<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">操作员维护</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-body">
            <div id="toolbar" class="pull-right">
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
    <div class="modal fade" id="AddModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document" style="width: 300px;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title"><i class="fa fa-pencil-square-o big-blue"></i>增加操作员</h4>
          </div>
          <div class="modal-body"  id="formA">
            <div class="form-group">
              <label>用户名</label>
              <input class="form-control" v-model="rowData.username">
            </div>
            <div class="form-group">
              <label>姓名</label>
              <input class="form-control" v-model="rowData.name">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="text" class="form-control" v-model="rowData.email">
            </div>
            <div class="form-group">
              <label>手机</label>
              <input type="tel" class="form-control" v-model="rowData.phone">
            </div>
            <div class="form-group">
              <label>用户组</label>
              <select class="form-contro select2" multiple style="width:100%" id="usergroup_id">
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="addOp"><i class="fa fa-fw fa-plus"></i>增加</button>
          </div>
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
  data: function () {
    return {
      pagePara: {},
      rowData: {},
      oldRow: ''
    }
  },
  name: 'operatorControl',
  mounted: function () {
    let _self = this
    let $table = $('#table')
    function getData () {
      _self.$http.post(apiUrl + 'search', {}).then((response) => {
        let retdata = response.data.data
        $table.bootstrapTable('load', {
          data: retdata
        })
      }, (response) => {
        // error callback
        console.log('get data error')
        common.dealErrorCommon(_self, response)
      })
    }
    function userGroupFormatter (value, row) {
      for (let i = 0; i < _self.pagePara['groupInfo'].length; i++) {
        if (_self.pagePara.groupInfo[i].id === parseInt(value)) {
          return _self.pagePara.groupInfo[i].text
        }
      }
      return ''
    }
    function initTable () {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
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
          common.BTRowFormatEdSelect(_self, 'usergroup_id', '用户组', 'groupInfo'),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'id',
        uniqueId: 'id',
        toolbar: '#toolbar',
        striped: true,
        clickToSelect: true,
        search: true,
        showRefresh: true,
        locale: 'zh-CN',
        onEditableShown: function (field, row, $el, editable) {
          _self.oldRow = $.extend(true, {}, row)
        },
        onEditableSave: function (field, row, oldValue, $el) {
          common.rowModify(_self, apiUrl, row, 'id')
        },
        onRefresh: function () {
          getData()
        }
      })
      common.changeTableClass($table)
    }

    function initPage () {
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        let retData = response.data.data
        _self.pagePara = $.extend(true, {}, retData)
        common.initSelect2($('#usergroup_id'), retData.groupInfo)
        initTable()
        getData()
        common.reSizeCall()
        console.log('init success')
      }, (response) => {
        console.log('init error')
        common.dealErrorCommon(_self, response)
      })
    }

    $(function () {
      initPage()
    })
  },
  methods: {
    addM: function (event) {
      let _self = this
      _self.rowData = {}
      $('#usergroup_id').val(null).trigger('change')
      $('#AddModal').modal('show')
    },
    addOp: function (event) {
      let _self = this
      _self.rowData.usergroup_id = $('#usergroup_id').val()[0]
      _self.$http.post(apiUrl + 'add', _self.rowData).then((response) => {
        let retData = response.data.data
        $('#table').bootstrapTable('insertRow', { index: 0, row: retData })
        _self.rowData = {}
        $('#usergroup_id').val(null).trigger('change')
        common.dealSuccessCommon('增加成功')
      }, (response) => {
        console.log('add error')
        common.dealErrorCommon(_self, response)
      })
    }
  }
}
</script>
<style>
</style>
