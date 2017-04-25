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
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
var apiUrl = '/api/putbox/boxApplyControl?method='

export default {
  data: function () {
    return {
      pagePara: '',
    }
  },
  name: 'boxApplyControl',
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

    function initTable () {
    }

    function initPage () {
    }

    initPage()
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
