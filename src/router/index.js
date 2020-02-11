import Home from '../view/Home/Home'
import Router from 'vue-router'
import Login from '../view/Login/Login'

const routes = [

    {path: '/home', component: Home},
    {
        path: '/show_log',
        component: resolve => require(['../view/ShowLog/showLog.vue'], resolve),
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/admin',
        component: resolve => require(['../view/Admin/Admin.vue'], resolve),
        children: [
            {
                path: 'user',
                component: resolve => require(['../view/Admin/User.vue'], resolve)
            },
            {
                path: 'admin_log',
                component: resolve => require(['../view/Admin/AdminLog.vue'], resolve)
            },
            {
                path: 'Attendance',
                component: resolve => require(['../view/Admin/User.vue'], resolve)
            },
            {
                path: '/',
                redirect: 'admin_log'
            },
        ]
    }
]
const router = new Router({
    mode:'history',
    routes,
})

router.beforeEach((to,form,next)=>{
    next()
})


export default router
