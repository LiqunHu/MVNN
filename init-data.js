const common = require('./util/CommonUtil');
const Sequence = require('./util/Sequence');
const GLBConfig = require('./util/GLBConfig');
const logger = require('./util/Logger').createLogger('db');
const model = require('./model.js');

let db_domain = model.domain;
let db_usergroup = model.usergroup;

(async() => {
    try {

        var domain = await db_domain.create({
            domain: 'admin',
            description: 'admin'
        });


        var usergroup = await db_usergroup.create({
            domain_id: domain.domain_id,
            usergroup_name: 'customer',
            usergroup_type: GLBConfig.TYPE_CUSTOMER,
            node_type: '01',
            parent_id: 0,
            description: 'customer'
        });

        usergroup = await db_usergroup.create({
            domain_id: domain.domain_id,
            usergroup_name: 'administrator',
            usergroup_type: GLBConfig.TYPE_ADMINISTRATOR,
            node_type: '01',
            parent_id: 0,
            description: 'administrator'
        });

        let db_user = model.user;
        var user = await db_user.create({
            user_id: await Sequence.genUserID(),
            domain_id: domain.domain_id,
            usergroup_id: usergroup.usergroup_id,
            type: GLBConfig.TYPE_ADMINISTRATOR,
            username: 'admin',
            name: 'admin',
            password: 'admin'
        });

        let groupmenu = null
        let fmenuID = null

        let db_menu = model.menu;
        let db_groupmenu = model.usergroupmenu;

        var menu = await db_menu.create({
            menu_type: '00',
            f_menu_id: '0',
            auth_flag: '1',
            menu_name: '系统管理',
            menu_path: '',
            menu_icon: 'fa-cogs',
            menu_index: 99
        });
        fmenuID = menu.menu_id
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '机构维护',
            menu_path: '/system/domainControl',
            menu_icon: '',
            domain_flag: GLBConfig.TRUE,
            menu_index: 1
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '用户组维护',
            menu_path: '/system/groupControl',
            menu_icon: '',
            menu_index: 2
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '菜单维护',
            menu_path: '/system/menuControl',
            menu_icon: '',
            domain_flag: GLBConfig.TRUE,
            menu_index: 3
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '机构菜单维护',
            menu_path: '/system/domainMenuControl',
            menu_icon: '',
            domain_flag: GLBConfig.TRUE,
            menu_index: 4
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            domain_flag: GLBConfig.TRUE,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '组菜单维护',
            menu_path: '/system/groupMenuControl',
            menu_icon: '',
            menu_index: 5
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '操作员维护',
            menu_path: '/system/operatorcontrol',
            menu_icon: '',
            menu_index: 6
        });
        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });

        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '用户设置',
            menu_path: '/system/userSetting',
            menu_icon: '',
            show_flag: '0',
            menu_index: 7
        });

        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
        menu = await db_menu.create({
            menu_type: '01',
            f_menu_id: fmenuID,
            auth_flag: '1',
            menu_name: '用户密码重置',
            menu_path: '/system/resetPassword',
            menu_icon: '',
            show_flag: '1',
            menu_index: 8
        });

        groupmenu = await db_groupmenu.create({
            usergroup_id: usergroup.usergroup_id,
            menu_id: menu.menu_id,
            menu_type: menu.menu_type,
            f_menu_id: menu.f_menu_id,
            auth_flag: menu.auth_flag,
            menu_name: menu.menu_name,
            menu_path: menu.menu_path,
            menu_icon: menu.menu_icon,
            show_flag: menu.show_flag,
            menu_index: menu.menu_index
        });
    } catch (error) {
        logger.error(error);
    }
})();
