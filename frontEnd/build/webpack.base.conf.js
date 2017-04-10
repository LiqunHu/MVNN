var path = require('path')

module.exports = {
  node: {
    fs: 'empty'
  },
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/webstatic'),
    publicPath: '/webstatic/',
    filename: '[name].js'
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js',
      'vue-router$': 'vue-router/dist/vue-router.common.js',
      src: path.resolve(__dirname, '../src'),
      commonFunc: path.resolve(__dirname, '../src/assets/js/common.js')
    },
    extensions: ['.js', '.vue', '.less']
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel-loader',
        options: {compact: false}
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.less$/,
        use: [
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  }
}
