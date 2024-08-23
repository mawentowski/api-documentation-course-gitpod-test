"use strict";

var utils = require("../utils/writer.js");
const problem = require("../utils/problem.js");
var Users = require("../service/UsersService.js");

module.exports.postUser = function postUser(req, res, next, body) {
 
  Users.postUser(body)
    .then(function (response) {
      res.status(201).json(response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error creating a user:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.getAllUsers = function getAllUsers(
  req,
  res,
  next,
  sort,
  include,
  select,
  limit,
  offset
) {
  Users.getAllUsers(sort, include, select, limit, offset)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error retrieving a list of users:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.getUser = function getUser(req, res, next, include) {
  const user_id = req.openapi.pathParams.user_id;
  Users.getUser(user_id, include)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error retrieving a user's details:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};


module.exports.putUser = function putUser(req, res, next, body, user_id) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const unauthorizedError = new problem.Problem(
      problem.E_UNAUTHORIZED,
      "The bearer token is missing."
    );
    return unauthorizedError.toResponse(res);
  }
  
  const token = authHeader.split(' ')[1];
  Users.putUser(body, user_id, token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error updating a user:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};

module.exports.deleteUser = function deleteUser(req, res, next, user_id) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const unauthorizedError = new problem.Problem(
      problem.E_UNAUTHORIZED,
      "The bearer token is missing."
    );
    return unauthorizedError.toResponse(res);
  }
  
  const token = authHeader.split(' ')[1];
  Users.deleteUser(user_id, token)
    .then(function () {
      res.sendStatus(204);
    })
    .catch(function (error) {
      if (error instanceof problem.Problem) {
        error.toResponse(res);
      } else {
        console.error("Error deleting the user:", error);
        const serverError = new problem.Problem(
          problem.E_SERVER_FAULT,
          "There was an issue originating from the controller layer of the API server. Report the issue to API support."
        );
        serverError.toResponse(res);
      }
    });
};
