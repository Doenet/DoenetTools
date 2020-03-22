const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');

module.exports = {

  // devtool: 'source-map',
  entry: {
    "index.js": "./src/index.js",
    "admin/index.js": "./src/admin/index.js",
    "chooser/index.js": "./src/chooser/index.js",
    "course/index.js": "./src/course/index.js",
    "docs/index.js": "./src/docs/index.js",
    "editor/index.js": "./src/editor/index.js",
    "exam/index.js": "./src/exam/index.js",
    "gradebook/index.js": "./src/gradebook/index.js",
    "page/index.js": "./src/page/index.js",
    "test/index.js": "./src/test/index.js",
    "viewer/index.js": "./src/viewer/index.js",
  },

  output: {
    path: resolve(__dirname, 'dist_local'),
    filename: '[name]',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: { minimize: true }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.doenet$/,
        use: { loader: "raw-loader" }
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000, // Convert images < 10kb to base64 strings
              name: 'media/[hash]-[name].[ext]'
            }
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      chunks: ['index.js'],
      template: "./src/index.html",
      filename: "./index.html",
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ['admin/index.js'],
      template: "./src/admin/index.html",
      filename: "./admin/index.html",
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ["chooser/index.js"],
      template: "./src/chooser/index.html",
      filename: "./chooser/index.html"
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ["course/index.js"],
      template: "./src/course/index.html",
      filename: "./course/index.html"
      // favicon: "",
    }),

    new HtmlWebPackPlugin({
      chunks: ['docs/index.js'],
      template: "./src/docs/index.html",
      filename: "./docs/index.html",
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ['editor/index.js'],
      template: "./src/editor/index.html",
      filename: "./editor/index.html",
      // favicon: "",
    }),

    new HtmlWebPackPlugin({
      chunks: ["exam/index.js"],
      template: "./src/exam/index.html",
      filename: "./exam/index.html"
      // favicon: "",
    }),
    // Gradebook
    new HtmlWebPackPlugin({
      chunks: ['gradebook/index.js'],
      template: "./src/gradebook/index.html",
      filename: "./gradebook/index.html",
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ['gradebook/index.js'],
      template: "./src/gradebook/assignment/index.html",
      filename: "./gradebook/assignment/index.html"
    }),
    new HtmlWebPackPlugin({
      chunks: ['gradebook/index.js'],
      template: "./src/gradebook/attempt/index.html",
      filename: "./gradebook/attempt/index.html"
    }),
    // /Gradebook
    new HtmlWebPackPlugin({
      chunks: ["page/index.js"],
      template: "./src/page/index.html",
      filename: "./page/index.html"
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ["test/index.js"],
      template: "./src/test/index.html",
      filename: "./test/index.html"
      // favicon: "",
    }),
    new HtmlWebPackPlugin({
      chunks: ["viewer/index.js"],
      template: "./src/viewer/index.html",
      filename: "./viewer/index.html"
      // favicon: "",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      // filename: "main.css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      { from: 'cypress_php' }
    ]),
    new CopyWebpackPlugin([
      { from: 'static' }
    ])
  ],
  devServer: {
    port: 3000,
    // openPage: "protected",
  },
  // devtool: 'source-map'
};