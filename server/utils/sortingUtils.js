// sortingUtils.js

// Function to parse sorting options
exports.parseSortOptions = function (sort) {
  const sortOptions = {};
  if (sort) {
    sort.split(",").forEach((field) => {
      const [fieldName, sortOrder] = field.split(":");
      sortOptions[fieldName] = sortOrder === "desc" ? -1 : 1;
    });
  }
  return sortOptions;
};

// Function to parse inclusion options (select)
exports.parseSelectOptions = function (include) {
  const selectOptions = {};
  if (include) {
    include.split(",").forEach((field) => {
      selectOptions[field] = 1;
    });
  }
  return selectOptions;
};
exports.parseFilterOptions = function (select) {
  const filterOptions = {};
  if (select) {
    select.split(",").forEach((filter) => {
      const dotIndex = filter.lastIndexOf(".");
      if (dotIndex !== -1) {
        const fieldName = filter.substring(0, dotIndex);
        const operatorAndValue = filter.substring(dotIndex + 1);
        const operatorIndex = operatorAndValue.indexOf(":");
        if (operatorIndex !== -1) {
          const operatorType = operatorAndValue.substring(0, operatorIndex);
          let value = operatorAndValue.substring(operatorIndex + 1).trim();

          console.log("Field Name:", fieldName);
          console.log("Operator:", operatorType);
          console.log("Raw Value:", value);

          filterOptions[fieldName] = {};

          if (!isNaN(value)) {
            console.log(`Value is a number: ${value}`);
            value = parseFloat(value);
            if (operatorType === "eq") {
              filterOptions[fieldName]["$eq"] = value;
            } else if (operatorType === "gt") {
              filterOptions[fieldName]["$gt"] = value;
            } else if (operatorType === "gte") {
              filterOptions[fieldName]["$gte"] = value;
            } else if (operatorType === "lt") {
              filterOptions[fieldName]["$lt"] = value;
            } else if (operatorType === "lte") {
              filterOptions[fieldName]["$lte"] = value;
            }
          } else if (!isNaN(Date.parse(value))) {
            console.log()
            const parsedValue = new Date(value).toISOString();
            if (operatorType === "eq") {
              filterOptions[fieldName]["$gte"] = parsedValue;
              const nextDay = new Date(parsedValue);
              nextDay.setDate(nextDay.getDate() + 1);
              filterOptions[fieldName]["$lt"] = nextDay.toISOString();
            } else if (operatorType === "gt") {
              filterOptions[fieldName]["$gt"] = parsedValue;
            } else if (operatorType === "gte") {
              filterOptions[fieldName]["$gte"] = parsedValue;
            } else if (operatorType === "lt") {
              filterOptions[fieldName]["$lt"] = parsedValue;
            } else if (operatorType === "lte") {
              filterOptions[fieldName]["$lte"] = parsedValue;
            }
          } else {
            filterOptions[fieldName][`$${operatorType}`] = value;
          }

          console.log("Filter Options:", filterOptions);
        } else {
          console.log("Invalid filter format:", filter);
        }
      } else {
        console.log("No operator found, treating as 'eq'");
        filterOptions[filter] = { "$eq": true }; // Default to equality check
        console.log("Filter Options:", filterOptions);
      }
    });
  }

  return filterOptions;
};

// Function to convert filter value to appropriate type
function getValue(value, operator) {
  if (operator === "eq") {
    operator = "eq"; // Remove the colon from the operator
  }
  if (!isNaN(value)) {
    // For numeric values
    return parseFloat(value);
  } else if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (value === "null") {
    return null;
  } else if (value === "undefined") {
    return undefined;
  } else {
    return value;
  }
}
