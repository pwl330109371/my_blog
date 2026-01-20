<template>
  <div class="header" ref="headRef">
    <div class="left flex align-center">
      <img @click="toIndex" src="/images/textlogo.png" alt="Logo" />
    </div>

    <!-- 中间导航菜单 -->
    <div class="center-nav">
      <nuxt-link :to="{ name: 'home' }" class="nav-item">首页</nuxt-link>
      <!-- <nuxt-link :to="{ name: 'articleList' }" class="nav-item">文章</nuxt-link> -->
      <nuxt-link :to="{ name: 'gallery' }" class="nav-item">图库</nuxt-link>
      <nuxt-link :to="{ name: 'message' }" class="nav-item">留言</nuxt-link>
      <nuxt-link :to="{ name: 'rainy' }" class="nav-item">听雨</nuxt-link>
    </div>

    <div class="mid" :class="musicIcon === 'show' ? 'show' : 'hid'" v-if="false">
      {{ midText }}
    </div>

    <div class="right flex align-center">
      <!-- 音乐控制 -->
      <i
        class="iconfont"
        @click="changeMusic"
        :class="isPlay ? 'icon-zanting' : 'icon-bofang'"
        style="margin-right: 20px; font-size: 20px;"
      ></i>

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
    
    <div class="progressBar" :style="{ width: progressBarWidth + '%' }"></div>
    <audio loop id="music" :src="music"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onDeactivated, watch } from 'vue'
import { throttle } from '@/utils/index'

// Props
const props = defineProps({
  music: {
    type: String,
    default:
      'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/thewind/KWXZ%20-%20ESti%20-%20Wind%20from%20the%20Far%20East%EF%BC%88%E4%B8%8A%E4%BA%AC%EF%BC%89%EF%BC%88%E9%98%BF%E6%B4%B2%20remix%EF%BC%89.mp3'
  },
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

// Refs
const headRef = ref(null)
const isPlay = ref(false)
const startListen = ref(false)
const dashArray = Math.PI * 100
const progressBarWidth = ref(0)
const musicIcon = ref('')
const audioDom = ref<HTMLAudioElement | null>(null)
const timer = ref<any>(null)
const showMenu = ref(false)

/**
 * 计算进度条偏移量
 */
const dashOffset = computed(() => {
  return (1 - progressBarWidth.value / 100) * dashArray
})

/**
 * 切换音乐播放状态
 */
const changeMusic = () => {
  listenPlay()
  startListen.value = true
  if (audioDom.value) {
    if (!isPlay.value) {
      audioDom.value.play()
    } else {
      audioDom.value.pause()
    }
  }
  isPlay.value = !isPlay.value
}

/**
 * 监听音乐播放进度
 */
const listenPlay = () => {
  if (startListen.value) return

  if (audioDom.value) {
    audioDom.value.ontimeupdate = () => {
      if (audioDom.value) {
        const currentTime = Number(
          (audioDom.value.currentTime / audioDom.value.duration) * 100
        ).toFixed(0)
        progressBarWidth.value = Number(currentTime)
      }
    }
  }
}

/**
 * 初始化音乐播放器
 */
const initMusic = () => {
  // @ts-ignore
  audioDom.value = document.getElementById('music')
  audioDom.value?.load()
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
  initMusic()
  listenScroll()
})

onDeactivated(() => {
  document.body.onscroll = null
  if (audioDom.value) {
    audioDom.value.ontimeupdate = null
  }
  startListen.value = false
  timer.value = null
  isPlay.value = false
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ccc;
  padding: 0 30px;
  background: rgba(9, 10, 15, 0.6);
  backdrop-filter: blur(12px);
  z-index: 99999;
  transition: all 0.3s;

  .left {
    img {
      height: 30px;
      width: auto;
      opacity: 0.9;
      cursor: pointer;
      transition: all 0.2s;
      filter: brightness(100); 

      &:hover {
        opacity: 1;
        transform: scale(1.05);
      }
    }
  }

  /* 导航链接样式 */
  .center-nav {
    display: flex;
    gap: 50px;
    /* 使用 Flex 布局替代绝对定位，防止重叠 */
    flex: 1;
    justify-content: center;
    align-items: center;

    .nav-item {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s;
      position: relative;
      padding: 5px 0;
      white-space: nowrap; /* 防止换行 */

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

      &:hover {
        color: #fff;
        text-shadow: 0 0 8px rgba(0, 150, 255, 0.5);
        &::after {
          width: 100%;
        }
      }
      
      &.router-link-active {
        color: #0096ff;
        &::after {
          width: 100%;
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
      color: #aaa;

      &:hover {
        color: #fff;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
      }

      &.icon-xin {
        color: #ef6d57;
      }
    }

    .login-btn {
      color: #fff;
      text-decoration: none;
      padding: 6px 16px;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      font-size: 14px;
      transition: all 0.3s;
      margin-left: 10px;

      &:hover {
        background: rgba(255,255,255,0.1);
        border-color: #fff;
      }
    }
  }

  .progressBar {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.03);
    z-index: -1;
    transition: width 0.1s linear;
  }
}

  /* 响应式设计 - 移动端适配 */
  @media screen and (max-width: 900px) {
    .header {
      padding: 0 15px;
      height: 56px;

      .left {
        img {
          height: 24px; /* 移动端缩小 Logo */
        }
      }

      /* 缩小导航间距以适应移动端 */
      .center-nav {
        gap: 15px;
        
        .nav-item {
          font-size: 14px;
        }
      }

      :deep(.right) {
        min-width: auto; /* 取消最小宽度限制 */
        
        .iconfont {
          font-size: 20px;
          margin: 0 5px;
        }

        .login-btn {
          padding: 4px 12px;
          font-size: 12px;
        }
      }
    }
  }
</style>