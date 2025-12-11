<template>
  <div class="max">
    <div id="scene" class="img-outer">
      <div data-depth="0.4" class="layer">
        <img
          src="https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/thewind/1594348066004.png?imageMogr2/quality/10"
          class="moveImg"
          :width="imgWidth"
          :height="imgHeight"
        />
      </div>
    </div>
    <div class="header flex align-center space-between">
      <img src="/images/textlogo.png" alt="Logo" />
      <div class="icon" @click="toggleMenu">
        <i class="el-icon-s-unfold"></i>
      </div>
    </div>
    <div class="mask"></div>
    <div class="info">
      <div class="time">{{ date.month }} {{ date.day }}, {{ date.year }}</div>
      <div class="title">
        欢迎光临！！
        <transition name="el-fade-in-linear">
          <span v-show="!hiddenText" class="tipsText">请向下滚动</span>
        </transition>
      </div>
      <div class="content">
        世间万般美好事物，我们高处再相见!
      </div>
    </div>
    <Menu @showModal="toggleMenu" :showMenu="showMenu" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import Parallax from 'parallax-js'
import { formatDate } from '@/utils'

// Store
const appStore = useAppStore()

// 响应式数据
const imgWidth = ref<number | string>(0)
const imgHeight = ref<number | string>(0)
const hiddenText = ref(false)
const showMenu = ref(false)
const date = ref<any>({})

/**
 * 切换菜单显示状态
 */
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

/**
 * 获取并格式化日期
 */
const getYearMonthDay = async () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const result = `${year}-${month}-${day} ${123}` // Why 123? keeping original logic
  
  // 原逻辑调用 appStore.dataHandle，但该 action 已移至 utils/formatDate
  date.value = formatDate(result)
}

/**
 * 延迟隐藏提示文字
 */
const hiddenTextEmit = () => {
  setTimeout(() => {
    hiddenText.value = true
  }, 3000)
}

/**
 * 初始化图片尺寸
 */
const initImageSize = () => {
  if (typeof window === 'undefined') return
  const wWidth = document.documentElement.clientWidth
  const wHeight = document.documentElement.clientHeight
  
  imgWidth.value = wWidth + 150
  imgHeight.value = wHeight + 150
  
  // 移动端适配
  if (wWidth <= 600) {
    imgWidth.value = 1920 / 1.3
    imgHeight.value = 960
  }
}

/**
 * 初始化视差效果
 */
const initParallax = () => {
  const scene = document.getElementById('scene')
  if (scene) {
    new Parallax(scene, {
      relativeInput: true,
      clipRelativeInput: true
    })
  }
}

// 组件挂载后初始化
onMounted(() => {
  initImageSize() // client side only
  getYearMonthDay()
  initParallax()
  hiddenTextEmit()
})

</script>

<style lang="scss" scoped>
@keyframes move {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}

#scene {
  position: relative;
  overflow: hidden;
  height: 100%;

  #image {
    position: absolute;
    max-width: none;
    display: block;
  }
}

.max {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 9;

  .img-outer {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .moveImg {
    margin-bottom: 20px;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    max-width: none;
    display: block;
  }
}

.tipsText {
  color: greenyellow;
  font-weight: bold;
  display: inline-block;
  animation: move 0.6s infinite alternate;
}

.header {
  padding: 0 40px;
  position: fixed;
  left: 0;
  top: 50px;
  width: 100%;
  height: auto;
  z-index: 1;
  cursor: pointer;

  img {
    width: 40px;
    height: 44px;
  }

  .icon {
    cursor: pointer;
    font-size: 30px;
    color: #ff3600;
    background: rgba(255, 255, 255, 0.8);
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 32px;
    border-radius: 2px;
  }
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(176, 14, 37, 0.7);
  clip-path: polygon(0 0, 25% 0, 60% 100%, 0 100%);
  pointer-events: none;
}

.info {
  position: absolute;
  top: 54%;
  left: 10%;
  color: #fff;
  width: 30%;
  transform: translateY(-50%);
  font-size: 0.5rem;
  text-align: left;

  .time {
    font-size: 14px;
  }

  .title {
    font-size: 1rem;
    margin: 15px 0;
  }

  .content {
    font-size: 15px;
  }
}

// 修复深度选择器语法
:deep(.el-drawer) {
  background-color: rgba(255, 255, 255, 0.92);
}

:deep(.el-drawer.ttb) {
  height: 100% !important;
}

.navs {
  margin-top: 5rem;
  font-size: 0.7rem;
  color: #666;
}

// 响应式设计
@media screen and (max-width: 900px) {
  .mask {
    clip-path: polygon(0 0, 220px 0, 700px 100%, 0 100%);
  }
}

@media screen and (max-width: 780px) {
  .header {
    top: 40px;
    padding: 0 20px;
  }

  .mask {
    clip-path: none;
  }

  .info {
    bottom: 8%;
    left: 5%;
    top: 68%;
    width: 70%;
    transform: none;
  }
}
</style>
