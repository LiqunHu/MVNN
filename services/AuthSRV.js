const fs = require('fs');
const common = require('../util/CommonUtil.js');
const logger = common.createLogger('AuthSRV.js');
const model = require('../model');
const Security = require('../util/Security');
const GLBConfig = require('../util/GLBConfig');

exports.AuthResource = async(req, res) => {
    let doc = req.body;
    if (!('domain' in doc)) {
        common.sendError(req, res, 1, 'domain is missing');
        return
    }
    if (!('username' in doc)) {
        common.sendError(req, res, 1, 'username is missing');
        return
    }
    if (!('identifyCode' in doc)) {
        common.sendError(req, res, 1, 'identifyCode is missing');
        return
    }
    if (!('magicNo' in doc)) {
        common.sendError(req, res, 1, 'magicNo is missing');
        return
    }

    try {
        let tb_user = model.user;

        let user = await tb_user.findOne({
            'where': {
                'username': doc.username,
                'state': '1'
            }
        });
        if (user == null) {
            common.sendError(req, res, 1, '用户不存在或密码错误');
            return
        }
        let decrypted = await Security.aesDecryptModeCFB(doc.identifyCode, user.password, doc.magicNo)
        if (decrypted != doc.username) {
            common.sendError(req, res, 1, '用户不存在或密码错误');
            return
        } else {
            let session_token = await Security.user2token(user, doc.identifyCode, doc.magicNo)
            res.append('authorization', session_token);
            let loginData = await loginInit(user);
            common.sendData(req, res, loginData);
            return
        }
    } catch (error) {
        logger.error(error);
        common.sendFault(req, res, error);
        return
    }
}

async function loginInit(user) {
    try {
        let returnData = {};
        if (user.avatar) {
            returnData.avatar = user.avatar
        } else {
            returnData.avatar = '/static/images/base/head.gif'
        }
        returnData.id = user.id
        returnData.name = user.name
        let tb_usergroup = model.usergroup;
        let usergroup = await tb_usergroup.findOne({
            'where': {
                'domain_id': user.domain_id,
                'id': user.usergroup_id,
                'state': '1'
            }
        });

        if (usergroup) {
            returnData.description = usergroup.description
            returnData.menulist = await iterationMenu(usergroup.id, '0')
        }

        return returnData;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

async function iterationMenu(GroupID, fMenuID) {
    let return_list = []
    let tb_usergroupmenu = model.usergroupmenu;
    let menus = await tb_usergroupmenu.findAll({
        where: {
            usergroup_id: GroupID,
            f_menu_id: fMenuID
        },
        order: [
            ['menu_index']
        ]
    });

    for (let m of menus) {
        let sub_menu = [];
        if (m.type === GLBConfig.MTYPE_ROOT) {
            sub_menu = await iterationMenu(GroupID, m.id);
        } else {
            return_list.push({
                'type': m.type,
                'menu_name': m.menu_name,
                'menu_path': m.menu_path,
                'menu_icon': m.menu_icon,
                'sub_menu': sub_menu
            })
        }
    }
    return return_list
}
