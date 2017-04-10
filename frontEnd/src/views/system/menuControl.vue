<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">菜单维护</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
      <div class="col-lg-8">
        <div class="box box-info">
          <div class="box-body">
            <table id="table"
            data-search="true"
            data-show-refresh="true"
            data-show-toggle="true"
            data-show-columns="true"
            data-show-export="true"
            data-id-field="userid"
            data-striped='true'>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="box box-success">
          <div class="box-header with-border ui-sortable-handle">
            <!-- tools box -->
            <div class="pull-right box-tools">
              <button type="button" class="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse" style="margin-right: 5px;">
                <i class="fa fa-minus"></i>
              </button>
            </div>
            <!-- /. tools -->
            <i class="fa fa-desktop"></i>
            <h3 class="box-title"> 工作台 </h3>
          </div>
          <div class="box-body" id="box-body">
            <div id="scroll-des">
              <div id="deskForm">
                <div class="hidden">{{ menuID }}</div>
                <div class="form-group">
                  <label>菜单名</label>
                  <input class="form-control" v-model="menuName" name="menuName">
                </div>
                <div class="form-group">
                  <label>所在父级目录</label>
                  <select class="form-control select2" multiple style="width:100%" id="fMenu">
                  </select>
                </div>
                <div class="form-group">
                  <label>功能路径</label>
                  <input class="form-control" v-model="menuPath">
                </div>
                <div class="form-group">
                  <label>功能图标</label>
                  <div class="input-group">
                    <input class="form-control" v-model="menuIcon">
                    <span class="input-group-btn">
                      <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modalTable" v-on:click="showIcon"><i class="fa fa-fw fa-search"></i>图标选择</button>
                    </span>
                  </div>
                </div>
                <div class="form-group">
                  <label>显示序号</label>
                  <input class="form-control" v-model="menuIdx" name="menuIdx">
                </div>
              </div>
            </div>
          </div>
          <div class="box-footer no-border">
            <div class="lower-right-corner">
              <button type="button" class="btn btn-primary" v-on:click="addMu"><i class="fa fa-fw fa-plus"></i>增加</button>
              <button type="button" class="btn btn-info" v-on:click="modifyMu"><i class="fa fa-fw fa-edit"></i>修改</button>
              <button type="button" class="btn btn-warning" v-on:click="deleteMu"><i class="fa fa-fw fa-remove"></i>删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="modal fade" id="modalTable" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title"><i class="fa fa-file-image-o fa-fw"></i>图标选择</h4>
            </div>
            <div class="modal-body">
              <table id="iconTable"
              data-height="299"
              data-toggle="table">
              </table>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-fw fa-close"></i>关闭</button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->
  </div>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
var apiUrl = '/api/system/menucontrol?method='
let currentRow
let currentRowIndex
function desk2Json (obj) {
  return {
    'menuID': parseInt(obj.menuID),
    'menuName': obj.menuName,
    'fMenuID': $('#fMenu').val()[0],
    'menuPath': obj.menuPath,
    'menuIcon': obj.menuIcon,
    'menuIdx': obj.menuIdx
  }
}
function deskClean (obj) {
  obj.menuName = ''
  obj.fMenu = 0
  $('#fMenu').val(null).trigger('change')
  obj.menuPath = ''
  obj.menuIcon = ''
  obj.menuIdx = ''
}

function getData (obj) {
  obj.$http.post(apiUrl + 'search', {}).then((response) => {
    var retdata = response.data['data']
    $('#table').bootstrapTable('load', {
      data: retdata
    })
    return retdata
  }, (response) => {
    common.dealErrorCommon(obj, response)
  })
}

function initPage (obj) {
  obj.$http.post(apiUrl + 'init', {}).then((response) => {
    var retData = response.data['data']
    obj.pagePara = retData
    common.initSelect2($('#fMenu'), retData['fMenuInfo'])
    console.log('init success1')
  }, (response) => {
    console.log('init error')
    common.dealErrorCommon(obj, response)
  })
}

export default {
  data: function () {
    return {
      pagePara: '',
      menuPara: '',
      menuID: '',
      menuName: '',
      fMenu: 0,
      menuPath: '',
      menuIcon: '',
      menuIdx: ''
    }
  },
  name: 'menuControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    var _self = this
    function formatdesk (row) {
      _self.menuID = row['menuID']
      _self.menuName = row['menuName']
      $('#fMenu').val([row['fMenuID']]).trigger('change')
      _self.menuPath = row['menuPath']
      _self.menuIcon = row['menuIcon']
      _self.menuIdx = row['menuIdx']
    }
    function menuNameFormatter (value, row) {
      var formatValue = ''
      if (row.menuType === '00') {
        formatValue = '<span class="glyphicon glyphicon-minus showChild"><i class="hidden">' + row.menuID + '</i></span>' + value
      } else {
        formatValue = '<span class="indent"></span><span class="indent"></span>' + value
      }
      return formatValue
    }

    function iconDisplayFormatter (value, row) {
      return '<i class="fa fa-fw ' + row.iconSource + '"></i>'
    }
    function initTable () {
      window.tableEvents = {
        'click .showChild': function (e, value, row, index) {
          var $menuTable = $('#table')
          var iconTarget = $(e.currentTarget)
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
        }
      }

      $('#table').bootstrapTable({
        height: common.getTableHeight(),
        columns: [{
          field: 'menuID',
          align: 'left',
          visible: false
        }, {
          field: 'menuName',
          align: 'left',
          title: '菜单名',
          formatter: menuNameFormatter,
          events: tableEvents,
        }, {
          field: 'menuType',
          align: 'left',
          visible: false
        }, {
          field: 'fMenuID',
          align: 'left',
          visible: false
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
        onClickRow: function (row, $element) {
          currentRow = $.extend(true, {}, row)
          currentRowIndex = $element[0].rowIndex - 1
          formatdesk(row)
        },
        onRefresh: function () {
          getData(_self)
        },
        formatLoadingMessage: function () {
          return '请稍等，正在加载中...'
        },
        formatNoMatches: function () {
          return '无符合条件的记录'
        }
      })
      $('#iconTable').bootstrapTable({
        columns: [{
          field: 'id',
          align: 'center',
          title: '序号'
        }, {
          field: 'iconDisplay',
          align: 'center',
          title: '图标',
          formatter: iconDisplayFormatter
        }, {
          field: 'iconSource',
          align: 'center',
          title: '图标代码'
        }],
        onClickRow: function (row, $element) {
          _self.menuIcon = row.iconSource
          $('#modalTable').modal('hide')
        },
        formatLoadingMessage: function () {
          return '请稍等，正在加载中...'
        },
        formatNoMatches: function () {
          return '无符合条件的记录'
        }
      })
    }

    $(function () {
      initPage(_self)
      initTable()
      common.changeTableClass($('#table'))
      common.changeTableClass($('#iconTable'))
      getData(_self)
      common.reSizeCall()
    })
  },
  methods: {
    addMu: function (event) {
      var workRow = desk2Json(this)
      this.$http.post(apiUrl + 'add', workRow).then((response) => {
        initPage(this)
        getData(this)
        deskClean(this)
        console.log('add success')
      }, (response) => {
        console.log('add error')
        common.dealErrorCommon(this, response)
      })
    },
    modifyMu: function (event) {
      var old = currentRow
      var workRow = desk2Json(this)
      this.$http.post(apiUrl + 'modify', { 'old': old, 'new': workRow }).then((response) => {
        initPage(this)
        getData(this)
        console.log('modify success')
      }, (response) => {
        console.log('modify error')
        common.dealErrorCommon(this, response)
      })
    },
    deleteMu: function (event) {
      var _self = this
      common.dealConfrimCommon('目录对应的子菜单全部删除,确定删除该目录吗?', function () {
        _self.$http.post(apiUrl + 'delete', currentRow).then((response) => {
          initPage(_self)
          getData(_self)
          deskClean(_self)
          console.log('delete success')
        }, (response) => {
          console.log('delete error')
          common.dealErrorCommon(_self, response)
        })
      })
    },
    showIcon: function (event) {
      var data = require('../../components/data/icon.json')
      $('#modalTable').on('shown.bs.modal', function () {
        $('#iconTable').bootstrapTable('load', {
          data: data
        })
      })
    },
    showChild: function (event) {
      var $menuTable = $('#table')
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
    }
  }
}
</script>
<style>
</style>
