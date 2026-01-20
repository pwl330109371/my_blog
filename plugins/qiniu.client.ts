/**
 * Author: pengwenlei 330109371@qq.com
 * Date: 2026-01-14 11:17:07
 * LastEditors: pengwenlei 330109371@qq.com
 * LastEditTime: 2026-01-14 11:22:02
 */
import { createQiniuImage } from '@/utils/qiniuImage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const qiniu = createQiniuImage(config.public.qiniuCdn)

  return {
    provide: {
      qiniu
    }
  }
})