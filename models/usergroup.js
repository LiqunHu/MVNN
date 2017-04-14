const db = require('../db');

module.exports = db.defineModel('tbl_usergroup', {
    domain_id: {
        type: db.ID,
        allowNull: false
    },
    name: {
        type: db.STRING(50),
        allowNull: false
    },
    type: {
        type: db.STRING(3),
        allowNull: true
    }
}, {
    timestamps: true,
});
