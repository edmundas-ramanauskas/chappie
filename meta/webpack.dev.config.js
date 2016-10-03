var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  bail: true,
  devServer: {
    publicPath: '/',
    hot: true,
    inline: true,
    noInfo: true,
    color: true,
    port: 3000,
    host: '0.0.0.0'
  },
  devtool: 'source-map',
  entry: [
		'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  logErrorsToConsole: true,
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        loaders: ['react-hot-loader/webpack', 'babel'],
        include: path.join(__dirname, '../src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ]
      },
      {
        test: /\.(png|svg|gif)$/,
        loaders: [
          'url-loader',
          'image-webpack?bypassOnDebug'
        ]
      }
    ]
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: 'bundle.js'
  },
  plugins: [
    // new webpack.DefinePlugin({}),
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({React: 'react'}),
		new HtmlWebpackPlugin({
      title: 'File manager',
			template: './src/index.html',
      inject: false
		})
	],
  resolve: {
    root: path.join(__dirname, 'mocks'),
		extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
	}
};

module.exports = config;
