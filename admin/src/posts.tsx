// in src/posts.tsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  Create,
} from "react-admin";
import { Edit, ReferenceInput, SimpleForm, TextInput } from "react-admin";

// displays on record list first page.

const postFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="title" label="Title" reference="users" />,
];

export const PostList = () => (
  <List filters={postFilters}>
    <Datagrid rowClick={false}>
      {/* this is the blog post ID not the userid */}
      <TextField source="id" />
      {/* Reference components let users navigate from one resource to another in a natural way.  */}
      {/* The <ReferenceField> component fetches the reference data, creates a RecordContext with the result, and renders the record representation (or its children). */}
      {/* reference is to the users resource we defined in App.tsx */}
      {/* The admin portal adds the name of the user here automatically*/}
      {/* Need to look into referencing more: https://marmelab.com/react-admin/Resource.html#recordrepresentation */}
      {/* User is not a field in the API, the admin portal is taking the name and adding it there. */}
      <ReferenceField source="userId" reference="users" link="show" />
      <TextField source="title" />
      <TextField source="body" />
      <EditButton />
    </Datagrid>
  </List>
);
// displays when you edit a record.

export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" InputProps={{ disabled: true }} />
      <ReferenceInput source="userId" reference="users" />

      <TextInput source="title" />
      <TextInput source="body" />
      <TextInput source="body" multiline rows={5} />
    </SimpleForm>
  </Edit>
);

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      <TextInput source="body" multiline rows={5} />
    </SimpleForm>
  </Create>
);
