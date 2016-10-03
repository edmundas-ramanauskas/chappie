var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  bail: true,
  entry: [
    './src/index.jsx'
  ],
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        loader: 'babel',
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
    path: path.join(__dirname, '../build'),
    crossOriginLoading: 'anonymous',
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    // new webpack.DefinePlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({React: 'react'}),
		new HtmlWebpackPlugin({
      title: 'File manager',
			template: './src/index.html',
      inject: false,
      // minify: {
      //   collapseWhitespace: true,
      //   removeComments: true
      // },
		})
    // new CopyWebpackPlugin([{
    //   from: '',
    //   to: ''
    // }])
	],
  resolve: {
		extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
	},
  target: 'electron-main'
};

module.exports = config;
