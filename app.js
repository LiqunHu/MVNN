const log4js = require('log4js');
const express = require('express');
const path = require('path');
//var logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const common = require('./util/CommonUtil.js');
const logger = common.createLogger('app');

let app = express();
let ejs = require('ejs');

let authority = require('./util/Authority')
let services = require('./service');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
//app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: 'auto'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/api', authority.AuthMiddleware);

//处理webpack服务请求
app.get('/__webpack_hmr', function(req, res) {
    res.send('')
})

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.post('/api/auth', services.AuthSRV.AuthResource);
app.post('/api/system/groupcontrol', services.GroupControlSRV.GroupControlResource);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        })
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

module.exports = app;
