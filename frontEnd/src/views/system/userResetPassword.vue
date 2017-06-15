<template>
    <div>
        <section class="content-header">
          <ol class="breadcrumb">
            <li><a href="#"><i class="fa fa-dashboard"></i> 系统管理</a></li>
            <li class="active">重置用户密码</li>
          </ol>
        </section>
        <section class="content" style="display:none;">
          <div class="col-lg-12">
            <div class="box box-info">
              <div class="box-body">
                  <div id="toolbar">
                      <div class="form-inline">
                          <div class="form-group" style="width:200px">
                              <select class="form-control select2" multiple id="username"> </select>
                          </div>
                          <div class="form-group">
                              <button id="modify" class="btn btn-success" v-on:click="resetOn">
                                  <i class="glyphicon glyphicon-saved"></i>重置密码
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </section>
        <div class="modal fade" id="ResetModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">重置操作员密码</h4>
                    </div>
                    <div class="modal-body" id="formA">
                        <div class="form-group">
                            <label>新密码</label>
                            <input class="form-control" id="newPassword">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" v-on:click="resetOp"><i
                                class="fa fa-fw fa-plus"></i>提交
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import $ from 'jquery'
    const common = require('commonFunc');
    const CryptoJS = require('crypto-js');
    const apiUrl = '/api/system/resetPassword?method=';
    export default{
        data: function () {
            return {
                pagePara: {},
                rowData: {},
                oldRow: ''
            }
        },
        name: 'resetPassword',
        mounted: function () {
            let _self = this;

            function initPage() {
                _self.$http.post(apiUrl + 'search', {}).then((response) => {
                    let retData = response.data.info;
                    _self.pagePara = $.extend(true, {}, retData);
                    common.initSelect2($('#username'), retData);
                    common.reSizeCall();
                    console.log('init success');
                }, (response) => {
                    console.log('init error');
                    common.dealErrorCommon(_self, response);
                })
            }

            $(function () {
                initPage();
            });
        },
        methods: {
            resetOn: function (event) {
                let _self = this;
                if ($("#username").val())
                    $('#ResetModal').modal('show');
                else return common.dealPromptCommon('请选择用户');
            },
            resetOp: function (event) {
                let _self = this;
                let newPassword = $("#newPassword").val();
                if (newPassword)
                    _self.$http.post(apiUrl + 'reset', {
                        user_id: $("#username").val().toString(),
                        password: newPassword.toString()
                    }).then((response) => {
                        common.dealSuccessCommon('修改成功');
                        $('#ResetModal').modal('hide');
                    }, (response) => {
                        console.log('add error');
                        common.dealErrorCommon(_self, response)
                    });
                else return common.dealPromptCommon('请输入密码');
            }
        }
    }
</script>
<style scoped>
</style>
