#!/bin/bash

# Convert JSON to YAML
js-yaml ../converter/input.json > output.yaml

# Notify user
echo "Conversion complete. The output is saved to output.yaml"
