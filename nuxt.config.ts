/**
 * Author: pengwenlei 330109371@qq.com
 * Date: 2025-12-12 09:39:36
 * LastEditors: pengwenlei 330109371@qq.com
 * LastEditTime: 2026-01-20 10:48:58
 */
import svgLoader from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    port: 3002
  },

  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],

  // Element Plus configuration
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
  },

  // Explicitly set srcDir to root since Nuxt 4 might default to 'app'
  srcDir: '.',

  // Global CSS
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/prism.css',
    '~/assets/css/animate.min.css',
    '~/assets/css/main.scss',
    '~/assets/font/iconfont.css'
  ],
  vite: {
    plugins: [
      svgLoader(),
      tailwindcss()
      ],
    css: {
      preprocessorOptions: {
        scss: {
          // Inject variables and mixins into all components
          additionalData: `@use "~/assets/css/variables.scss" as *; @use "~/assets/css/mixin.scss" as *;`
        }
      }
    },
    // Dev 模式下使用 Vite proxy，更可靠
    // server: {
    //   proxy: {
    //     '/api': {
    //       // target: 'http://152.136.55.216:3001',
    //       target: 'http://localhost:3001',
    //       changeOrigin: true
    //     }
    //   }
    // }
  },

  runtimeConfig: {
    public: {
      apiBase: '/api',
      qiniuCdn: 'https://img.thewind.vip'
    }
  },

  // 配置 Nuxt 3 的 app 模块
  app: {
    head: {
      title: 'TheWind',
      meta: [
        { name: 'description', content: 'TheWind\'s blog' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  // Universal rendering
  ssr: true,

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3001/api',
        changeOrigin: true
      }
    },
    // Production proxy: 把 /api/** 原封不动转发到后端
    routeRules: {
      '/api/**': { proxy: 'http://localhost:3001/api/**' }
    }
  }
})
