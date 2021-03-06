const db = require('../util/db');
const GLBConfig = require('../util/GLBConfig');

module.exports = db.defineModel('tbl_usergroupmenu', {
    usergroup_id: {
        type: db.IDNO,
        allowNull: false
    },
    menu_id: {
        type: db.IDNO,
        allowNull: false
    },
    menu_type: {
        type: db.STRING(3),
        allowNull: false
    },
    f_menu_id: {
        type: db.ID,
        allowNull: false
    },
    menu_name: db.STRING(100),
    menu_path: {
        type: db.STRING(100),
        allowNull: true
    },
    menu_icon: {
        type: db.STRING(100),
        allowNull: true
    },
    show_flag: {
        type: db.STRING(2),
        defaultValue: GLBConfig.TRUE // 1 need auth, 0 not
    },
    menu_index: {
        type: db.INTEGER,
        allowNull: false
    }
});
