import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

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
    '~/assets/css/normalize.scss',
    '~/assets/css/prism.css',
    '~/assets/css/main.scss',
    '~/assets/css/transition.scss',
    '~/assets/font/iconfont.css'
  ],

  vite: {
    plugins: [
      svgLoader()
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
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true
        }
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },

  // Universal rendering
  ssr: true,

  nitro: {
    // Production proxy: 把 /api/** 原封不动转发到后端
    routeRules: {
      '/api/**': { proxy: 'http://127.0.0.1:3001' }
    }
  }
})
