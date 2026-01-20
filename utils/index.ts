import { ElMessage } from 'element-plus'

export function debounce(fn: Function, delays?: number) {
    const delay = delays || 200
    let timer: any
    return function (this: any, ...args: any[]) {
        const th = this
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            timer = null
            fn.apply(th, args)
        }, delay)
    }
}

export function throttle(fn: Function, interval?: number) {
    let last: number
    let timer: any
    const _interval = interval || 200
    return function (this: any, ...args: any[]) {
        const th = this
        const now = +new Date()
        if (last && now - last < _interval) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                last = now
                fn.apply(th, args)
            }, _interval)
        } else {
            last = now
            fn.apply(th, args)
        }
    }
}

export const formatDate = (dateStr: string) => {
    if (!dateStr) return {}
    const arr = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    // Handle simplified handling or full parsing depending on input
    // If input is not YYYY-MM-DD format, this might fail.
    // Original code relied on simple splitting.
    if (dateStr.includes('-')) {
        let [y, m, other] = dateStr.split('-')
        const d = other ? other.split(' ')[0] : '01'
        const monthIndex = Number.parseInt(m || '0', 10)
        m = arr[monthIndex] || ''
        return {
            year: y,
            month: m,
            day: d
        }
    }
    return { year: '', month: '', day: '' }
}

export async function valiFunc(arr: any[]) {
    let res = true
    for (const item of arr) {
        if (!item.data || item.data.length === 0) {
            res = false
            ElMessage({
                message: item.msg,
                type: 'error',
                offset: 60
            })
            break
        }
    }
    return res
}

export function parseTime(time: any, cFormat?: string) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date: Date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string' || typeof time === 'number') && ('' + time).length === 10) time = parseInt(time as string) * 1000
        date = new Date(time)
    }
    const formatObj: any = {
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

export function formatTime(time: any, option?: string) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d.getTime()) / 1000

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
        return (d.getMonth() + 1) + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

// 滚动监听
let bottomScrollListener: ((e: Event) => void) | null = null

export function bottomHandle(isScroll: boolean | (() => boolean), callback: Function) {
    if (typeof window === 'undefined') return
    clearBottomHandle()
    const getIsScroll = typeof isScroll === 'function' ? isScroll : () => isScroll
    const listener = throttle(() => {
        scrollChange(getIsScroll(), callback)
    }, 200) as (e: Event) => void
    bottomScrollListener = listener
    window.addEventListener('scroll', listener, { passive: true })
}

// 清除滚动监听
export function clearBottomHandle() {
    if (typeof window === 'undefined') return
    if (!bottomScrollListener) return
    window.removeEventListener('scroll', bottomScrollListener)
    bottomScrollListener = null
}

function scrollChange(isScroll: boolean, callback: Function) {
    if (!isScroll) return
    // 滚动的距离
    const scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset)
    // 窗口高度
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    // 滚动的高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    // @ts-ignore
    if (scrollTop + windowHeight >= scrollHeight) {
        callback()
    }
}
