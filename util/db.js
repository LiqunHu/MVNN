const Sequelize = require('sequelize');

const uuid = require('uuid');

const config = require('../config');

const common = require('./CommonUtil.js');
const logger = common.createLogger('db');

logger.debug('init sequelize...');

function generateId() {
    return uuid.v4().replace(/-/g, '');
}

var sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: config.mysql.dialect,
    pool: {
        max: 5, // max
        min: 0, // min
        idle: 10000 //10 seconds
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes, params) {
    let attrs = {};
    let tbpara = arguments[2] ? arguments[2] : {};

    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };

    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    attrs.state = {
        type: Sequelize.STRING(5),
        defaultValue: '1'
    };

    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function(k, v) {
    //     if (k === 'type') {
    //         for (let key in Sequelize) {
    //             if (key === 'ABSTRACT' || key === 'NUMBER') {
    //                 continue;
    //             }
    //             let dbType = Sequelize[key];
    //             if (typeof dbType === 'function') {
    //                 if (v instanceof dbType) {
    //                     if (v._length) {
    //                         return `${dbType.key}(${v._length})`;
    //                     }
    //                     return dbType.key;
    //                 }
    //                 if (v === dbType) {
    //                     return dbType.key;
    //                 }
    //             }
    //         }
    //     }
    //     return v;
    // }, '  '));
    return sequelize.define(name, attrs, Object.assign({
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function(obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    logger.debug('will create entity...' + obj);
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.version = 0;
                } else {
                    logger.debug('will update entity...');
                    obj.version++;
                }
            }
        }
    }, tbpara));
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

let exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            return sequelize.sync({
                force: true
            });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;
