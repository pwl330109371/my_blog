/*
 * @Author: pwl
 * @Date: 2020-11-12 18:08:41
 * @LastEditTime: 2020-11-12 18:09:30
 * @LastEditors: Please set LastEditors
 * @Description: cookie sessionStrong 封装
 * @FilePath: \my_blog\src\utils\auth.js
 */
import Cookies from 'js-cookie'

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
    return typeof value === 'object'
        ? sessionStorage.setItem(key, JSON.stringify(value))
        : sessionStorage.setItem(key, JSON.stringify(`${value}`))
}

// 删除sessionStorage
export function removeSessionStorage(key) {
    return sessionStorage.removeItem(key)
}
