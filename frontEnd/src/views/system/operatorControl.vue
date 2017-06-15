<template>
<div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">操作员维护</li>
      </ol>
    </section>
    <section class="content hidedesk" style="display:none;">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-body">
              <div id="toolbar">
                  <div class="form-inline" role="form">
                      <div class="form-group">
                          <div class="form-group">
                              <button id="addM" class="btn btn-info" v-on:click="addM">
                          <i class="glyphicon glyphicon-plus"></i> 增加
                        </button>
                          </div>
                      </div>
                  </div>
              </div>
              <table id="table"></table>
          </div>
        </div>
      </div>
    </section>
    <div class="modal fade" id="AddModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">增加操作员</h4>
                </div>
                <form @submit.prevent="addOp" id="formA">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>用户名</label>
                            <input class="form-control" v-model="rowData.username" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>姓名</label>
                            <input class="form-control" v-model="rowData.name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input type="emain" class="form-control" v-model="rowData.email" data-parsley-type="email">
                        </div>
                        <div class="form-group">
                            <label>手机</label>
                            <input class="form-control" v-model="rowData.phone" data-parsley-phone="true">
                        </div>
                        <div class="form-group">
                            <label>用户组</label>
                            <select class="form-control select2" id="usergroup_id" data-parsley-required="true"></select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary"><i class="fa fa-fw fa-plus"></i>增加</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import $ from 'jquery'
const common = require('commonFunc')
const apiUrl = '/api/system/operatorcontrol?method='

export default {
    data: function() {
        return {
            pagePara: {},
            rowData: {},
            oldRow: ''
        }
    },
    name: 'operatorControl',
    mounted: function() {
        let _self = this
        let $table = $('#table')

        function getData() {
            _self.$http.post(apiUrl + 'search', {}).then((response) => {
                let retdata = response.data.info
                $table.bootstrapTable('load', {
                    data: retdata
                })
            }, (response) => {
                // error callback
                console.log('get data error')
                common.dealErrorCommon(_self, response)
            })
        }

        function userGroupFormatter(value, row) {
            for (let i = 0; i < _self.pagePara['groupInfo'].length; i++) {
                if (_self.pagePara.groupInfo[i].usergroup_id === parseInt(value)) {
                    return _self.pagePara.groupInfo[i].text
                }
            }
            return ''
        }

        function initTable() {
            window.tableEvents = {
                'click .tableDelete': function(e, value, row, index) {
                    common.rowDelete(_self, '用户删除', apiUrl, row, 'id')
                }
            }
            $table.bootstrapTable({
                height: common.getTableHeight(),
                columns: [
                    common.BTRowFormat('username', '用户名'),
                    common.BTRowFormatEditable('name', '姓名'),
                    common.BTRowFormatEditable('phone', '电话'),
                    common.BTRowFormatEditable('email', '邮箱'),
                    common.BTRowFormatEdSelect2(_self, 'usergroup_id', '用户组', 'groupInfo'),
                    common.actFormatter('act', common.operateFormatter, tableEvents)
                ],
                idField: 'user_id',
                uniqueId: 'user_id',
                toolbar: '#toolbar',
                striped: true,
                clickToSelect: true,
                search: true,
                showRefresh: true,
                locale: 'zh-CN',
                onEditableShown: function(field, row, $el, editable) {
                    _self.oldRow = $.extend(true, {}, row)
                },
                onEditableSave: function(field, row, oldValue, $el) {
                    common.rowModifyWithT(_self, apiUrl + 'modify', row, 'user_id', $table)
                },
                onRefresh: function() {
                    getData()
                }
            })
            common.changeTableClass($table)
        }

        function initPage() {
            _self.$http.post(apiUrl + 'init', {}).then((response) => {
                let retData = response.data.info
                _self.pagePara = $.extend(true, {}, retData)
                common.initSelect2($('#usergroup_id'), retData.groupInfo)
                initTable()
                getData()
                $('#formA').parsley()
                common.reSizeCall()
                console.log('init success')
            }, (response) => {
                console.log('init error')
                common.dealErrorCommon(_self, response)
            })
        }

        $(function() {
            initPage()
        })
    },
    methods: {
        addM: function(event) {
            let _self = this
            _self.rowData = {}
            $('#usergroup_id').val(null).trigger('change')
            $('#AddModal').modal('show')
        },
        addOp: function(event) {
            let _self = this
            if ($('#formA').parsley().isValid()) {
                _self.rowData.usergroup_id = common.getSelect2Val('usergroup_id')
                _self.$http.post(apiUrl + 'add', _self.rowData).then((response) => {
                    let retData = response.data.info
                    $('#table').bootstrapTable('insertRow', {
                        index: 0,
                        row: retData
                    })
                    $('#table').bootstrapTable('resetView')
                    _self.rowData = {}
                    $('#usergroup_id').val(null).trigger('change')
                    $('#formA').parsley().reset()
                    common.dealSuccessCommon('增加成功')
                }, (response) => {
                    console.log('add error')
                    common.dealErrorCommon(_self, response)
                })
            }
        }
    }
}
</script>
<style scoped>
</style>
