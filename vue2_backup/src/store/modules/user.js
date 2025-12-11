/*
 * @Author: pwl
 * @Date: 2021-01-27 10:43:21
 * @LastEditTime: 2025-12-10 10:12:00
 * @LastEditors: Vue 3 Migration
 * @Description: User store - Pinia version
 * @FilePath: /my_blog/src/store/modules/user.js
 */
import { defineStore } from 'pinia'
import { login, register, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.token || getToken() || null,
        userId: '',
        userInfo: null
    }),

    actions: {
        resetState() {
            this.token = null
            this.userId = ''
            this.userInfo = null
        },

        setToken(token) {
            this.token = token
        },

        setUserId(userId) {
            this.userId = userId
        },

        setUserInfo(userInfo) {
            this.userInfo = userInfo
        },

        // user login
        async login(userInfo) {
            const { username, password } = userInfo
            try {
                const response = await login({ userName: username.trim(), password })
                const { data } = response
                this.setToken(data.token)
                this.setUserId(data.userId)
                localStorage.token = data.token
                setToken(data.token)
                return data.userId
            } catch (error) {
                throw error
            }
        },

        // user register
        async register(userInfo) {
            const { username, password } = userInfo
            try {
                const data = await register({ userName: username.trim(), password: password, gender: 1 })
                return data
            } catch (error) {
                throw error
            }
        },

        // get user info
        async getInfoFun() {
            try {
                const response = await getInfo(this.userId)
                const { data } = response
                if (!data) {
                    throw new Error('Verification failed, please Login again.')
                }
                this.setUserInfo(data)
                return data
            } catch (error) {
                throw error
            }
        },

        // user logout
        async logout() {
            removeToken()
            this.resetState()
        },

        // remove token
        async resetToken() {
            removeToken()
            this.resetState()
        }
    }
})
