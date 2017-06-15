const http = require('http');
const querystring = require('querystring');
const common = require('../util/CommonUtil.js');
const GLBConfig = require('../util/GLBConfig');
const RedisClient = require('../util/RedisClient');
const logger = require('./Logger').createLogger('SMSUtil.js');

const model = require('../model');
// table
const tb_user = model.user;

exports.sedMsg = async(phone, smsType) => {
    let code = common.generateRandomAlphaNum(6)
    let msg = ''

    if (smsType == 'login') {
        msg = '【楽宜嘉】短信验证码:' + code

    } else {
        logger.error('smsType error');
        return false
    }

    try {
        let key = GLBConfig.REDISKEY.SMS + smsType + phone

        let liveTime = await RedisClient.getLiveTime(key)

        if (liveTime > 0) {
            if ((RedisClient.SMSTokenExpired - liveTime) < 50) {
                logger.error('too frequent');
                return false
            }
        }

        let error = await RedisClient.setItem(key, {
            code: code
        }, RedisClient.SMSTokenExpired)

        if (error) {
            logger.error(error);
            return false
        }

        logger.info(msg);

        // await sedNXMsg(phone, msg)
        return true
    } catch (error) {
        logger.error(error);
        return false
    }
}

exports.certifySMSCode = async(phone, code, smsType) => {
    let key = GLBConfig.REDISKEY.SMS + smsType + phone
    let codeData = await RedisClient.getItem(key)
    console.log(2222);
    if (codeData) {
        if (codeData.code === code) {
            return true
        }
        return false
    } else {
        logger.error('Redis get codeData failed');
        return false;
    }
}


function sedNXMsg(phone, msg) {
    return new Promise(function(resolve, reject) {
        if (phone) {
            if (phone.length != 11) {
                reject('phone error');
            }
        } else {
            reject('phone miss');
        }

        if (!msg) {
            reject('msg miss');
        }

        let data = {
            account: 'GC0515',
            password: 'GC0515',
            sender: '99999',
            timing: '',
            time_zone: 8,
            msisdn: '86' + phone,
            message: msg
        };

        let content = querystring.stringify(data);

        let options = {
            hostname: 'sms.nxtele.com',
            port: 80,
            path: '/Api/index?' + content,
            method: 'GET'
        };

        let req = http.request(options, (res) => {
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                let resJson = JSON.parse(chunk)
                if (resJson.state === 0) {
                    reject(resJson.info);
                } else {
                    resolve()
                }
            });
            res.on('end', () => {
                // console.log('响应中已无数据。');
            });
        });

        req.on('error', function(e) {
            logger.error(e.message);
            reject(e.message);
        });

        req.end();
    })
}
