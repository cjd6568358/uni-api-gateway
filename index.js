const config = [
  {
    node_type: "serverless",
    node_name: "wechat_wxxgj_master_xxxxx",
    apis: ["/htmljson.*/"],
    retry_times: 5,
  },
  {
    node_type: "server",
    node_name: "N1",
    apis: "*",
    retry_times: 5,
    baseUrl: "",
    aliasUrl: "",
  },
];
