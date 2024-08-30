import { DataProvider, fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = "http://localhost:4010/";
const httpClient = fetchUtils.fetchJson;

// Helper function to handle API errors
const handleError = () => {
  throw new Error("An error occurred");
};

export const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url)
      .then(({ headers, json }) => ({
        data: json.results,
        total: parseInt(
          (headers.get("content-range") || "0").split("/").pop() || "0",
          10,
        ),
      }))
      .catch(handleError);
  },

  getOne: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`)
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ _id: { $in: params.ids } }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url)
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url)
      .then(({ headers, json }) => ({
        data: json.results,
        total: parseInt(
          (headers.get("content-range") || "0").split("/").pop() || "0",
          10,
        ),
      }))
      .catch(handleError);
  },

  update: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    })
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },

  updateMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ _id: { $in: params.ids } }),
    };

    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    })
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },

  create: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    })
      .then(({ json }) => ({
        data: { ...params.data, id: json._id },
      }))
      .catch(handleError);
  },

  delete: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    })
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },

  deleteMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ _id: { $in: params.ids } }),
    };

    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    })
      .then(({ json }) => ({
        data: json,
      }))
      .catch(handleError);
  },
};
