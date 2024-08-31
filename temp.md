## More

DONE Still need to reformat some of thise problem statements
DONE Resource_id needs to be changed to just ‘id’ globally
DONE Remove Auth from the seeding script
DONE Need to update examples for the revised query parameters usage (refer to get list of dishes)
DONE include > fields, select > filter
DONE Ensure sort, order, etc are there. for the Get list subresource
DONE The subresrouce ones now support added filters.
DONE Remove Categories and Menus resources
DONE OpenAPI spec: order_id to just IDChange ID | include > fields, and DONE select > filter in model
DONE Change ID include > fields, and select > filter controller
DOONE Change ID include > fields, and select > filter server
DONE Add ‘draft’ enum to Status — implications for seed.db
DONE A ‘ price’ to ingredient
DONEL: Add ‘preparation_time’ to order
DONE Price format: cange to like Finix 999 1299 14599
DONE Add categoroy field to Dish
DONE Regenerate postman — add AUTH for post, put and delete, select the environment
DONE Test postman
DONE Change status enums to proper names: "status": "in_progress",
DONE user_name should only have numbers, letters, and no spaces, and no underscores. no special characters.
DONE Add the resources to react admin panel.
DONE Scheduled_at isnt very user friendly, maynbe like it delay and in minutes so they delay their togo order.
automated way to generate server openapi file.
DONE Normally APIs support a q search field: `<TextInput source="q" label="Search" alwaysOn />`. q
DONE Name given_name into name.
DONE Add additional requests field to order -- free form.
DONE Test out all resources in admin panel to see if htey work.
DONE Check on auth process to see if its working.
DONE Make enums selectable options, lik category and station.

## Later

ADMIN - Do images hosted through docker for dishes (see dish-images.md). User and dishes.
Add refresh token as the authoriation header when refreshing -- need to see how hard this is.
Can’t figure out how to trigger errors for sort/order not including one or the other — later date
OPENAPI ingredient_ids can also be nullable for drinks example.
OPENAPI: make it so string fields do not have underscores to promote filtering.
REPO: Adjust scripts to always open a new VS Code terminal. Name it as well? Instructions for stopping a process?

## COurse prep

Empty OpenAPI spec that loads in Swagger UI and Swagger Editor. Store the COmpleted one in the Final folder, and the ones the students work on in the draft folder? Need to think of a way to handle that. Their changes will be overrided if its pulled again. they need a awy of saving their openapi spec and viewing.

README:
Add NoSQLBOoster and setting it up as well as Loom.
https://github.com/mawentowski/api-documentation-course/blob/main/docs/windows-setup.md#3-setting-git-bash-as-the-default-terminal-for-vs-code

README updates:Check if bash_profile exists
Check if .zshrc exists and if not, create one.
Add section on using Loom to produce videos of your issue.
