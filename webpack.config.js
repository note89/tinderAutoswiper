const { CheckerPlugin } = require("awesome-typescript-loader");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    content: "./src/content/index.ts",
    popup: "./src/popup/index.ts",
    coin: "./src/coin.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  devtool: "source-map",

  // Add the loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  plugins: [new CheckerPlugin()]
};
