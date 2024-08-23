Converting Code (JSON to YAML and Vice Versa)
Convert JSON to YAML
Create an input.json file in the formatter directory.

Add your JSON code to ./formatter/input.json.

Run the following command:

```shell
(cd formatter && ./convert-json.sh)
```

The JSON code will be converted to YAML and saved as output.yaml.

Convert YAML to JSON
Create an input.yaml file in the formatter directory.

Add your YAML code to ./formatter/input.yaml.

Run the following command:

```shell
(cd formatter && ./convert-yaml.sh)

```

The YAML code will be converted to JSON and saved as output.json.
