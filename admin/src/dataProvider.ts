import jsonServerProvider from "ra-data-json-server";

export const dataProvider = jsonServerProvider(
  // import the base URL environment variable from the .env file
  import.meta.env.VITE_JSON_SERVER_URL,
);
