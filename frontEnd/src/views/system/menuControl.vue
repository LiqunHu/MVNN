<template>
<div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
        <li class="active">菜单维护</li>
      </ol>
    </section>
    <section class="content hidedesk" style="display:none;">
      <div class="col-lg-8">
          <div class="box box-info">
            <div class="box-body">
                <table id="table" data-search="true" data-show-refresh="true" data-show-toggle="true" data-show-columns="true" data-show-export="true" data-id-field="userid" data-striped='true'>
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
                <div class="form-group">
                    <label>菜单名</label>
                    <input class="form-control" v-model="workRow.menu_name">
                </div>
                <div class="form-group">
                    <label>所在父级目录</label>
                    <select class="form-control select2" multiple style="width:100%" id="f_menu_id"> </select>
                </div>
                <div class="form-group">
                    <label>菜单类型</label>
                    <select class="form-control select2" multiple style="width:100%" id="menu_type"> </select>
                </div>
                <div class="form-group">
                    <label>权限校验</label>
                    <select class="form-control select2" multiple style="width:100%" id="auth_flag"> </select>
                </div>
                <div class="form-group">
                    <label>功能路径</label>
                    <input class="form-control" v-model="workRow.menu_path">
                </div>
                <div class="form-group">
                    <label>功能图标</label>
                    <div class="input-group">
                        <input class="form-control" v-model="workRow.menu_icon">
                        <span class="input-group-btn">
                          <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modalTable" v-on:click="showIcon">
                              <i class="fa fa-fw fa-search"></i>图标选择
                          </button>
                        </span>
                    </div>
                </div>
                <div class="form-group">
                    <label>是否按机构控制</label>
                    <select class="form-control select2" multiple style="width:100%" id="domain_flag"> </select>
                </div>
                <div class="form-group">
                    <label>是否显示</label>
                    <select class="form-control select2" multiple style="width:100%" id="show_flag"> </select>
                </div>
                <div class="form-group">
                    <label>显示序号</label>
                    <input class="form-control" v-model="workRow.menu_index">
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
    <div class="modal fade" id="modalTable">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title">图标选择</h4>
                </div>
                <div class="modal-body">
                    <table id="iconTable" data-height="299" data-toggle="table">
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-fw fa-close"></i>关闭</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
</div>
</template>
<script>
import $ from 'jquery'
const common = require('commonFunc')
const apiUrl = '/api/system/menucontrol?method='

function getData(obj) {
    obj.$http.post(apiUrl + 'search', {}).then((response) => {
        let retdata = response.data.info
        $('#table').bootstrapTable('load', {
            data: retdata
        })
        return retdata
    }, (response) => {
        common.dealErrorCommon(obj, response)
    })
}

function initPage(obj, callback) {
    obj.$http.post(apiUrl + 'init', {}).then((response) => {
        let retData = response.data.info
        obj.pagePara = JSON.parse(JSON.stringify(retData))
        common.initSelect2($('#f_menu_id'), retData.fMenuInfo)
        common.initSelect2($('#auth_flag'), retData.authInfo)
        common.initSelect2($('#domain_flag'), retData.tfInfo)
        common.initSelect2($('#show_flag'), retData.tfInfo)
        common.initSelect2($('#menu_type'), retData.MTypeInfo)
        common.reSizeCall()
        console.log('init success')
        callback()
    }, (response) => {
        console.log('init error')
        common.dealErrorCommon(obj, response)
    })
}

export default {
    data: function() {
        return {
            pagePara: {},
            workRow: {
                menu_icon: ''
            },
            oldRow: {}
        }
    },
    name: 'menuControl',
    mounted: function() {
        let _self = this

        function initTable() {
            window.tableEvents = {
                'click .showChild': function(e, value, row, index) {
                    let $menuTable = $('#table')
                    let iconTarget = $(e.currentTarget)
                    let parentMenuID = iconTarget.find('i').first().text()
                    let tableData = $menuTable.bootstrapTable('getData')
                    if (iconTarget.hasClass('glyphicon-minus')) {
                        iconTarget.removeClass('glyphicon-minus').addClass('glyphicon-plus')
                        for (let indexH = 0; indexH < tableData.length; indexH++) {
                            if (tableData[indexH].f_menu_id === parseInt(parentMenuID)) {
                                $menuTable.bootstrapTable('hideRow', {
                                    index: indexH
                                })
                            }
                        }
                    } else {
                        iconTarget.removeClass('glyphicon-plus').addClass('glyphicon-minus')
                        for (let indexE = 0; indexE < tableData.length; indexE++) {
                            if (tableData[indexE].f_menu_id === parseInt(parentMenuID)) {
                                $menuTable.bootstrapTable('showRow', {
                                    index: indexE
                                })
                            }
                        }
                    }
                    $menuTable.bootstrapTable('resetView')
                }
            }

            function menuNameFormatter(value, row) {
                let formatValue = ''
                if (row.menu_type === '00') {
                    formatValue = '<span class="glyphicon glyphicon-minus showChild"><i class="hidden">' + row.menu_id + '</i></span>' + value
                } else {
                    formatValue = '<span class="indent"></span><span class="indent"></span>' + value
                }
                return formatValue
            }

            function iconDisplayFormatter(value, row) {
                return '<i class="fa fa-fw ' + row.iconSource + '"></i>'
            }

            function typeFormatter(value, row) {
                for (let i = 0; i < _self.pagePara.MTypeInfo.length; i++) {
                    if (_self.pagePara.MTypeInfo[i].id === value) {
                        return _self.pagePara.MTypeInfo[i].text
                    }
                }
                return ''
            }

            function authFormatter(value, row) {
                for (let i = 0; i < _self.pagePara.authInfo.length; i++) {
                    if (_self.pagePara.authInfo[i].id === value) {
                        return _self.pagePara.authInfo[i].text
                    }
                }
                return ''
            }

            function showFormatter(value, row) {
                for (let i = 0; i < _self.pagePara.tfInfo.length; i++) {
                    if (_self.pagePara.tfInfo[i].id === value) {
                        return _self.pagePara.tfInfo[i].text
                    }
                }
                return ''
            }

            $('#table').bootstrapTable({
                height: common.getTableHeight(),
                columns: [{
                        field: 'menu_name',
                        align: 'left',
                        title: '菜单名',
                        formatter: menuNameFormatter,
                        events: tableEvents,
                    },
                    common.BTRowFormatWithFormatter('menu_type', '菜单类型', typeFormatter),
                    common.BTRowFormatWithFormatter('auth_flag', '权限校验', authFormatter),
                    common.BTRowFormat('menu_path', '功能路径'),
                    common.BTRowFormat('menu_icon', '菜单图标'),
                    common.BTRowFormatWithFormatter('show_flag', '是否显示', showFormatter),
                    common.BTRowFormatWithFormatter('domain_flag', '是否按机构控制', showFormatter),
                    common.BTRowFormat('menu_index', '显示序号')
                ],
                showRefresh: true,
                onClickRow: function(row, $element) {
                    _self.workRow = JSON.parse(JSON.stringify(row))
                    _self.oldRow = JSON.parse(JSON.stringify(row))
                    $('#f_menu_id').val([row.f_menu_id]).trigger('change')
                    $('#auth_flag').val([row.auth_flag]).trigger('change')
                    $('#show_flag').val([row.show_flag]).trigger('change')
                    $('#domain_flag').val([row.domain_flag]).trigger('change')
                    $('#menu_type').val([row.menu_type]).trigger('change')
                },
                onRefresh: function() {
                    getData(_self)
                },
                formatLoadingMessage: function() {
                    return '请稍等，正在加载中...'
                },
                formatNoMatches: function() {
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
                onClickRow: function(row, $element) {
                    _self.workRow.menu_icon = row.iconSource
                    $('#modalTable').modal('hide')
                },
                formatLoadingMessage: function() {
                    return '请稍等，正在加载中...'
                },
                formatNoMatches: function() {
                    return '无符合条件的记录'
                }
            })
            common.changeTableClass($('#table'))
            common.changeTableClass($('#iconTable'))
        }

        $(function() {
            initPage(_self, function() {
                initTable()
                getData(_self)
                common.reSizeCall()
            })
        })
    },
    methods: {
        addMu: function(event) {
            let _self = this
            let f_menu_id = $('#f_menu_id').val()
            if (f_menu_id) {
                _self.workRow.f_menu_id = f_menu_id[0]
            }
            let auth_flag = $('#auth_flag').val()
            if (auth_flag) {
                _self.workRow.auth_flag = auth_flag[0]
            }
            let show_flag = $('#show_flag').val()
            if (show_flag) {
                _self.workRow.show_flag = show_flag[0]
            }
            let domain_flag = $('#domain_flag').val()
            if (domain_flag) {
                _self.workRow.domain_flag = domain_flag[0]
            }
            let menu_type = $('#menu_type').val()
            if (menu_type) {
                _self.workRow.menu_type = menu_type[0]
            }

            this.$http.post(apiUrl + 'add', this.workRow).then((response) => {
                initPage(_self)
                getData(_self)
                _self.workRow = {}
                console.log('add success')
            }, (response) => {
                console.log('add error')
                common.dealErrorCommon(this, response)
            })
        },
        modifyMu: function(event) {
            let _self = this
            if(!_self.workRow.menu_name){
                common.dealPromptCommon('请填写菜单名')
                return
            }

            if (!common.selectCheck(_self, 'f_menu_id', '请选择父菜单')) return
            if (!common.selectCheck(_self, 'auth_flag', '请选择权限校验')) return
            if (!common.selectCheck(_self, 'domain_flag', '请选择是否按机构控制')) return
            if (!common.selectCheck(_self, 'show_flag', '是否显示 ')) return
            this.$http.post(apiUrl + 'modify', {
                'old': _self.oldRow,
                'new': _self.workRow
            }).then((response) => {
                initPage(_self)
                getData(_self)
                console.log('modify success')
            }, (response) => {
                console.log('modify error')
                common.dealErrorCommon(this, response)
            })
        },
        deleteMu: function(event) {
            let _self = this
            common.dealConfrimCommon(' 有子项时请先清楚子项', function() {
                _self.$http.post(apiUrl + 'delete', _self.workRow).then((response) => {
                    initPage(_self)
                    getData(_self)
                    _self.workRow = {}
                    console.log('delete success')
                }, (response) => {
                    console.log('delete error')
                    common.dealErrorCommon(_self, response)
                })
            })
        },
        showIcon: function(event) {
            let data = require('../../components/data/icon.json')
            $('#modalTable').on('shown.bs.modal', function() {
                $('#iconTable').bootstrapTable('load', {
                    data: data
                })
            })
        },
        showChild: function(event) {
            let $menuTable = $('#table')
            let iconTarget = $(event.currentTarget)
            let parentMenuID = parseInt(iconTarget.find('i').first().text())
            let tableData = $menuTable.bootstrapTable('getData')
            if (iconTarget.hasClass('glyphicon-minus')) {
                iconTarget.removeClass('glyphicon-minus').addClass('glyphicon-plus')
                for (let indexH = 0; indexH < tableData.length; indexH++) {
                    if (tableData[indexH].f_menu_id === parentMenuID) {
                        $menuTable.bootstrapTable('hideRow', {
                            index: indexH
                        })
                    }
                }
            } else {
                iconTarget.removeClass('glyphicon-plus').addClass('glyphicon-minus')
                for (let indexE = 0; indexE < tableData.length; indexE++) {
                    if (tableData[indexE].f_menu_id === parentMenuID) {
                        $menuTable.bootstrapTable('showRow', {
                            index: indexE
                        })
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
