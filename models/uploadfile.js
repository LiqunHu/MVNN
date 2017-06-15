/**
 * Created by Szane on 17/5/25.
 */
/** 设计文档 **/
const db = require('../util/db');
const GLBConfig = require('../util/GLBConfig');

module.exports = db.defineModel('tbl_upload_file', {
    file_id: {
        type: db.IDNO,
        autoIncrement: true,
        primaryKey: true
    },
    api_name: {
        type: db.STRING(100),//接口名称
        allowNull: false
    },
    order_id: {
        type: db.ID,//相关用户主键
        allowNull: true
    },
    user_id: {
        type: db.ID,//相关用户主键
        allowNull: true
    },
    srv_id: {
        type: db.IDNO,//相关业务主键
        allowNull: true
    },
    file_name: {//文档名称
        type: db.STRING(200),
        defaultValue: '',
        allowNull: true
    },
    file_content: {//文档内容描述
        type: db.STRING(1000),
        defaultValue: '',
        allowNull: true
    },
    file_url: {//文档地址
        type: db.STRING(500),
        allowNull: false
    },
    file_type: {//文件格式
        type: db.STRING(10),
        defaultValue: '',
        allowNull: true
    },
    file_visible: {//客户可见 0:不可见 1：可见
        type: db.STRING(2),
        defaultValue: '',
        allowNull: true
    },
    file_creator: {
        type: db.STRING(20),
        allowNull: true
    }
});
