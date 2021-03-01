/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2020-12-21 21:29:35
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
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/'),
        meta: {
            keepAlive: true
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
        path: '/self',
        name: 'self',
        component: () => import(/* webpackChunkName: "chunk-all" */ '../views/selfInfo')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
