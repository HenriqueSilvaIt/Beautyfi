module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],

    plugins: [
      // ...outros plugins
      
      // ESTE DEVE SER O ÚLTIMO PLUGIN DA LISTA!
      'react-native-reanimated/plugin',
        ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true
      }]
    ],
  };
};