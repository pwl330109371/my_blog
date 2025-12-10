/*
 * @文件描述: Axios 请求配置
 * @作者: Peng wenlei
 * @Date: 2020-09-25
 * @LastEditTime: 2025-12-10 10:50:00
 * @LastEditors: Vue 3 Migration
 */
import axios from 'axios'
import { getCookie } from '@/utils/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import route from '@/router'

/**
 * 创建 axios 实例
 * 注意：Vite 中使用 import.meta.env 而不是 process.env
 * vite.config.js 中已配置 /api 代理，所以这里直接使用 /api
 */
const serve = axios.create({
    baseURL: '/api', // API 基础路径，会被 vite proxy 代理
    timeout: 1000 * 30 // 请求超时时间：30秒
})

/**
 * 请求拦截器
 * 在请求发送前添加 token
 */
serve.interceptors.request.use(
    config => {
        if (getCookie('token')) {
            config.headers.Authorization = getCookie('token')
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

/**
 * 响应拦截器
 * 统一处理响应和错误
 */
serve.interceptors.response.use(
    response => {
        const res = response
        if (res.status === 200) {
            if (res.data.code === 200) {
                return res.data
            } else {
                // 未登录状态
                if (res.data.code === -1) {
                    ElMessageBox.confirm('进行登录后才能操作哦！', '确定', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        closeOnClickModal: false,
                        showClose: false,
                        closeOnPressEscape: false,
                        center: true,
                        type: 'warning'
                    }).then(() => {
                        const path = route.currentRoute.value.fullPath
                        route.push('/login?redirect=' + path)
                    })
                } else {
                    ElMessage({
                        type: 'error',
                        message: res.data.msg,
                        offset: 60
                    })
                }
            }
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    ElMessageBox.confirm('您登录时间过长，请重新返回登录页面进行登录', '确定登出', {
                        confirmButtonText: '重新登录',
                        showCancelButton: false,
                        closeOnClickModal: false,
                        showClose: false,
                        closeOnPressEscape: false,
                        type: 'warning'
                    }).then(() => {
                        route.push('/login')
                    })
                    break
            }
        }
        return Promise.reject(error)
    }
)

export default serve
