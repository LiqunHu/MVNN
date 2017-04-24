const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = common.createLogger('GroupControlSRV');
const model = require('../../model');

const tb_usergroup = model.usergroup
const tb_user = model.user

exports.OperatorControlResource = (req, res) => {
    let method = req.query.method
    if (method === 'init') {
        initAct(req, res);
    } else if (method === 'search') {
        searchAct(req, res)
    } else if (method === 'add') {
        addAct(req, res)
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'delete') {
        deleteAct(req, res)
    } else {
        common.sendError(res, 'common_01')
    }
}

async function initAct(req, res) {
    let returnData = {}
    let user = req.user;

    let whereCase;
    if (user.username === 'admin') {
        whereCase = {
            domain_id: user.domain_id
        }
    } else {
        whereCase = {
            domain_id: user.domain_id,
            name: {
                $ne: 'administrator'
            }
        }
    }

    let groups = await tb_usergroup.findAll({
        where: whereCase
    });

    returnData.groupInfo = []
    for (let g of groups) {
        returnData.groupInfo.push({
            id: g.id,
            value: g.id,
            text: g.name
        })
    }

    common.sendData(res, returnData)
}

async function searchAct(req, res) {
    try {
        let doc = req.body
        let user = req.user;
        let returnData = {}

        let users = await tb_user.findAll({
            attributes: ['id', 'usergroup_id', 'username', 'email', 'phone', 'name', 'gender', 'address', 'state', 'city', 'zipcode', 'type', 'created_at', 'updated_at'],
            where: {
                domain_id: user.domain_id,
                state: GLBConfig.ENABLE,
                username: {
                    $ne: 'admin'
                }
            }
        });
        common.sendData(res, users);
    } catch (error) {
        common.sendFault(res, error);
        return
    }
}

async function addAct(req, res) {
    try {
        let doc = req.body
        let user = req.user

        let usergroup = tb_usergroup.findOne({
            where: {
                id: doc.usergroup_id
            }
        });

        if (usergroup) {
            let adduser = await tb_user.findOne({
                where: {
                    domain_id: user.domain_id,
                    username: doc.username
                }
            });

            if(adduser) {
                common.sendError(res, 'operator_02');
                return
            } else {
                adduser = await tb_user.create({
                    domain_id: user.domain_id,
                    usergroup_id: doc.usergroup_id,
                    username: doc.username,
                    email: doc.email,
                    phone: doc.phone,
                    password: GLBConfig.INITPASSWORD,
                    name: doc.name,
                    gender: doc.gender,
                    avatar: doc.avatar,
                    address: doc.address,
                    state: doc.state,
                    city: doc.city,
                    zipcode: doc.zipcode,
                    type: usergroup.type
                });
                delete adduser.password
                common.sendData(res, adduser)
            }

        } else {
            common.sendError(res, 'operator_01')
            return
        }

    } catch (error) {
        common.sendFault(res, error)
        return
    }
}

async function modifyAct(req, res) {
    try {
        let doc = req.body
        let user = req.user

        let modiuser = await tb_user.findOne({
            where: {
                domain_id: user.domain_id,
                id: doc.old.id,
                state: GLBConfig.ENABLE
            }
        });

        if(modiuser) {
            modiuser.email = doc.new.email
            modiuser.phone = doc.new.phone
            modiuser.name = doc.new.name
            modiuser.gender = doc.new.gender
            modiuser.avatar = doc.new.avatar
            modiuser.address = doc.new.address
            modiuser.state = doc.new.state
            modiuser.city = doc.new.city
            modiuser.zipcode = doc.new.zipcode
            await modiuser.save()
            delete modiuser.password
            common.sendData(res, modiuser)
            return
        } else {
            common.sendError(res, 'operator_03')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}

async function deleteAct(req, res) {
    try {
        let doc = req.body
        let user = req.user

        let deluser = await tb_user.findOne({
            where: {
                domain_id: user.domain_id,
                id: doc.id,
                state: GLBConfig.ENABLE
            }
        });

        if(deluser) {
            deluser.state = GLBConfig.DISABLE
            await deluser.save()
            common.sendData(res)
            return
        } else {
            common.sendError(res, 'operator_03')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return
    }
}
