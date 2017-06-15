<template>
<div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">用户组维护</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-body">
              <div class="form-inline">
                  <div class="form-group">
                      <div class="form-group">
                          <button id="addFolder" class="btn btn-primary" v-on:click="addNode('00', $event)">
                            <i class="glyphicon glyphicon-plus"></i> 增加机构
                          </button>
                          <button id="addGroup" class="btn btn-primary" v-on:click="addNode('01', $event)">
                            <i class="glyphicon glyphicon-plus"></i> 增加角色
                          </button>
                          <button id="editNode" class="btn btn-primary" v-on:click="editNode">
                            <i class="glyphicon glyphicon-plus"></i> 编辑
                          </button>
                      </div>
                  </div>
              </div>
              <ul id="tree" class="ztree"></ul>
          </div>
        </div>
      </div>
    </section>
    <div class="modal fade" id="AddModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="AddModalTitle"></h4>
                </div>
                <form @submit.prevent="submitNode" id="formA">
                    <div class="modal-body">
                        <div class="form-group">
                            <label id="AddModalLable">目录名称</label>
                            <input class="form-control" v-model="nameA" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">
                            <i class="fa fa-fw fa-plus"></i>增加
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade" id="editNodeModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">编辑节点</h4>
                </div>
                <form @submit.prevent="doEditNode" id="formM">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>名称</label>
                            <input class="form-control" v-model="nameA" data-parsley-required="true">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">
                            <i class="fa fa-fw fa-plus"></i>提交
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import $ from 'jquery'
const common = require('commonFunc');
const apiUrl = '/api/system/groupcontrol?method=';

function getData(_self) {
    _self.$http.post(apiUrl + 'search', {}).then((response) => {
        let zNodes = response.data.info;
        let treeObj = $.fn.zTree.init($("#tree"), {}, zNodes);
        treeObj.expandAll(true);
        $('#formA').parsley()
        $('#formM').parsley()
        common.reSizeCall()
        console.log('init success')
    }, (response) => {
        // error callback
        common.dealErrorCommon(_self, response)
    });
}

export default {
    data: function() {
        return {
            node_type: '',
            actNode: {},
            nameA: ''
        }
    },
    name: 'groupControl',
    mounted: function() {
        let _self = this;
        $(function() {
            getData(_self);
        });
    },
    methods: {
        addNode: function(node_type, event) {
            let _self = this
            let nodeObj = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if (nodeObj && nodeObj.length > 0) {
                if (nodeObj[0].node_type === '01') return alert("角色下不允许新增");
                _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]));
            } else return common.dealWarningCommon("请选择一个节点");

            this.node_type = node_type; // 目录
            this.nameA = '';
            $('#formA').parsley().reset()
            if (node_type === '00') {
                $('#AddModalTitle').text('增加机构')
                $('#AddModalLable').text('机构名称')
            } else {
                $('#AddModalTitle').text('增加角色')
                $('#AddModalLable').text('角色名称')
            }

            $('#AddModal').modal('show')
        },
        submitNode: function(event) {
            let _self = this;
            if ($('#formA').parsley().isValid()) {
                if (!_self.nameA) {
                    return common.dealWarningCommon("请输入节点名称");
                }
                let workRow = {
                    'usergroup_name': _self.nameA,
                    'parent_id': _self.actNode.usergroup_id,
                    'node_type': _self.node_type
                };
                _self.$http.post(apiUrl + 'add', workRow).then((response) => {
                    getData(_self);
                    console.log('add success')
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                });
            }
        },
        editNode: function(event) {
            let _self = this;
            let nodeObj = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if (nodeObj && nodeObj.length > 0)
                _self.actNode = JSON.parse(JSON.stringify(nodeObj[0]));
            else return common.dealWarningCommon("请选择一个节点");
            this.nameA = nodeObj[0].name;
            $('#formM').parsley().reset()
            $('#stateA').val(null).trigger('change');
            $('#editNodeModal').modal('show');
        },
        doEditNode: function(event) {
            let _self = this;
            if ($('#formM').parsley().isValid()) {
                let workRow = {
                    'usergroup_id': _self.actNode.usergroup_id,
                    'usergroup_name': _self.nameA
                };
                _self.$http.post(apiUrl + 'modify', workRow).then((response) => {
                    common.dealSuccessCommon('修改成功');
                    $('#editNodeModal').modal('hide');
                    getData(_self);
                    console.log('add success')
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                });
            }
        }
    }
}
</script>
<style scoped>
</style>
