var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
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
		}),
    // new CopyWebpackPlugin([{
    //   from: '',
    //   to: ''
    // }]),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
	],
  postcss: [
    require('autoprefixer-core')
  ],
  resolve: {
		extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'src']
	},
  target: 'electron-main'
};

module.exports = config;
