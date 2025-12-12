import { defu } from 'defu'
import { ElMessage, ElMessageBox } from 'element-plus'

export const useApi = async <T>(url: string, options: any = {}) => {
    const config = useRuntimeConfig()
    const token = useCookie('token')
    const router = useRouter() // Use router instance

    const defaults = {
        baseURL: config.public.apiBase,
        // key: url, // Optional: key for deduplication
        headers: token.value ? { Authorization: token.value } : {},
        credentials: 'include',
        onResponse({ response }: any) {
            // Check status code from response or payload
            // Original logic: if (res.status === 200) ...
            // fetch returns the response object. _data is the body.

            const data = response._data

            if (response.status === 200) {
                if (data.code === 200) {
                    // Success
                    return data
                } else if (data.code === -1) {
                    // Not logged in
                    if (import.meta.client) {
                        ElMessageBox.confirm('进行登录后才能操作哦！', '确定', {
                            confirmButtonText: '确定',
                            showCancelButton: false,
                            type: 'warning'
                        }).then(() => {
                            const path = router.currentRoute.value.fullPath
                            router.push('/login?redirect=' + path)
                        })
                    }
                    return Promise.reject(new Error('Unauthorized'))
                } else {
                    if (import.meta.client) {
                        ElMessage({
                            type: 'error',
                            message: data.msg || 'Error',
                            offset: 60
                        })
                    }
                    return Promise.reject(new Error(data.msg))
                }
            }
        },
        onResponseError({ response }: any) {
            if (response.status === 401) {
                if (import.meta.client) {
                    ElMessageBox.confirm('您登录时间过长，请重新返回登录页面进行登录', '确定登出', {
                        confirmButtonText: '重新登录',
                        showCancelButton: false,
                        type: 'warning'
                    }).then(() => {
                        // Clear token
                        token.value = null
                        router.push('/login')
                    })
                }
            }
        }
    }

    // Merge options
    const params = defu(options, defaults)

    return useFetch(url, params)
}
