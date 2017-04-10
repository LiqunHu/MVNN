var Vue = require('vue')
var VueRouter = require('vue-router')

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: [
    { path: '/',                redirect: '/login' },
    { path: '/login',           component: resolve => require(['./views/login'], resolve) },
    { path: '/system',          component: resolve => require(['./components/mainSystem'], resolve),
      children: [
        { path: 'error',                  component: resolve => require(['./components/errpage'], resolve) },
        { path: 'error401',               component: resolve => require(['./components/err401'], resolve) },
        { path: 'home',                   component: resolve => require(['./views/home'], resolve) },
        { path: 'userSettingControl',     component: resolve => require(['./views/system/userSettingControl'], resolve) },
        { path: 'operatorControl',        component: resolve => require(['./views/system/operatorControl'], resolve) },
        { path: 'groupControl',           component: resolve => require(['./views/system/groupControl'], resolve) },
        { path: 'menuControl',            component: resolve => require(['./views/system/menuControl'], resolve) },
        { path: 'groupMenuControl',       component: resolve => require(['./views/system/groupMenuControl'], resolve) }
    ]},
    { path: '/example',           component: resolve => require(['./components/mainSystem'], resolve),
      children: [
        { path: 'example1',   component: resolve => require(['./views/example/example1'], resolve) },
    ]}
  ]
})
