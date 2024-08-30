"use strict";
const sortingUtils = require("../utils/sortingUtils");
const problem = require("../utils/problem");
const mongoose = require("mongoose");
const OrderModel = mongoose.model("Order", require("../models/Order").Order);
const DishModel = mongoose.model("Dish", require("../models/Dish").Dish);
const AuthModel = mongoose.model("Auth", require("../models/Auth").Auth);
const { Types } = require("mongoose");

exports.postOrder = async function (body, token) {
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

    const existingOrder = await OrderModel.findOne({
      $and: [
        { given_name: body.given_name },
        { table_number: body.table_number },
      ],
    });

    if (existingOrder) {
      throw new problem.Problem(
        problem.E_CONFLICT,
        "The provided given name is associated with an existing order for this table.",
        409
      );
    }

    if (body.dish_ids) {
      const dishIds = body.dish_ids;

      // Validate each dish ID
      for (const dishId of dishIds) {
        if (!Types.ObjectId.isValid(dishId)) {
          throw new problem.Problem(
            problem.E_BAD_REQUEST,
            "Invalid dish ID format. Ensure all dish IDs are valid Mongo database ObjectId strings.",
            400
          );
        }
      }

      // Fetch existing dishes
      const existingDishes = await DishModel.find({ _id: { $in: dishIds } });

      // Check for missing dishes
      const existingDishIds = existingDishes.map((dish) => dish._id.toString());
      const nonExistingDishIds = dishIds.filter(
        (id) => !existingDishIds.includes(id)
      );
      if (nonExistingDishIds.length > 0) {
        throw new problem.Problem(
          problem.E_NOT_FOUND,
          "The requested resource does not exist.",
          `The following dish(es) do not exist: ${nonExistingDishIds.join(
            ", "
          )}`,
          404
        );
      }
    }
    if (!body.hasOwnProperty("scheduled_at")) {
      body.scheduled_at = null;
    }
    const order = new OrderModel(body);
    order.status = "received";
    order.priority = 3;
    order.created_at = new Date();
    order.updated_at = new Date();
    await order.save();
    return order.toResultFormat();
  } catch (error) {
    console.error("Error encountered:", error);
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
exports.getOrderList = async function (sort, include, select, limit, offset) {
  try {
    const sortOptions = sortingUtils.parseSortOptions(sort);
    const selectOptions = sortingUtils.parseSelectOptions(include);
    const filterOptions = sortingUtils.parseFilterOptions(select);

    let ordersQuery = OrderModel.find(filterOptions, selectOptions);

    if (limit) {
      if (offset) {
        ordersQuery = ordersQuery.skip(offset).limit(limit);
      } else {
        ordersQuery = ordersQuery.limit(limit);
      }
    }

    const orders = await ordersQuery.sort(sortOptions).exec();

    const response = {
      results: orders.map((order) => ({
        order_id: order._id,
        given_name: order.given_name,
        table_number: order.table_number,
        status: order.status,
        priority: order.priority,
        dish_ids: order.dish_ids,
        created_at: order.created_at,
        updated_at: order.updated_at,
        scheduled_at: order.scheduled_at,
      })),
    };

    response.total_results = orders.length;
    return response;
  } catch (error) {
    switch (error.status) {
      case 400:
        throw error;
      default:
        throw new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the service layer of the API server. Report the issue to API support."
        );
    }
  }
};

exports.getOrder = async function getOrder(order_id, include) {
  try {
    if (!Types.ObjectId.isValid(order_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid order ID format. Ensure the order ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const order = await OrderModel.findById(order_id);
    if (!order) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Order not found. If you are unsure of the ID, try searching for the order by the table number and given name.",
        404
      );
    }
    const selectOptions = sortingUtils.parseSelectOptions(include);
    let ordersQuery = OrderModel.findById(order_id, selectOptions);

    const response = await ordersQuery.exec();

    return {
      order_id: response._id,
      given_name: response.given_name,
      table_number: response.table_number,
      status: response.status,
      priority: response.priority,
      dish_ids: response.dish_ids,
      created_at: response.created_at,
      updated_at: response.updated_at,
      scheduled_at: response.scheduled_at,
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

exports.getOrderDishes = async function (order_id, include) {
  try {
    if (!Types.ObjectId.isValid(order_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid order ID format. Ensure the order ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const order = await OrderModel.findById(order_id);
    if (!order) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Order not found. If you are unsure of the ID, try searching for the order by table or and given_name.",
        404
      );
    }

    // Fetch detailed dish information for each dish ID

    const dish_promises = order.dish_ids.map(async (dish_id) => {
      try {
        if (!Types.ObjectId.isValid(dish_id)) {
          // Check if dish_id is a valid ObjectId
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
            "The requested resource does not exist.",
            `Dish with ID ${dish_id} not found. If you are unsure of the ID, try searching for the dish by name.`,
            404
          );
        }

        return dish.toResultFormat();
      } catch (dish_error) {
        throw dish_error;
      }
    });

    // Wait for all dish promises to resolve
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

exports.putOrder = async function putOrder(body, order_id, token) {
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
    
    
    if (!Types.ObjectId.isValid(order_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid order ID format. Ensure the order ID is a valid Mongo database ObjectId string.",
        400
      );
    }

    // Retrieve the existing order from the database
    const existingOrder = await OrderModel.findById(order_id);
    if (!existingOrder) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Order not found. If you are unsure of the ID, try searching for the order by table number and given name.",
        404
      );
    }
    // Validate required fields and generate error message
    let missingFields = [];
    if (!body.status) missingFields.push("status");
    if (!body.priority) missingFields.push("priority");
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

    // Update the existing order with new data
    Object.assign(existingOrder, body);
    existingOrder.updated_at = new Date();

    // Save the updated order
    await existingOrder.save();

    // Return the updated order in the desired format
    return existingOrder.toResultFormat();
  } catch (error) {
    // Handle errors based on status codes
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

exports.deleteOrder = async function (order_id, token) {
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
    
    if (!Types.ObjectId.isValid(order_id)) {
      throw new problem.Problem(
        problem.E_BAD_REQUEST,
        "Invalid order ID format. Ensure the order ID is a valid Mongo database ObjectId string.",
        400
      );
    }
    const order = await OrderModel.findById(order_id);
    if (!order) {
      throw new problem.Problem(
        problem.E_NOT_FOUND,
        "Order not found. If you are unsure of the ID, try searching for the order by table number and given name.",
        404
      );
    }
    await OrderModel.deleteOne({ _id: order_id });
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
