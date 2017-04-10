const CryptoJS = require('crypto-js')
const common = require('../util/CommonUtil.js');
const logger = common.createLogger('Security.js');

const model = require('../model');
const config = require('../config');

exports.token2user = async(req) => {
    let token_str = req.get('authorization');
    if (!token_str) {
        logger.info('no token');
        return null;
    }

    let tokensplit = token_str.split('-');
    if (tokensplit.length != 4) {
        return null;
    }

    let uid = tokensplit[0],
        magicNo = tokensplit[1],
        expires = tokensplit[2],
        sha1 = tokensplit[3]

    if (parseInt(expires) < Date.now()) {
        logger.info('expires');
        return null;
    }

    let tbUser = model.user;
    let user = await tbUser.findOne({
        'where': {
            'id': uid,
            'state': '1'
        }
    });
    if (!user) {
        logger.info('user do not exist');
        return null;
    }

    let idf = aesEncryptModeCFB(user.username, user.password, magicNo)
    let s = [uid, idf, expires, config.SECRET_KEY].join('-')
    if (sha1 != CryptoJS.SHA1(s)) {
        logger.info('invalid sha1');
        return null;
    }

    let db_usergroupmenu = model.usergroupmenu;
    let menuList = await db_usergroupmenu.findAll({
        where: {
            usergroup_id: user.usergroup_id,
            'state': '1'
        }
    });

    // auth control
    let menus = {};
    for (m in menuList) {
        let ma = m.menu_path.split('/');
        menus[ma[ma.length - 1].toUpperCase()] = m.auth_flag
    }

    let patha = req.baseUrl.split('/')
    let func = patha[patha.length - 1].toUpperCase()
    if (func in menus) {
        if (menus[func] === 1) {
            return user
        }
    }
    return null
}

function generateRandomAlphaNum(len) {
    var rdmString = ''
    // toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
    for (; rdmString.length < len;) {
        rdmString += Math.random().toString(16).substr(2)
    }
    return rdmString.substr(0, len)
}

function aesEncryptModeCFB(msg, pwd, magicNo) {
    let key = CryptoJS.enc.Hex.parse(CryptoJS.MD5(pwd).toString())
    let iv = CryptoJS.enc.Hex.parse(magicNo)

    let identifyCode = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
    return identifyCode
}
