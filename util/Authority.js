const common = require('../util/CommonUtil.js');
const logger = common.createLogger('Authority.js');

const model = require('../model');
const Security = require('./Security');
const GLBConfig = require('../util/GLBConfig');

// table
const tb_menu = model.menu;

exports.AuthMiddleware = async(req, res, next) => {
    try {
        let menuList = await tb_menu.findAll({
            where: {
                auth_flag: GLBConfig.AUTH,
                state: GLBConfig.ENABLE
            }
        });

        let menus = {};
        for (let m of menuList) {
            if (m.menu_path) {
                let ma = m.menu_path.split('/');
                menus[ma[ma.length - 1].toUpperCase()] = m.auth_flag
            }
        }

        let patha = req.path.split('/')
        let func = patha[patha.length - 1].toUpperCase()
        if (func in menus) {
            let user = await Security.token2user(req)

            if (user == null) {
                logger.info('UNAUTHORIZED')
                res.status(401).send({
                    errno: -1,
                    msg: 'Auth Failed or session expired',
                });
                return
            }

            req.user = user
        }
    } catch (error) {
        logger.error(error);
        common.sendFault(res, error);
    }
    next();
}
