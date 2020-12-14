/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2020-11-21 11:36:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import('element-ui').then(ele => {
    Vue.use(ele)
})
import('element-ui/lib/theme-chalk/index.css')

// 引入全局组件Header
import Header from '@/components/Header'
Vue.component('Header', Header)

// 引入 iconfont
import '@/assets/font/iconfont.css'
import 'highlight.js/styles/atom-one-dark.css'
import '@/style/normalize.scss'
import '@/style/prism.css'

// 高亮富文本
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)
Vue.directive('highlight', function(el) {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
        hljs.highlightBlock(block)
    })
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
