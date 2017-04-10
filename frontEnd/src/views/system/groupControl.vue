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
            <div class="form-group" id="userGroupName">
              <label>用户组名称</label>
              <input class="form-control" v-model="userGroupNameA">
            </div>
            <div class="form-group">
              <label>用户组状态</label>
              <select class="form-contro select2" multiple style="width:100%" id='userGroupStatusA'>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="addGp"><i class="fa fa-fw fa-plus"></i>增加</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
var apiUrl = '/api/system/groupcontrol?method='

export default {
  data: function () {
    return {
      pagePara: '',
      userGroupNameA: '',
      oldRow: ''
    }
  },
  name: 'groupControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    var _self = this
    var $table = $('#table')
    function formatdesk (row) {
      _self.userGroupID = row['userGroupID']
      _self.userGroupName = row['userGroupName']
      $('#userGroupStatus').val([row['userGroupStatus']]).trigger('change')
    }
    function getData () {
      _self.$http.post(apiUrl + 'search', {}).then((response) => {
        var retdata = response.data['data']
        $table.bootstrapTable('load', {
          data: retdata
        })
      }, (response) => {
        // error callback
        common.dealErrorCommon(_self, response)
      })
    }
    function initTable () {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
          common.rowDelete(_self, '用户组删除', apiUrl, row, 'userGroupID')
        }
      }
      $table.bootstrapTable({
        height: common.getTableHeight(),
        columns: [
          {
            field: 'userGroupID',
            visible: false
          },
          {
            align: 'center',
            valign: 'middle',
            field: 'state',
            radio: true
          },
          common.BTRowFormatEditable('userGroupName', '用户组名称'),
          common.BTRowFormatEdSelect(_self, 'userGroupStatus', '用户组状态', 'statusInfo'),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'userGroupID',
        uniqueId: 'userGroupID',
        toolbar: '#toolbar',
        clickToSelect: true,
        locale: 'zh-CN',
        onEditableShown: function (field, row, $el, editable) {
          _self.oldRow = $.extend(true, {}, row)
        },
        onEditableSave: function (field, row, oldValue, $el) {
          common.rowModify(_self, apiUrl, row, 'userGroupID')
        },
        onRefresh: function () {
          getData()
        }
      })
      common.changeTableClass($table)
    }

    function initPage () {
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        var retData = response.data['data']
        _self.pagePara = $.extend(true, {}, retData)
        common.initSelect2($('#userGroupStatusA'), retData['statusInfo'])
        common.initSelect2($('#userGroupStatusM'), retData['statusInfo'])
        initTable()
        getData()
        common.reSizeCall()
        console.log('init success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    }

    $(function () {
      initPage()
    })
  },
  methods: {
    addM: function (event) {
      this.userGroupNameA = ''
      $('#userGroupStatusA').val(null).trigger('change')
      $('#AddModal').modal('show')
    },
    addGp: function (event) {
      var _self = this
      var workRow = {
        'userGroupID': '',
        'userGroupName': _self.userGroupNameA,
        'userGroupStatus': $('#userGroupStatusA').val()[0]
      }
      _self.$http.post(apiUrl + 'add', workRow).then((response) => {
        var retData = response.data['data']
        $('#table').bootstrapTable('insertRow', { index: 0, row: retData })
        _self.userGroupNameA = ''
        common.dealSuccessCommon('增加成功')
        console.log('add success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    },
    deleteGp: function (event) {
      var _self = this
      common.dealConfrimCommon('用户删除', function () {
        _self.$http.post(apiUrl + 'delete', _self.currentRow).then((response) => {
          $('#table').bootstrapTable('remove', { field: 'userGroupID', values: [_self.currentRow.userGroupID] })
          common.dealSuccessCommon('删除成功')
          $('#modifyModal').modal('hide')
          console.log('delete success')
        }, (response) => {
          common.dealErrorCommon(_self, response)
        })
      })
    }
  }
}
</script>
<style>
</style>
