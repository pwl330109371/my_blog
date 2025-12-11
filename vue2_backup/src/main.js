/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2025-12-10 10:12:00
 * @LastEditors: Vue 3 Migration
 * @Description: Main entry file for Vue 3
 * @FilePath: /my_blog/src/main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入全局组件Header
import Header from '@/components/Header'
import SvgIcon from '@/components/SvgIcon'

// 引入 iconfont
import '@/assets/font/iconfont.css'
import 'virtual:svg-icons-register' // SVG icons

// 富文本渲染主题样式
import 'highlight.js/styles/atom-one-dark.css'
import '@/style/index.scss'
import '@/style/prism.css'

// 高亮富文本
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)

// 创建应用实例
const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 注册全局组件
app.component('Header', Header)
app.component('SvgIcon', SvgIcon)

// 注册自定义指令 - Vue 3 directive API
app.directive('highlight', {
    mounted(el) {
        let blocks = el.querySelectorAll('pre code')
        blocks.forEach(block => {
            hljs.highlightElement(block) // Vue 3 + highlight.js v11 API
        })
    },
    updated(el) {
        let blocks = el.querySelectorAll('pre code')
        blocks.forEach(block => {
            hljs.highlightElement(block)
        })
    }
})

// 使用插件
app.use(ElementPlus)
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')

