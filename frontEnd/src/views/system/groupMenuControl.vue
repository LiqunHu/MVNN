<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">组菜单维护</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
        <div class="col-lg-12">
          <div class="box box-success">
            <div class="box-body">
              <div id="toolbar" class="pull-right">
                <div class="form-inline" role="form">
                  <div class="form-group">
                    <label>菜单组</label>
                    <select class="form-control select2" style="width: 200px" name="userGroupID" id="userGroupID">
                    </select>
                  </div>
                  <div class="form-group">
                    <button id="modify" class="btn btn-success" v-on:click="modify" disabled>
                      <i class="glyphicon glyphicon-saved"></i> 提交
                    </button>
                  </div>
                </div>
              </div>
              <table id="menuTable"></table>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
var apiUrl = '/api/system/groupmenucontrol?method='

function menuNameFormatter (value, row) {
  var formatValue = ''
  if (row.menuType === '00') {
    formatValue = '<span class="glyphicon glyphicon-minus" v-on:click="showChild"><i class="hidden">' + row.menuID + '</i></span>' + value
  } else {
    formatValue = '<span class="indent"></span><span class="indent"></span>' + value
  }
  return formatValue
}

export default {
  data: function () {
    return {
      pagePara: '',
      tableData: ''
    }
  },
  name: 'groupMenuControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    var _self = this
    var $menuTable = $('#menuTable')

    function initTable () {
      $menuTable.bootstrapTable({
        height: common.getTableHeight(),
        columns: [{
          field: 'state',
          checkbox: true
        }, {
          field: 'menuID',
          align: 'center',
          visible: false
        }, {
          field: 'menuName',
          align: 'left',
          title: '菜单名',
          formatter: menuNameFormatter
        }, {
          field: 'menuPath',
          align: 'left',
          title: '功能路径'
        }, {
          field: 'menuIcon',
          align: 'left',
          title: '菜单图标'
        }, {
          field: 'menuIdx',
          align: 'center',
          title: '显示序号'
        }],
        idField: 'menuID',
        uniqueId: 'menuID',
        toolbar: '#toolbar',
        striped: true,
        onCheck: function (row, $element) {
          if (row.menuType === '01') {
            for (let i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].menuID === row.fMenuID) {
                _self.tableData[i]['state'] = true
              }
              if (_self.tableData[i].menuID === row.menuID) {
                _self.tableData[i]['state'] = true
              }
            }
          }
          $('#menuTable').bootstrapTable('load', {
            data: _self.tableData
          })
        },
        onUncheck: function (row, $element) {
          if (row.menuType === '00') {
            for (let i = 0; i < _self.tableData.length; i++) {
              if (_self.tableData[i].fMenuID === row.menuID) {
                _self.tableData[i]['state'] = false
              }
              if (_self.tableData[i].menuID === row.menuID) {
                _self.tableData[i]['state'] = false
              }
            }
          }
          $('#menuTable').bootstrapTable('load', {
            data: _self.tableData
          })
        }
      })
      common.changeTableClass($menuTable)
    }

    function initPage () {
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        var retData = response.data['data']
        for (let i = 0; i < retData.menuInfo.length; i++) {
          retData.menuInfo[i]['state'] = false
        }
        _self.pagePara = $.extend(true, {}, retData)
        common.initSelect2SingleWithSearch($('#userGroupID'), retData['groupInfo'])
        $('#userGroupID').on('select2:select', function (evt) {
          getCheckData()
          $('#modify').prop('disabled', false)
        })

        $('#menuTable').bootstrapTable('load', {
          data: retData.menuInfo
        })

        initTable()
        common.reSizeCall()
        console.log('init success')
      }, (response) => {
        console.log('init error')
        common.dealErrorCommon(_self, response)
      })
    }

    function getCheckData () {
      var userGroupID = $('#userGroupID').val()
      _self.$http.post(apiUrl + 'searchCheck', { 'userGroupID': userGroupID }).then((response) => {
        var retData = response.data['data']
        var menuInfo = $.extend(true, [], _self.pagePara.menuInfo)
        for (let i = 0; i < retData.groupMenu.length; i++) {
          for (let j = 0; j < menuInfo.length; j++) {
            if (retData.groupMenu[i] === menuInfo[j].menuID) {
              menuInfo[j]['state'] = true
            }
          }
        }
        _self.tableData = $.extend(true, [], menuInfo)
        $('#menuTable').bootstrapTable('load', {
          data: menuInfo
        })
      }, (response) => {
        // error callback
        console.log('get data error')
        common.dealErrorCommon(_self, response)
      })
    }

    $(function () {
      initPage()
    })
  },
  methods: {
    showChild: function (event) {
      var $menuTable = $('#menuTable')
      var iconTarget = $(event.currentTarget)
      var parentMenuID = parseInt(iconTarget.find('i').first().text())
      var tableData = $menuTable.bootstrapTable('getData')
      if (iconTarget.hasClass('glyphicon-minus')) {
        iconTarget.removeClass('glyphicon-minus').addClass('glyphicon-plus')
        for (var indexH = 0; indexH < tableData.length; indexH++) {
          if (tableData[indexH].fMenuID === parentMenuID) {
            $menuTable.bootstrapTable('hideRow', { index: indexH })
          }
        }
      } else {
        iconTarget.removeClass('glyphicon-plus').addClass('glyphicon-minus')
        for (var indexE = 0; indexE < tableData.length; indexE++) {
          if (tableData[indexE].fMenuID === parentMenuID) {
            $menuTable.bootstrapTable('showRow', { index: indexE })
          }
        }
      }
      $menuTable.bootstrapTable('resetView')
    },
    modify: function (event) {
      var userGroupID = $('#userGroupID').val()
      if (!userGroupID) {
        common.dealPromptCommon('未选定用户组，不能分配菜单')
      } else {
        var menuTableData = $('#menuTable').bootstrapTable('getSelections')
        this.$http.post(apiUrl + 'modify', { 'userGroupID': userGroupID, 'userGroupMenu': menuTableData }).then((response) => {
          common.dealPromptCommon('选定用户组的菜单已分配，请重新登录查看')
        }, (response) => {
          // error callback
          console.log('get data error')
          common.dealErrorCommon(this, response)
        })
      }
    }
  }
}

</script>
<style>
.indent{
  width: 16px;
  height: 16px;
  display: inline-block;
  position: relative
}
</style>
