import { DataProvider, fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl =
  import.meta.env.VITE_REACT_APP_SERVER_URL || "http://localhost:8080";
console.log("API Base URL in dataProvider is:", apiUrl);

const httpClient = (url: string, options: any = {}) => {
  const token = localStorage.getItem("access_token");

  // Conditionally set Authorization header only if the method is POST, PUT, or DELETE
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(["POST", "PUT", "DELETE"].includes(options.method) &&
      token && { Authorization: `Bearer ${token}` }),
    ...options.headers, // Spread in any additional headers
  });

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // This will include cookies in the request
  }).then((response) => {
    console.log(`HTTP ${options.method || "GET"} request to: ${url}`);

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      throw new Error(response.statusText);
    }

    return response.json().then((data) => {
      console.log("Response JSON:", data);
      return data;
    });
  });
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field, order } = params.sort || {};

    const query: Record<string, any> = {
      limit: perPage,
      offset: (page - 1) * perPage,
    };

    if (field && order) {
      query.sort = field;
      query.order = order.toLowerCase();
    }

    console.log("The params object looks like:", params);

    if (params.filter && typeof params.filter === "object") {
      const filterConditions: string[] = [];

      Object.keys(params.filter).forEach((key) => {
        filterConditions.push(`${key}.eq~${params.filter[key]}`);
      });

      if (filterConditions.length > 0) {
        query[`filter`] = filterConditions.join("|");
      }
    }

    const queryString = stringify(query);
    const url = `${apiUrl}/${resource}?${queryString}`;
    console.log("Constructed URL for getList:", url);

    const response = await httpClient(url);

    // Ensure response structure is as expected
    console.log("Response for getList:", response);

    if (response.results) {
      return {
        data: response.results,
        total: response.total_results,
      };
    } else {
      console.error("Unexpected response structure for getList:", response);
      return { data: [], total: 0 }; // Fallback
    }
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    console.log("Fetching single resource from:", url);

    const response = await httpClient(url);
    return { data: response };
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    console.log("Updating resource at:", url);

    const response = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data: response };
  },

  getMany: async (resource, params) => {
    console.log("The getMany params look like", params);

    const requests = params.ids.map((id) => {
      const url = `${apiUrl}/${resource}/${id}`;
      console.log("Fetching resource for getMany from:", url);
      return httpClient(url);
    });

    const responses = await Promise.all(requests);
    console.log("The getMany responses look like:", responses);

    return { data: responses };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const parentResource = params.target.replace(/_id$/, "");

    const queryString = Object.keys(params.filter)
      .map((key) => `${key}.eq~${encodeURIComponent(params.filter[key])}`)
      .join("|");

    const url = `${apiUrl}/${parentResource}/${params.id}/${resource}?sort=${field}&order=${order.toLowerCase()}&limit=${perPage}&offset=${(page - 1) * perPage}&filter=${queryString}`;
    console.log("The getManyReference constructed URL looks like:", url);

    const response = await httpClient(url);
    console.log("The getManyReference response looks like:", response);

    if (response.results) {
      return {
        data: response.results,
        total: response.total_results,
        pageInfo: {
          hasNextPage: page * perPage < response.total_results,
          hasPreviousPage: page > 1,
        },
      };
    } else {
      console.error(
        "Unexpected response structure for getManyReference:",
        response,
      );
      return { data: [], total: 0 }; // Fallback
    }
  },

  updateMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    console.log("Updating multiple resources at:", url);

    const response = await httpClient(url, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });

    return { data: response };
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`;
    console.log("Creating resource at:", url);

    const response = await httpClient(url, {
      method: "POST",
      body: JSON.stringify(params.data),
    });

    return { data: { ...params.data, id: response.id } };
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    console.log("Deleting resource at:", url);

    const response = await httpClient(url, {
      method: "DELETE",
    });

    return { data: response };
  },

  deleteMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    console.log("Deleting multiple resources at:", url);

    const response = await httpClient(url, {
      method: "DELETE",
    });

    return { data: response };
  },
};
