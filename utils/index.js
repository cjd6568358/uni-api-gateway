const checkValid = (result) => {
  if (!result) {
    return false;
  }
  return Date.now() + 5 * 60 * 60 * 1000 < result.deadTime;
};

let tokenCache = new Map();

const getAccessToken = async (appid) => {
  let result = tokenCache.get(appid);
  if (!checkValid(result)) {
    let { data } = await fetch(
      "https://server.com/wechat/accessToken/:appid/:refresh?"
    );
    tokenCache.set(
      appid,
      Object.assign(data, { deadTime: data.expires_in * 1000 + Date.now() })
    );
    result = data;
  }
  return result.access_token;
};

export { getAccessToken };
