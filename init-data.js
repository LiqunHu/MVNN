const common = require('./util/CommonUtil.js');
const logger = common.createLogger('init-data.js');
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
        var menu = await db_menu.create({
            type: '01',
            f_menu_id: '0',
            auth_flag: '0',
            menu_name: '授权',
            menu_path: '/api/auth',
            menu_icon: '',
            menu_index: 99
        });
    } catch (error) {
        logger.error(error);
    }
})();
