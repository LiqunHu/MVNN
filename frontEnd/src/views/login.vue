<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="/"><b>Test</b> Co.</a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">登录进入工作台</p>

      <div>
        <div class="alert alert-danger" v-bind:class="{ 'hidden': isA }">{{ errorMessage }}</div>
        <div class="form-group has-feedback">
          <input v-model="username" type="text" class="form-control" placeholder="用户名">
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input v-model="password" type="password" class="form-control" placeholder="密码">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
          <div class="col-xs-4">
            <button v-on:click="login" class="btn btn-primary btn-block btn-flat">登录</button>
          </div>
          <!-- /.col -->
        </div>
      </div>

      <div class="social-auth-links text-center">
        <p></p>
      </div>
      <!-- /.social-auth-links -->

      <a href="#">忘记密码</a><br>
      <a href="register.html" class="text-center">注册新账户</a>

    </div>
    <!-- /.login-box-body -->
  </div>
  <!-- /.login-box -->
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')

export default{
  name: 'login',
  data: function () {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isA: true
    }
  },
  mounted: function () {
    $('body').removeClass()
    $('body').addClass('hold-transition')
    $('body').addClass('login-page')
  },
  methods: {
    login: function (event) {
      var encInfo = common.aesEncryptModeCFB(this.username, this.password)
      this.$http.post('/api/auth', { username: this.username, identifyCode: encInfo[1], magicNo: encInfo[0] }).then((response) => {
        var token = response.headers.get('authorization')

        if (token) {
          common.clearStoreData()
          common.setStoreData('token', token)
          common.setStoreData('userinfo', response.data['data'])
          $('body').removeClass()
          $('body').addClass('hold-transition')
          $('body').addClass('skin-blue')
          $('body').addClass('sidebar-mini')
          this.$router.push({ path: '/system/home' })
        } else {
          this.errorMessage = '系统错误'
          this.isA = false
          common.clearStoreData()
        }
      }, (response) => {
        // error callback
        this.errorMessage = '用户名或者密码错误'
        this.isA = false
        console.log(response.status)
        console.log(response.data)
        common.clearStoreData()
      })
    }
  }
}
</script>
<style>
</style>
