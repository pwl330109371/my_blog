/*
 * @Author: pwl
 * @Date: 2021-01-27 10:43:21
 * @LastEditTime: 2021-03-25 21:37:11
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \vue-blog-admin\src\store\modules\user.js
 */
import { login, register, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
    return {
        token: localStorage.token || getToken() || null,
        userId: '',
        userInfo: null
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: state => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERID: (state, userId) => {
        state.userId = userId
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ userName: username.trim(), password })
                .then(response => {
                    const { data } = response
                    commit('SET_TOKEN', data.token)
                    commit('SET_USERID', data.userId)
                    localStorage.token = data.token
                    setToken(data.token)
                    resolve(data.userId)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // user register
    register({ commit }, userInfo) {
        console.log(userInfo)
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            register({ userName: username.trim(), password: password, gender: 1 })
                .then(response => {
                    const data = response
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // get user info
    getInfoFun({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.userId)
                .then(response => {
                    const { data } = response
                    console.log(data)
                    if (!data) {
                        return reject('Verification failed, please Login again.')
                    }

                    const userInfo = data

                    commit('SET_USERINFO', userInfo)
                    resolve(userInfo)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // user logout
    logout({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
