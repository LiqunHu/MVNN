const common = require('./util/CommonUtil');
const GLBConfig = require('./util/GLBConfig');
const logger = common.createLogger('init-data');
const model = require('./model.js');

(async() => {
    try {
        let db_domain = model.domain;
        var domain = await db_domain.create({
            domain: 'adminCo',
            description: 'adminCo'
        });

        let db_usergroup = model.usergroup;
        var usergroup = await db_usergroup.create({
            domain_id: domain.id,
            name: 'administrator',
            type: GLBConfig.GTYPE_ADMINISTRATOR,
            description: 'adminGroup'
        });

        let db_user = model.user;
        var user = await db_user.create({
            domain_id: domain.id,
            usergroup_id: usergroup.id,
            username: 'admin',
            password: 'admin'
        });

        let db_menu = model.menu;
        let db_groupmenu = model.usergroupmenu;
        var menu = await db_menu.create({
            type: '01',
            f_menu_id: '0',
            auth_flag: '0',
            menu_name: '授权',
            menu_path: '/api/auth',
            menu_icon: '',
            menu_index: 99
        });
        let groupmenu = null
        let fmenuID = null

        menu = await db_menu.create({
            type: '00',
            f_menu_id: '0',
            auth_flag: '1',
            menu_name: '系统管理',
            menu_path: '',
            menu_icon: 'fa-cogs',
            menu_index: 99
        });
        fmenuID = menu.id
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.id,
            menu_id: menu.id,
            type: menu.type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '用户组维护',
            menu_path: '/system/groupcontrol',
            menu_icon: '',
            menu_index: 1
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.id,
            menu_id: menu.id,
            type: menu.type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            menu_index: menu.menu_index
        });


    } catch (error) {
        logger.error(error);
    }
})();
