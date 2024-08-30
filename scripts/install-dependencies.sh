#!/bin/bash

# Function to install Node.js and npm
install_node_npm() {
  echo "Node.js and npm not found. Installing Node.js..."

  # Install Node.js and npm
  if command -v brew >/dev/null 2>&1; then
    # Install Node.js using Homebrew
    brew install node
  else
    echo "Homebrew not found. Please install Homebrew first."
    exit 1
  fi
}

# Check if npm is installed
if ! command -v npm >/dev/null 2>&1; then
  install_node_npm
fi

# Function to install dependencies
install_dependencies() {
  local dir=$1
  echo "Navigating to the $dir directory..."
  cd "$dir" || { echo "Error: '$dir' directory not found."; exit 1; }

  # Check if package.json exists
  if [ ! -f package.json ]; then
    echo "Error: No package.json found in the '$dir' directory."
    exit 1
  fi

  # Install Node.js dependencies
  echo "Installing dependencies..."
  npm install

  if [ $? -eq 0 ]; then
    echo "Dependencies installed successfully in '$dir'."
  else
    echo "Failed to install dependencies in '$dir'."
    exit 1
  fi

  # Navigate back to the root directory
  cd ..
}

# Install dependencies for code base directories
install_dependencies "server"
install_dependencies "admin"
install_dependencies "slides"
