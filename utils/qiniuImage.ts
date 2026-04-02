/**
 * Author: pengwenlei 330109371@qq.com
 * Date: 2026-01-14 11:11:02
 * LastEditors: pengwenlei 330109371@qq.com
 * LastEditTime: 2026-01-14 11:21:48
 */
type ImageScene = 'thumb' | 'list' | 'detail' | 'avatar'

interface QiniuOptions {
  scene?: ImageScene
  width?: number
  quality?: number
  webp?: boolean
}

const SCENE_MAP: Record<ImageScene, { w: number; q: number }> = {
  thumb:  { w: 300,  q: 70 },
  list:   { w: 600,  q: 75 },
  detail: { w: 1200, q: 80 },
  avatar: { w: 200,  q: 85 }
}

export function createQiniuImage(cdn: string) {
  return function qiniuImage(
    path: string,
    options: QiniuOptions = {}
  ): string {
    if (!path) return ''

    const normalizedCdn = cdn.replace(/\/+$/, '')
    const cdnHost = (() => {
      try {
        return new URL(normalizedCdn).host
      } catch {
        return ''
      }
    })()

    path = String(path).trim()

    // 已经是完整 URL（兼容老数据）
    if (/^https?:\/\//.test(path)) {
      let parsed: URL
      try {
        parsed = new URL(path)
      } catch {
        return path
      }

      if (!cdnHost || parsed.host !== cdnHost) {
        return path
      }

      path = `${parsed.pathname}${parsed.search}`
    } else if (path.startsWith('//')) {
      const fullUrl = `https:${path}`
      try {
        const parsed = new URL(fullUrl)
        if (!cdnHost || parsed.host !== cdnHost) {
          return fullUrl
        }
        path = `${parsed.pathname}${parsed.search}`
      } catch {
        return fullUrl
      }
    }

    const {
      scene = 'detail',
      width,
      quality,
      webp = true
    } = options

    const sceneConfig = SCENE_MAP[scene]
    const w = width || sceneConfig.w
    const q = quality || sceneConfig.q

    let params = `imageView2/2/w/${w}/q/${q}`

    if (webp) {
      params += '/format/webp'
    }

    const [pathname, search = ''] = path.split('?')
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
    const encodedPath = encodeURI(normalizedPath)
    const separator = search ? '&' : '?'

    return `${normalizedCdn}${encodedPath}${search ? `?${search}` : ''}${separator}${params}`
  }
}
