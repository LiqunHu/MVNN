const db = require('../db');

module.exports = db.defineModel('tbl_menu', {
    type: {
        type: db.STRING(3),
        allowNull: false
    },
    f_menu_id: {
        type: db.ID,
        allowNull: false
    },
    auth_flag: {
        type: db.STRING(2),
        defaultValue: '1' // 1 need auth, 0 not
    },
    menu_name: db.STRING(100),
    menu_path: db.STRING(100),
    menu_icon: db.STRING(100),
    menu_index: {
        type: db.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
});
