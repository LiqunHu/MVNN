const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = common.createLogger('GroupControlSRV');
const model = require('../../model');

// tables
const tb_usergroup = model.usergroup;
const tb_user = model.user

exports.GroupControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if(method === 'search') {
        searchAct(req, res)
    } else if(method === 'add') {
        addAct(req, res)
    } else if(method === 'modify') {
        modifyAct(req, res)
    } else if(method === 'delete') {
        deleteAct(req, res)
    } else {
        common.sendError(res, 'common_01');
    }
}

function initAct(req, res) {
    let returnData = {}
    returnData.statusInfo = GLBConfig.STSTUSINFO
    common.sendData(res, returnData)
}

async function searchAct(req, res) {
    try {
        let user = req.user;
        let groups = await tb_usergroup.findAll({
            where: {
                domain_id: user.domain_id,
                type: {
                    $ne: GLBConfig.TYPE_ADMINISTRATOR
                },
                name: {
                    $ne: 'administrator'
                }
            }
        });
        common.sendData(res, groups);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function addAct(req, res) {
    try {
        let doc = req.body;
        let user = req.user;

        let usergroup = await tb_usergroup.findOne({
            where: {
                domain_id: user.domain_id,
                name: doc.name
            }
        });
        if (usergroup) {
            common.sendError(res, 'group_01');
            return
        } else {
            usergroup = await tb_usergroup.create({
                domain_id: user.domain_id,
                name: doc.name,
                type: GLBConfig.TYPE_OPERATORGROUP
            })
        }
        common.sendData(res, usergroup);
    } catch (error) {
        common.sendFault(res, error);
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body
        let user = req.user
        let usergroup = await tb_usergroup.findOne({
            where: {
                domain_id: user.domain_id,
                name: doc.old.name
            }
        })
        if (usergroup) {
            usergroup.name = doc.new.name
            usergroup.state = doc.new.state
            await usergroup.save()
            common.sendData(res, usergroup)
        } else {
            common.sendError(res, 'group_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}

async function deleteAct(req, res) {
    try {
        let doc = req.body
        let user = req.user
        let usergroup = await tb_usergroup.findOne({
            where: {
                domain_id: user.domain_id,
                name: doc.name
            }
        })

        let usersCount = await tb_user.count({
            where: {
                usergroup_id: usergroup.id
            }
        })

        if (usersCount > 0) {
            common.sendError(res, 'group_03')
            return
        }

        if (usergroup) {
            await usergroup.destroy();
            common.sendData(res)
            return
        } else {
            common.sendError(res, 'group_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
    }
}
