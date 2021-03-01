/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
<<<<<<< HEAD
 * @LastEditTime: 2021-03-01 21:46:10
 * @LastEditors: Peng wenlei
=======
 * @LastEditTime: 2021-03-01 18:27:12
 * @LastEditors: Please set LastEditors
>>>>>>> 567bd84578935c65aa58cf42edc80fe5c0c51017
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
        path: '/wode',
        name: 'Wode',
        component: () => import(/* webpackChunkName: "about" */ '../views/wode/')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
