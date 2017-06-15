const db = require('../util/db');

module.exports = db.defineModel('tbl_domain', {
    domain_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    domain: {
        type: db.STRING(100),
        unique: true
    },
    name: {
        type: db.STRING(50),
        defaultValue: '',
        allowNull: false
    },
    address: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    contact: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    phone: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    description: {
        type: db.STRING(200),
        defaultValue: '',
        allowNull: false
    }
});
