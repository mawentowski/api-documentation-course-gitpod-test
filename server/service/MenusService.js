"use strict";

const sortingUtils = require("../utils/sortingUtils");
const problem = require("../utils/problem");
const mongoose = require("mongoose");
const MenuModel = mongoose.model("Menu", require("../models/Menu").Menu);
const CategoryModel = mongoose.model(
  "Category",
  require("../models/Category").Category
);
const AuthModel = mongoose.model("Auth", require("../models/Auth").Auth);
const { Types } = require("mongoose");

exports.postMenu = async function (body, token) {
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

    const existingMenu = await MenuModel.findOne({ name: body.name });
    if (existingMenu) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Menu already exists. Either update the existing menu or create a new one.",
        409
      );
    }

    if (body.category_ids) {
      const categoryIds = body.category_ids;

      for (const categoryId of categoryIds) {
        if (!Types.ObjectId.isValid(categoryId)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "Invalid category ID format. Ensure all category IDs are valid Mongo database ObjectId strings.",
            400
          );
        }
      }

      const existingCategories = await CategoryModel.find({
        _id: { $in: categoryIds },
      });
      const existingCategoryIds = existingCategories.map((category) =>
        category._id.toString()
      );
      const nonExistingCategoryIds = categoryIds.filter(
        (id) => !existingCategoryIds.includes(id)
      );
      if (nonExistingCategoryIds.length > 0) {
        throw new problem.Problem(
          problem.E_NOT_FOUND,
          `The following category(es) do not exist: ${nonExistingCategoryIds.join(
            ", "
          )}`,
          404
        );
      }
    }

    const newMenu = new MenuModel(body);
    newMenu.created_at = new Date();
    newMenu.updated_at = new Date();
    await newMenu.save();
    return newMenu.toResultFormat();
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

exports.getMenuList = async function (sort, include, select, limit, offset) {
  try {

    const sortOptions = sortingUtils.parseSortOptions(sort);
    const selectOptions = sortingUtils.parseSelectOptions(include);
    const filterOptions = sortingUtils.parseFilterOptions(select);

    let menusQuery = MenuModel.find(filterOptions, selectOptions);

    if (limit) {
      if (offset) {
        menusQuery = menusQuery.skip(offset).limit(limit);
      } else {
        menusQuery = menusQuery.limit(limit);
      }
    }

    const menus = await menusQuery.sort(sortOptions).exec();

    const response = {
      results: menus.map((menu) => ({
        menu_id: menu._id,
        created_at: menu.created_at,
        updated_at: menu.updated_at,
        name: menu.name,
        category_ids: menu.category_ids,
      })),
    };

    response.total_results = menus.length;

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

exports.getMenu = async function getMenu(menu_id, include) {
  try {

    if (!Types.ObjectId.isValid(menu_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid menu ID format. Ensure the menu ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const menu = await MenuModel.findById(menu_id);
    if (!menu) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Menu not found. If you are unsure of the ID, try searching for the menu by name.",
        404
      );
    }
    const selectOptions = sortingUtils.parseSelectOptions(include);
    let menusQuery = MenuModel.findById(menu_id, selectOptions);

    const response = await menusQuery.exec();

    return {
      menu_id: response._id,
      created_at: response.created_at,
      updated_at: response.updated_at,
      name: response.name,
      category_ids: response.category_ids,
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

exports.getMenuCategories = async function (menu_id, include) {
  try {

    if (!Types.ObjectId.isValid(menu_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        `Invalid menu ID format. Ensure the menu ID is a valid Mongo database ObjectId string.`,
        400
      );
    }

    const menu = await MenuModel.findById(menu_id);
    if (!menu) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Menu not found. If you are unsure of the ID, try searching for the menu by name.",
        404
      );
    }

    // Fetch detailed dish information for each dish ID

    const category_promises = menu.category_ids.map(async (category_id) => {
      try {
        if (!Types.ObjectId.isValid(category_id)) {
          // Check if dish_id is a valid ObjectId
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            `Invalid category ID format: ${category_id}. Ensure all category IDs are valid Mongo database ObjectId strings.`,
            400
          );
        }

        const selectOptions = sortingUtils.parseSelectOptions(include);
        let categoryQuery = CategoryModel.findById(category_id);

        if (selectOptions) {
          categoryQuery = categoryQuery.select(selectOptions);
        }

        const category = await categoryQuery.exec();

        if (!category) {
          throw new problem.Problem(
            problem.E_NOT_FOUND,
            `Category with ID ${category_id} not found. If you are unsure of the ID, try searching for the category by name.`,
            404
          );
        }

        return category.toResultFormat();
      } catch (category_error) {
        throw category_error;
      }
    });

    // Wait for all dish promises to resolve
    const categories = await Promise.all(category_promises);

    return { results: categories };
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

exports.putMenu = async function (body, menu_id, token) {
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

    if (!Types.ObjectId.isValid(menu_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid menu ID format. Ensure the menu ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const existingMenu = await MenuModel.findById(menu_id);
    if (!existingMenu) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Menu not found. If you are unsure of the ID, try searching for the menu by name.",
        404
      );
    }

    // Validate required fields and generate error message
    let missingFields = [];
    if (!body.name) missingFields.push("name");
    if (!body.category_ids) missingFields.push("category_ids");

    if (missingFields.length > 0) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        `The following required fields are missing: ${missingFields.join(
          ", "
        )}.`,
        400
      );
    }

    if (existingMenu.name !== body.name) {
      const existingMenuWithSameName = await MenuModel.findOne({
        name: body.name,
        _id: { $ne: existingMenu._id },
      });
      if (existingMenuWithSameName) {
        throw new problem.Problem(
          problem.E_CONFLICT,
          "Menu name already exists. Please choose a different name.",
          409
        );
      }
    }
    if (body.category_ids) {
      const categoryIds = body.category_ids;

      for (const categoryId of categoryIds) {
        if (!Types.ObjectId.isValid(categoryId)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "Invalid category ID format. Ensure all category IDs are valid Mongo database ObjectId strings.",
            400
          );
        }
      }
      const existingCategories = await CategoryModel.find({
        _id: { $in: categoryIds },
      });
      const existingCategoryIds = existingCategories.map((category) =>
        category._id.toString()
      );
      const nonExistingCategoryIds = categoryIds.filter(
        (id) => !existingCategoryIds.includes(id)
      );
      if (nonExistingCategoryIds.length > 0) {
        throw new problem.Problem(
          problem.E_NOT_FOUND,
          `The following category(es) do not exist: ${nonExistingCategoryIds.join(
            ", "
          )}`,
          404
        );
      }
    }

    Object.assign(existingMenu, body);
    existingMenu.updated_at = new Date();
    await existingMenu.save();
    return existingMenu.toResultFormat();
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

exports.deleteMenu = async function (menu_id, token) {
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
    
    if (!Types.ObjectId.isValid(menu_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid menu ID format. Ensure the menu ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const menu = await MenuModel.findById(menu_id);
    if (!menu) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Menu not found. If you are unsure of the ID, try searching for the menu by name.",
        404
      );
    }
    await MenuModel.deleteOne({ _id: menu_id });
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
