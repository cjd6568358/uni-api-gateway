import http from "./utils/http";
let nodes = [
  {
    node_type: "serverless",
    node_name: "wechat_wxxgj_master_xxxxx",
    apis: ["/htmljson.*/"],
    retry_times: 5,
    healthUrl: "",
    baseUrl: "",
    aliasUrl: "",
  },
  {
    node_type: "server",
    node_name: "N1",
    apis: "*",
    retry_times: 5,
    healthUrl: "",
    baseUrl: "",
    aliasUrl: "",
  },
];

export { nodes };

export default (params = nodes) => {
  return Promise.allSettled(params.map((node) => fetch(node.healthUrl))).then(
    (results) => {
      nodes = results.filter(
        (result) => result.status === "fulfilled"
      );
      return http;
    }
  );
};
