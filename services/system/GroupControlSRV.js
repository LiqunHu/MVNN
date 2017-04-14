const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = common.createLogger('GroupControlSRV');
const model = require('../../model');

exports.GroupControlResource = (req, res) => {
    let method = req.param('method')
    if (method === 'init') {
        initAct(req, res);
    } else if(method === 'search') {
        searchAct(req, res)
    } else if(method === 'add') {
        addAct(req, res)
    } else if(method === 'modify') {
        modifyAct(req, res)
    }
}

function initAct(req, res) {
    returnData = {}
    returnData.statusInfo = GLBConfig.STSTUSINFO
    common.sendData(res, returnData)
}

async function searchAct(req, res) {
    try {
        let tb_usergroup = model.usergroup;
        let groups = tb_usergroup.findAll({
            where: {
                type: {
                    $ne: GLBConfig.GTYPE_ADMINISTRATOR
                },
                name: {
                    $ne: 'administrator'
                }
            }
        });
        common.sendData(res, resData);
    } catch (error) {
        common.sendFault(req, res, error);
        return null;
    }
}

async function addAct(req, res) {
    try {
        let doc = req.body;
        returnData = {}
        let tb_usergroup = model.usergroup;
        let usergroup = await tb_usergroup.findOne({
            where: {
                name: doc['name']
            }
        });
        if (usergroup) {
            common.sendError(res, 'group_01');
            return
        } else {
            usergroup = await tb_usergroup.create({
                domain_id: req.uer.domain_id,
                name: doc['name'],
                type: GLBConfig.GTYPE_OPERATORGROUP
            })
        }
        common.sendData(res, usergroup);
    } catch (error) {
        common.sendFault(res, error);
        return null;
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body
        returnData = {}
        let tb_usergroup = model.usergroup
        let usergroup = await tb_usergroup.findOne({
            where: {
                name: doc['name']
            }
        })
        if (usergroup) {
            usergroup.name = doc['name']
            usergroup.state = doc['state']
            usergroup.save()
            common.sendData(res, usergroup)
        } else {
            common.sendError(res, 'group_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}
