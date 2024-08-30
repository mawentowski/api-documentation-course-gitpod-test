### API Styleguide

#### Response Handling

- POST requests return the entire response object.
- The structure of fields passed in the request body matches the same in the response.
- POST requests return the full resource.

#### Parameters

- Parameters and body parameters are underscore case and not camel case.

#### Sub-resources

- Sub resource URLs return the full sub-resource (not IDs array).
- Sub-resource URLs are only used for GET requests.
- The maximum amount of sub-resources is one.
- Sub-resources are never created, deleted, or updated. Only GET requests are allowed.

#### Filtering

- Use the parameter name `filters` for filters that apply to all fields.
- Use the convention `filter_fieldName` for filters that apply to a single field.
- Use `date_filter` for date filters, e.g., `eq:2024-01-01`.

#### Projection

- Use `fields` for projection filters.

#### URL Convention

- URLs only contain resources/sub-resources and path params (not actions like listItems).
- Path IDs should be named according to the resource, not just generically as "id" in the URL (e.g., `user_id`).

#### Schema and Nesting

- The maximum allowed schema nesting is 2 levels.

#### HTTP Status Codes

- Unique fields require a 409 status code to indicate a conflict.

#### Resource Operations

- Each resource should support POST, GET (by ID/all), PUT/PATCH, and DELETE operations.
- All operations should have a summary and description.
- All parameters should have descriptions.

#### Additional Notes

- Add the styleguide to the OpenAPI repository for reference.

## Needs cleanup:

is\_ for booleans like is_essential
Parameters should be general and not specific to fields since youc ant antipicate how apic osnumers will use the API fully of the specific fields they are interested in.
Collection endpoints have these query params: - test
cursor based pagination for UI vs. other one
'fields' rather than properties
Need extended docs on query parameter construction (translating api styleguide)
Error message -- name for example
request and response bodies must be objects (and not arrays, for example)
get endpoints return a object with an array of object with results and total results

Query params:
/orders
full query params for complex
or just include/select minimum
ingredients/{ingredient_id} - only include
/orders/{order_id}/dishes - only include

Sub resources should be conistently an action or a sub-resouce...
“For collection endpoints, every API call should return status code 200, even if the collection is empty.”
