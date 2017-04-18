const log4js = require('log4js');
const config = require('../config');
const Error = require('./Error');

// common response
function sendData(res, data) {
    let datares = arguments[1] ? arguments[1] : {};
    let sendData = {
        errno: 0,
        msg: 'ok',
        data: datares
    };
    res.send(sendData);
}

function sendError(res, errno) {
    let errnores = arguments[1] ? arguments[1] : -1;
    let msgres = arguments[2] ? arguments[2] : 'error';
    let sendData;
    if(errnores in Error){
        sendData = {
            errno: errnores,
            msg: Error[errnores]
        };
    } else {
        sendData = {
            errno: errnores,
            msg: '错误未配置'
        };
    }
    res.status(700).send(sendData);
}

function sendFault(res, msg) {
    let msgres = arguments[1] ? arguments[1] : 'Internal Error';
    let sendData = {};
    console.log(msg);
    if (process.env.NODE_ENV === 'test') {
        sendData = {
            errno: -1,
            msg: msgres,
        };
    } else {
        sendData = {
            errno: -1,
            msg: 'Internal Error',
        };
    }
    res.status(500).send(sendData);
}

function createLogger(name) {
    log4js.configure(config.loggerConfig.config);
    var logger = log4js.getLogger(name);
    logger.setLevel(config.loggerConfig.level);
    return logger;
}

module.exports = {
    sendData: sendData,
    sendError: sendError,
    sendFault: sendFault,
    createLogger: createLogger
};
