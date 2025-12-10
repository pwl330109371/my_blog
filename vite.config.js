import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@img': path.resolve(__dirname, './src/assets/img'),
      '@c': path.resolve(__dirname, './src/components')
    },
    extensions: ['.js', '.json', '.vue', '.mjs']
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 使用新的 Sass API，避免弃用警告
        additionalData: `@import "@/style/normalize.scss";`
      }
    }
  },
  server: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://115.159.117.118:3001/',
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
