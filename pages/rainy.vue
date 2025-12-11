<template>
  <div class="rain">
    <div class="logo-img" @click="toIndex">
      <img src="/images/whitelogo.png" alt="Logo" />
    </div>

    <!-- Background rain gif -->
    <img
      class="rain-bg"
      src="https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain-bg.gif"
      draggable="false"
      alt="雨天背景"
    />
    <img class="words" src="/images/rain/words.png" draggable="false" alt="文字" />

    <ul class="option flex align-center" v-show="show">
      <li v-for="(item, index) in rainIcon" :key="index">
        <span @click="music(index, item.active)">
          <img :src="item.on" draggable="false" v-if="item.active" alt="开启" />
          <img :src="item.off" draggable="false" v-else alt="关闭" />
        </span>
        <!-- music -->
        <audio :ref="el => audioDom[index] = el" class="music" loop preload="auto">
          <source type="audio/mpeg" :src="item.music" />
        </audio>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { h } from 'vue'

definePageMeta({
    layout: false
})

// Router
const router = useRouter()

// 响应式数据
const audioDom = ref<any[]>([])
const show = ref(true)

// Assets - using absolute paths assuming they are in public/images/rain/
// Original used import, here we use static URLs or public assets
const rainIcon = ref([
  {
    on: '/images/rain/rain_on.png',
    off: '/images/rain/rain_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/thunder.mp3',
    active: false
  },
  {
    on: '/images/rain/rain2_on.png',
    off: '/images/rain/rain2_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/loudThunder.mp3',
    active: false
  },
  {
    on: '/images/rain/rain3_on.png',
    off: '/images/rain/rain3_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain.mp3',
    active: false
  },
  {
    on: '/images/rain/rain4_on.png',
    off: '/images/rain/rain4_off.png',
    music: 'https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/bizhibian.mp3',
    active: false
  }
])

/**
 * 跳转到首页
 */
const toIndex = () => {
  router.push('/')
}

/**
 * 切换音乐播放状态
 */
const music = (type: number, active: boolean) => {
  rainIcon.value[type].active = !active
  const audio = audioDom.value[type]
  if (audio) {
      !active ? audio.play() : audio.pause()
  }
}

/**
 * 让用户自动触发播放，避免浏览器限制
 */
const oncePlay = () => {
  music(0, false)
  document.documentElement.removeEventListener('click', oncePlay)
}

/**
 * 提示用户点击页面开始播放
 */
const userToast = () => {
  ElNotification({
    title: '提示',
    message: h(
      'span',
      { style: 'color: #008c8c' },
      '请点击一次页面开始聆听雨声哦！也可以在右下角关闭或者打开其声音。左上角logo可以回到首页'
    )
  })
}

/**
 * 初始化音频元素
 */
const initAudio = () => {
  // audioDom is bound via ref
  userToast()
  document.documentElement.addEventListener('click', oncePlay)
}

/**
 * 清理音频和事件监听
 */
const cleanup = () => {
  document.documentElement.removeEventListener('click', oncePlay)
  rainIcon.value.forEach((item, index) => {
    item.active = false
    const audio = audioDom.value[index]
    if (audio) {
        audio.pause()
        audio.currentTime = 0
    }
  })
}

// 生命周期钩子
onMounted(() => {
  initAudio()
})

onActivated(() => {
  initAudio()
})

onDeactivated(() => {
  cleanup()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style lang="scss" scoped>
.rain {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;

  .logo-img {
    color: #fff;
    position: fixed;
    top: 20px;
    left: 30px;
    z-index: 9999;
    cursor: pointer;
    width: 100px;
    height: 44px;

    img {
      width: 40px;
    }
  }

  .rain-bg {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }

  .words {
    position: fixed;
    top: 80px;
    right: 80px;
  }

  .option {
    width: auto;
    height: 70px;
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;

    li {
      display: inline-block;
      list-style-type: none;
      cursor: pointer;

      span {
        display: inline-block;
      }

      &:last-child {
        width: 108px;
        height: 73px;
        line-height: 73px;

        img {
          width: 50px;
          height: 30px;
          vertical-align: middle;
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 480px) {
  .rain {
    .logo-img {
      color: #fff;
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 9999;
      cursor: pointer;
      width: 88px;
      height: 55px;

      img {
        width: 100%;
      }
    }

    .words {
      top: 30%;
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
    }

    .rain-bg {
      position: absolute;
      left: 60%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 100%;
      width: auto;
    }

    .option {
      width: auto;
      right: 20px;

      li {
        width: 60px;
        overflow: hidden;

        span {
          display: flex;
          justify-content: center;
        }

        &:last-child {
          width: 60px;
          height: 40px;
          line-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: auto;
            height: 30px;
            vertical-align: middle;
          }
        }
      }
    }

    .logo {
      left: 20px;
    }
  }
}
</style>
