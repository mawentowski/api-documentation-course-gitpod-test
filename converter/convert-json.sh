#!/bin/bash

# Convert JSON to YAML
js-yaml ../converter/input.yaml > output.json

# Notify user
echo "Conversion complete. The output is saved to output.json"
