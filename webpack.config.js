var path = require( 'path' );
var webpack = require( 'webpack' );
var destPath = 'dest';

module.exports = {
  cache: true,
  entry: {
    app: './js/app.js'
  },
  target: 'atom',
  resolve: {
    modulesDirectories: ["node_modules"]
  },
  output: {
    path: path.join( __dirname, destPath ),
    publicPath: destPath,
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.html$/, loader: 'html-loader'},
      // Required for bootstrap fonts
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
      },
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?prefix=font/'}
    ]
  },
  plugins: [
    new webpack.ProvidePlugin( {
      // Automatically inject jQuery
      // This is required by many jQuery plugins
      jQuery: "jquery",
      $: "jquery",
      _: "underscore",
      Backbone: 'backbone'
    } ),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ]
};
