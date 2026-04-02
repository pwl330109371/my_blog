import { defu } from 'defu'
import { ElMessage } from 'element-plus'

export const useApi = async <T>(url: string, options: any = {}) => {
    const config = useRuntimeConfig()
    const token = useCookie('token')

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
                    if (import.meta.client) {
                        ElMessage({
                            type: 'warning',
                            message: '当前站点已关闭登录功能，这个操作暂不可用',
                            offset: 60
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
                    ElMessage({
                        type: 'warning',
                        message: '当前站点已关闭登录功能，这个操作暂不可用',
                        offset: 60
                    })
                }
            }
        }
    }

    // Merge options
    const params = defu(options, defaults)

    return await useFetch(url, params)
}
