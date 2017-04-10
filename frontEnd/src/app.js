var Vue = require('vue')
var VueResource = require('vue-resource')
var appEntry = require('./main')
var common = require('commonFunc')
import 'babel-polyfill'
import { mapGetters, mapActions } from 'vuex'
import router from './routes';
import store from './store'
import $ from 'jquery'

router.beforeEach(function(to, from, next) {
  const toPath = to.path
  const fromPath = from.path
  // console.log('to: ' + toPath + ' from: ' + fromPath)
  // console.log('to: ' + toPath.replace('.html', ''))
  var token = common.getStoreData('token')
  if (typeof (token) !== 'string') {
    if (toPath !== '/login') {
      next('/login')
    }
  }
  next()
})

router.afterEach(route => {
  console.log(`成功浏览到: ${route.path}`)
})

// Resource
Vue.use(VueResource)

Vue.http.options.root = '/root'
Vue.http.headers.common['Content-Type'] = 'application/json'

Vue.http.interceptors.push((request, next) => {
  $('.btn').addClass('disabled')
  var token = common.getStoreData('token')
  if (typeof (token) === 'string') {
    Vue.http.headers.common['authorization'] = token
  }

  // continue to next interceptor
  next((response) => {
    $('.btn').removeClass('disabled')
  })
})

var eventHub = new Vue()
window.eventHub = eventHub


// inject a handler for `myOption` custom option
Vue.mixin({
  methods: mapActions([
    'setError'
  ])
})

const app = new Vue({
  router,
  store,
  render: h => h(appEntry)
}).$mount('#app')
