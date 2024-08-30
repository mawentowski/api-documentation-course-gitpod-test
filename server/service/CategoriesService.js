"use strict";

const sortingUtils = require("../utils/sortingUtils");
const problem = require("../utils/problem");
const mongoose = require("mongoose");
const CategoryModel = mongoose.model(
  "Category",
  require("../models/Category").Category
);
const DishModel = mongoose.model("Dish", require("../models/Dish").Dish);
const AuthModel = mongoose.model("Auth", require("../models/Auth").Auth);

const { Types } = require("mongoose");

exports.postCategory = async function (body, token) {
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
    const existingCategory = await CategoryModel.findOne({ name: body.name });
    if (existingCategory) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Category already exists. Either update the existing category or create a new one.",
        409
      );
    }

    if (body.dish_ids) {
      const dishIds = body.dish_ids;

      for (const dishId of dishIds) {
        if (!Types.ObjectId.isValid(dishId)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "Invalid dish ID format. Ensure all dish IDs are valid Mongo database ObjectId strings.",
            400
          );
        }
      }

      const existingDishes = await DishModel.find({ _id: { $in: dishIds } });
      const existingDishIds = existingDishes.map((dish) => dish._id.toString());
      const nonExistingDishIds = dishIds.filter(
        (id) => !existingDishIds.includes(id)
      );
      if (nonExistingDishIds.length > 0) {
        throw new problem.Problem(
          problem.E_NOT_FOUND,
          `The following dish(es) do not exist: ${nonExistingDishIds.join(
            ", "
          )}`,
          404
        );
      }
    } else {
      console.log("No dish IDs provided. Skipping dish ID check...");
    }

    const newCategory = new CategoryModel(body);
    newCategory.created_at = new Date();
    newCategory.updated_at = new Date();
    await newCategory.save();
    return newCategory.toResultFormat();
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
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getCategoryList = async function (
  sort,
  include,
  select,
  limit,
  offset
) {
  try {
    const sortOptions = sortingUtils.parseSortOptions(sort);
    const selectOptions = sortingUtils.parseSelectOptions(include);
    const filterOptions = sortingUtils.parseFilterOptions(select);

    let categoriesQuery = CategoryModel.find(filterOptions, selectOptions);

    if (limit) {
      if (offset) {
        categoriesQuery = categoriesQuery.skip(offset).limit(limit);
      } else {
        categoriesQuery = categoriesQuery.limit(limit);
      }
    }

    const categories = await categoriesQuery.sort(sortOptions).exec();

    const response = {
      results: categories.map((category) => ({
        category_id: category._id,
        created_at: category.created_at,
        updated_at: category.updated_at,
        name: category.name,
        dish_ids: category.dish_ids,
      })),
    };

    response.total_results = categories.length;
    return response;
  } catch (error) {
    switch (error.status) {
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getCategory = async function getCategory(category_id, include) {
  try {

    if (!Types.ObjectId.isValid(category_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid category ID format. Ensure the category ID is a valid Mongo database ObjectId string.",
        400
      );
    }

    const category = await CategoryModel.findById(category_id);
    if (!category) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Category not found. If you are unsure of the ID, try searching for the category by the table number and given name",
        404
      );
    }
    const selectOptions = sortingUtils.parseSelectOptions(include);
    let categorysQuery = CategoryModel.findById(category_id, selectOptions);

    const response = await categorysQuery.exec();

    return {
      category_id: response._id,
      created_at: response.created_at,
      updated_at: response.updated_at,
      name: response.name,
      dish_ids: response.dish_ids,
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
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getCategoryDishes = async function (category_id, include) {
  try {
    if (!Types.ObjectId.isValid(category_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        `Invalid category ID format. Ensure the category ID is a valid Mongo database ObjectId string.`,
        400
      );
    }

    const category = await CategoryModel.findById(category_id);
    if (!category) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Category not found. If you are unsure of the ID, try searching for the category by name.",
        404
      );
    }

    const dish_promises = category.dish_ids.map(async (dish_id) => {
      try {
        if (!Types.ObjectId.isValid(dish_id)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            `Invalid dish ID format: ${dish_id}. Ensure all dish IDs are valid Mongo database ObjectId strings.`,
            400
          );
        }

        const selectOptions = sortingUtils.parseSelectOptions(include);
        let dishQuery = DishModel.findById(dish_id);

        if (selectOptions) {
          dishQuery = dishQuery.select(selectOptions);
        }

        const dish = await dishQuery.exec();

        if (!dish) {
          throw new problem.Problem(
            problem.E_NOT_FOUND,
            `Dish with ID ${dish_id} not found. If you are unsure of the ID, try searching for the dish by name.`,
            404
          );
        }

        return dish.toResultFormat();
      } catch (dish_error) {
        throw dish_error;
      }
    });

    const dishes = await Promise.all(dish_promises);

    return { results: dishes };
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 404:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.putCategory = async function (body, category_id, token) {
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
    if (!Types.ObjectId.isValid(category_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid category ID format. Ensure the category ID is a valid Mongo database ObjectId string.",
        400
      );
    }

    const existingCategory = await CategoryModel.findById(category_id);
    if (!existingCategory) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Category not found. If you are unsure of the ID, try searching for the category by name.",
        404
      );
    }

    let missingFields = [];
    if (!body.name) missingFields.push("name");
    if (!body.dish_ids) missingFields.push("dish_ids");

    if (missingFields.length > 0) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        `The following required fields are missing: ${missingFields.join(
          ", "
        )}.`,
        400
      );
    }

    if (existingCategory.name !== body.name) {
      const existingCategoryWithSameName = await CategoryModel.findOne({
        name: body.name,
        _id: { $ne: existingCategory._id },
      });
      if (existingCategoryWithSameName) {
        throw new problem.Problem(
          problem.E_CONFLICT,
          "Category name already exists. Please choose a different name.",
          409
        );
      }
    }
    if (body.dish_ids) {
      const dishIds = body.dish_ids;

      for (const dishId of dishIds) {
        if (!Types.ObjectId.isValid(dishId)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "Invalid dish ID format. Ensure all dish IDs are valid Mongo database ObjectId strings.",
            400
          );
        }
      }

      const existingDishes = await DishModel.find({ _id: { $in: dishIds } });
      const existingDishIds = existingDishes.map((dish) => dish._id.toString());
      const nonExistingDishIds = dishIds.filter(
        (id) => !existingDishIds.includes(id)
      );
      if (nonExistingDishIds.length > 0) {
        throw new problem.Problem(
          problem.E_NOT_FOUND,
          `The following dish(es) do not exist: ${nonExistingDishIds.join(
            ", "
          )}`,
          404
        );
      }
    }
    Object.assign(existingCategory, body);
    existingCategory.updated_at = new Date();
    await existingCategory.save();
    return existingCategory.toResultFormat();
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
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.deleteCategory = async function (category_id, token) {
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
    if (!Types.ObjectId.isValid(category_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid category ID format. Ensure the category ID is a valid Mongo database ObjectId string.",
        400
      );
    }

    const category = await CategoryModel.findById(category_id);

    if (!category) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Category not found. If you are unsure of the ID, try searching for the category by name.",
        404
      );
    }
    await CategoryModel.deleteOne({ _id: category_id });
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      case 401:
        throw error;
      case 404:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};
