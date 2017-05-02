const express = require('express')
const path = require('path')
const app = express()
const favicon = require('express-favicon')

app.use('/webstatic', express.static(path.join(__dirname, './dist/static/')))
app.use('/data', express.static(path.join(__dirname, './src/data')))

app.use(favicon(path.join(__dirname, './favicon.ico')))

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, './dist') })
})

const server = app.listen(8000, '0.0.0.0', function () {

  let host = server.address().address
  let port = server.address().port

  console.log('vue-sui-demo listening at http://%s:%s', host, port)

})
