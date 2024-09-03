#!/bin/bash

# Make sure the make-sh-executable.sh script is executable
# chmod +x ./scripts/make-sh-executable.sh

# Call the make-sh-executable.sh script to make .sh files executable
# ./scripts/make-sh-executable.sh

# Check if the make-sh-executable.sh script executed successfully
# if [ $? -eq 0 ]; then
#   echo "Scripts are now executable."
# else
#   echo "Failed to make scripts executable."
#   exit 1
# fi

# Pull latest changes from the remote repository.

./scripts/pull-changes.sh

# Check if script executed successfully
if [ $? -eq 0 ]; then
  echo "The latest changes were pulled from the remote."
else
  echo "Failed to pull the latest changes from the remote."
  exit 1
fi

# Install packages inside code base folders.
./scripts/install-dependencies.sh

# Check if the install-dependencies.sh script executed successfully
if [ $? -eq 0 ]; then
  echo "Dependencies installed successfully."
else
  echo "Failed to install dependencies."
  exit 1
fi

./scripts/start-docker.sh

# Check if the reset-mongo-db.sh script executed successfully
if [ $? -eq 0 ]; then
  echo "Docker successfully started."
else
  echo "Failed to start docker."
  exit 1
fi

# Wipe the Mongo Database
./scripts/wipe-mongo-db.sh

# Check if the reset-mongo-db.sh script executed successfully
if [ $? -eq 0 ]; then
  echo "Database wiped successfully."
else
  echo "Failed to wipe the database."
  exit 1
fi

# Seed the database
./scripts/seed-db.sh

if [ $? -eq 0 ]; then
  echo "Database seeded successfully."
else
  echo "Failed to seed the database."
  exit 1
fi

