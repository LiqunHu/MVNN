const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = require('../../util/Logger').createLogger('MenuControlSRV');
const model = require('../../model');

// tables
const tb_menu = model.menu;

exports.MenuControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'add') {
        addAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'delete') {
        deleteAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
}

async function initAct(req, res) {
    let returnData = {}
    let menuData = [{
        'id': 0,
        'text': '根菜单'
    }]

    let menus = await tb_menu.findAll({
        where: {
            menu_type: GLBConfig.MTYPE_ROOT
        }
    })

    for (let m of menus) {
        menuData.push({
            'id': m.menu_id,
            'text': m.menu_name
        })
    }
    returnData.fMenuInfo = menuData
    returnData.authInfo = GLBConfig.AUTHINFO
    returnData.tfInfo = GLBConfig.TFINFO
    returnData.MTypeInfo = GLBConfig.MTYPEINFO

    common.sendData(res, returnData)
}

async function searchAct(req, res) {
    try {
        let returnData = await iterationMenu('0');
        common.sendData(res, returnData);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function iterationMenu(fMenuID) {
    let return_list = []

    let menus = await tb_menu.findAll({
        where: {
            f_menu_id: fMenuID
        },
        order: [
            ['auth_flag', 'DESC'],
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
                auth_flag: m.auth_flag,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                show_flag: m.show_flag,
                domain_flag: m.domain_flag,
                menu_index: m.menu_index
            })
            sub_menu = await iterationMenu(m.menu_id);
            return_list = return_list.concat(sub_menu)
        } else {
            return_list.push({
                menu_id: m.menu_id,
                menu_type: m.menu_type,
                f_menu_id: m.f_menu_id,
                auth_flag: m.auth_flag,
                menu_name: m.menu_name,
                menu_path: m.menu_path,
                menu_icon: m.menu_icon,
                show_flag: m.show_flag,
                domain_flag: m.domain_flag,
                menu_index: m.menu_index
            })
        }
    }
    return return_list
}

async function addAct(req, res) {
    try {
        let doc = req.body;

        let menu = await tb_menu.findOne({
            where: {
                menu_name: doc.menu_name
            }
        });
        if (menu) {
            common.sendError(res, 'menu_01');
            return
        } else {

            if (doc.menu_type === GLBConfig.MTYPE_LEAF) {
                if (!doc.menu_path){
                    common.sendError(res, 'menu_04');
                    return
                }
            }

            menu = await tb_menu.create({
                menu_type: doc.menu_type,
                f_menu_id: doc.f_menu_id,
                auth_flag: doc.auth_flag,
                menu_name: doc.menu_name,
                menu_path: doc.menu_path,
                menu_icon: doc.menu_icon,
                show_flag: doc.show_flag,
                domain_flag: doc.domain_flag,
                menu_index: doc.menu_index
            })
            common.sendData(res, menu);
        }
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body;
        let menu = await tb_menu.findOne({
            where: {
                menu_id: doc.old.menu_id
            }
        });
        if (menu) {
            menu.menu_name = doc.new.menu_name
            menu.menu_path = doc.new.menu_path
            menu.menu_icon = doc.new.menu_icon
            menu.domain_flag = doc.new.domain_flag
            menu.menu_index = doc.new.menu_index
            await menu.save()
            common.sendData(res, menu);
        } else {
            common.sendError(res, 'menu_02');
            return
        }
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function deleteAct(req, res) {
    try {
        let doc = req.body
        let menu = await tb_menu.findOne({
            where: {
                menu_id: doc.menu_id
            }
        });

        if (menu) {
            let menuCount = await tb_menu.count({
                where: {
                    f_menu_id: menu.menu_id
                }
            })
            if (menuCount > 0) {
                common.sendError(res, 'menu_03')
                return
            } else {
                await menu.destroy()
            }
            common.sendData(res, menu);
        } else {
            common.sendError(res, 'menu_02');
            return
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}
