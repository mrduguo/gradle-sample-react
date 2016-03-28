const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const CommonsPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

const root_dir = path.resolve(__dirname, './../')
const node_dir = root_dir + '/node_modules'

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(root_dir, './src')
]

module.exports = {
  entry: {
    app: ['./src/index'],
    common: ['rest', 'react']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(root_dir, '../../../build/resources/main/static/dist'),
    publicPath: '/dist'
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new LiveReloadPlugin(),
    new CommonsPlugin({
      minChunks: 8,
      name: 'common'
    })
  ],
  devtool: 'source-map',
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    root: path.resolve(root_dir, './src'),
    alias: {
      'stompjs': node_dir + '/stompjs/lib/stomp.js'
    },
    extensions: ['', '.js', '.sass'],
    modulesDirectories: ['src', 'node_modules']
  }
}
