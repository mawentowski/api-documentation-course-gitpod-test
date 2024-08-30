"use strict";

const databaseUrl = "mongodb://pos-db:27017/pos-db"; // Using the service name
const mongoose = require("mongoose");

mongoose
  .connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

var path = require("path");
var http = require("http");

var oas3Tools = require("oas3-tools");
var serverPort = 8080;

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, "./controllers"),
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, "api/openapi.yaml"),
  options
);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
var server = http.createServer(app);

// Set a timeout of 30 seconds (adjust this according to your needs)
server.setTimeout(5000); // 30 seconds

server.listen(serverPort, function () {
  console.log(
    "Your server is listening on port %d (http://localhost:%d)",
    serverPort,
    serverPort
  );
  console.log(
    "Swagger-ui is available on http://localhost:%d/docs",
    serverPort
  );
});
