const log4js = require('log4js');
const config = require('../config');

// common response
function sendData(req, res, data) {
    let datares = arguments[2] ? arguments[2] : {};
    let sendData = {
        errno: 0,
        msg: 'ok',
        data: datares
    };
    res.send(sendData);
}

function sendError(req, res, errno, msg) {
    let errnores = arguments[2] ? arguments[2] : 1;
    let msgres = arguments[3] ? arguments[3] : 'error';
    let sendData = {
        errno: errnores,
        msg: msgres
    };
    res.send(sendData);
}

function sendFault(req, res, msg) {
    let msgres = arguments[2] ? arguments[2] : 'Internal Error';
    let sendData = {};
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
