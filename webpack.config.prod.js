const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: "./src/app.ts",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      { test: /\.ts$/, use: "ts-loader", exclude: /node-modules/ },
    ],
  },
  devtool: false,
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [],
};
