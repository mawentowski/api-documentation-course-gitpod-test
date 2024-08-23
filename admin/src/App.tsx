import {
  Admin,
  Resource,
  ListGuesser,
  ShowGuesser,
  EditGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
// import { dataProvider } from "./dataProviderPOS";
import { UserList } from "./users";
import { PostList, PostEdit, PostCreate } from "./posts";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./Dashboard";
// import { authProvider } from "./authProvider";

// Define resources that appear in the left nav.

export const App = () => (
  <Admin
    // authProvider={authProvider}
    layout={Layout}
    dataProvider={dataProvider}
    dashboard={Dashboard}
  >
    {/* out of the box component that returns code to the console */}
    {/* <Resource name="posts" list={ListGuesser} /> */}
    {/* List is the initial resource page, usuually not containing all fields. Editguesser is for editing records */}
    <Resource
      name="posts"
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={PostIcon}
    />
    {/* custom component to render a list.*/}
    {/* List displays 'list pages'. Show defines the 'detail' view. */}
    {/* Later: customize the Show Guesser component by creating a custom component. Easy: copy the code outputted to the console first then create the customc component */}
    <Resource name="users" list={UserList} show={ShowGuesser} icon={UserIcon} />
  </Admin>
);
