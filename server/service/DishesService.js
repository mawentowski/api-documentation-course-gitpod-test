"use strict";

const sortingUtils = require("../utils/sortingUtils");
const problem = require("../utils/problem");
const mongoose = require("mongoose");
const DishModel = mongoose.model("Dish", require("../models/Dish").Dish);
const IngredientModel = mongoose.model(
  "Ingredient",
  require("../models/Ingredient").Ingredient
);
const AuthModel = mongoose.model("Auth", require("../models/Auth").Auth);

const { Types } = require("mongoose");

exports.postDishes = async function (body, token) {
  try {
    const existingAuth = await AuthModel.findOne({ access_token: token });

    if (!existingAuth) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token is invalid.",
        401
      );
    }
    // Check if the token is expired
    if (new Date() > new Date(existingAuth.expires_at)) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token has expired.",
        401
      );
    }

    const existingDish = await DishModel.findOne({ name: body.name });

    if (existingDish) {
      throw new problem.Problem(
        problem.E_CONFLICT,
        "The provided name corresponds to a resource instance in the database.",
        "Dish already exists. Update the existing dish or create a new dish.",
        409
      );
    }

    // Check if all ingredients exist and retrieve their quantities
    const ingredientsWithQty = await Promise.all(
      body.ingredients.map(async (ingredient) => {
        if (!Types.ObjectId.isValid(ingredient.ingredient_id)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "The request was malformed or invalid.",
            "Invalid ingredient ID format. Ensure all ingredient IDs are valid Mongo database ObjectId strings.",
            400
          );
        }

        const foundIngredient = await IngredientModel.findById(
          ingredient.ingredient_id
        );
        if (!foundIngredient) {
          throw new problem.Problem(
            problem.E_NOT_FOUND,
            "A requested resource does not exist.",
            `Ingredient with ID ${ingredient.ingredient_id} not found.`,
            404
          );
        }
        return {
          id: foundIngredient._id.toString(),
          name: foundIngredient.name,
          is_essential: ingredient.is_essential,
          in_stock_qty: foundIngredient.in_stock_qty,
        };
      })
    );

    // Filter out insufficient essential ingredients
    const insufficientEssentialIngredients = ingredientsWithQty.filter(
      (ingredient) => ingredient.is_essential && ingredient.in_stock_qty === 0
    );

    if (insufficientEssentialIngredients.length > 0) {
      const ingredientNames = insufficientEssentialIngredients
        .map((ingredient) => `${ingredient.name} (ID: ${ingredient.id})`)
        .join(", ");
      throw new problem.Problem(
        problem.E_CLIENT_FAULT,
        "The request was malformed or invalid.",
        `The following essential ingredients are out of stock: ${ingredientNames}`,
        400
      );
    }

    const dish = new DishModel(body);
    dish.created_at = new Date();
    dish.updated_at = new Date();
    await dish.save();
    return dish.toResultFormat();
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 401:
        throw error;
      case 404:
        throw error;
      case 409:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getDishList = async function (sort, include, select, limit, offset) {
  try {

    const sortOptions = sortingUtils.parseSortOptions(sort);
    const selectOptions = sortingUtils.parseSelectOptions(include);
    const filterOptions = sortingUtils.parseFilterOptions(select);

    let dishesQuery = DishModel.find(filterOptions, selectOptions);

    if (limit) {
      if (offset) {
        dishesQuery = dishesQuery.skip(offset).limit(limit);
      } else {
        dishesQuery = dishesQuery.limit(limit);
      }
    }

    const dishes = await dishesQuery.sort(sortOptions).exec();

    const response = {
      results: dishes.map((dish) => ({
        dish_id: dish._id,
        created_at: dish.created_at,
        updated_at: dish.updated_at,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        image_name: dish.image_name,
        station: dish.station,
        ingredients: dish.ingredients,
      })),
    };

    // Set total_results to the number of dishes returned in the response
    response.total_results = dishes.length;

    return response;
  } catch (error) {
    switch (error.status) {
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getDish = async function getDish(dish_id, include) {
  try {
    if (!Types.ObjectId.isValid(dish_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "The request was malformed or invalid.",
        "Invalid dish ID format. Ensure the dish ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const dish = await DishModel.findById(dish_id);
    if (!dish) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "The requested resource does not exist.",
        "Dish not found. If you are unsure of the ID, try searching for the dish by name.",
        404
      );
    }
    const selectOptions = sortingUtils.parseSelectOptions(include);
    let dishsQuery = DishModel.findById(dish_id, selectOptions);

    const response = await dishsQuery.exec();

    return {
      dish_id: response._id,
      created_at: response.created_at,
      updated_at: response.updated_at,
      name: response.name,
      description: response.description,
      price: response.price,
      image_name: response.image_name,
      station: response.station,
      ingredients: response.ingredients,
    };
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 404:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getDishIngredients = async function (dish_id, include) {
  try {
    if (!Types.ObjectId.isValid(dish_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "The request was malformed or invalid.",
        `Invalid dish ID format. Ensure the dish ID is a valid Mongo database ObjectId string.`,
        400
      );
    }

    const dish = await DishModel.findById(dish_id);
    if (!dish) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "The requested resource does not exist.",
        "Dish not found. If you are unsure of the ID, try searching for the dish by name.",
        404
      );
    }

    // Ensure dish.ingredients is an array and not empty
    if (!Array.isArray(dish.ingredients) || dish.ingredients.length === 0) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "The requested resource does not exist.",
        "Dish does not have any ingredients.",
        404
      );
    }

    // Fetch detailed dish information for each ingredient
    const ingredient_promises = dish.ingredients.map(async (ingredientObj) => {
      if (!Types.ObjectId.isValid(ingredientObj.ingredient_id)) {
        // Check if dish_id is a valid ObjectId
        throw new problem.Problem(
          problem.E_BAD_REQUEST,
          "The request was malformed or invalid.",
          `Invalid ingredient ID format: ${ingredient_id}. Ensure all ingredient IDs are valid Mongo database ObjectId strings.`,
          400
        );
      }
      try {
        const ingredient_id = ingredientObj.ingredient_id;
        const selectOptions = sortingUtils.parseSelectOptions(include);
        let ingredientQuery = IngredientModel.findById(ingredient_id);

        if (selectOptions) {
          ingredientQuery = ingredientQuery.select(selectOptions);
        }

        const ingredient = await ingredientQuery.exec();
        return ingredient ? ingredient.toResultFormat() : null;
      } catch (ingredient_error) {
        throw ingredient_error;
      }
    });

    // Wait for all ingredient promises to resolve
    const ingredients = await Promise.all(ingredient_promises);

    // Remove any null values from ingredients array
    const validIngredients = ingredients.filter(
      (ingredient) => ingredient !== null
    );

    return { results: validIngredients };
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 404:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.putDish = async function (body, dish_id, token) {
  try {
    const existingAuth = await AuthModel.findOne({ access_token: token });

    if (!existingAuth) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token is invalid.",
        401
      );
    }
    // Check if the token is expired
    if (new Date() > new Date(existingAuth.expires_at)) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token has expired.",
        401
      );
    }
    if (!Types.ObjectId.isValid(dish_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "The request was malformed or invalid.",
        "Invalid dish ID format. Ensure the dish ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const existingDish = await DishModel.findById(dish_id);
    if (!existingDish) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "The requested resource does not exist.",
        "Dish not found. If you are unsure of the ID, try searching for the dish by name.",
        404
      );
    }

    const conflictingDish = await DishModel.findOne({
      _id: { $ne: dish_id },
      name: body.name,
    });

    if (conflictingDish) {
      throw new problem.Problem(
        problem.E_CONFLICT,
        "The provided name corresponds to a resource instance in the database.",
        "Name is already used for an existing dish. Update the existing dish's details instead of creating a new dish.",
        409
      );
    }

    // Check if all ingredients exist and retrieve their quantities
    const ingredientsWithQty = await Promise.all(
      body.ingredients.map(async (ingredient) => {
        if (!Types.ObjectId.isValid(ingredient.ingredient_id)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "The request was malformed or invalid.",
            "Invalid ingredient ID format. Ensure all ingredient IDs are valid Mongo database ObjectId strings.",
            400
          );
        }

        const foundIngredient = await IngredientModel.findById(
          ingredient.ingredient_id
        );
        if (!foundIngredient) {
          throw new problem.Problem(
            problem.E_NOT_FOUND,
            "A requested resource does not exist.",
            `Ingredient with ID ${ingredient.ingredient_id} not found.`,
            404
          );
        }
        return {
          id: foundIngredient._id.toString(),
          name: foundIngredient.name,
          is_essential: ingredient.is_essential,
          in_stock_qty: foundIngredient.in_stock_qty,
        };
      })
    );

    const insufficientEssentialIngredients = ingredientsWithQty.filter(
      (ingredient) => ingredient.is_essential && ingredient.in_stock_qty === 0
    );

    if (insufficientEssentialIngredients.length > 0) {
      const ingredientNames = insufficientEssentialIngredients
        .map((ingredient) => `${ingredient.name} (ID: ${ingredient.id})`)
        .join(", ");
      throw new problem.Problem(
        problem.E_CLIENT_FAULT,
        "The request was malformed or invalid.",
        `The following essential ingredients are out of stock: ${ingredientNames}`,
        400
      );
    }

    Object.assign(existingDish, body);

    existingDish.updated_at = new Date();

    await existingDish.save();

    return existingDish.toResultFormat();
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 401:
        throw error;
      case 404:
        throw error;
      case 409:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.deleteDish = async function (dish_id, token) {
  try {
    const existingAuth = await AuthModel.findOne({ access_token: token });

    if (!existingAuth) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token is invalid.",
        401
      );
    }
    // Check if the token is expired
    if (new Date() > new Date(existingAuth.expires_at)) {
      throw new problem.Problem(
        problem.E_UNAUTHORIZED,
        "Bearer token has expired.",
        401
      );
    }
    if (!Types.ObjectId.isValid(dish_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "The request was malformed or invalid.",
        "Invalid dish ID format. Ensure the dish ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const dish = await DishModel.findById(dish_id);
    if (!dish) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "The requested resource does not exist.",
        "Dish not found. If you are unsure of the ID, try searching for the dish by name.",
        404
      );
    }
    await DishModel.deleteOne({ _id: dish_id });
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 404:
        throw error;
      case 401:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "Internal server error",
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};
