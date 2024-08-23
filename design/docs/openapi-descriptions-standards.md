### OpenAPI Description Standards

#### Introduction

Writing OpenAPI descriptions requires adherence to certain standards to ensure clarity, consistency, and completeness. This style guide outlines best practices for documenting API endpoints and their associated components.

#### General Principles

1. **Standardize Error Responses:**
   - Error response messages should follow a standard format.
2. **Avoid Over-Documentation:**
   - Document only essential information; details that can be expressed as metadata should be expanded upon.
3. **Address OpenAPI Limitations:**
   - List the shortcomings of OpenAPI, considering Lukas' book for reference.
4. **Describe ENUMS:**
   - Clarify ENUMS if not self-evident from the name.
5. **Clarify Field Interactions:**
   - Explain how fields work together to produce specific results.
6. **Describe Complex Booleans:**
   - Detail consequences and interactions when boolean values are not straightforward.
7. **Consistency in Error Status Codes:**
   - Error status codes should have consistent descriptions while addressing specific issues.
8. **Style Guide:**
   - Create a comprehensive style guide with organized sections.

#### Endpoint Descriptions

1. **Focus on Functionality:**
   - Describe the endpoint's functionality, avoiding use cases to keep them versatile.
2. **Omit User Focus:**
   - Don't focus on who uses the endpoint; maintain endpoint independence.
3. **Omit Unnecessary Descriptions:**
   - Avoid descriptions if they're obvious or unnecessary (e.g., GET /guests/{guest_id}).
4. **Use Short Descriptions:**
   - Keep descriptions concise; if a field needs more than 2-3 sentences, move it to conceptual documentation.

#### Field Descriptions

1. **State 'What' It Is:**
   - Describe fields by stating what they are.
2. **Provide Context:**
   - Relate fields together within the context of the resource.
3. **Summary Required:**
   - Each endpoint should have a summary.

#### Example

```yaml
paths:
  /orders:
    post:
      summary: Add an Order
      description: Add a new order to the restaurant.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Order"
      responses:
        "201":
          description: Order created successfully.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"
        "400":
          description: Bad request. Check your request parameters.
          content:
            application/json:
              example:
                error: Bad request
                message: Please provide all required fields.
                details:
                  - Missing field: table_number
components:
  schemas:
    Order:
      type: object
      properties:
        table_number:
          type: integer
          description: The number of the table where the order should be delivered.
          example: 5
        items:
          type: array
          items:
            $ref: "#/components/schemas/MenuItem"
```

This structured approach ensures clear and concise documentation of API endpoints and their components, facilitating better understanding and usage by API consumers.

Cleanup
don't include use cases in API reference. should be independent.
if the operations purpose is apparent from the summary, no need to add a description
the operation description should describe recommenddd logic for the server that directly relates what what is returned in the response.
IDs dont need descriptions

Answers question about how it could be used.
