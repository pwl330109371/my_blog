<template>
  <div class="menu-container">
    <el-drawer
      v-model="drawer"
      :append-to-body="true"
      direction="rtl"
      size="70%"
      :with-header="false"
      :before-close="handleClose"
      custom-class="glass-drawer"
    >
      <div class="menu-content">
        <div class="menu-header">
          <span class="menu-title">NAVIGATION</span>
        </div>
        <ul class="menu-group">
          <li class="menu-item" v-for="(item, index) in menuList" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
            <nuxt-link :to="item.path" active-class="active">
              <span class="en">{{ item.en }}</span>
              <span class="cn">{{ item.name }}</span>
            </nuxt-link>
          </li>
        </ul>
        <div class="menu-footer">
          <div class="line"></div>
          <p>THE WIND</p>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  showMenu: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['showModal'])

// Router
const route = useRoute()

// 响应式数据
const drawer = ref(false)

const menuList = [
  { name: '首页', en: 'HOME', path: { name: 'home' } },
  { name: '文章', en: 'ARTICLES', path: { name: 'articleList' } },
  { name: '图库', en: 'GALLERY', path: { name: 'gallery' } },
  { name: '留言', en: 'MESSAGE', path: { name: 'message' } },
  { name: '听雨', en: 'RAINY', path: { name: 'rainy' } },
  { name: '登录', en: 'LOGIN', path: { name: 'login' } },
  { name: '站主', en: 'PROFILE', path: { name: 'wode' } }
]

/**
 * 监听路由变化，关闭抽屉
 */
watch(
  () => route.path,
  () => {
    drawer.value = false
    emit('showModal') // 通知父组件重置状态
  }
)

/**
 * 监听 showMenu prop 变化
 */
watch(
  () => props.showMenu,
  (val) => {
    drawer.value = val
  }
)

/**
 * 关闭抽屉前的回调
 */
const handleClose = () => {
  emit('showModal')
}
</script>

<style lang="scss">
/* 全局样式覆盖 Element UI Drawer */
.glass-drawer {
  background: rgba(10, 15, 30, 0.85) !important;
  backdrop-filter: blur(20px) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5) !important;
  
  .el-drawer__body {
    padding: 0 !important;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.menu-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;

  /* 背景装饰 */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 150, 255, 0.1), transparent 70%);
    pointer-events: none;
  }
}

.menu-header {
  margin-bottom: 60px;
  .menu-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
    display: block;
  }
}

.menu-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;

  .menu-item {
    opacity: 0;
    animation: slideIn 0.5s ease forwards;
    
    a {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      group: transition;
      
      .en {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        letter-spacing: 2px;
        margin-bottom: 4px;
        transition: color 0.3s;
      }
      
      .cn {
        font-size: 24px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        transition: all 0.3s;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #0096ff;
          transition: width 0.3s;
        }
      }

      &:hover, &.active {
        .en {
          color: #0096ff;
        }
        .cn {
          color: #fff;
          text-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
          transform: translateX(10px);
          
          &::after {
            width: 100%;
          }
        }
      }
    }
  }
}

.menu-footer {
  margin-top: auto;
  text-align: center;
  
  .line {
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 auto 20px;
  }
  
  p {
    font-family: 'Rajdhani', sans-serif;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 8px;
    font-size: 12px;
    margin: 0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
