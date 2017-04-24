const db = require('../util/db');

module.exports = db.defineModel('tbl_domain', {
    domain: {
        type: db.STRING(100),
        unique: true
    },
    description: db.STRING(200)
});
