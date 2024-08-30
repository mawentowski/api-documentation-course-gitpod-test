/dishes Get a list of dishes
A common use case is to display a list of dishes to the user for selection.

Get a list of orders
Helpful to view the status and priority of orders on the current day or view historical orders for inventory and analytics purposes. Will support pagination in the future.

/orders/{order_id}/dishes
Some common use cases are patron billing and displaying dishes that need to be prepared and collected by kitchen staff.

/orders/{order_id}
Common use cases include:
Changing the status of an order as it progresses toward completion
Changing the priority of the order to account for preparation times and other factors
Updating dishes if the patron wishes the modify them if a dish runs out.

/dishes
Create a dish  
Below is sample server logic:

- In the request body, each `ingredient_id` in the `ingredient_ids` array must represent an ingredient in the system.
- The `name` field must be unique since it is commonly used for search when the ID is not known.
- If an ingredient is 'essential' for preparation (a boolean value of `true`), a `in_stock_qty` set to `0` should deactivate the associated dish for selection by the patron in user interfaces.

/dishes/{dish_id}/ingredients
A common use case is to display ingredients in the order they should be assembled when the chef prepares a dish.

/ingredients:
post:
The `name` field must be unique because it is commonly used for retriveing IDs.
Each time a dish is created, there should be logic to determine if a primary ingredient reaches 0 so they menu dish can greyed out in the UI. The UI can also indicate if any non-primary ingredients are available.

get:
summary: Get a list of ingredients
description: |
Commonly used when creating dishes to check if an ingredient is in the system by filtering on the `name` field. If so, Get it's ID so it can be added to a dish.

    It is also useful for retrieving ingredients quantities to determine if a ingredient has run out and dishes associated with the ingredient should be unavailable for selection by the patron.

/categories/{category_id}/dishes:
get:
summary: View dishes associated with a category
description: Commonly used to dishes under category tabs in a food ordering app.
