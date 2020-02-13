import Home from '../view/Home/Home';
import Router from 'vue-router';
import Login from '../view/Login/Login';
import loginStorage from '../utils/loginStorage';

const routes = [
  { path: '/home', component: Home },
  {
    path: '/show_log',
    component: resolve => require(['../view/ShowLog/showLog.vue'], resolve),
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/admin',
    component: resolve => require(['../view/Admin/Admin.vue'], resolve),
    children: [
      {
        path: 'user',
        component: resolve => require(['../view/Admin/User.vue'], resolve),
      },
      {
        path: 'admin_log',
        component: resolve => require(['../view/Admin/AdminLog.vue'], resolve),
      },
      {
        path: 'Attendance',
        component: resolve => require(['../view/Admin/User.vue'], resolve),
      },
      {
        path: '/',
        redirect: 'admin_log',
      },
    ],
  },
];
const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, form, next) => {
  if (to.path === '/' || to.path === '/home' || to.path === '/show_log') {
    if (loginStorage.isLogin()) {
      const loginStauts = JSON.parse(window.localStorage.getItem('login'));
      loginStauts.topbarShow = true;
      window.localStorage.setItem('login', JSON.stringify(loginStauts));
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
