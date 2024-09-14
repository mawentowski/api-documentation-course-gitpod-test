const fs = require('fs');
const yaml = require('js-yaml');

// Function to recursively replace 'description' and 'summary' fields
function recursiveReplace(obj) {
  if (typeof obj === 'object' && obj !== null) {
    for (let key in obj) {
      if (key === 'description' || key === 'summary') {
        obj[key] = '...';
      } else if (typeof obj[key] === 'object') {
        recursiveReplace(obj[key]);
      }
    }
  }
}

// Load the YAML file
function replaceDescriptionsAndSummaries(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    let data = yaml.load(fileContents);

    // Replace all descriptions and summaries
    recursiveReplace(data);

    // Save the modified YAML back to the file
    const newYaml = yaml.dump(data);
    fs.writeFileSync(filePath, newYaml, 'utf8');
    console.log('Descriptions and summaries replaced successfully.');
  } catch (error) {
    console.log(error);
  }
}

// Usage
replaceDescriptionsAndSummaries('openapi.yml');
