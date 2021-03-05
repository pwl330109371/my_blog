/*
 * @文件描述: 请求配置
 * @作者: L
 * @Date: 2020-09-25
 * @LastEditors: Peng wenlei
 * @LastEditTime: 2021-03-05 22:19:55
 * @Author: L
 */
import axios from 'axios'
import { getCookie } from '@/utils/auth'
import { Message } from 'element-ui'
// import route from '@/router'
// 设置axios请求默认配置
const serve = axios.create({
    baseURL: '', // api的base_url前缀
    // baseURL: 'localhost:3000/api/', // api的base_url前缀
    timeout: 1000 * 30 // 请求超时
})

// request拦截器 请求前的拦截器
serve.interceptors.request.use(
    config => {
        if (getCookie('token')) {
            config.headers.Authorization = getCookie('token')
        }
        console.log(config.method.toLowerCase())

        return config
    },
    error => {
        Promise.reject(error)
    }
)

// axios响应拦截
serve.interceptors.response.use(
    response => {
        const res = response
        if (res.status === 200) {
            if (res.data.code === 200) {
                return res.data
            } else {
                Message({
                    type: 'error',
                    message: res.data.msg,
                    offset: 60
                })
            }
        } else {
            Message({
                type: 'error',
                message: res.msg,
                offset: 60
            })
            return Promise.reject(res.msg || 'Error')
        }
    },
    error => {
        if (error.response) {
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            Message({
                type: 'error',
                message: '登陆已过期,请重新登陆',
                offset: 60
            })
        }
        return Promise.reject(error) // 返回接口返回的错误信息
    }
)

export default serve
