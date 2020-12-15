/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2020-12-15 22:58:34
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
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
