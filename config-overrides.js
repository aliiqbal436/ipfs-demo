const webpack = require("webpack");
const WorkerPlugin = require("worker-plugin");

module.exports = function override(webpackConfig) {
  // Disable resolving ESM paths as fully specified.
  // See: https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
  webpackConfig.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Ignore source map warnings from node_modules.
  // See: https://github.com/facebook/create-react-app/pull/11752
  webpackConfig.ignoreWarnings = [/Failed to parse source map/];

  // Polyfill Buffer.
  webpackConfig.plugins.push(new WorkerPlugin());
  // webpackConfig.module.rules.push({
  //   test: /\.worker\.js$/,
  //   use: {
  //     loader: "worker-loader",
  //   },
  // });

  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  // Polyfill other modules.
  webpackConfig.resolve.fallback = {
    util: require.resolve("util"),
    assert: require.resolve("assert"),
    url: require.resolve("url"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    fs: false,
    process: false,
    path: false,
  };

  return webpackConfig;
};
