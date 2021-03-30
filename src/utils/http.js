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
import { Message, MessageBox } from 'element-ui'
import route from '@/router'
// 设置axios请求默认配置
const serve = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api的base_url前缀
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
				// 没有登录
				if (res.data.code === -1) {
					// 返回 401 清除token信息并跳转到登录页面
					MessageBox.confirm('进行登录后才能操作哦！', '确定', {
					  confirmButtonText: '确定',
					  showCancelButton: false,
					  closeOnClickModal: false,
					  showClose: false,
					  closeOnPressEscape: false,
					  center: true,
					  type: 'warning'
					}).then(() => {
						route.push('/login')
					})
				} else {
					Message({
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
			    MessageBox.confirm('您登录时间过长，请重新返回登录页面进行登录', '确定登出', {
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
        return Promise.reject(error) // 返回接口返回的错误信息
    }
)

export default serve
