const fs = require('fs');
const db = require('./util/db');

const common = require('./util/CommonUtil.js');
const logger = require('./util/Logger').createLogger('db');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f) => {
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    // logger.debug(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/models/' + f);
}

module.exports.sequelize = db.sequelize;

module.exports.sync = () => {
    return db.sync();
};
