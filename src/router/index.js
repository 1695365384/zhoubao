import Home from '../view/Home/Home'
import Router from 'vue-router'

const routes = [
  { path: '/home', component: Home },
  { path: '/showLog', component: resolve => require(['../view/ShowLog/showLog.vue'], resolve) },
  { path: '/admin', component: resolve => require(['../view/Admin/Admin.vue'], resolve) },
  { path: '/', component: resolve => require(['../view/Home/Home.vue'], resolve) },
  { path: '/', redirect: '/home' },
]



export default new Router({
  routes,
})