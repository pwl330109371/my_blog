/*
 * @Author: your name
 * @Date: 2021-03-29 16:32:21
 * @LastEditTime: 2021-03-29 16:37:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\public\js\autoload.js
 */
/* eslint-disable no-undef */
// 注意：live2dPath 参数应使用绝对路径
// const live2dPath = "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
const live2dPath = './live2d-widget/'

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag

        if (type === 'css') {
            tag = document.createElement('link')
            tag.rel = 'stylesheet'
            tag.href = url
        } else if (type === 'js') {
            tag = document.createElement('script')
            tag.src = url
        }
        if (tag) {
            tag.onload = () => resolve(url)
            tag.onerror = () => reject(url)
            document.head.appendChild(tag)
        }
    })
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 168) {
    Promise.all([loadExternalResource(live2dPath + 'waifu.css', 'css'), loadExternalResource(live2dPath + 'live2d.min.js', 'js'), loadExternalResource(live2dPath + 'waifu-tips.js', 'js')]).then(() => {
        initWidget({
            waifuPath: live2dPath + 'waifu-tips.json',
            cdnPath: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/'
        })
    })
}
// apiPath: "https://live2d.fghrsh.net/api/",
// initWidget 第一个参数为 waifu-tips.json 的路径，第二个参数为 API 地址
// API 后端可自行搭建，参考 https://github.com/fghrsh/live2d_api
// 初始化看板娘会自动加载指定目录下的 waifu-tips.json

console.log(`
  く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
`)
