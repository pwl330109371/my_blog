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

    // 已经是完整 URL（兼容老数据）
    if (/^https?:\/\//.test(path)) {
      // 如果不是本站 CDN 域名，直接返回
      if (!path.startsWith(cdn)) {
        return path
      }
      // 如果是本站 CDN 域名，去掉域名部分，继续处理（以便追加参数）
      path = path.replace(cdn, '')
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

    const separator = path.includes('?') ? '&' : '?'
    return `${cdn}${path}${separator}${params}`
  }
}