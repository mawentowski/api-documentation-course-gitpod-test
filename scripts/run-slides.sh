#!/bin/bash

# Change directory to ./slides
cd ./slides || { echo "Directory ./slides not found!"; exit 1; }

# Install dependencies
npm install || { echo "npm install failed!"; exit 1; }

# Run npm start with the specified port
npm start -- --port=8001
