<template>
  <div>
    <main-header></main-header>
    <main-sidebar></main-sidebar>
    <div class="content-wrapper"><router-view></router-view></div>
  </div>
</template>
<script>
import $ from 'jquery'
var common = require('commonFunc')
var Store = require('store')
import mainHeader from './main/mainHeader'
import mainSidebar from './main/mainSidebar'
export default {
  name: 'mainSystem',
  components: { mainHeader, mainSidebar },
  mounted: function () {
    require('../assets/js/app.js')
    require('../assets/js/init.js')
  }
}
</script>
<style>
</style>
