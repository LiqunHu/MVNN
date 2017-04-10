<template>
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
        <li><a href="#">error</a></li>
        <li class="active">{{ errCode }} error</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="error-page">
        <h2 class="headline text-yellow"> {{ errCode }}</h2>

        <div class="error-content">
          <h3><i class="fa fa-warning text-yellow"></i> {{ errMsg }}</h3>

          <p>
            We could not find the page you were looking for.
            Meanwhile, you may <a href="../../index.html">return to dashboard</a> or try using the search form.
          </p>

          <form class="search-form">
            <div class="input-group">
              <input type="text" name="search" class="form-control" placeholder="Search">

              <div class="input-group-btn">
                <button type="submit" name="submit" class="btn btn-warning btn-flat"><i class="fa fa-search"></i>
                </button>
              </div>
            </div>
            <!-- /.input-group -->
          </form>
        </div>
        <!-- /.error-content -->
      </div>
      <!-- /.error-page -->
    </section>
    <!-- /.content -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default{
  name: 'errpage',
  computed: mapGetters({
    errCode: 'errCode',
    errMsg: 'errMsg'
  })
}
</script>
</style>
