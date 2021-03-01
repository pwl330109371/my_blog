/*
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @LastEditTime: 2021-03-01 22:19:56
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {
        /**
         * 把日期变成 月份 哪一天 年份
         */
        async dataHandle(state, result) {
            const arr = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            let [y, m, other] = result.createdAt.split('-')
            const d = other.split(' ')[0]
            m = arr[parseInt(m)]
            const resultDate = [y, m, d]
            const keys = ['year', 'month', 'day']
            resultDate.forEach((item, index) => (result[keys[index]] = resultDate[index]))
            return result
        }
    },
    modules: {}
})
