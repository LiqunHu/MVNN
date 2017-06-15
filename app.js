const log4js = require('log4js');
const express = require('express');
const path = require('path');
//var logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const common = require('./util/CommonUtil.js');
const logger = require('./util/Logger').createLogger('app.js');

let app = express();
let cors = require('cors')
let ejs = require('ejs');

let authority = require('./util/Authority')
let AuthSRV = require('./util/AuthSRV')
let services = require('./service')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/temp', express.static(path.join(__dirname, 'public/temp')))
app.use('/files', express.static(path.join(__dirname, 'public/files')))
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
app.get('/__webpack_hmr', function (req, res) {
    res.send('')
})

app.post('/api/auth', AuthSRV.AuthResource);
app.post('/api/sms', AuthSRV.SMSResource);
app.post('/api/system/domainControl', services.DomainControlSRV.DomainControlResource);
app.post('/api/system/groupControl', services.GroupControlSRV.GroupControlResource);
app.post('/api/system/menuControl', services.MenuControlSRV.MenuControlResource);
app.post('/api/system/domainMenuControl', services.DomainMenuControlSRV.DomainMenuControlResource);
app.post('/api/system/groupMenuControl', services.GroupMenuControlSRV.GroupMenuControlResource);
app.post('/api/system/operatorControl', services.OperatorControlSRV.OperatorControlResource);
app.post('/api/system/userSetting', services.UserSettingSRV.UserSettingResource);
app.post('/api/system/resetPassword', services.UserResetPasswordSRV.UserResetPasswordResource);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'test') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        })
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

module.exports = app;
