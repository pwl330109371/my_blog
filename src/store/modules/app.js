/*
 * @Description: app store
 * @Author: Peng wenlei
 * @Date: 2021-03-05 21:04:55
 * @LastEditTime: 2021-03-05 21:06:15
 * @LastEditors: Peng wenlei
 */
const state = {
    device: 'desktop'
}

const mutations = {
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    }
}

const actions = {
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
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
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
