const webpack = require('webpack')
const config = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

config.output.filename = '[name].js'
config.output.chunkFilename = '[id].js'

let SOURCE_MAP = true

config.devtool = SOURCE_MAP ? 'eval-source-map' : false

// add hot-reload related code to entry chunk
config.entry.app = [
  'eventsource-polyfill',
  'webpack-hot-middleware/client?quiet=true&reload=true',
  config.entry.app
]

config.output.publicPath = '/'

config.plugins = (config.plugins || []).concat([
//  new webpack.ProvidePlugin({
//    $: 'jquery',
//    jQuery: 'jquery',
//    'window.jQuery': 'jquery'
//  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new ExtractTextPlugin('[name].css'),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.ejs',
    title: 'MVNN',
    minify: {
      removeComments: false,
      collapseWhitespace: false
    }
  }),
  new BrowserSyncPlugin(
    // BrowserSync options
    {
      host: '127.0.0.1',
      port: 8080,
      proxy: 'http://127.0.0.1:8000/',
      logConnections: false,
      notify: false
    },
    {
      reload: true
    }
  )
])

module.exports = config
