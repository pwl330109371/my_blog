<template>
  <div class="header" ref="headRef">
    <div class="left flex align-center">
      <img @click="toIndex" src="/images/textlogo.png" alt="Logo" />
    </div>

    <!-- 中间导航菜单 (Desktop) -->
    <div class="center-nav hidden-mobile">
      <nuxt-link :to="{ name: 'home' }" class="nav-item" data-text="START">星港</nuxt-link>
      <nuxt-link :to="{ name: 'gallery' }" class="nav-item" data-text="VIEW">视界</nuxt-link>
      <nuxt-link :to="{ name: 'message' }" class="nav-item" data-text="ECHO">回响</nuxt-link>
      <!-- <nuxt-link :to="{ name: 'rainy' }" class="nav-item" data-text="TIDE">潮汐</nuxt-link> -->
      <nuxt-link :to="{ name: 'astral' }" class="nav-item" data-text="FATE">星谕</nuxt-link>
      <nuxt-link :to="{ name: 'tunes' }" class="nav-item" data-text="TUNES">星律</nuxt-link>
    </div>

    <!-- Mobile Toggle Button -->
    <div class="mobile-toggle show-mobile" @click="toggleMobileMenu">
      <div class="hamburger" :class="{ 'active': showMenu }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div class="mobile-menu-overlay" v-if="showMenu" @click.self="toggleMobileMenu">
        <div class="mobile-nav-content">
          <nuxt-link :to="{ name: 'home' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">START</span>
            <span class="cn">星港</span>
          </nuxt-link>
          <nuxt-link :to="{ name: 'gallery' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">VIEW</span>
            <span class="cn">视界</span>
          </nuxt-link>
          <nuxt-link :to="{ name: 'message' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">ECHO</span>
            <span class="cn">回响</span>
          </nuxt-link>
          <!-- <nuxt-link :to="{ name: 'rainy' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">TIDE</span>
            <span class="cn">潮汐</span>
          </nuxt-link> -->
          <nuxt-link :to="{ name: 'astral' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">FATE</span>
            <span class="cn">星谕</span>
          </nuxt-link>
          <nuxt-link :to="{ name: 'tunes' }" class="mobile-nav-item" @click="toggleMobileMenu">
            <span class="en">TUNES</span>
            <span class="cn">星律</span>
          </nuxt-link>
        </div>
      </div>
    </transition>

    <div class="mid" :class="musicIcon === 'show' ? 'show' : 'hid'" v-if="false">
      {{ midText }}
    </div>

    <div class="right flex align-center hidden-mobile">
      <!-- 音乐控制 - 跳转到星律页面 -->
      <nuxt-link 
        :to="{ name: 'tunes' }"
        class="iconfont"
        style="margin-right: 20px; font-size: 20px; text-decoration: none;"
        :class="musicStore.isPlaying ? 'icon-zanting' : 'icon-bofang'"
      ></nuxt-link>

      <i
        class="iconfont"
        :class="isLike === 1 ? 'icon-xin' : 'icon-xinheart118'"
        v-if="showLike"
        @click="$emit('like', isLike)"
      ></i>
      
      <nuxt-link :to="{ name: 'wode', query: { id: userInfo.id } }" v-if="userInfo && userInfo.id">
        <el-image
          style="width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);"
          :src="userInfo.picture"
          fit="fill"
        ></el-image>
      </nuxt-link>
      <nuxt-link :to="{ name: 'login' }" v-else class="login-btn">
        登录
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onDeactivated } from 'vue'
import { useRouter } from 'vue-router'
import { throttle } from '@/utils/index'
import { useMusicStore } from '@/stores/music'

// Props
const props = defineProps({
  isLike: {
    type: Number,
    default: 2
  },
  userInfo: {
    type: Object,
    default: () => ({
      gender: 1,
      nickName: '从前慢',
      picture:
        'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210415142326.jpg',
      id: 1
    })
  },
  midText: {
    type: String,
    default: '文章列表'
  },
  showLike: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['like'])

// Router
const router = useRouter()
const musicStore = useMusicStore()

// Refs
const headRef = ref(null)
const musicIcon = ref('')
const timer = ref<any>(null)
const showMenu = ref(false)

/**
 * 切换移动端菜单
 */
const toggleMobileMenu = () => {
  showMenu.value = !showMenu.value
}

/**
 * 切换音乐播放器显示
 */
const toggleMusicPlayer = () => {
  musicStore.togglePlayer()
}

/**
 * 跳转到首页
 */
const toIndex = () => {
  router.push({ path: '/' })
}

/**
 * 监听页面滚动
 */
const listenScroll = () => {
  if (timer.value) return

  timer.value = setTimeout(() => {
    document.body.onscroll = throttle(scrollHandle, 200)
  }, 200)
}

/**
 * 滚动处理函数
 */
const scrollHandle = () => {
  const scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset
  musicIcon.value = scrollTop >= 60 ? 'show' : 'exit'
}

// 生命周期钩子
onMounted(() => {
  listenScroll()
})

onDeactivated(() => {
  document.body.onscroll = null
  timer.value = null
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&family=Rajdhani:wght@400;600;700&display=swap');

.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 70px;
  width: 100%;
  // border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e2e8f0;
  padding: 0 40px;
  // background: rgba(15, 23, 42, 0.75);
  // backdrop-filter: blur(6px);
  z-index: 99999;
  transition: all 0.3s;
  // box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  .left {
    img {
      height: 32px;
      width: auto;
      opacity: 0.9;
      cursor: pointer;
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));

      &:hover {
        opacity: 1;
        transform: scale(1.05);
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
      }
    }
  }

  /* 导航链接样式 */
  .center-nav {
    display: flex;
    gap: 60px;
    flex: 1;
    justify-content: center;
    align-items: center;

    .nav-item {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-family: 'Rajdhani', sans-serif;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 2px;
      transition: all 0.3s ease;
      position: relative;
      padding: 5px 0;
      white-space: nowrap;
      text-transform: uppercase;

      &::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #3b82f6;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.3s ease;
        filter: blur(2px);
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        transition: width 0.3s ease;
        box-shadow: 0 0 10px #3b82f6;
      }

      &:hover, &.router-link-active {
        color: #fff;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        
        &::after {
          width: 100%;
        }
        
        &::before {
          opacity: 0.3;
          transform: translateY(0);
        }
      }
    }
  }
  
  /* Mobile Toggle */
  .mobile-toggle {
    cursor: pointer;
    z-index: 100001;
    
    .hamburger {
      width: 24px;
      height: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      span {
        display: block;
        width: 100%;
        height: 2px;
        background: #fff;
        transition: all 0.3s ease;
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
      }
      
      &.active {
        span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        span:nth-child(2) { opacity: 0; }
        span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
      }
    }
  }

  /* Mobile Menu Overlay */
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(5, 5, 10, 0.95);
    backdrop-filter: blur(20px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .mobile-nav-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
      text-align: center;
      
      .mobile-nav-item {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        position: relative;
        padding: 10px 20px;
        
        .en {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.2rem;
          color: #3b82f6;
          letter-spacing: 4px;
          margin-bottom: 5px;
          font-weight: 700;
          opacity: 0.7;
          transition: all 0.3s;
        }
        
        .cn {
          font-size: 1.8rem;
          color: #fff;
          font-weight: 300;
          letter-spacing: 8px;
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          transition: all 0.3s;
        }
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          height: 0%;
          width: 2px;
          background: #3b82f6;
          transition: height 0.3s;
          transform: translateY(-50%);
          opacity: 0;
        }
        
        &:hover, &.router-link-active {
          .en { opacity: 1; letter-spacing: 6px; text-shadow: 0 0 8px #3b82f6; }
          .cn { letter-spacing: 12px; text-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
          
          &::before {
            height: 60%;
            opacity: 1;
            box-shadow: 0 0 10px #3b82f6;
          }
        }
      }
    }
  }

  .mid {
    font-weight: 600;
    transition: all 0.4s ease-in;
    color: #fff;

    &.hid {
      opacity: 0;
    }
  }

  :deep(.right) {
    display: flex;
    align-items: center;
    justify-content: flex-end; /* 右侧对齐 */
    min-width: 200px; /* 保证右侧空间 */

    .iconfont {
      font-size: 22px;
      margin: 0 10px;
      cursor: pointer;
      transition: all 0.3s;
      color: #94a3b8;

      &:hover {
        color: #fff;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        transform: scale(1.1);
      }

      &.icon-xin {
        color: #ef6d57;
        filter: drop-shadow(0 0 5px rgba(239, 109, 87, 0.5));
      }
    }

    .login-btn {
      color: #fff;
      text-decoration: none;
      padding: 6px 20px;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 4px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      letter-spacing: 1px;
      font-size: 14px;
      transition: all 0.3s;
      margin-left: 10px;
      background: rgba(59, 130, 246, 0.1);
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);

      &:hover {
        background: rgba(59, 130, 246, 0.3);
        border-color: #3b82f6;
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        transform: translateY(-1px);
      }
    }
  }
}

/* 响应式设计 - 移动端适配 */
@media screen and (max-width: 900px) {
  .header {
    padding: 0 20px;
    height: 60px;
    
    .hidden-mobile {
      display: none !important;
    }
    
    .show-mobile {
      display: block;
    }

    .left {
      img {
        height: 26px;
      }
    }

    :deep(.right) {
      min-width: auto;
      
      .iconfont {
        font-size: 20px;
        margin: 0 8px;
      }

      .login-btn {
        padding: 4px 12px;
        font-size: 12px;
      }
    }
  }
}

/* Desktop Only Helpers */
@media screen and (min-width: 901px) {
  .show-mobile {
    display: none !important;
  }
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
