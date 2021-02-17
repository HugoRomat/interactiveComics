  
const path = require("path");
const webpack = require('webpack');
const fs = require('fs');

module.exports = env => {
  console.log('NODE_ENV: ', env); 
  return {
    entry: [
      "./src/index.js", 
    ],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: 'inkspace'
    },
    devServer: {
      contentBase: "./public",
      port: 8080,
      proxy: {
        '/api': 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    },
    module: {
      rules: [
         {
            test: /\.js$/,
            use: 'babel-loader',
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(png|j?g|svg|gif)?$/,
            use: 'file-loader'
         }
]
   }
  }
}