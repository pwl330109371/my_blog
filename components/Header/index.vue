<template>
  <div class="header" ref="headRef">
    <div class="left flex align-center">
      <img @click="toIndex" src="/images/textlogo.png" alt="Logo" />
      <i
        class="iconfont"
        @click="changeMusic"
        :class="isPlay ? 'icon-zanting' : 'icon-bofang'"
      ></i>
    </div>
    <div class="mid" :class="musicIcon === 'show' ? 'show' : 'hid'">
      {{ midText }}
    </div>
    <div class="right flex align-center">
      <i
        class="iconfont"
        :class="isLike === 1 ? 'icon-xin' : 'icon-xinheart118'"
        v-if="showLike"
        @click="$emit('like', isLike)"
      ></i>
      <nuxt-link :to="{ name: 'Wode', query: { id: userInfo.id } }" v-if="userInfo && userInfo.id">
        <el-image
          style="width: 40px; height: 40px"
          :src="userInfo.picture + '/thumbnail/40x40'"
          fit="fill"
        ></el-image>
      </nuxt-link>
    </div>
    <div class="progressBar" :style="{ width: progressBarWidth + '%' }"></div>
    <div class="music-btn" @click="changeMusic" :class="[musicIcon]">
      <svg
        class="progress-circle"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        />
        <circle
          class="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <span
        class="iconfont"
        :class="isPlay ? 'icon-zanting' : 'icon-bofang'"
      ></span>
    </div>
    <audio loop id="music" :src="music"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onDeactivated } from 'vue'
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
defineEmits(['like'])

// Router
const router = useRouter()

// Refs
const headRef = ref(null)

// 响应式数据
const isPlay = ref(false)
const startListen = ref(false)
const dashArray = Math.PI * 100
const progressBarWidth = ref(0)
const musicIcon = ref('')
const audioDom = ref<HTMLAudioElement | null>(null)
const timer = ref<any>(null)

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

// Nuxt handles activation differently (keep-alive), relying on mounted for initial setup
// For checking reactivation in keep-alive we can use onActivated if <NuxtPage> is wrapped in keep-alive
// Assuming keep-alive is used in App.vue or Layout
// But for now, just migrate onMounted logic.

// onDeactivated logic
// Note: onDeactivated only works if component is inside <KeepAlive>
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
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #f6f7f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #666;
  padding: 0 15px;
  background: #fff;
  z-index: 99999;
  transition: all 0.3s;

  .left {
    img {
      width: 30px;
      height: auto;
      opacity: 0.8;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        animation: jump 1s infinite alternate;
      }
    }

    .iconfont {
      color: #888;
      margin-left: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #303033;
      }
    }
  }

  .mid {
    font-weight: 600;
    transition: all 0.4s ease-in;

    &.hid {
      opacity: 0;
    }
  }

  :deep(.right) {
    .iconfont {
      font-size: 26px;
      margin: 0 16px;
      cursor: pointer;
      transition: all 0.3s;

      &.icon-xin {
        color: #ef6d57;
        font-weight: bold;
      }

      &.icon-xinheart118:hover {
        color: #ef6d57;
      }
    }

    .el-image__inner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .progressBar {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 50px;
    background-color: #eee;
    z-index: -1;
  }
}

.music-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 36px;
  padding: 3px;
  height: 36px;
  color: #fff;
  opacity: 0.8;
  cursor: pointer;
  z-index: 9999999;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: none;

  .progress-circle {
    height: 30px;
    width: 30px;

    circle {
      stroke-width: 10px;
      transform-origin: center;

      &.progress-background {
        transform: scale(0.9);
        stroke: #fff;
      }

      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: #50bcb6;
      }
    }
  }

  .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    font-size: 13px;

    &.icon-bofang {
      padding: 1px 0 0 3px;
    }

    &.icon-pause {
      padding-left: 1px;
    }
  }
}

// 响应式设计
@media screen and (max-width: 600px) {
  .header {
    position: absolute;
  }

  .mid {
    font-size: 14px;
  }

  .music-btn {
    opacity: 0;

    &.show {
      display: block;
      visibility: visible;
      animation: fadeInTop 0.6s both;
    }

    &.exit {
      display: block;
      opacity: 0;
      animation: fadeInDown 0.6s both;
    }
  }
}

// 动画定义
@keyframes jump {
  0% {
    transform: translateY(0px) scale(1);
  }
  60% {
    transform: translateY(2px) scale(1.1);
  }
  100% {
    transform: translateY(-4px) scale(1);
  }
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 1;
    transform: translate(0, 0px);
  }
  to {
    opacity: 0;
    visibility: hidden;
    transform: translate(0, 30px);
  }
}
</style>
