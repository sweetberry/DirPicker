"use strict";
const path = require( 'path' );
const webpack = require( 'webpack' );
const destPath = 'dest/js/renderer';

module.exports = {
  cache  : true,
  entry  : {
    app: './src/js/renderer/app.js'
  },
  target : 'electron-renderer',
  resolve: {
    modules   : ["node_modules"],
    extensions: ['.js', '.es6', '.json']
  },
  output : {
    path         : path.join( __dirname, destPath ),
    publicPath   : destPath,
    filename     : '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module : {
    rules: [
      {test: /\.(js)$/, exclude: /node_modules/, use: 'babel-loader'},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {test: /\.html$/, use: 'html-loader'},
      {test: /\.json$/, use: 'json-loader'},
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use : 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
      },
      {
        test   : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader : 'file-loader',
        options: {
          name      : '[name].[ext]',
          publicPath: '../',
          outputPath: './fonts/'
        }
      }]
  },
  devtool: "#source-map",
  plugins: [
    new webpack.ProvidePlugin( {
      // Automatically inject jQuery
      // This is required by many jQuery plugins
      jQuery  : "jquery",
      $       : "jquery",
      _       : "underscore",
      Backbone: 'backbone'
    } )
  ]
};
