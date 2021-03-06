const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = require('../../util/Logger').createLogger('GroupMenuControlSRV');
const model = require('../../model');

const tb_usergroup = model.usergroup;
const tb_usergroupmenu = model.usergroupmenu
const tb_menu = model.menu;
const tb_domain = model.domain
const tb_domainmenu = model.domainmenu

let domain
let dmenus = []
let groups = []

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

    groups = []
    await genUserGroup(user.domain_id, '0', 0)

    returnData.groupInfo = groups

    domain = await tb_domain.findOne({
        where: {
            domain_id: user.domain_id
        }
    });

    let menus = await tb_domainmenu.findAll({
        where: {
            domain_id: user.domain_id,
        }
    });
    dmenus = []
    for (let dm of menus) {
        dmenus.push(dm.menu_id)
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
        if (m.menu_type === GLBConfig.MTYPE_ROOT) {
            return_list.push({
                menu_id: m.menu_id,
                menu_type: m.menu_type,
                f_menu_id: m.f_menu_id,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                show_flag: m.show_flag,
                menu_index: m.menu_index
            })
            sub_menu = await iterationMenu(m.menu_id);
            return_list = return_list.concat(sub_menu)
        } else {
            if (domain.domain === 'admin' || m.domain_flag == GLBConfig.FALSE || dmenus.indexOf(m.menu_id) > 0){
                return_list.push({
                    menu_id: m.menu_id,
                    menu_type: m.menu_type,
                    f_menu_id: m.f_menu_id,
                    menu_name: m.menu_name,
                    menu_path: m.menu_path,
                    menu_icon: m.menu_icon,
                    show_flag: m.show_flag,
                    menu_index: m.menu_index
                })
            }
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
                menu_id: doc.userGroupMenu[i].menu_id,
                menu_type: doc.userGroupMenu[i].menu_type,
                f_menu_id: doc.userGroupMenu[i].f_menu_id,
                menu_name: doc.userGroupMenu[i].menu_name,
                menu_path: doc.userGroupMenu[i].menu_path,
                menu_icon: doc.userGroupMenu[i].menu_icon,
                show_flag: doc.userGroupMenu[i].show_flag,
                menu_index: doc.userGroupMenu[i].menu_index
            })
        }
        common.sendData(res)
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}

async function genUserGroup(domain_id, parentId, lev) {
    let actgroups = await tb_usergroup.findAll({
        where: {
            domain_id: domain_id,
            parent_id: parentId,
            usergroup_type: GLBConfig.TYPE_OPERATOR
        }
    });
    for (let g of actgroups) {
        if (g.node_type === GLBConfig.MTYPE_ROOT) {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name,
                disabled: true
            });
            groups.concat(await genUserGroup(domain_id, g.usergroup_id, lev + 1));
        } else {
            groups.push({
                id: g.usergroup_id,
                text: '--'.repeat(lev) + g.usergroup_name,
            });
        }
    }
}
