const path = require("path");
module.exports = {
  entry: "./src/app.ts",
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      { test: /\.ts$/, use: "ts-loader", exclude: /node-modules/ },
    ],
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".ts"],
  },
};
