/*
 * @Author: your name
 * @Date: 2020-11-12 16:56:17
 * @LastEditTime: 2020-11-12 17:03:00
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
    if (!isScroll()) return
    // 滚动的距离
    const scrollTop = Math.ceil(
        document.documentElement.scrollTop ||
            document.body.scrollTop ||
            window.pageYOffset
    )
    // 窗口高度
    const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight
    // 滚动的高度
    const scrollHeight =
        document.documentElement.scrollHeight ||
        document.body.scrollHeight ||
        window.scrollHeight
    if (scrollTop + windowHeight >= scrollHeight) {
        console.log(scrollTop, windowHeight, scrollHeight)
        callback()
    }
}

// 节流滚动方法
const throttleScroll = (isScroll, callback) =>
    throttle(scrollChange.bind(null, isScroll, callback))
