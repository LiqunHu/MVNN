const common = require('../util/CommonUtil.js');
const logger = common.createLogger('Authority.js');

const model = require('../model')
const Security = require('./Security');

exports.AuthMiddleware = async(req, res, next) => {
    let db_menu = model.menu;
    let menuList = await db_menu.findAll({
        where: {
            auth_flag: '0',
            state: '1'
        }
    });

    let menus = {};
    for (m in menuList) {
        let ma = m.menu_path.split('/');
        menus[ma[ma.length - 1].toUpperCase()] = m.auth_flag
    }

    let patha = req.baseUrl.split('/')
    let func = patha[patha.length - 1].toUpperCase()
    if (!(func in menus)) {
        let user = Security.token2user(req)

        if (user == null) {
            logger.info('UNAUTHORIZED')
            res.status(401).send({
                errno: -1,
                msg: 'Auth Failed or session expired',
            });
        }

        req.user = user
    }
    next();
}
