const db = require('../util/db');

module.exports = db.defineModel('tbl_domainmenu', {
    domain_id: {
        type: db.IDNO,
        allowNull: false
    },
    menu_id: {
        type: db.IDNO,
        allowNull: false
    }
});
