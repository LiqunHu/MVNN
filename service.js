const fs = require('fs');
const path = require('path');

const common = require('./util/CommonUtil.js');
const logger = common.createLogger('db');

let files = []

function readDirSync(path) {
    var pa = fs.readdirSync(__dirname + path);
    pa.forEach(function(ele, index) {
        var info = fs.statSync(__dirname + path + "/" + ele)
        if (info.isDirectory()) {
            readDirSync(path + "/" + ele);
        } else {
            files.push(path + "/" + ele)
        }
    })
}

readDirSync('/services');

let js_files = files.filter((f) => {
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    logger.debug(`import service from file ${f}...`);
    let name = path.basename(f, path.extname(f));
    module.exports[name] = require(__dirname + f);
}
