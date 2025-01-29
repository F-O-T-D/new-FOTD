const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // resolverMainFields 추가
  config.resolver = {
    ...config.resolver,
    resolverMainFields: ['react-native', 'browser', 'main']
  };

  return config;
})();
