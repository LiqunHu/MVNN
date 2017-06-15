const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const Sequence = require('../../util/Sequence');
const logger = require('../../util/Logger').createLogger('GroupControlSRV');
const model = require('../../model');

// tables
const sequelize = model.sequelize
const tb_domain = model.domain
const tb_usergroup = model.usergroup
const tb_user = model.user
const tb_usergroupmenu = model.usergroupmenu

exports.DomainControlResource = (req, res) => {
    let method = req.query.method
    if(method === 'search') {
        searchAct(req, res)
    } else if(method === 'add') {
        addAct(req, res)
    } else if(method === 'modify') {
        modifyAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
}

async function searchAct(req, res) {
    try {
        let domains = await tb_domain.findAll({
            where: {
                domain: {
                    $ne: 'admin'
                }
            }
        });
        common.sendData(res, domains);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function addAct(req, res) {
    try {
        let doc = req.body;
        let user = req.user

        let domain = await tb_domain.findOne({
            where: {
                domain: doc.domain
            }
        });
        if (domain) {
            common.sendError(res, 'domain_01');
            return
        } else {
            domain = await tb_domain.create({
                domain: doc.domain,
                name: doc.name,
                address: doc.address,
                contact: doc.contact,
                phone: doc.phone,
                description: doc.description
            })

            let usergroup = await tb_usergroup.create({
                domain_id: domain.domain_id,
                usergroup_name: 'administrator',
                usergroup_type: GLBConfig.TYPE_ADMINISTRATOR,
                node_type: GLBConfig.MTYPE_ROOT,
                parent_id: 0
            });

            let adduser = await tb_user.create({
                user_id: await Sequence.genUserID(),
                domain_id: domain.domain_id,
                usergroup_id: usergroup.usergroup_id,
                username: doc.domain+'admin',
                name: 'admin',
                password: 'admin',
                type: GLBConfig.TYPE_ADMINISTRATOR
            });

            let queryRst = await sequelize.query('\
            select * from tbl_usergroupmenu a, tbl_usergroup b, tbl_menu c \
            where a.usergroup_id = b.usergroup_id and a.menu_id = c.menu_id and c.domain_flag = ? and b.usergroup_name = ? \
            and b.domain_id = ?', {
                replacements: [GLBConfig.FALSE, 'administrator', user.domain_id],
                type: sequelize.QueryTypes.SELECT
            })

            for(let menu of queryRst){
                await tb_usergroupmenu.create({
                    usergroup_id: usergroup.usergroup_id,
                    menu_id: menu.menu_id,
                    menu_type: menu.menu_type,
                    f_menu_id: menu.f_menu_id,
                    auth_flag: menu.auth_flag,
                    menu_name: menu.menu_name,
                    menu_path: menu.menu_path,
                    menu_icon: menu.menu_icon,
                    show_flag: menu.show_flag,
                    domain_flag: menu.domain_flag,
                    menu_index: menu.menu_index
                });
            }
            common.sendData(res, domain);
        }
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body
        let user = req.user
        let domain = await tb_domain.findOne({
            where: {
                domain_id: doc.old.domain_id
            }
        })
        if (domain) {
            domain.name = doc.new.name
            domain.address = doc.new.address
            domain.contact = doc.new.contact
            domain.phone = doc.new.phone
            domain.description = doc.new.description
            await domain.save()
            common.sendData(res, domain)
        } else {
            common.sendError(res, 'group_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}
