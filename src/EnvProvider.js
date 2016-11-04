import fetch from "isomorphic-fetch";

const ConfigProvider = (remoteConfigProviderUrl, header) => {
  let config;

  return {
    value: (key) => {
      if (config) {
        return Promise.resolve(config[key]);
      }

      return fetch(remoteConfigProviderUrl, {method: "HEAD"})
        .then((response) => {
          config = JSON.parse(response.headers.get(header));
          return config[key];
        });
    }
  }
};

export default ConfigProvider;
