/*
 * @Author: pwl
 * @Date: 2020-11-12 18:08:41
 * @LastEditTime: 2021-03-05 22:01:07
 * @LastEditors: Peng wenlei
 * @Description: cookie sessionStrong 封装
 * @FilePath: \my_blog\src\utils\auth.js
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

// 获取cookie
export function getCookie(name) {
    return Cookies.get(name)
}

// 设置cookie
export function setCookie(name, value) {
    return Cookies.set(name, value)
}

// 删除cookie
export function removeCookie(name) {
    return Cookies.remove(name)
}

// 获取sessionStorage
export function getSessionStorage(item) {
    return JSON.parse(sessionStorage.getItem(item))
}

// 设置sessionStorage
export function setSessionStorage(key, value) {
    return typeof value === 'object' ? sessionStorage.setItem(key, JSON.stringify(value)) : sessionStorage.setItem(key, JSON.stringify(`${value}`))
}

// 删除sessionStorage
export function removeSessionStorage(key) {
    return sessionStorage.removeItem(key)
}
