<template>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img :src="userinfo['headImg']" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{ userinfo['groupName'] }}</p>
          <a href="#"><i class="fa fa-circle text-success"></i> {{ userinfo['name'] }}</a>
        </div>
      </div>
      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu">
        <li class="header">主菜单</li>
        <template v-for="item in userinfo['menulist']">
          <li class="treeview">
            <template v-if="item.menuType === '01'">
              <router-link to="item.menuPath">
                <i v-bind:class="'fa ' + item.menuIcon "></i> <span>{{ item.menuName }}</span>
                <span class="pull-right-container">
                  <small class="label pull-right bg-green">new</small>
                </span>
              </router-link>
            </template>
            <template v-if="item.menuType === '00'">
              <a href="#">
                <i :class="'fa ' + item.menuIcon"></i> <span> {{ item.menuName }}</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <template v-for="sItem in item.subMenu">
                  <li><router-link :to="sItem.menuPath"><i class="fa fa-circle-o"></i> {{ sItem.menuName }}</router-link></li>
                </template>
              </ul>
            </template>
          </li>
        </template>
      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
export default {
  name: 'mainMenu',
  data: function () {
    return {
      userinfo: common.getStoreData('userinfo')
    }
  },
  mounted: function () {
    console.log('mainMenu created!')
  }
}
</script>
<style>
</style>
