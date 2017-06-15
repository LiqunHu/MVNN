const CryptoJS = require('crypto-js');
const db = require('../util/db');
const GLBConfig = require('../util/GLBConfig');

module.exports = db.defineModel('tbl_user', {
    user_id: {
        type: db.ID,
        primaryKey: true
    },
    domain_id: {
        type: db.IDNO,
        allowNull: true
    },
    usergroup_id: {
        type: db.IDNO,
        allowNull: false
    },
    username: {
        type: db.STRING(100),
        allowNull: false,
        unique : true
    },
    email: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    phone: {
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    password: {
        type: db.STRING(100),
        allowNull: false,
        set: function(val) {
            this.setDataValue('password', CryptoJS.MD5(val).toString());
        }
    },
    name: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    gender: {
        type: db.STRING(1),
        defaultValue: '',
        allowNull: true
    },
    avatar: {
        type: db.STRING(200),
        defaultValue: '',
        allowNull: true
    },
    address: {
        type: db.STRING(100),
        defaultValue: '',
        allowNull: true
    },
    country: {
        type: db.STRING(20),
        defaultValue: '',
        allowNull: true
    },
    city: {
        type: db.STRING(40),
        defaultValue: '',
        allowNull: true
    },
    zipcode: {
        type: db.STRING(32),
        defaultValue: '',
        allowNull: true
    },
    type: {
        type: db.STRING(3),
        defaultValue: '',
        allowNull: true
    }
}, {
    indexes: [{
        unique: true,
        fields: ['username', 'type']
    }]
});
