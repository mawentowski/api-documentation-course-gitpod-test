"use strict";

var utils = require("../utils/writer.js");
const problem = require("../utils/problem");
var Menus = require("../service/MenusService");

module.exports.postMenu = function postMenu(req, res, next, body) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const unauthorizedError = new problem.Problem(
      problem.E_UNAUTHORIZED,
      "The bearer token is missing."
    );
    return unauthorizedError.toResponse(res);
  }
  
  const token = authHeader.split(' ')[1];
  Menus.postMenu(body, token)
    .then(function (response) {
      res.status(201).json(response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error creating menu:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.getMenuList = function getMenuList(
  req,
  res,
  next,
  sort,
  include,
  select,
  limit,
  offset
) {
  Menus.getMenuList(sort, include, select, limit, offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error retrieving a list of menus:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.getMenu = function getMenu(req, res, next, include) {
  const menu_id = req.openapi.pathParams.menu_id;
  Menus.getMenu(menu_id, include)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error retrieving the menu's details:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.getMenuCategories = function getMenuCategories(
  req,
  res,
  next,
  include
) {
  const menu_id = req.openapi.pathParams.menu_id;
  Menus.getMenuCategories(menu_id, include)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error retrieving the menu's categories:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.putMenu = function putMenu(req, res, next, body, menu_id) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const unauthorizedError = new problem.Problem(
      problem.E_UNAUTHORIZED,
      "The bearer token is missing."
    );
    return unauthorizedError.toResponse(res);
  }
  
  const token = authHeader.split(' ')[1];
  Menus.putMenu(body, menu_id, token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error updating menu:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.deleteMenu = function deleteMenu(req, res, next, menu_id) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const unauthorizedError = new problem.Problem(
      problem.E_UNAUTHORIZED,
      "The bearer token is missing."
    );
    return unauthorizedError.toResponse(res);
  }
  
  const token = authHeader.split(' ')[1];
  Menus.deleteMenu(menu_id, token)
    .then(function () {
      res.sendStatus(204);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error deleting the menu:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};
