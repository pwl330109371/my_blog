/*
 * @Author: your name
 * @Date: 2020-11-12 16:56:17
 * @LastEditTime: 2021-04-14 18:28:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\utils\index.js
 */
import { Message } from 'element-ui'
export function debounce(fn, delays) {
    var delay = delays || 200
    var timer
    return function() {
        var th = this
        var args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function() {
            timer = null
            fn.apply(th, args)
        }, delay)
    }
}

export function throttle(fn) {
    var last
    var timer
    var interval = interval || 200
    return function() {
        var th = this
        var args = arguments
        var now = +new Date()
        if (last && now - last < interval) {
            clearTimeout(timer)
            timer = setTimeout(function() {
                last = now
                fn.apply(th, args)
            }, interval)
        } else {
            last = now
            fn.apply(th, args)
        }
    }
}

export async function valiFunc(arr) {
    let res = true
    for (let item of arr) {
        if (!item.data || item.data.length === 0) {
            res = false
            Message({
                message: item.msg,
                type: 'error',
                offset: 60
            })
            break
        }
    }
    return res
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

export function formatDate(date, format) {
    console.log(format)
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
    if (typeof format === 'string') format = isMac ? format.replace(/-/g, '/').replace(/\./g, '/') : format // 兼容safari
    var dateObj = new Date(date)
    var year = dateObj.getFullYear()
    var month = dateObj.getMonth() + 1
    var day = dateObj.getDate()
    var hour = dateObj.getHours()
    var minute = dateObj.getMinutes()
    var second = dateObj.getSeconds()
    var formatStr = format || 'yyyy/MM/dd hh:mm:ss'
    console.log(formatStr)

    return formatStr
        .replace(/yyyy/g, year)
        .replace(/MM/g, ('0' + month).slice(-2))
        .replace(/dd/g, ('0' + day).slice(-2))
        .replace(/hh/g, ('0' + hour).slice(-2))
        .replace(/mm/g, ('0' + minute).slice(-2))
        .replace(/ss/g, ('0' + second).slice(-2))
}

// 滚动监听
export function bottomHandle(isScroll, callback) {
    // window.onscroll = throttle(scrollChange.bind(null, isScroll, callback), 200)
    window.addEventListener('scroll', throttleScroll(isScroll, callback), 200)
}

// 清除滚动监听
export function clearBottomHandle() {
    window.removeEventListener('scroll', throttleScroll)
}

function scrollChange(isScroll, callback) {
    if (!isScroll) return
    // 滚动的距离
    const scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset)
    // 窗口高度
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    // 滚动的高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || window.scrollHeight
    if (scrollTop + windowHeight >= scrollHeight) {
        console.log(scrollTop, windowHeight, scrollHeight)
        callback()
    }
}

// 节流滚动方法
const throttleScroll = (isScroll, callback) => throttle(scrollChange.bind(null, isScroll, callback))
