const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: './src/client/index.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: '/\.js$/',
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
       test: /\.scss$/,
       use: [ 'style-loader', 'css-loader', 'sass-loader' ]
     }
    ]
  },
  output: {
    libraryTarget: 'var',
    library: 'Client',
    path: path.resolve('dist')
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new webpack.DefinePlugin({})
  ]
}
