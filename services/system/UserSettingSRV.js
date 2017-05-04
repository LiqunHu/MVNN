const fs = require('fs');
const common = require('../../util/CommonUtil');
const GLBConfig = require('../../util/GLBConfig');
const logger = common.createLogger('UserSettingSRV');
const model = require('../../model');

const tb_user = model.user

exports.UserSettingResource = (req, res) => {
    let method = req.query.method
    if (method === 'setpwd') {
        setpwdAct(req, res);
    } else if (method === 'modify') {
        modifyAct(req, res)
    } else if (method === 'upload') {
        uploadAct(req, res)
    } else {
        common.sendError(res, 'common_01')
    }
}

async function setpwdAct(req, res) {
    let returnData = {}
    let doc = req.body
    let user = req.user;

    if(user.password != doc.oldPwd){
        common.sendError(res, 'usersetting_01');
        return
    }

    let modiuser = await tb_user.findOne({
        where: {
            id: user.id,
            state: GLBConfig.ENABLE
        }
    });

    if(modiuser){
        modiuser.password = doc.pwd
        await modiuser.save()
        common.sendData(res);
    }else{
        common.sendError(res, 'usersetting_02');
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
            modiuser.avatar = doc.new.avatar
            modiuser.phone = doc.new.phone
            await modiuser.save()
            delete modiuser.password
            common.sendData(res, modiuser)
            return
        } else {
            common.sendError(res, 'usersetting_02')
            return
        }
    } catch (error) {
        common.sendFault(res, error)
        return null
    }
}

async function uploadAct(req, res) {
    try {
        let uploadurl = await common.fileSave(req)
        common.sendData(res)
    } catch (error) {
        common.sendFault(res, error)
        return
    }
}
