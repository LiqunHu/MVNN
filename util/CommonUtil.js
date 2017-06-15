const formidable = require('formidable');
const gm = require('gm').subClass({
    imageMagick: true
});
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const Error = require('./Error');
const logger = require('./Logger').createLogger('CommonUtil.js');
const model = require('../model');
const sequelize = model.sequelize;

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// common response
function sendData(res, data) {
    let datares = arguments[1] ? arguments[1] : {};
    let sendData = {
        errno: 0,
        msg: 'ok',
        info: datares
    };
    res.send(sendData);
}

function sendError(res, errno) {
    let errnores = arguments[1] ? arguments[1] : -1;
    let msgres = arguments[2] ? arguments[2] : 'error';
    let sendData;
    if (errnores in Error) {
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
    logger.error(msg);
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

/**
 * 事务方法
 * @param options
 * @param autoCallback
 * @returns {*}
 */
let transaction = async function (options, autoCallback) {
    return sequelize.transaction(options, autoCallback);
};


// table
let tb_user = model.user;

function fileSave(req) {
    return new Promise(function (resolve, reject) {
        if (req.is('multipart/*')) {
            try {
                let form = new formidable.IncomingForm(config.uploadOptions);
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                    }
                    if (files.avatar_file) {
                        let filename = uuid.v4() + '.jpg'
                        let tmpFile = path.join(__dirname, '../' + config.uploadOptions.uploadDir + '/' + filename)
                        let avatar_data = JSON.parse(fields.avatar_data);
                        gm(files.avatar_file.path)
                            .setFormat("jpeg")
                            .crop(avatar_data.width, avatar_data.height, avatar_data.x, avatar_data.y)
                            .rotate('white', fields.avatar_data.rotate)
                            .write(tmpFile, function (err) {
                                if (!err) resolve(config.tmpUrlBase + filename);
                                reject(err);
                            })
                    } else if (files.file) {
                        resolve({
                            name: files.file.name,
                            ext: path.extname(files.file.name),
                            url: config.tmpUrlBase + path.basename(files.file.path),
                            type: files.file.type,
                        })
                    } else {
                        reject('no files');
                    }
                })
            } catch (error) {
                reject(error);
            }
        } else {
            reject('content-type error');
        }
    })
}

function fileMove(url, mode) {
    return new Promise(function (resolve, reject) {
        if (url) {
            let fileName = path.basename(url)
            let relPath = ''
            let today = new Date()
            if (mode == 'avatar') {
                relPath = 'avatar/' + today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate() + '/'
            } else if (mode == 'upload') {
                relPath = 'upload/' + today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate() + '/'
            } else {
                reject('mode error');
            }

            let svPath = path.join(__dirname, '../' + config.filesDir + '/' + relPath);

            if (!fs.existsSync(svPath)) {
                mkdirssync(svPath)
            }

            let tempfile = path.join(__dirname, '../' + config.uploadOptions.uploadDir + '/' + fileName);
            fs.renameSync(tempfile, path.join(svPath, fileName))

            resolve(config.fileUrlBase + relPath + fileName);
        } else {
            reject('url error');
        }
    })
}

function mkdirssync(dirpath) {
    try {
        if (!fs.existsSync(dirpath)) {
            let pathtmp;
            dirpath.split(/[/\\]/).forEach(function (dirname) { //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                if (dirname) {
                    if (pathtmp) {
                        pathtmp = path.join(pathtmp, dirname);
                    } else {
                        pathtmp = '/' + dirname;
                    }
                    if (!fs.existsSync(pathtmp)) {
                        if (!fs.mkdirSync(pathtmp)) {
                            return false;
                        }
                    }
                }
            });
        }
        return true;
    } catch (e) {
        logger.error("create director fail! path=" + dirpath + " errorMsg:" + e);
        return false;
    }
}

function generateRandomAlphaNum(len) {
    let charSet = '0123456789';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

async function queryWithCount(db, req, queryStr, replacements) {
    let doc = req.body
    let count = await db.query('select count(*) num from ' + queryStr, {
        replacements: replacements,
        type: db.QueryTypes.SELECT
    })

    let rep = replacements
    rep.push(doc.offset)
    rep.push(doc.limit)

    let queryRst = await db.query('select * from ' + queryStr + ' LIMIT ?,?', {
        replacements: rep,
        type: db.QueryTypes.SELECT
    })

    return {
        count: count[0].num,
        data: queryRst
    }
}

//列表分页查询，查询语句queryStr传完整的sql语句
async function queryWithCount2(db, req, queryStr, replacements) {
    let doc = req.body

    let cnt = queryStr.indexOf("from") + 5;
    let queryStrCnt = queryStr.substr(cnt);

    let count = await db.query('select count(*) num from ' + queryStrCnt, {
        replacements: replacements,
        type: db.QueryTypes.SELECT
    })

    let rep = replacements
    rep.push(doc.offset)
    rep.push(doc.limit)

    let queryRst = await db.query(queryStr + ' LIMIT ?,?', {
        replacements: rep,
        type: db.QueryTypes.SELECT
    })

    return {count: count[0].num, data: queryRst}
}

function getApiName(req) {
    let patha = req.path.split('/')
    let func = patha[patha.length - 1].toUpperCase()
    return func;
}

module.exports = {
    sendData: sendData,
    sendError: sendError,
    sendFault: sendFault,
    fileSave: fileSave,
    fileMove: fileMove,
    generateRandomAlphaNum: generateRandomAlphaNum,
    queryWithCount: queryWithCount,
    queryWithCount2: queryWithCount2,
    getApiName: getApiName,
    transaction: transaction
};
