var mime = require('mime-types')

exports.addEvent = function(obj, name, func)
{
  if (obj.attachEvent) {
      obj.attachEvent("on"+name, func);
  } else {
      obj.addEventListener(name, func, false);
  }
}

exports.convertBase64StrToArray = function(base64Str){
    var bytes=window.atob(base64Str);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return ab
}

exports.aesEncryptModeCFB = function (msg, pwd) {
  var magicNo = exports.generateRandomAlphaNum(32)

  var key = CryptoJS.enc.Hex.parse(CryptoJS.MD5(pwd).toString())
  var iv = CryptoJS.enc.Hex.parse(magicNo)

  var identifyCode = CryptoJS.AES.encrypt(msg, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString()
  return [magicNo, identifyCode]
}

exports.generateRandomAlphaNum = function (len) {
  var rdmString = ''
  // toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
  for (; rdmString.length < len;) { rdmString += Math.random().toString(16).substr(2) }
  return rdmString.substr(0, len)
}

exports.centerModals = function (ele) {
    ele.each(function(i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}

exports.daterangepickerlocale = {
  format: 'YYYY-MM-DD',
  applyLabel: '确定',
  cancelLabel: '取消',
  fromLabel: '起始时间',
  toLabel: '结束时间',
  customRangeLabel: '自定义',
  daysOfWeek: [ '日', '一', '二', '三', '四', '五', '六' ],
  monthNames: [ '一月', '二月', '三月', '四月', '五月', '六月',
          '七月', '八月', '九月', '十月', '十一月', '十二月' ],
  firstDay: 1
}

exports.daterangepickerlocaletime = {
  format: 'YYYY-MM-DD HH:mm',
  applyLabel: '确定',
  cancelLabel: '取消',
  fromLabel: '起始时间',
  toLabel: '结束时间',
  customRangeLabel: '自定义',
  daysOfWeek: [ '日', '一', '二', '三', '四', '五', '六' ],
  monthNames: [ '一月', '二月', '三月', '四月', '五月', '六月',
          '七月', '八月', '九月', '十月', '十一月', '十二月' ],
  firstDay: 1
}

exports.clearStoreData = function (key, value) {
  store.clear()
}

exports.setStoreData = function (key, value) {
  store.set(key, value)
}

exports.getStoreData = function (key) {
  return store.get(key)
}

exports.removeStoreData = function (key) {
  store.remove(key)
}

exports.dealErrorCommon = function(obj,response) {
  if (response.status > 699 && response.status < 800) {
    console.log('700 error')
    BootstrapDialog.show({
      title: '<i class= "fa fa-fw fa-info-circle"></i><strong>错误信息</strong>',
      cssClass: 'modal-danger',
      message: '<i class="text-warning fa fa-fw fa-warning" style="font-size: 40px"></i>' + response.data.description,
      buttons: [{
        label: '<i class= "fa fa-fw fa-close"></i>关闭',
        cssClass: 'btn-outline',
        action: function(dialogItself){
          dialogItself.close()
        }
      }]
    })
  } else if (response.status > 401) {
    obj.$router.push({ path: '/system/error401' })
  } else{
    console.log('else error')
    console.log(response.data)
    obj.setError(response.status,response.data.description)
    obj.$router.push({ path: '/system/error' })
  }
}

exports.dealAlertCommon = function(obj,response) {
  if (response.status > 699 && response.status < 800) {
    console.log('700 error')
    alert(response.data.description)
  } else if (response.status > 401) {
    obj.$router.push({ path: '/system/error401'})
  } else{
    console.log(response.data)
    obj.setError(response.status,response.data.description)
    obj.$router.push({ path: '/system/error'})
  }
}

exports.dealConfrimCommon = function(message, callbackFunc) {
  BootstrapDialog.confirm({
    title: '<i class= "fa fa-fw fa-info-circle"></i><strong>确认信息</strong>',
    message: '<i class="text-warning fa fa-fw fa-question-circle" style="font-size: 40px"></i>' + message,
    cssClass: 'modal-primary',
    btnOKLabel: '<i class= "fa fa-fw fa-check"></i>确认',
    btnOKClass: 'btn-primary',
    btnCancelLabel: '<i class= "fa fa-fw fa-close"></i>取消',
    btnCancelClass: 'btn-warning',
    callback: function (result) {
      if (result) {
        callbackFunc()
      }
    }
  })
}

exports.dealSuccessCommon = function(message) {
  BootstrapDialog.show({
    title: '<i class= "fa fa-fw fa-info-circle"></i><strong>提示信息</strong>',
    cssClass: 'modal-success',
    message: '<i class="tex t-warning glyphicon glyphicon-ok" style="font-size: 40px"></i>' + message,
    buttons: [{
      label: '<i class= "fa fa-fw fa-close"></i>关闭',
      cssClass: 'btn-primary',
      action: function(dialogItself){
        dialogItself.close()
      }
    }]
  })
}

exports.dealPromptCommon = function(message) {
  BootstrapDialog.show({
    title: '<i class= "fa fa-fw fa-info-circle"></i><strong>提示信息</strong>',
    cssClass: 'msg-dialog',
    message: '<i class="text-warning fa fa-fw fa-warning" style="font-size: 40px"></i>' + message,
    buttons: [{
      label: '<i class= "fa fa-fw fa-close"></i>关闭',
      cssClass: 'btn-primary',
      action: function(dialogItself){
        dialogItself.close()
      }
    }]
  })
}

exports.dealWarningCommon = function(message) {
  BootstrapDialog.show({
    title: '<i class= "fa fa-fw fa-info-circle"></i><strong>警告信息</strong>',
    cssClass: 'modal-warning',
    message: '<i class="text-warning fa fa-fw fa-warning" style="font-size: 40px"></i>' + message,
    buttons: [{
      label: '<i class= "fa fa-fw fa-close"></i>关闭',
      cssClass: 'btn-outline',
      action: function(dialogItself){
        dialogItself.close()
      }
    }]
  })
}

exports.changeTableClass = function (tableObj) {
  tableObj.on('click-row.bs.table', function (e, row, $element) {
    $('.success').removeClass('success')
    $($element).addClass('success')
  })
}

exports.changeValidatorStatus = function (tableObj, columns, status) {
  for (var index = 0; index < columns.length; index++) {
    tableObj.data('bootstrapValidator').updateStatus(columns[index], status)
  }
}

exports.reSizeCall = function () {
  $('.fixed-table-container').resize( function () {
    $('#table').bootstrapTable('resetView')
  })
  $('.content-wrapper').trigger("resize")
  $('.content').height($(window).height()-97)
  $('.content').show()
}

exports.getTableHeight = function () {
  var topOffset = 130
  var height = $(window).height()
  height = height - topOffset
  return height
}

exports.initCkeditor = function (textareaID) {
  CKEDITOR.replace(textareaID)
}

exports.initSelect2 = function (jqItem, sdata) {
  jqItem.select2({
    maximumSelectionLength: 1,
    language: 'zh-CN',
    tags: false,
    width: '100%',
    data: sdata,
    multiple: true
  })
}

exports.initSelect2Placeholder = function (jqItem, sdata, placeholder) {
  jqItem.select2({
    maximumSelectionLength: 1,
    language: 'zh-CN',
    placeholder: placeholder,
    tags: false,
    width: '200',
    data: sdata,
    multiple: true
  })
}

exports.initSelect2Single = function (jqItem, sdata) {
  jqItem.select2({
    minimumResultsForSearch: Infinity,
    language: 'zh-CN',
    tags: false,
    width: '100%',
    data: sdata
  })
  jqItem.val("")
}

exports.initSelect2SingleWithSearch = function (jqItem, sdata) {
  jqItem.select2({
    language: 'zh-CN',
    tags: false,
    data: sdata
  })
  jqItem.val("")
}

exports.initSelect2SingleWithSearchPlaceholder = function (jqItem, sdata, placeholder) {
  jqItem.select2({
    language: 'zh-CN',
    placeholder: placeholder,
    data: sdata
  })
}


exports.initDatepicker = function (jqItem) {
  jqItem.datepicker({
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true,
    format: 'yyyy-mm-dd'
  })
}

exports.imagesFileUpload = function (_self, obj, row, url, key) {
  var maxsize = 2*1024*1024;//2M
  var files = _self.files
  var oldRow = $.extend(true, {}, row)
  var fileTypes = new Array('jpg','jpeg','png','gif','bmp')
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let filename = files[i].name
      let nameSplit = filename.split('.')
      let postfix = nameSplit[nameSplit.length-1]
      let fileTypeFlag = '0'
      for (let idx = 0; idx < fileTypes.length; idx++) {
    　　if(fileTypes[idx] === postfix){
    　　　　fileTypeFlag = '1'
    　　}
      }
      if (fileTypeFlag === '0') {
      　alert('图片文件必须是jpg、jpeg、png、gif、bmp')
      　return
      }
      if (files[i].size > maxsize) {
      　alert('最大只允许上传2M的文件')
      　return
      }
      var formData = new FormData();
      formData.append('file', files[i])

      obj.$http.post(url+'upload', formData).then((response) => {
        var fileUrl = response.data['data']['uploadurl']
        row.images.push(fileUrl)
        obj.$http.post(url + 'modify', { 'old': oldRow, 'new': row }).then((response) => {
          var uprow = response.data['data']
          $('#table').bootstrapTable('updateByUniqueId', { id: row[key], row: uprow })
          console.log('modify success')
        }, (response) => {
          console.log('modify error')
          exports.dealErrorCommon(obj, response)
        })
      }, (response) => {
        // error callback
        exports.dealErrorCommon(obj, response)
      })
    }
  }
}

exports.modelImagesFileUpload = function (_self, obj, url) {
  var files = _self.files
  var maxsize = 2*1024*1024;//2M
  var fileTypes = new Array('jpg','jpeg','png','gif','bmp')
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let filename = files[i].name
      let nameSplit = filename.split('.')
      let postfix = nameSplit[nameSplit.length-1]
      let fileTypeFlag = '0'
      for (let idx = 0; idx < fileTypes.length; idx++) {
    　　if(fileTypes[idx] === postfix){
    　　　　fileTypeFlag = '1'
    　　}
      }
      if (fileTypeFlag === '0') {
      　alert('图片文件必须是jpg、jpeg、png、gif、bmp')
      　return
      }
      if (files[i].size > maxsize) {
      　alert('最大只允许上传2M的文件')
      　return
      }
      var formData = new FormData();
      formData.append('file', files[i])

      obj.$http.post(url+'upload', formData).then((response) => {
        obj.imgSrc = response.data['data'].uploadurl
      }, (response) => {
        // error callback
        exports.dealErrorCommon(_self, response)
      })
    }
  }
}

exports.fileFileUpload = function (_self, obj, row, url, key) {
  var files = _self.files
  var maxsize = 2*1024*1024;//2M
  var oldRow = $.extend(true, {}, row)
  var fileTypes = new Array('pdf')
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxsize) {
      　alert('最大只允许上传2M的文件')
      　return
      }

      var formData = new FormData();
      formData.append('file', files[i])

      obj.$http.post(url+'upload', formData).then((response) => {
        var fileUrl = response.data['data']['uploadurl']
        row.files.push(fileUrl)
        obj.$http.post(url + 'modify', { 'old': oldRow, 'new': row }).then((response) => {
          var uprow = response.data['data']
          $('#table').bootstrapTable('updateByUniqueId', { id: row[key], row: uprow })
          console.log('modify success')
        }, (response) => {
          console.log('modify error')
          exports.dealErrorCommon(this, response)
        })
      }, (response) => {
        // error callback
        exports.dealErrorCommon(_self, response)
      })
    }
  }
}

exports.pdfFileFileUpload = function (_self, obj, row, url, key) {
  var files = _self.files
  var maxsize = 2*1024*1024;//2M
  var oldRow = $.extend(true, {}, row)
  var fileTypes = new Array('pdf')
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let filename = files[i].name
      let nameSplit = filename.split('.')
      let postfix = nameSplit[nameSplit.length-1]
      let fileTypeFlag = '0'

//      if (filename.search(row.billLodingNo) <0) {
//        alert('文件名不符合规范')
//        return
//      }

      for (let idx = 0; idx < fileTypes.length; idx++) {
    　　if(fileTypes[idx] === postfix){
    　　　　fileTypeFlag = '1'
    　　}
      }
      if (fileTypeFlag === '0') {
      　alert('图片文件必须是pdf')
      　return
      }
      if (files[i].name > maxsize) {
      　alert('最大只允许上传2M的文件')
      　return
      }

      var formData = new FormData();
      formData.append('file', files[i])
      obj.$http.post(url+'upload', formData).then((response) => {
        var fileUrl = response.data['data']['uploadurl']
        row.files.push(fileUrl)
        obj.$http.post(url + 'modify', { 'old': oldRow, 'new': row }).then((response) => {
          var uprow = response.data['data']
          $('#table').bootstrapTable('updateByUniqueId', { id: row[key], row: uprow })
          console.log('modify success')
        }, (response) => {
          console.log('modify error')
          exports.dealErrorCommon(this, response)
        })
      }, (response) => {
        // error callback
        exports.dealErrorCommon(_self, response)
      })
    }
  }
}

exports.urlsUpload = function (_self, url) {
  $(".urlsupload").change(function(){
    var files = this.files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        var formData = new FormData();
        formData.append('file', files[i])
        _self.$http.post(url+'upload', formData).then((response) => {
          var fileUrl = response.data['data'].uploadurl
          _self.urlsA.push(fileUrl)
          _self.$nextTick(function () {
            $('.urls-detail').thumbox({ thumbs: 3, keyboardNavigation: false, openImageEffect: 'easeOutBack', closeImageEffect: 'easeInBack', scrollDockEffect: 'easeInOutBack' })
          })
        }, (response) => {
          // error callback
          exports.dealErrorCommon(_self, response)
        })
      }
    }
  })
}

exports.rowModify = function (_self, apiUrl, row, key) {
  _self.$http.post(apiUrl + 'modify', { 'old': _self.oldRow, 'new': row }).then((response) => {
    var updaterow = response.data['data']
    $('#table').bootstrapTable('updateByUniqueId', { id: updaterow[key], row: updaterow })
    console.log('modify success')
  }, (response) => {
    console.log('modify error')
    exports.dealErrorCommon(this, response)
  })
}

exports.rowDelete = function (_self, msg, apiUrl, row, key) {
  exports.dealConfrimCommon(msg, function () {
    _self.$http.post(apiUrl + 'delete', row).then((response) => {
      $('#table').bootstrapTable('remove', { field: key, values: [row[key]] })
      exports.dealSuccessCommon('删除成功')
      console.log('delete success')
    }, (response) => {
      console.log('delete error')
      exports.dealErrorCommon(_self, response)
    })
  })
}

//两端去空格函数
String.prototype.trim = function() {    return this.replace(/(^\s*)|(\s*$)/g,""); }

exports.DateFormat = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

exports.remarkFormatter = function (value, row, index) {
  if (value) {
    var displayName = (value.length > 10) ? (value.substring(0, 7) + '...') : value
    return [
      '<a role="button" data-toggle="popover" data-trigger="hover" data-placement="left" data-html="true" data-content="' +
      '<div class=&quot;box&quot;>' +
        '<div class=&quot;box-body&quot;>' +
          '<div class=&quot;form-group&quot;>' +
            '<div class=&quot;&quot;><span>' + value + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>">' + displayName + '</a>'
    ].join('')
  }
}

exports.imagesFormatterNoA = function (value, row, index) {
  var retString = '<div class="form-inline" role="form">'
  if (value.length > 0) {
    retString += '<div class="form-group image-set">'
    for (var key in value) {
      retString += '<a class="box-image-link" href="' +value[key] + '" data-lightbox="'+index+'">'
      retString += '<img class="box-image" src="'+ value[key] +'"></a>'
    }
    retString += '</div">'
  }
  retString += '</div>'
  return retString
}

exports.imagesFormatter = function (value, row, index) {
  var retString = '<div class="form-inline" role="form">'
  if (value.length > 0) {
    retString += '<div class="form-group image-set">'
    for (var key in value) {
      retString += '<a class="box-image-link" href="' +value[key] + '" data-lightbox="'+index+'">'
      retString += '<img class="box-image" src="'+ value[key] +'"></a>'
    }
    retString += '</div>'
  }
  retString += '<span class="form-group fileupload-button">'
  retString += '<i class="glyphicon glyphicon-plus"></i>'
  retString += '<input class="imageupload" type="file" name="file">'
  retString += '</span></div>'
  return retString
}

exports.filesFormatterNoA = function (value, row) {
  if (value.length > 0) {
    var retString = '<div class="form-inline" role="form">'
    retString += '<div class="btn-group">'
    retString += '<button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
    retString += '<ul class="dropdown-menu" style="min-width: 0; border:2px solid #3c8dbc;">'
    for (var key in value) {
      retString += '<li><a href="' + value[key] + '"><i class="glyphicon glyphicon-save-file"></i>'
      retString += '</a></li>'
    }
    retString += '</ul></div></div>'
    return retString
  } else {
    return ''
  }
}

exports.fileFormatter = function (value, row) {
  var retString = '<div class="form-inline" role="form">'
  if (value.length > 0) {
    retString += '<div class="btn-group">'
    retString += '<button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
    retString += '<ul class="dropdown-menu" style="min-width: 0; border:2px solid #3c8dbc;">'
    for (var key in value) {
      retString += '<li><a href="' + value[key] + '" target="_blank"><i class="glyphicon glyphicon-save-file"></i>'
      retString += '</a></li>'
    }
    retString += '</ul></div>'
  }
  retString += '<span class="form-group fileupload-button">'
  retString += '<i class="glyphicon glyphicon-plus"></i>'
  retString += '<input class="fileupload" type="file" name="file">'
  retString += '</span></div>'
  return retString
}


exports.pdfFileFormatterNoA = function (value, row) {
  if (value.length > 0) {
    var retString = '<div class="form-inline" role="form">'
    retString += '<div class="btn-group">'
    retString += '<button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
    retString += '<ul class="dropdown-menu" style="min-width: 0; border:2px solid #3c8dbc;">'
    for (var key in value) {
      retString += '<li><a class="pdf-print" href="#"><i class="glyphicon glyphicon-save-file"></i>'
      retString += '<iframe style="display:none" src="' + value[key] + '"></iframe>'
      retString += '</a></li>'
    }
    retString += '</ul></div></div>'
    return retString
  } else {
    return ''
  }
}

exports.pdfFileFormatter = function (value, row) {
  var retString = '<div class="form-inline" role="form">'
  if (value.length > 0) {
    retString += '<div class="btn-group">'
    retString += '<button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>'
    retString += '<ul class="dropdown-menu" style="min-width: 0; border:2px solid #3c8dbc;">'
    for (var key in value) {
      retString += '<li><a class="pdf-print" href="#"><i class="glyphicon glyphicon-save-file"></i>'
      retString += '<iframe style="display:none" src="' + value[key] + '"></iframe>'
      retString += '</a></li>'
    }
    retString += '</ul></div>'
  }
  retString += '<span class="form-group fileupload-button">'
  retString += '<i class="glyphicon glyphicon-plus"></i>'
  retString += '<input class="fileupload" type="file" name="file">'
  retString += '</span></div>'
  return retString
}

exports.operateFormatter = function (value, row, index) {
  return [
    '<a class="tableDelete" title="删除">',
    '<i class="glyphicon glyphicon-remove"></i>',
    '</a>'
  ].join('')
}

exports.BTRowFormat = function (rowid,rowname) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle'
  }
}

exports.BTRowFormatEditable = function (rowid,rowname) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'text',
      emptytext: '无'
    }
  }
}

exports.BTRowFormatEditableWF = function (rowid,rowname, width) {
  return {
    field: rowid,
    title: rowname,
    class: 'over-hide',
    width: width,
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'text',
      emptytext: '无'
    }
  }
}

exports.BTRowFormatEdSelect = function (_self, rowid, rowname ,paraIndex) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'select',
      emptytext: '无',
      source: _self.pagePara[paraIndex],
      display: function (value, sourceData) {
        var showText = ''
        $(sourceData).each(function () {
          if (typeof(this.id) === typeof(value)) {
            if (this.id === value) {
              showText = this.text
              return false
            }
          } else {
            if (parseInt(this.id) === parseInt(value)) {
              showText = this.text
              return false
            }
          }
        })
        $(this).html(showText)
      }
    }
  }
}

exports.BTRowFormatEditableW = function (rowid,rowname, width) {
  return {
    field: rowid,
    title: rowname,
    width: width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'text',
      mode: 'inline',
      emptyclass: 'form-control',
      emptytext: '',
      showbuttons: false,
      onblur: 'submit',
      clear: false,
      display: function (value, sourceData) {
        $(this).html('<div class="form-control">' + value + '</div>')
      }
    }
  }
}

exports.BTRowFormatEnumberW = function (rowid, rowname, width) {
  return {
    field: rowid,
    title: rowname,
    width: width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'number',
      mode: 'inline',
      emptyclass: 'form-control',
      emptytext: '',
      showbuttons: false,
      onblur: 'submit',
      clear: false,
      display: function (value, sourceData) {
        $(this).html('<div class="form-control">' + value + '</div>')
      }
    }
  }
}

exports.BTRowFormatEdSelectW = function (_self, rowid, rowname , paraIndex, width) {
  return {
    field: rowid,
    title: rowname,
    width: width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'select',
      mode: 'inline',
      emptyclass: 'form-control',
      emptytext: '',
      unsavedclass: null,
      showbuttons: false,
      source: _self.pagePara[paraIndex],
      display: function (value, sourceData) {
        var showText = ''
        $(sourceData).each(function () {
          if (typeof(this.id) === typeof(value)) {
            if (this.id === value) {
              showText = this.text
              return false
            }
          } else {
            if (parseInt(this.id) === parseInt(value)) {
              showText = this.text
              return false
            }
          }
        })
        $(this).html('<div class="form-control">' + showText + '</div>')
      }
    }
  }
}

exports.BTRowFormatEdSelect2 = function (_self, rowid, rowname , paraIndex, width = 200) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'select2',
      emptytext: '无',
      select2: {
        data: _self.pagePara[paraIndex],
        width: width
      },
      display: function (value) {
        var showText = ''
        $(_self.pagePara[paraIndex]).each(function () {
          if (typeof(this.id) === typeof(value)) {
            if (this.id === value) {
              if (this.name) {
                showText = this.name
              } else {
                showText = this.text
              }
              return false
            }
          } else {
            if (parseInt(this.id) === parseInt(value)) {
              if (this.name) {
                showText = this.name
              } else {
                showText = this.text
              }
              return false
            }
          }
        })
        $(this).html(showText)
      }
    }
  }
}

exports.BTRowFormatEdNum = function ( rowid, rowname ) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'text',
      validate: function (value) {
        value = $.trim(value)
        if (!value) {
          return '请输入金额'
        }
        if (!/^\d+\.\d{2}$|^\d+$/.test(value)) {
          return '请输入正确的金额格式如: 0.00.'
        }

        return ''
      }
    }
  }
}

exports.BTRowFormatEdTextarea = function ( rowid, rowname ) {
  return {
    field: rowid,
    title: rowname,
    class: 'auto-line',
    width: 80,
    align: 'center',
    valign: 'middle',
    editable: {
      type: 'textarea',
      disabled: false,
      emptytext: '无',
      display: function (value, sourceData) {
        var ele = value.toString()
        if (ele) {
          var displayName = (ele.length > 10) ? (ele.substring(0, 7) + '...') : ele
          $(this).html(displayName)
        }
      }
    }
  }
}

exports.BTRowFormatWidth = function (rowid, rowname, width) {
  return {
    field: rowid,
    title: rowname,
    class: 'text-nowrap',
    width: width,
    align: 'center',
    valign: 'middle'
  }
}

exports.BTRowFormatWithFormatter = function (rowid, rowname, rFormatter) {
  return {
    field: rowid,
    title: rowname,
    formatter: rFormatter,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle'
  }
}

exports.BTRowFormatWithFW = function (rowid, rowname, rFormatter, width) {
  return {
    field: rowid,
    title: rowname,
    formatter: rFormatter,
    width: width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle'
  }
}

exports.BTRowFormatWithFE = function (rowid, rowname, rFormatter, e) {
  return {
    field: rowid,
    title: rowname,
    formatter: rFormatter,
    events: e,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle'
  }
}

exports.BTRowFormatWithFEW = function (rowid, rowname, rFormatter, e, width) {
  return {
    field: rowid,
    title: rowname,
    formatter: rFormatter,
    events: e,
    width, width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle'
  }
}

exports.actFormatter = function (rowid,rFormatter,e) {
  return {
    field: rowid,
    events: e,
    formatter: rFormatter,
    align: 'center',
    valign: 'middle',
    class: 'text-nowrap'
  }
}

exports.BTRowFormatWithFormatterWidth = function (rowid,rowname,rFormatter,width) {
  return {
    field: rowid,
    title: rowname,
    formatter: rFormatter,
    width: width,
    class: 'text-nowrap',
    align: 'center',
    valign: 'middle',
    width: '60px'
  }
}
// bootstrapValidator  检查公共方法
exports.BVUsername = {
  validators: {
    notEmpty: {
      message: '用户名不能为空'
    },
    regexp: {
      regexp: /^[a-zA-Z0-9_\.]+$/,
      message: '只能是数字和字母_.'
    },
    stringLength: {
      min: 3,
      max: 30,
      message: '用户名长度必须在3到30之间'
    }
  }
}

exports.BVEmail = {
  validators: {
    notEmpty: {
      message: '邮件不能为空'
    },
    emailAddress: {
      message: '请输入正确的邮件地址如：xxxx@abc.com'
    }
  }
}

exports.BVMobile = {
  validators: {
    notEmpty: {
      message: '手机不能为空'
    },
    phone: {
      country: 'CN',
      message: '请输入正确的手机号码'
    }
  }
}

exports.BVDate = {
  validators: {
    notEmpty: {
      message: '日期不能为空'
    },
    date: {
      format: 'YYYY-MM-DD',
      message: '日期类型是 YYYY-MM-DD'
    }
  }
}

exports.BVMoney = {
  validators: {
    notEmpty: {
      message: '请输入金额'
    },
    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
      regexp: /^\d+\.\d{2}$|^\d+$/,
      message: '请输入正确的金额格式如: 0.00.'
    }
  }
}

exports.BVNotEmpty = function (message) {
  return {
    validators: {
      notEmpty: {
        message: message
      }
    }
  }
}
