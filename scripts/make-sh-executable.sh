#!/bin/bash

# Navigate to the root of the project
echo "Navigating to project root directory..."
cd "$(dirname "$0")/.."  # Go up one level to reach the root directory

# Navigate to the 'converter' directory
if [ -d "converter" ]; then
  echo "Navigating to the 'converter' directory..."
  cd converter
else
  echo "Error: 'converter' directory not found."
  exit 1
fi

# Find and make all .sh files in the 'converter' directory executable
echo "Making .sh files in 'converter' directory executable..."
sh_files=$(find . -name "*.sh")

if [ -z "$sh_files" ]; then
  echo "No .sh files found in the 'converter' directory."
else
  for file in $sh_files; do
    chmod +x "$file"
    if [ $? -eq 0 ]; then
      echo "Made $file executable."
    else
      echo "Failed to make $file executable."
      exit 1
    fi
  done
  echo "All .sh files in 'converter' directory are now executable."
fi

# Navigate to the 'scripts' directory
cd ../scripts || { echo "Error: 'scripts' directory not found."; exit 1; }

# Find and make all .sh files in the 'scripts' directory executable
echo "Making .sh files in 'scripts' directory executable..."
sh_files=$(find . -name "*.sh")

if [ -z "$sh_files" ]; then
  echo "No .sh files found in the 'scripts' directory."
else
  for file in $sh_files; do
    chmod +x "$file"
    if [ $? -eq 0 ]; then
      echo "Made $file executable."
    else
      echo "Failed to make $file executable."
      exit 1
    fi
  done
  echo "All .sh files in 'scripts' directory are now executable."
fi

# Navigate back to the root directory
cd ..
