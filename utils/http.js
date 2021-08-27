import axios from "axios";
import { nodes } from "../index";
import { getAccessToken } from "./index";
const httpClient = axios.create({
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    if (!config.baseUrl) {
      let { node_index = -1 } = config;
      node_index++;
      let node = nodes[node_index];
      while (
        node &&
        (node.retry_times < 0 ||
          !(Array.isArray(node.apis)
            ? node.apis.includes(config.url)
            : new RegExp(node.apis).test(config.url)))
      ) {
        node_index++;
        node = nodes[node_index];
      }
      if (node) {
        Object.assign(config, { baseUrl: node.baseUrl, node_index });
        if (node.node_type === "cloudfunction") {
          let { appid, env, access_token_url } = node.options;
          let access_token = await getAccessToken(appid, access_token_url);
          let function_name = config.url.replace(/\//g, "_");
          Object.assign(config.data, config.params);
          config.params = {
            access_token,
            env,
            name: function_name,
          };
        }
      } else {
        return Promise.reject("找不到可用的node节点");
      }
    }
    return config;
  },
  async (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
httpClient.interceptors.response.use(
  async (response) => {
    // Do something with response data
    return response;
  },
  async (error) => {
    // Do something with response error
    if (error.config.node_index >= 0) {
      let node = nodes[error.config.node_index];
      node.retry_times--;
      if (node.retry_times < 0) {
        return Promise.reject(error);
      } else {
        delete error.config.baseUrl;
        return httpClient(error.config);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default httpClient;
