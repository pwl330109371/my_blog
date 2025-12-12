import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        // 不在 state 初始化时调用 composable，改为在 hydrate 或 action 中获取
        token: null as string | null,
        userId: '',
        userInfo: null as any
    }),

    // Nuxt 3/4 Pinia 插件支持 hydrate，用于 SSR 时同步 cookie
    hydrate(state) {
        // 只在客户端执行时从 cookie 读取 token
        if (import.meta.client) {
            const cookie = useCookie('token')
            state.token = cookie.value || null
        }
    },

    actions: {
        // 初始化时调用，从 cookie 读取 token
        initToken() {
            const cookie = useCookie('token')
            this.token = cookie.value || null
        },

        setToken(token: string) {
            const cookie = useCookie('token')
            cookie.value = token
            this.token = token
        },

        setUserId(userId: string) {
            this.userId = userId
        },

        setUserInfo(userInfo: any) {
            this.userInfo = userInfo
        },

        async login(userInfo: any) {
            const { username, password } = userInfo
            try {
                const { data, error } = await useApi('/users/login', {
                    method: 'POST',
                    body: { userName: username.trim(), password }
                })

                if (error.value) throw error.value

                const res = data.value as any
                if (res && res.data) {
                    this.setToken(res.data.token)
                    this.setUserId(res.data.userId)
                    return res.data.userId
                }
            } catch (error) {
                throw error
            }
        },

        async register(userInfo: any) {
            const { username, password } = userInfo
            try {
                const { data, error } = await useApi('/users/register', {
                    method: 'POST',
                    body: { userName: username.trim(), password, gender: 1 }
                })
                if (error.value) throw error.value
                return data.value
            } catch (error) {
                throw error
            }
        },

        async getInfo() {
            try {
                // Assuming getInfo endpoint exists or using generic user info endpoint
                // Original was getInfo(this.userId)
                const { data, error } = await useApi(`/users/getUserInfo?userId=${this.userId}`)
                if (error.value) throw error.value

                const res = data.value as any
                if (res && res.data) {
                    this.setUserInfo(res.data)
                    return res.data
                } else {
                    throw new Error('Verification failed')
                }
            } catch (error) {
                throw error
            }
        },

        logout() {
            const cookie = useCookie('token')
            cookie.value = null
            this.token = null
            this.userId = ''
            this.userInfo = null
        }
    }
})
