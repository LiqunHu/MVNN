const db = require('../db');

module.exports = db.defineModel('tbl_usergroup', {
    domain_id: {
        type: db.ID,
        allowNull: false
    },
    type: {
        type: db.STRING(30),
        allowNull: true
    },
    description: db.STRING(200)
}, {
    timestamps: true,
});
