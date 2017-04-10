const fs = require('fs');
const common = require('../util/CommonUtil.js');

exports.AuthResource = (req, res) => {
  common.sendData(req, res);
}
