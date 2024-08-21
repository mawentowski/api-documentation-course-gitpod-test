

Okay i need to set up a docker compose file that sits at the root of the following folder:

mawentowski@Marks-MacBook-Pro api-documentation-course % ls
docsgeek-course		pos-engine		restaurantPOSclient
docsgeek-course-theme	pos-openapi

Choose image thats best based on my use case. I am using NPM as the package manager for everything.

Need Docker compose instead of executing docker commands as shown, including pulling images and running containers. so i just give those docker commands to demonstrate ideas/functionality. feel free to adjust to make it make more sense

## POS Engine

```shell
# cd into post-engine
cd pos-engine
# install dependencies
npm i
# create and start a server at http://localhost:8080. Name the container 'api-server'
npm run start
```

### Prism proxy server

```shell
# pull the docker imnage for stoplight/prism
docker pull stoplight/prism
# Run the proxy server container:
docker run --init --rm -v $(pwd):/api -p 4010:4010 stoplight/prism:4 mock -h 0.0.0.0 -p 8081 "/api/openapi.yaml"
# Here's the logic I want you to do for Docker compose version:
# Prism will act as a proxy server, intercepting incoming requests on port 4010, using the OpenAPI specification provided, and forwarding those requests to the API server running at http://localhost:8080/.
```


### Swagger UI

The api server already serves the swagger ui docs at http://localhost:8080/docs which is good but i would like to do a container so i cna make the URL easily clickable in docker descktop...then call the container swagger-ui. not sure how to do that. here is my index.js with express details. the code below autoamtically creates the /docs

```javascript
"use strict";

const databaseUrl = "mongodb://localhost:27017/pos-db";
const mongoose = require("mongoose");

mongoose
  .connect(databaseUrl)
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

```

<!-- Pull the `swagger-ui` image now (I dont have the command), and run it against the `openapi.yml` file in the project root.

```shell
docker pull swaggerapi/swagger-ui
docker run -d -p 8080:8000 -e PORT=8000 -v $(pwd):/tmp -e SWAGGER_JSON=/tmp/openapi.yml -e URL=/docs swaggerapi/swagger-ui
``` -->


## POS Open API

```shell
cd pos-openapi
```

### Swagger Editor container
```shell
# Pull swagger editor docker image:
docker pull swaggerapi/swagger-editor
# Run and start the container at http://localhost:80. call the container swagger-editor
docker run -d -p 80:80 -e PORT=80 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/openapi.yml swaggerapi/swagger-editor
# not that i want to do docker compose isntead of the docker commands. make it it does not use any of the ports listed in this document.
```



## Database

The database isnt associated with any local files

```shell
# pull mongo image:
docker pull mongo
# start the database at port locahost 27017:
docker run --name pos-db -d -p 27017:27017 mongo:latest
```

Note that for the docker compose version, I dont want there to be a username and password so the defaults are fine.
