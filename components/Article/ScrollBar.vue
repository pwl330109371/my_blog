<template>
  <div class="top" :style="{ width: bar + '%' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { throttle } from '@/utils'

// 响应式数据
const bar = ref(0)
// Type for the throttled function
let throttleScrollHandle: any = null

/**
 * 滚动处理函数
 */
const scrollHandle = () => {
  const scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset
  const windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight
  const scrollHeight =
    document.documentElement.scrollHeight || document.body.scrollHeight

  const scrollBar =
    (Math.ceil(scrollTop) / Math.ceil(scrollHeight - windowHeight)) * 100
  bar.value = scrollBar
}

// 生命周期钩子
onMounted(() => {
  throttleScrollHandle = throttle(scrollHandle, 100)
  window.addEventListener('scroll', throttleScrollHandle)
})

onUnmounted(() => {
  if (throttleScrollHandle) {
    window.removeEventListener('scroll', throttleScrollHandle)
  }
})
</script>

<style scoped lang="scss">
.top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999999;
  background: #409eff;
  height: 2px;
  transition: all 0.3s linear;
}
</style>
