const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = require('../../util/Logger').createLogger('DomainMenuControlSRV');
const model = require('../../model');

const tb_domain = model.domain;
const tb_domainmenu = model.domainmenu
const tb_menu = model.menu;

exports.DomainMenuControlResource = (req, res) => {
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

    let domains = await tb_domain.findAll({
        where: {
            domain: {
                $ne: 'admin'
            }
        }
    });

    returnData.domainInfo = []
    for (let d of domains) {
        returnData.domainInfo.push({
            id: d.domain_id,
            text: d.domain
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
            if (m.domain_flag === GLBConfig.TRUE) {
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
        returnData.domainMenu = []

        let domainmenus = await tb_domainmenu.findAll({
            where: {
                domain_id: doc.domain_id
            }
        });
        for (let item of domainmenus) {
            returnData.domainMenu.push(item.menu_id)
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

        await tb_domainmenu.destroy({
            where: {
                domain_id: doc.domain_id
            }
        })

        for (let i = 0; i < doc.domainMenu.length; i++) {
            await tb_domainmenu.create({
                domain_id: doc.domain_id,
                menu_id: doc.domainMenu[i].menu_id
            })
        }
        common.sendData(res)
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}
