<template>
  <div>
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> template</a></li>
        <li class="active">template</li>
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
const common = require('commonFunc')
const apiUrl = '....'

export default {
  data: function () {
    return {
      pagePara: '',
    }
  },
  name: 'template',
  mounted: function () {
    let _self = this

    function initPage () {
        common.reSizeCall()
    }

    initPage()
  },
  methods: {
    example: function (event) {
    }
  }
}
</script>
<style scoped>
</style>
