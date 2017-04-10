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
              <input class="form-control" v-model="userNameA" name="userNameA">
            </div>
            <div class="form-group">
              <label>姓名</label>
              <input class="form-control" v-model="nameA" name="nameA" v-on:change="makeHelpMarkA">
            </div>
            <div class="form-group">
              <label>客户代码</label>
              <input class="form-control" v-model="helpMarkA" name="helpMarkA">
            </div>
            <div class="form-group">
              <label>联系方式</label>
              <input type="tel" class="form-control" v-model="mobileA" name="mobileA">
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="text" class="form-control" v-model="emailA" name="emailA">
            </div>
            <div class="form-group">
              <label>用户组</label>
              <select class="form-contro select2" multiple style="width:100%" name="userGroupA" id="userGroupA">
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
var common = require('commonFunc')
var apiUrl = '/api/system/operatorcontrol?method='

export default {
  data: function () {
    return {
      pagePara: '',
      userNameA: '',
      nameA: '',
      helpMarkA: '',
      mobileA: '',
      emailA: '',
      oldRow: ''
    }
  },
  name: 'operatorControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    var _self = this
    var $table = $('#table')
    function getData () {
      _self.$http.post(apiUrl + 'search', {}).then((response) => {
        var retdata = response.data['data']
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
        if (_self.pagePara['groupInfo'][i].id === parseInt(value)) {
          return _self.pagePara['groupInfo'][i].text
        }
      }
      return ''
    }
    function initTable () {
      window.tableEvents = {
        'click .tableDelete': function (e, value, row, index) {
          common.rowDelete(_self, '用户删除', apiUrl, row, 'userID')
        }
      }
      $table.bootstrapTable({
        height: common.getTableHeight(),
        columns: [
          {
            field: 'userID',
            visible: false
          },
          common.BTRowFormat('userName', '用户名'),
          common.BTRowFormatEditable('name', '姓名'),
          common.BTRowFormatEditable('helpMark', '客户代码'),
          common.BTRowFormatEditable('mobile', '电话'),
          common.BTRowFormatEditable('email', '邮箱'),
          common.BTRowFormatEdSelect(_self, 'userGroupID', '用户组', 'groupInfo'),
          common.actFormatter('act', common.operateFormatter, tableEvents)
        ],
        idField: 'userID',
        uniqueId: 'userID',
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
          common.rowModify(_self, apiUrl, row, 'userID')
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
        common.initSelect2($('#userGroupA'), retData['groupInfo'])
        common.initSelect2($('#userGroupM'), retData['groupInfo'])
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
      this.userNameA = ''
      this.nameA = ''
      this.helpMarkA = ''
      this.emailA = ''
      this.mobileA = ''
      $('#userGroupA').val(null).trigger('change')
      $('#AddModal').modal('show')
    },
    addOp: function (event) {
      var _self = this
      var workRow = {
        'userID': '',
        'userName': _self.userNameA,
        'name': _self.nameA,
        'helpMark': _self.helpMarkA,
        'email': _self.emailA,
        'mobile': _self.mobileA,
        'userGroupID': $('#userGroupA').val()[0]
      }
      _self.$http.post(apiUrl + 'add', workRow).then((response) => {
        workRow.userID = response.data['data'].userID
        $('#table').bootstrapTable('insertRow', { index: 0, row: workRow })
        this.userNameA = ''
        this.nameA = ''
        this.helpMarkA = ''
        this.emailA = ''
        this.mobileA = ''
        $('#userGroupA').val(null).trigger('change')
        $('#formA').data('bootstrapValidator').resetForm()
        common.dealSuccessCommon('增加成功')
      }, (response) => {
        console.log('add error')
        common.dealErrorCommon(_self, response)
      })
    },
    makeHelpMarkA: function (event) {
      this.helpMarkA = common.getPinYin(this.nameA)
    }
  }
}
</script>
<style>
</style>
