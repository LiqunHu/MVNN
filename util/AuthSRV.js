const fs = require('fs');
const common = require('../util/CommonUtil.js');
const logger = common.createLogger('AuthSRV.js');
const model = require('../model');
const Security = require('../util/Security');
const config = require('../config');
const GLBConfig = require('../util/GLBConfig');
const RedisClient = require('../util/RedisClient');


// table
const tb_domain = model.domain;
const tb_user = model.user;
const tb_usergroup = model.usergroup;
const tb_usergroupmenu = model.usergroupmenu;

exports.AuthResource = async(req, res) => {
    let doc = req.body;
    if (!('domain' in doc)) {
        common.sendError(res, 'auth_01');
        return
    }
    if (!('username' in doc)) {
        common.sendError(res, 'auth_02');
        return
    }
    if (!('identifyCode' in doc)) {
        common.sendError(res, 'auth_03');
        return
    }
    if (!('magicNo' in doc)) {
        common.sendError(res, 'auth_04');
        return
    }

    try {
        let domain = await tb_domain.findOne({
            'where': {
                domain: doc.domain
            }
        });
        if (domain == null) {
            common.sendError(res, 'auth_05');
            return
        }

        let user = await tb_user.findOne({
            'where': {
                domain_id: domain.id,
                username: doc.username,
                state: GLBConfig.ENABLE
            }
        });
        if (user == null) {
            common.sendError(res, 'auth_05');
            return
        }
        let decrypted = Security.aesDecryptModeCFB(doc.identifyCode, user.password, doc.magicNo)
        if (decrypted != doc.username) {
            common.sendError(res, 'auth_05');
            return
        } else {
            let session_token = Security.user2token(user, doc.identifyCode, doc.magicNo)
            res.append('authorization', session_token);
            let loginData = await loginInit(user, session_token);
            if (loginData) {
                common.sendData(res, loginData);
                return
            } else {
                common.sendError(res, 'auth_05');
                return
            }
        }
    } catch (error) {
        logger.error(error);
        common.sendFault(res, error);
        return
    }
}

async function loginInit(user, session_token) {
    try {
        let returnData = {};
        if (user.avatar) {
            returnData.avatar = user.avatar
        } else {
            returnData.avatar = '/static/images/base/head.gif'
        }
        returnData.id = user.id
        returnData.name = user.name
        returnData.created_at = user.created_at.Format("MM, yyyy")

        let usergroup = await tb_usergroup.findOne({
            'where': {
                'domain_id': user.domain_id,
                'id': user.usergroup_id,
                'state': GLBConfig.ENABLE
            }
        });

        if (usergroup) {
            returnData.description = usergroup.name
            returnData.menulist = await iterationMenu(usergroup.id, '0')

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
                        type: item.type,
                        auth_flag: item.auth_flag,
                        menu_name: item.menu_name,
                        menu_path: item.menu_path,
                        menu_icon: item.menu_icon
                    })
                }

                let error = await RedisClient.setItem(GLBConfig.REDISKEY.AUTH + session_token, {
                    user: user,
                    authmenus: authMenus
                }, RedisClient.tokenExpired)
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
        if (m.type === GLBConfig.MTYPE_ROOT) {
            sub_menu = await iterationMenu(GroupID, m.menu_id);
        }
        return_list.push({
            type: m.type,
            menu_name: m.menu_name,
            menu_path: m.menu_path,
            menu_icon: m.menu_icon,
            sub_menu: sub_menu
        })
    }
    return return_list
}
