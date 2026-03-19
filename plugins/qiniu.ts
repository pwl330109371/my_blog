import { createQiniuImage } from '@/utils/qiniuImage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const qiniu = createQiniuImage(config.public.qiniuCdn)

  return {
    provide: {
      qiniu
    }
  }
})
