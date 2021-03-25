/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2021-03-25 21:07:29
 * @LastEditors: Peng wenlei
 * @Description:router 路由配置
 * @FilePath: \my_blog\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'indexPage',
        component: () => import(/* webpackChunkName: "about" */ '../views/indexPage/'),
        meta: {
            keepAlive: true,
            title: '从前慢的时光驿站'
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/'),
        meta: {
            keepAlive: true,
            title: '首页'
        }
    },
    {
        path: '/articleList',
        name: 'ArticleList',
        component: () => import(/* webpackChunkName: "about" */ '../views/article/')
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        component: () => import(/* webpackChunkName: "about" */ '../views/article/detail')
    },
    {
        path: '/wode',
        name: 'Wode',
        component: () => import(/* webpackChunkName: "about" */ '../views/wode/'),
        meta: {
            keepAlive: true,
            title: '关于作者'
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "about" */ '../views/setting/'),
        meta: {
            keepAlive: true,
            title: '编辑信息'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ '../views/login/'),
        meta: {
            keepAlive: true,
            title: '登录注册'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
