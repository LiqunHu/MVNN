<template>
<div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">机构维护</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-body">
              <div id="toolbar">
                  <div class="form-inline">
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
                    <button type="button" class="close"  data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">增加机构</h4>
                </div>
                <form @submit.prevent="addDm" id="formA">
                    <div class="modal-body">
                        <div class="form-group">
                            <label>机构编号</label>
                            <input class="form-control" v-model="workRow.domain" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>机构名称</label>
                            <input class="form-control" v-model="workRow.name" data-parsley-required="true" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>地址</label>
                            <input class="form-control" v-model="workRow.address" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>联系人</label>
                            <input class="form-control" v-model="workRow.contact" maxlength="50" data-parsley-maxlength="50">
                        </div>
                        <div class="form-group">
                            <label>手机</label>
                            <input class="form-control" v-model="workRow.phone" data-parsley-phone="true">
                        </div>
                        <div class="form-group">
                            <label>描述</label>
                            <input class="form-control" v-model="workRow.description" maxlength="100" data-parsley-maxlength="100">
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
const common = require('commonFunc')
const apiUrl = '/api/system/domainControl?method='

export default {
    data: function() {
        return {
            pagePara: '',
            workRow: {},
            oldRow: ''
        }
    },
    name: 'domainControl',
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
                common.dealErrorCommon(_self, response)
            })
        }

        function initTable() {
            $table.bootstrapTable({
                height: common.getTableHeight(),
                columns: [
                    common.BTRowFormat('domain', '机构编号'),
                    common.BTRowFormatEditable('name', '机构名称'),
                    common.BTRowFormatEditable('address', '地址'),
                    common.BTRowFormatEditable('contact', '联系人'),
                    common.BTRowFormatEditable('phone', '联系方式'),
                    common.BTRowFormatEditable('description', '描述')
                ],
                idField: 'domain_id',
                uniqueId: 'domain_id',
                toolbar: '#toolbar',
                clickToSelect: true,
                showRefresh: true,
                locale: 'zh-CN',
                onEditableShown: function(field, row, $el, editable) {
                    _self.oldRow = $.extend(true, {}, row)
                },
                onEditableSave: function(field, row, oldValue, $el) {
                    common.rowModifyWithT(_self, apiUrl + 'modify', row, 'domain_id', $table)
                },
                onRefresh: function() {
                    getData()
                }
            })
            common.changeTableClass($table)
        }

        function initPage() {
            initTable()
            getData()
            $('#formA').parsley()
            common.reSizeCall()
            console.log('init success')
        }

        initPage()
    },
    methods: {
        addM: function(event) {
            let _self = this
            _self.workRow = {}
            $('#formA').parsley().reset()
            $('#AddModal').modal('show')
        },
        addDm: function(event) {
            let _self = this
            if ($('#formA').parsley().isValid()) {
                _self.$http.post(apiUrl + 'add', _self.workRow).then((response) => {
                    let retData = response.data.info
                    $('#table').bootstrapTable('insertRow', {
                        index: 0,
                        row: retData
                    })
                    $('#table').bootstrapTable('resetView')
                    _self.workRow = {}
                    common.dealSuccessCommon('增加成功')
                    $('#AddModal').modal('hide')
                    console.log('add success')
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }
        }
    }
}
</script>
<style scoped>
</style>
