const fs = require('fs');
const common = require('../util/CommonUtil.js');
const logger = require('./Logger').createLogger('AuthSRV.js');
const model = require('../model');
const Security = require('../util/Security');
const Sequence = require('../util/Sequence');
const config = require('../config');
const GLBConfig = require('../util/GLBConfig');
const RedisClient = require('../util/RedisClient');
const sms = require('../util/SMSUtil.js');

// table
const tb_user = model.user;
const tb_usergroup = model.usergroup;
const tb_usergroupmenu = model.usergroupmenu;

exports.AuthResource = async(req, res) => {
    let doc = req.body;
    if (!('username' in doc)) {
        return common.sendError(res, 'auth_02');
    }
    if (!('identifyCode' in doc)) {
        return common.sendError(res, 'auth_03');
    }
    if (!('magicNo' in doc)) {
        return common.sendError(res, 'auth_04');
    }

    try {
        let user = await tb_user.findOne({
            'where': {
                username: doc.username,
                type: {
                    $in: ['00','01']
                },
                state: GLBConfig.ENABLE
            }
        });
        if (user == null) {
            return common.sendError(res, 'auth_05');
        }
        let decrypted = Security.aesDecryptModeCFB(doc.identifyCode, user.password, doc.magicNo)
        if (decrypted != doc.username) {
            return common.sendError(res, 'auth_05');
        } else {
            let session_token = Security.user2token(user, doc.identifyCode, doc.magicNo)
            res.append('authorization', session_token);
            let loginData = await loginInit(user, session_token, 'WEB');
            if (loginData) {
                return common.sendData(res, loginData);
            } else {
                return common.sendError(res, 'auth_05');
            }
        }
    } catch (error) {
        logger.error(error);
        common.sendFault(res, error);
        return
    }
}

exports.SMSResource = async(req, res) => {
    let doc = req.body;
    if (!('phone' in doc)) {
        common.sendError(res, 'auth_06');
        return
    }
    if (!('type' in doc)) {
        common.sendError(res, 'auth_07');
        return
    }

    try {
        let result = await sms.sedMsg(doc.phone, doc.type)
        if (result) {
            common.sendData(res);
            return
        } else {
            common.sendError(res, 'auth_08');
            return
        }
    } catch (error) {
        logger.error(error);
        common.sendFault(res, error);
        return
    }
}

async function loginInit(user, session_token, type) {
    try {
        let returnData = {};
        if (user.avatar) {
            returnData.avatar = user.avatar
        } else {
            returnData.avatar = '/static/images/base/head.gif'
        }
        returnData.user_id = user.user_id
        returnData.name = user.name
        returnData.created_at = user.created_at.Format("MM, yyyy")

        let usergroup = await tb_usergroup.findOne({
            'where': {
                'usergroup_id': user.usergroup_id,
                'state': GLBConfig.ENABLE
            }
        });

        if (usergroup) {
            returnData.description = usergroup.name
            returnData.menulist = await iterationMenu(usergroup.usergroup_id, '0')

            if (config.redisCache) {
                // prepare redis Cache
                let groupmenus = await tb_usergroupmenu.findAll({
                    where: {
                        usergroup_id: user.usergroup_id
                    },
                    order: [
                        ['menu_index']
                    ]
                });

                let authMenus = []
                for (let item of groupmenus) {
                    authMenus.push({
                        menu_type: item.menu_type,
                        auth_flag: item.auth_flag,
                        menu_name: item.menu_name,
                        menu_path: item.menu_path,
                        show_flag: item.show_flag,
                        menu_icon: item.menu_icon
                    })
                }
                let expired = null
                if (type == 'WEB') {
                    expired = RedisClient.tokenExpired
                } else {
                    expired = RedisClient.mobileTokenExpired
                }

                let error = await RedisClient.setItem(GLBConfig.REDISKEY.AUTH + session_token, {
                    user: user,
                    authmenus: authMenus
                }, expired)
                if (error) {
                    return null
                }
            }

            return returnData
        } else {
            return null
        }

    } catch (error) {
        logger.error(error);
        return null
    }
}

async function iterationMenu(GroupID, fMenuID) {
    let return_list = []
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
        if (m.menu_type === GLBConfig.MTYPE_ROOT) {
            sub_menu = await iterationMenu(GroupID, m.menu_id);
        }
        if (m.menu_type != GLBConfig.MTYPE_ROOT || (m.menu_type === GLBConfig.MTYPE_ROOT && sub_menu.length > 0)) {
            return_list.push({
                menu_type: m.menu_type,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                show_flag: m.show_flag,
                sub_menu: sub_menu
            })
        }
    }
    return return_list
}
