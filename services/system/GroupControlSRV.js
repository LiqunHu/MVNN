const fs = require('fs');
const common = require('../../util/CommonUtil.js');
const logger = common.createLogger('GroupControlSRV.js');
const model = require('../../model');

exports.GroupControlResource = async(req, res) => {
    logger.info(model)
    let Domain = model.domain;

    try {
        var domain = await Domain.create({
            domain: 'John',
            description: 'AAAAA'
        });
        logger.info('created: ' + JSON.stringify(domain));
        common.sendData(req, res, domain);
    } catch (error) {
        logger.error(error);
        common.sendFault(req, res, error);
    }
}
