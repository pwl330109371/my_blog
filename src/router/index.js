/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2021-03-02 15:07:45
 * @LastEditors: Please set LastEditors
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
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/indexPage/'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/home/'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/articleList',
        name: 'ArticleList',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/article/')
    },
    {
        path: '/detail/:id',
        name: 'Detail',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/article/detail')
    },
    {
        path: '/wode',
        name: 'Wode',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/wode/')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
