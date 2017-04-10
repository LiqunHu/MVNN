<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 用箱管理</a></li>
        <li class="active">用箱申请</li>
      </ol>
    </section>
    <section class="content" style="display:none;">
      <div class="col-lg-12">
        <div class="box box-info">
          <div class="box-body">
            <div id="toolbar">
              <div class="form-inline" role="form">
                <div class="form-group">
                  <button id="apply" class="btn btn-block btn-primary">
                      <i class="glyphicon glyphicon-save"></i> 申请放箱
                  </button>
                </div>
                <div class="form-group" style="display:none;">
                  <button id="cancel" class="btn btn-danger" disabled>
                    <i class="glyphicon glyphicon-remove"></i> 取消放箱
                  </button>
                </div>
                <div class="form-group">
                  <input name="searchDate" v-model="searchDate" class="form-control" id="searchDate" placeholder="查询日期">
                </div>
              </div>
            </div>
            <table id="table"></table>
          </div>
        </div>
      </div>
    </section>
    <div class="modal" id="applyModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="clear"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="rowEditModalLabel"><i class="fa fa-pencil-square-o big-blue"></i>申请放箱</h4>
          </div>
          <div class="modal-body form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">用箱日期</label>
              <div class="col-sm-10">
                <input type="text" class="form-control input-sm" id="useContainerDate" name="useContainerDate">
              </div>
            </div>
            <div class="nav-tabs-custom" style="cursor: move;">
              <ul class="nav nav-tabs pull-right ui-sortable-handle">
                <li class="active"><a href="#select-ship" data-toggle="tab" aria-expanded="true">选择</a></li>
                <li class=""><a href="#input-ship" data-toggle="tab" aria-expanded="false">填充</a></li>
                <li class="pull-left" style="line-height: 41px;font-weight: 700;"> 船名 / 航次</li>
              </ul>
              <div class="tab-content no-padding">
                <!-- Morris chart - Sales -->
                <div class="chart tab-pane active" id="select-ship" style="position: relative;">
                  <div class="form-group">
                    <label class="col-sm-2 control-label"></label>
                    <div class="col-sm-10">
                      <select class="form-control input-sm select2" multiple style="width:100%" id="EDIExportShipID" name="EDIExportShipID"></select>
                      <span class="text-light-blue">{{shipInfo}}</span>
                    </div>
                  </div>
                </div>
                <div class="chart tab-pane" id="input-ship" style="position: relative;">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">船名</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control input-sm" v-model="shipName" name="shipName">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">航次</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control input-sm" v-model="voyageNo" name="voyageNo">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">箱信息</label>
              <div class="col-sm-10">
                <table id="container_Table" class="table table-no-bordered" style="margin-bottom:0">
                  <thead>
                    <tr>
                      <th style="text-align: center; width: 45%; "><div class="th-inner ">提单号</div><div class="fht-cell"></div></th>
                      <th style="text-align: center; width: 15%; "><div class="th-inner ">尺寸</div><div class="fht-cell"></div></th>
                      <th style="text-align: center; width: 15%; "><div class="th-inner ">箱型</div><div class="fht-cell"></div></th>
                      <th style="text-align: center; width: 15%; "><div class="th-inner ">数量</div><div class="fht-cell"></div></th>
                      <th style="text-align: center; width: 10%; "><div class="th-inner "></div><div class="fht-cell"></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr data-index="0">
                      <td style="text-align: center; width: 45%;"><input class="form-control" style="padding-right:12px" type="text" id="billLodingNo" v-on:change="getCarrierByBillNo"></td>
                      <td style="text-align: center; width: 15%;"><select class="form-control select2" id="containerSize" name="containerSize"></select></td>
                      <td style="text-align: center; width: 15%;"><select class="form-control select2" id="containerType" name="containerType"></select></td>
                      <td style="text-align: center; width: 15%;"><input class="form-control" style="padding-right:12px" type="number" min="1" value="1" id="containerCount"></td>
                      <td style="text-align: center; width: 10%;"><a class="form-control" style="padding-right:12px;" v-on:click="addContainerInfo" title="增加"><i class="glyphicon glyphicon-plus"></i></a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">提箱要求</label>
              <div class="col-sm-10">
                <textarea rows="3" class="form-control" v-model="requirment" name="requirment"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">船代</label>
              <div class="col-sm-10">
                <select class="form-control input-sm select2" multiple id="carrier" name="carrier" disabled></select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">船公司</label>
              <div class="col-sm-10">
                <select class="form-control input-sm select2" multiple id="shipco" name="shipco" disabled></select>
              </div>
            </div>
            <div class="checkbox">
              <label>
                <input type="checkbox" id="transcheck"> 申请运单
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" v-on:click="add"><i class="fa fa-fw fa-save"></i>提交</button>
            <button type="button" class="btn btn-success" v-on:click="clear"><i class="fa fa-fw fa-trash"></i>清空</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import moment from 'moment'
var common = require('commonFunc')
var apiUrl = '/api/putbox/boxApplyControl?method='
let containerInfoNum

function desk2Json (obj) {
  var containerData = []
  $('#container_Table tbody tr').each(function () {
    var containerSimple = { 'billLodingNo': $(this).find('td:eq(0) input').val(),
                            'containerSize': $(this).find('td:eq(1) select').val(),
                            'containerType': $(this).find('td:eq(2) select').val(),
                            'containerCount': $(this).find('td:eq(3) input').val() }
    containerData.push(containerSimple)
  })

  var carrier = ''
  if ($('#carrier').val()) {
    carrier = $('#carrier').val()[0]
  }

  var shipco = ''
  if ($('#shipco').val()) {
    shipco = $('#shipco').val()[0]
  }

  if ($('#select-ship').hasClass('active')) {
    return {
      'useContainerDate': obj.useContainerDate,
      'carrier': carrier,
      'shipco': shipco,
      'EDIExportShipID': $('#EDIExportShipID').val()[0],
      'requirment': obj.requirment,
      'containerData': containerData,
      'transFlag': $('#transcheck')[0].checked
      // 'containerDisplay': containerDisplay.substring(0, containerDisplay.length - 1)
    }
  } else if ($('#input-ship').hasClass('active')) {
    return {
      'useContainerDate': obj.useContainerDate,
      'carrier': carrier,
      'shipco': shipco,
      'EDIExportShipID': '',
      'shipv': obj.shipName + ' / ' + obj.voyageNo,
      'shipName': obj.shipName,
      'voyageNo': obj.voyageNo,
      'requirment': obj.requirment,
      'containerData': containerData,
      'transFlag': $('#transcheck')[0].checked
    }
  }
}
function deskClean (obj) {
  $('#useContainerDate').value = ''
  obj.useContainerDate = ''
  $('#carrier').val(null).trigger('change')
  $('#shipco').val(null).trigger('change')
  $('#EDIExportShipID').val(null).trigger('change')
  obj.requirment = ''
  obj.shipName = ''
  obj.voyageNo = ''
  $('#transcheck').prop('checked', true);
  $('#container_Table tbody tr[data-index!=0]').remove()
  $('#containerSize').val(null).trigger('change')
  $('#containerType').val(null).trigger('change')
  $('input[id=containerCount]').val('1')
  $('input[id=billLodingNo]').val('')
  // $('#deskForm').data('bootstrapValidator').updateStatus('billLodingNo', 'NOT_VALIDATED')
  containerInfoNum = 0
}

export default {
  data: function () {
    return {
      pagePara: '',
      stDate: moment().format('YYYY-MM-DD'),
      edDate: moment().format('YYYY-MM-DD'),
      useContainerDate: '',
      shipName: '',
      voyageNo: '',
      shipInfo: '',
      requirment: ''
    }
  },
  name: 'boxApplyControl',
  route: {
    canReuse: false
  },
  mounted: function () {
    var _self = this
    function getData () {
      _self.$http.post(apiUrl + 'search', { 'stDate': _self.stDate, 'edDate': _self.edDate }).then((response) => {
        var retData = response.data['data']
        $('#table').bootstrapTable('load', {
          data: retData
        })
      }, (response) => {
        // error callback
        console.log('get data error')
        common.dealErrorCommon(_self, response)
      })
    }

    function operatorInfoFormatter (value, row, index) {
      if (value) {
        return [
          '<a tabindex="operator' + index + '" role="button" data-toggle="popover" data-trigger="hover" data-placement="right" data-html="true" data-content="' +
          '<div class=&quot;box&quot;>' +
            '<div class=&quot;box-body&quot;>' +
              '<div class=&quot;form-group&quot;>' +
                '<label class=&quot;control-label&quot;>电话:</label>' +
                '<div class=&quot;&quot;><span>' + row.operatorInfo.mobile + '</span></div>' +
              '</div>' +
              '<div class=&quot;form-group&quot;>' +
                '<label class=&quot;control-label&quot;>邮箱:</label>' +
                '<div class=&quot;&quot;><span>' + row.operatorInfo.email + '</span></div>' +
              '</div>' +
            '</div>' +
          '</div>">' + row.operatorInfo.name + '</a>'
        ].join('')
      } else {
        return '未分配'
      }
    }

    function carrierFormatter (value, row) {
      for (let i = 0; i < _self.pagePara['carrierInfo'].length; i++) {
        if (_self.pagePara['carrierInfo'][i].id === value) {
          return _self.pagePara['carrierInfo'][i].name
        }
      }
      return ''
    }

    function shipcoFormatter (value, row) {
      for (let i = 0; i < _self.pagePara['shipcoInfo'].length; i++) {
        if (_self.pagePara['shipcoInfo'][i].id === value) {
          return _self.pagePara['shipcoInfo'][i].name
        }
      }
      return ''
    }

    function statusFormatter (value, row) {
      for (let i = 0; i < _self.pagePara['statusInfo'].length; i++) {
        if (_self.pagePara['statusInfo'][i].id === value) {
          return '<span class="label ' + _self.pagePara['statusInfo'][i].style + '">' + _self.pagePara['statusInfo'][i].text + '</span>'
        }
      }
      return ''
    }

    function yardIdFormatter (value, row, index) {
      if (value) {
        if (value.length > 1) {
          var retString = '<a tabindex="carManager' + index + '" role="button" data-toggle="popover" data-trigger="hover" data-placement="left" data-html="true" data-content="' +
          '<div class=&quot;box&quot;>' +
          '<div class=&quot;box-body&quot;>'
          $(value).each(function () {
            var _yard = this
            retString += '<div class=&quot;form-group&quot;>'
            $(_self.pagePara['containerYard']).each(function () {
              if (this.id === _yard.containerYard) {
                retString += '<label class=&quot;control-label&quot;>' + this.text + ' : ' + _yard.containerCount.toString() + '</label>'
                return
              }
            })
            retString += '</div>'
          })
          retString += '</div></div>">多个堆场</a>'
          return retString
        } else if (value.length > 0) {
          var retString = ''
          $(_self.pagePara['containerYard']).each(function () {
            if (this.id === value[0].containerYard) {
              retString = this.text
              return
            }
          })
          return retString
        }
      }
    }

    function sumFeeFormater (value, row, index) {
      return [
        '<a tabindex="carManager' + index + '" role="button" data-toggle="popover" data-trigger="hover" data-placement="left" data-html="true" data-content="' +
        '<div class=&quot;box&quot;>' +
          '<div class=&quot;box-body&quot;>' +
            '<div class=&quot;form-group&quot;>' +
              '<label class=&quot;control-label&quot;>提箱费:</label>' +
              '<div class=&quot;&quot;><span>' + row.containerStuffingCharge + '</span></div>' +
            '</div>' +
            '<div class=&quot;form-group&quot;>' +
              '<label class=&quot;control-label&quot;>打单费:</label>' +
              '<div class=&quot;&quot;><span>' + row.logisticsHitCharge + '</span></div>' +
            '</div>' +
            '<div class=&quot;form-group&quot;>' +
              '<label class=&quot;control-label&quot;>服务费:</label>' +
              '<div class=&quot;&quot;><span>' + row.serviceCharge + '</span></div>' +
            '</div>' +
            '<div class=&quot;form-group&quot;>' +
              '<label class=&quot;control-label&quot;>其它:</label>' +
              '<div class=&quot;&quot;><span>' + row.otherFee + '</span></div>' +
            '</div>' +
          '</div>' +
        '</div>">' + row.sumFee + '</a>'
      ].join('')
    }

    function initTable () {
      window.tableEvents = {
        'change .imageupload': function (e, value, row, index) {
          common.imagesFileUpload(this, _self, row, apiUrl, 'trunkListID')
        }
      }

      $('#table').bootstrapTable({
        height: common.getTableHeight(),
        columns: [
        {
          field: 'trunkListID',
          align: 'center',
          valign: 'middle',
          title: '申请编号',
          visible: false
        },
        common.BTRowFormat('useContainerDate', '用箱日期'),
        common.BTRowFormatWithFormatter('status', '状态', statusFormatter),
        common.BTRowFormatWithFormatter('remark', '备注', common.remarkFormatter),
        common.BTRowFormatWithFormatter('operatorID', '操作员', operatorInfoFormatter),
        common.BTRowFormatWithFormatter('carrierID', '船代', carrierFormatter),
        common.BTRowFormatWithFormatter('shipCoID', '船公司', shipcoFormatter),
        common.BTRowFormat('shipv', '船名 / 航次'),
        common.BTRowFormat('billLodingNo', '提单号'),
        common.BTRowFormat('containerInfo', '箱型箱量'),
        common.BTRowFormatWithFormatter('yardID', '堆场', yardIdFormatter),
        common.BTRowFormat('dischargePort', '卸港'),
        common.BTRowFormatWithFormatter('sumFee', '总费用', sumFeeFormater),
        common.BTRowFormatWithFormatter('requirment', '要求', common.remarkFormatter),
        common.BTRowFormatWithFE('images', '图片', common.imagesFormatter, tableEvents),
        common.BTRowFormatWithFormatter('files', '文件', common.pdfFileFormatterNoA),
        {
          field: 'maketime',
          align: 'center',
          valign: 'middle',
          title: '申请时间',
          visible: false
        },
        {
          field: 'modifytime',
          align: 'center',
          valign: 'middle',
          title: '末次更新日期',
          visible: false
        }
      ],
        idField: 'trunkListID',
        uniqueId: 'trunkListID',
        toolbar: '#toolbar',
        search: true,
        showRefresh: true,
        showColumns: true,
        showExport: true,
        striped: true,
        pagination: true,
        pageSize: 25,
        pageList: [10,15,25,50,'All'],
        showFooter: false,
        clickToSelect: true,
        locale: 'zh-CN',
        onPostBody: function (data) {
          $('td.bs-checkbox').css({ 'text-align': 'center', 'vertical-align': 'middle' })
          $('[data-toggle="popover"]').each(function () {
            $(this).popover()
          })
          $('.pdf-print').click(function() {
            var doc = $(this).find("iframe")
            try
            {
              $(doc)[0].contentWindow.focus()
              $(doc)[0].contentWindow.print()
            } catch (ex) {
              console.log(ex.message)
              window.open($(doc).attr('src'))
            }
          })
        },
        onRefresh: function () {
          getData()
        }
      })

      common.changeTableClass($('#table'))
    }

    function initPage () {
      _self.$http.post(apiUrl + 'init', {}).then((response) => {
        var retData = response.data['data']
        _self.pagePara = $.extend(true, {}, retData)
        common.initSelect2($('#carrier'), retData['carrierInfo'])
        common.initSelect2($('#shipco'), retData['shipcoInfo'])
        common.initSelect2($('#EDIExportShipID'), retData['shipInfo'])
        $('#EDIExportShipID').on('select2:select', function (e) {
          var shipid = parseInt(this.value)
          $(_self.pagePara['shipInfo']).each(function () {
            if (this.id === shipid) {
              _self.shipInfo = '离港: ' + this.ETD + ' 码头: ' + this.wharfName
              return
            }
          })
        });
        common.initSelect2Single($('#containerSize'), retData['containerSizeInfo'])
        common.initSelect2Single($('#containerType'), retData['containerTypeInfo'])
        initTable()
        getData()
        $('#useContainerDate').datepicker({
          language: 'zh-CN',
          autoclose: true,
          todayHighlight: true,
          format: 'yyyy-mm-dd'
        }).on('changeDate', function(e) {
            _self.useContainerDate = e.format('yyyy-mm-dd')
        })
        $('#useContainerDate').value = '';
        $('#searchDate').daterangepicker({
          startDate: _self.stDate,
          endDate: _self.edDate,
          timePicker: false,
          dateLimit: { days: 30 },
          ranges: {
            '最近7日': [moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
            '最近14日': [moment().subtract(13, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
            '最近30日': [moment().subtract(29, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
          },
          locale: common.daterangepickerlocale
        }, function (start, end, label) { // 格式化日期显示框
          _self.stDate = start.format('YYYY-MM-DD')
          _self.edDate = end.format('YYYY-MM-DD')
          getData()
        })
        common.reSizeCall()
        console.log('init success')
      }, (response) => {
        common.dealErrorCommon(_self, response)
      })
    }

    $(function () {
      initPage()
      $('#apply').click(function () {
        containerInfoNum = 0
        $('#transcheck').prop('checked', true);
        $('#applyModal').modal('show')
      })

      $('#cancel').click(function () {
        var rows = $('#table').bootstrapTable('getSelections')
        var ids = []
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].status !== '1') {
            common.dealWarningCommon('只有已提交状态能够取消')
            break
          } else {
            ids.push(rows[i].trunkListID)
          }
        }
        if (ids.length === rows.length) {
          _self.$http.post(apiUrl + 'delete', { 'cancelids': ids }).then((response) => {
            $('#table').bootstrapTable('remove', {
              field: 'trunkListID',
              values: ids
            })
            console.log('delete success')
          }, (response) => {
            console.log('delete error')
            common.dealErrorCommon(this, response)
          })
        }
      })
    })
  },
  methods: {
    add: function (event) {
      var _self = this
      var yzFlag = false
      if (_self.useContainerDate < moment().format('YYYY-MM-DD')) {
        common.dealPromptCommon('放箱日期不能小于当日!')
        return false
      }
      $('select[name="containerSize"]').each(function () {
        if (!$(this).val()) {
          yzFlag = true
          common.dealPromptCommon('尺寸不能为空, 请确认!')
          return false
        }
      })
      if (yzFlag) {
        return
      }
      $('select[name="containerType"]').each(function () {
        if (!$(this).val()) {
          yzFlag = true
          common.dealPromptCommon('箱型不能为空, 请确认!')
          return false
        }
      })
      $('input[name="containerCount"]').each(function () {
        if ($(this).val()) {
          if (parseInt($(this).val()) === 0) {
            yzFlag = true
            common.dealPromptCommon('箱量不能为0,请确认!')
            return false
          }
        } else {
          yzFlag = true
          common.dealPromptCommon('箱量不能为空,请确认!')
          return false
        }
      })
      if (yzFlag) {
        return
      }

      var workRow = desk2Json(this)
      common.dealConfrimCommon('确定申请用箱？', function () {
        _self.$http.post(apiUrl + 'add', workRow).then((response) => {
          var retdata = response.data['data'].serviceReData
          for (let i = 0; i < retdata.length; i++) {
            $('#table').bootstrapTable('insertRow', { index: 0, row: retdata[i] })
          }
          deskClean(_self)
        }, (response) => {
          console.log('add error')
          common.dealAlertCommon(this, response)
        })
      })
    },
    clear: function (event) {
      deskClean(this)
      console.log('clear success')
    },
    addContainerInfo: function () {
      containerInfoNum += 1
      var icons = '<a class="form-control containersub" style="padding-right:12px;" containerindex="' + containerInfoNum + '" title="删除"><i class="glyphicon glyphicon-minus"></i></a>'

      var tr = '<tr data-index="' + containerInfoNum + '">' +
                 '<td style="text-align: center; width: 45%;"><input class="form-control" style="padding-right:12px" type="text" name="billLodingNo"></td>' +
                 '<td style="text-align: center; width: 15%;"><select id="containerSize' + containerInfoNum + '" name="containerSize" class="form-control select2"></select></td>' +
                 '<td style="text-align: center; width: 15%;"><select id="containerType' + containerInfoNum + '" name="containerType" class="form-control select2"></select></td>' +
                 '<td style="text-align: center; width: 15%;"><input class="form-control" style="padding-right:12px" type="number" min="1" value="1" name="containerCount"></td>' +
                 '<td style="text-align: center; width: 10%;">' + icons + '</td>' +
               '</tr>'
      $('#container_Table tbody').append(tr)

      common.initSelect2Single($('#containerSize' + containerInfoNum), this.pagePara['containerSizeInfo'])
      common.initSelect2Single($('#containerType' + containerInfoNum), this.pagePara['containerTypeInfo'])

      $('.containersub').click(function () {
        var trIndex = $(this).attr('containerindex')
        $('#container_Table tbody tr[data-index=\'' + trIndex + '\']').remove()
      })
    },
    getCarrierByBillNo: function () {
      this.$http.post(apiUrl + 'grapCarrier', { 'billLodingNo': $('#billLodingNo').val() }).then((response) => {
        var IDs = response.data['data']
        if (IDs) {
          $('#carrier').val(IDs['carrierID']).trigger('change')
          $('#shipco').val(IDs['shipCoID']).trigger('change')
        }
      }, (response) => {
        console.log('add error')
        common.dealAlertCommon(this, response)
      })
    }
  }
}
</script>
<style>
</style>
