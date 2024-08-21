# Exploring Functionalities

- [Exploring Functionalities](#exploring-functionalities)
    - [Functionality Landing Page](#functionality-landing-page)
    - [Information Types for Topics Underneath Functionalities](#information-types-for-topics-underneath-functionalities)
    - [About the Functionality - Page Template](#about-the-functionality---page-template)
    - [Recipes](#recipes)
    - [Request / Response Descriptions](#request--response-descriptions)
    - [Best Practices](#best-practices)

We’ve already covered what functionalities are in the context of planning our documentation—

essentially, they are the various ways the API can be utilized. 

We identify these functionalities by referencing the functional requirements.

During the information architecture phase, we grouped related topics into functionalities, each representing a different capability offered by the API.

Let’s consider a payment processor example. This API offers two functionalities: processing online payments (Functionality #1) and processing in-person payments (Functionality #2).

Under these functionalities, we’ll need various topics that explain the functionality, demonstrate how to use it, and provide best practices, reference tables, or troubleshooting tips specific to that functionality.

To organize these, we would create two folders representing these functionalities:

```shell
docs/
┣ Home
┣ Getting Started/
┃ ┣ Account Registration
┃ ┣ Retrieving an API Key
┃ ┣ About Requests
┃ ┣ Making a Request
┃ ┣ Using the Response
┣ About the REST API/
┃ ┣ API Overview
┃ ┣ Key Concepts and Terminology
┃ ┣ Use Cases
┃ ┣ Resource Descriptions
┃ ┣ High-Level Software Architecture
┃ ┣ Authentication and Authorization
┃ ┣ Security Best Practices
┃ Online Payments/ # Functionality #1
┃ In-Person Payments/ # Functionality #2
┣ API Reference
```

### Functionality Landing Page

The landing page for each functionality acts as an overview. It typically includes a brief introduction to the functionality and displays 'cards' with short descriptions of each topic under that functionality, allowing users to quickly navigate to specific sections.

By clicking the functionality folder, users will be directed to this overview page.

```shell
docs/
┃ Online Payments/ # Click to view the landing page
┃ In-Person Payments/ # Same
```

On a functionality landing page, you'll typically find a topic title, a summary, and possibly a short description. The cards on this page can be structured as follows:

**Example Card Structure:**

```yaml
Topic Title: Managing Online Payments
Topic Summary: How to securely manage and optimize online payments.
Link to Functionality: [Managing Online Payments Functionality Overview](#)  # Replace with actual link
```

### Information Types for Topics Underneath Functionalities

Within each functionality folder, there can be topics that encompass various information types. 

For example, there might be a main topic explaining the functionality (concept), tasks on how to use it, best practices, or reference materials like field descriptions or error references.

Here’s an example structure:

```shell
docs/
┣ Functionality/
┃ ┣ Concept
┃ ┣ Task
┃ ┣ Reference
┣ Functionality/
┃ ┣ Concept
┃ ┣ Task
┃ ┣ Reference
```

While we’ve provided a clear division of information types, it’s common for topics to mix these types. For example, a topic might start with conceptual information important to understanding the functionality, followed by step-by-step instructions (task), and end with reference material like a table of possible fields or errors.

Let’s add some specific topics under each functionality in our payment processor example:

```shell
docs/
┣ Online Payments/             # Landing page
┃ ┣ About Online Payments       # Concept
┃ ┣ Managing Online Payments    # Task
┃ ┣ Refunding Payments          # Task
┃ ┣ Best Practices              # Reference
┣ In-Person Payments/          # Landing page
┃ ┣ About In-Person Payments    # Concept
┃ ┣ Managing In-Person Payments # Task
┃ ┣ Refunding Payments          # Task
┃ ┣ Best Practices              # Reference
```

### About the Functionality - Page Template

For functionality concepts that are more descriptive rather than task-oriented, you can use the following template:

```markdown
# Functionality Name
## Summary
## Description 
## Resources/Endpoints
## Concept
```

In the **Description** section, describe the benefit of the functionality, which can be aligned with the user story corresponding to the functional requirement. 

The **Resources/Endpoints** section should list relevant endpoints, possibly involving multiple resources, but typically focusing on a primary resource.

Additionally, include relevant conceptual information, such as business domain insights, that illustrate the real-world application of the functionality.

### Recipes

Tasks, often called recipes, demonstrate how to use the functionality step-by-step. They fall under the task information type.

Characteristics of recipes:

- **Practical Implementation**: Step-by-step instructions for accomplishing specific tasks or workflows using the API.
- **Example-Centric**: Concrete examples of how to use the API for common tasks, demonstrating best practices.
- **User Journey**: Guides users through the practical implementation, showing how different API components interact.

Here’s a basic template for a task topic:

```markdown
# Task Name
## Summary
A brief overview of what the task accomplishes.

## Description
A detailed explanation of the task, including any necessary background information.

## Steps
### Step 1: [Step Title]
Clear instructions for the first step.

### Step 2: [Step Title]
Clear instructions for the second step.

### Step 3: [Step Title]
Clear instructions for the third step.
```

In the case of our payment processor, for the "Managing Online Payments" functionality, the recipe could be structured as follows:

```markdown
# Managing Online Payments

## Summary
[Summarize the recipe]

## Description 
[Detailed description of the process]

## Resources/Endpoints
[Table of relevant endpoints]

### 1. Initiate Payment Request
[Instructions for initiating a payment request]

### 2. Handle Payment Authorization
[Instructions for handling payment authorization]

### 3. Process the Payment
[Instructions for processing the payment]

### 4. Capture the Payment
[Instructions for capturing the payment]

### 5. Verify Payment Success
[Instructions for verifying payment success]
```

### Request / Response Descriptions

Within each of these sub-headings, provide:

- **Request Description**: Describe the request, provide an example API call as a code sample, and explain the important parts like method, path, params, and request body.
- **Response Description**: Highlight important resource fields and explain the response.

```markdown
### 1. Initiate Payment Request

**Request Description**:

[Describe the request]

**Response Description**:

[Describe the response]
```

### Best Practices

The Best Practices section under a specific functionality outlines the most effective and safest ways to use the functionality.

For example, in our payment processor API, this section might cover best practices for handling online payments securely and efficiently, such as validation, error handling, and ensuring data integrity.

Here’s where this would be located:

```shell
docs/
┣ Online Payments/       
┃ ┣ About Online Payments    
┃ ┣ Managing Online Payments   
┃ ┣ Refunding Payments      
┃ ┣ Best Practices         
┣ In-Person Payments/          
┃ ┣ In-Person Payments     
┃ ┣ Managing In-Person Payments 
┃ ┣ Refunding Payments          
┃ ┣ Best Practices             
```