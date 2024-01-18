import axios from "axios";

const base_url = "https://yuslords-bk-ea6d9e6fc16a.herokuapp.com";

const axiosBaseClient = (type) => {
  return axios.create({
    // baseURL: type === "auth" ? auth_url : base_url,
    baseURL: base_url,
  });
};

const axiosClient = axiosBaseClient("base");
// const axiosAuthClient = axiosBaseClient("auth");

const api = (axios) => {
  return {
    get: (url, config = {}) => {
      console.log({url, config});
      return axios.get(url, config);
    },
    post: (url, body, config = {}) => {
      return axios.post(url, body, config);
    },
    put: (url, body, config = {}) => {
      return axios.put(url, body, config);
    },
    delete: (url, config = {}) => {
      return axios.delete(url, config);
    },
    patch: (url, body, config = {}) => { 
      return axios.patch(url, body, config)
    }
  };
};

async function requestHandlers(request) {
  console.log({request});
  return request;
}
async function responseHandler(response) {
  console.log({response});
  return response;
}

// const responseHandler = async (response) => {
//   return response;
// };

const errorHandler = (error) => {
  const { response } = error;
  const data = response?.data;

  if (data) {
    throw new Error(JSON.stringify(data));
  }

};

//inceptors
axiosClient.interceptors.request.use(requestHandlers, errorHandler);
axiosClient.interceptors.response.use(responseHandler, errorHandler);
// axiosAuthClient.interceptors.response.use(responseHandler, errorHandler);

export const apiClient = api(axiosClient);
// export const authApiClient = api(axiosAuthClient);
