const fs = require('fs');
const yaml = require('js-yaml');

// Function to recursively replace 'description' and 'summary' fields
function recursiveReplace(obj) {
  if (typeof obj === 'object' && obj !== null) {
    for (let key in obj) {
      if (key === 'description') {
        // Check for the specific exception
        if (
          typeof obj[key] === 'string' &&
          obj[key] === "$ref: '#/components/schemas/Description'"
        ) {
          continue; // Skip replacing this field
        } else {
          obj[key] = '...'; // Replace description with '...'
        }
      } else if (key === 'summary') {
        obj[key] = '...'; // Replace summary with '...'
      } else if (typeof obj[key] === 'object') {
        recursiveReplace(obj[key]);
      }
    }
  }
}

// Function to load and modify the YAML file
function replaceDescriptionsAndSummaries(filePath) {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    console.log('File already exists. Exiting script.');
    return;
  }

  // If the file doesn't exist, copy contents from openapi.original.yml
  try {
    const originalFilePath = 'openapi.original.yml';
    if (!fs.existsSync(originalFilePath)) {
      console.error('Original file not found. Exiting script.');
      return;
    }

    // Read contents of the original file
    const originalFileContents = fs.readFileSync(originalFilePath, 'utf8');
    let data = yaml.load(originalFileContents);

    // Replace all descriptions and summaries
    recursiveReplace(data);

    // Save the modified YAML to the new file
    const newYaml = yaml.dump(data);
    fs.writeFileSync(filePath, newYaml, 'utf8');
    console.log(
      'File created and descriptions and summaries replaced successfully.'
    );
  } catch (error) {
    console.error('Error processing the file:', error);
  }
}

// Usage
replaceDescriptionsAndSummaries('openapi.yml');
