var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var config = require('./webpack.dev.conf')
var favicon = require('express-favicon')

var app = express()
var compiler = webpack(config)

var proxyTable = {
    '/api': 'http://localhost:9090',
    '/static': 'http://localhost:9090',
    '/temp': 'http://localhost:9090'
}

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options,
      // changeOrigin: true
    }
  }
  app.use(proxyMiddleware(context, options))
})

// 设置资源目录
app.use('/static', express.static(path.join(__dirname, '../../public')))
app.use('/temp', express.static(path.join(__dirname, '../../public')))

app.use(favicon(path.join(__dirname, '../favicon.ico')))
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}))

// enable hot-reload and state-preserving
// compilation error display
app.use(require('webpack-hot-middleware')(compiler))

app.listen(8000, '0.0.0.0', function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://127.0.0.1:8000')
})
