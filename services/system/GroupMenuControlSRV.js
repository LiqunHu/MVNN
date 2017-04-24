const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = common.createLogger('GroupControlSRV');
const model = require('../../model');

const tb_usergroup = model.usergroup;
const tb_usergroupmenu = model.usergroupmenu
const tb_menu = model.menu;

exports.GroupMenuControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
}

async function initAct(req, res) {
    let returnData = {}
    let user = req.user;

    let whereCase;
    if (user.username === 'admin') {
        whereCase = {
            domain_id: user.domain_id
        }
    } else {
        whereCase = {
            domain_id: user.domain_id,
            name: {
                $ne: 'administrator'
            }
        }
    }

    let groups = await tb_usergroup.findAll({
        where: whereCase
    });

    returnData.groupInfo = []
    for (let g of groups) {
        returnData.groupInfo.push({
            id: g.id,
            text: g.name
        })
    }

    returnData.menuInfo = await iterationMenu('0')
    common.sendData(res, returnData)
}

async function iterationMenu(fMenuID) {
    let return_list = []

    let menus = await tb_menu.findAll({
        where: {
            f_menu_id: fMenuID,
            auth_flag: GLBConfig.AUTH
        },
        order: [
            ['menu_index']
        ]
    });

    for (let m of menus) {
        let sub_menu = [];
        if (m.type === GLBConfig.MTYPE_ROOT) {
            return_list.push({
                id: m.id,
                type: m.type,
                f_menu_id: m.f_menu_id,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                menu_index: m.menu_index
            })
            sub_menu = await iterationMenu(m.id);
            return_list = return_list.concat(sub_menu)
        } else {
            return_list.push({
                id: m.id,
                type: m.type,
                f_menu_id: m.f_menu_id,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                menu_index: m.menu_index
            })
        }
    }
    return return_list
}

async function searchAct(req, res) {
    try {
        let doc = req.body
        let returnData = {}
        returnData.groupMenu = []

        let groupmenus = await tb_usergroupmenu.findAll({
            where: {
                usergroup_id: doc.usergroup_id
            }
        });
        for (let item of groupmenus) {
            returnData.groupMenu.push(item.menu_id)
        }
        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
        return null;
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body

        await tb_usergroupmenu.destroy({
            where: {
                usergroup_id: doc.usergroup_id
            }
        })

        for (let i = 0; i < doc.userGroupMenu.length; i++) {
            await tb_usergroupmenu.create({
                usergroup_id: doc.usergroup_id,
                menu_id: doc.userGroupMenu[i].id,
                type: doc.userGroupMenu[i].type,
                f_menu_id: doc.userGroupMenu[i].f_menu_id,
                menu_name: doc.userGroupMenu[i].menu_name,
                menu_path: doc.userGroupMenu[i].menu_path,
                menu_icon: doc.userGroupMenu[i].menu_icon,
                menu_index: doc.userGroupMenu[i].menu_index
            })
        }
        common.sendData(res)
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}
