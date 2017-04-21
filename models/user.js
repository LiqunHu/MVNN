const CryptoJS = require('crypto-js');
const db = require('../db');
const GLBConfig = require('../util/GLBConfig');

module.exports = db.defineModel('tbl_user', {
    domain_id: {
        type: db.ID,
        allowNull: false
    },
    usergroup_id: {
        type: db.ID,
        allowNull: false
    },
    username: {
        type: db.STRING(100),
        allowNull: false
    },
    email: {
        type: db.STRING(100),
        allowNull: true
    },
    phone: {
        type: db.STRING(20),
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
        type: db.STRING(20),
        allowNull: true
    },
    gender: {
        type: db.STRING(1),
        allowNull: true
    },
    avatar: {
        type: db.STRING(200),
        allowNull: true
    },
    address: {
        type: db.STRING(100),
        allowNull: true
    },
    state: {
        type: db.STRING(20),
        allowNull: true
    },
    city: {
        type: db.STRING(40),
        allowNull: true
    },
    zipcode: {
        type: db.STRING(32),
        allowNull: true
    },
    type: {
        type: db.STRING(30),
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [{
        unique: true,
        fields: ['domain_id', 'username']
    }]
});
