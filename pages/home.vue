<template>
  <div class="outer" @scroll="handleScroll" ref="mainCenterRef">
    <GiantScreen />
    <div class="content-wrap">
      <Article :datas="requestDatas" :isLoading="isLoading" :isNext="isNext" />
    </div>
    <div style="padding-bottom: 15px; cursor: pointer; text-align: center;" @click="goHref">
      鲁ICP备2025208345号-1
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onActivated, onDeactivated, onUnmounted } from 'vue'
import { bottomHandle, clearBottomHandle } from '@/utils'
// Use useArticle composable
const config = useRuntimeConfig()
const token = useCookie<string | null>('token')

defineOptions({
  name: 'home'
})

const mainCenterRef = ref<HTMLElement | null>(null)

// 响应式数据
const requestDatas = ref<any[]>([])
const page = ref({
  keyword: '',
  pageSize: 10,
  pageIndex: 1
})
const len = ref(0)
const scroll = ref(0) // 记录滚动距离
const isLoading = ref(false)
const isNext = ref(true)
const listFetchSeed = ref(0)
const activatedOnce = ref(false)

const { data: listRes, pending, error, refresh } = await useAsyncData(
  () => `home-article-list-${listFetchSeed.value}-${page.value.pageIndex}`,
  async () => {
    return await $fetch('/article/getArticleList', {
      baseURL: config.public.apiBase,
      params: page.value,
      headers: token.value ? { Authorization: token.value } : {},
      credentials: 'include'
    })
  },
  { server: false, immediate: true }
)

/**
 * 获取当前的滚动位置
 */
const handleScroll = () => {
  if (mainCenterRef.value) {
    scroll.value = mainCenterRef.value.scrollTop
  }
}

const resetAndLoad = async () => {
  isNext.value = true
  page.value.pageIndex = 1
  requestDatas.value = []
  listFetchSeed.value += 1
  await refresh()
}

/**
 * 跳转工信部网站
 */
const goHref = () => {
  window.open('https://beian.miit.gov.cn/', '_blank')
}

watch(
  pending,
  (p) => {
    isLoading.value = p
  },
  { immediate: true }
)

watch(
  error,
  (e) => {
    if (e) console.error('获取文章列表失败:', e)
  },
  { immediate: true }
)

watch(
  listRes,
  (res: any) => {
    const payload = (res && (res.data != null ? res.data : res)) || null
    if (!payload) return

    const total = payload.total ?? 0
    const rows = Array.isArray(payload.rows) ? payload.rows : []

    if (page.value.pageIndex === 1) {
      requestDatas.value = rows
    } else {
      requestDatas.value.push(...rows)
    }

    len.value = requestDatas.value.length
    isNext.value = len.value !== total
  },
  { immediate: true }
)

// 组件激活时恢复滚动位置并监听底部
onActivated(() => {
  if (!activatedOnce.value) {
    activatedOnce.value = true
  } else if (requestDatas.value.length === 0) {
    resetAndLoad()
  }

  if (scroll.value > 0 && mainCenterRef.value) {
    mainCenterRef.value.scrollTo(0, scroll.value)
    scroll.value = 0
  }

  bottomHandle(
    () => isNext.value,
    () => {
      page.value.pageIndex += 1
      refresh()
    }
  )
})

// 组件失活时清除底部监听
onDeactivated(() => {
  clearBottomHandle()
})

// 组件卸载时清除底部监听
onUnmounted(() => {
  clearBottomHandle()
})
</script>

<style lang="scss" scoped>
.outer {
  overflow: auto; // Ensure updated for scroll handling
  height: 100vh;
  // 移除可能存在的背景色
  background: transparent;
}

.content-wrap {
  position: relative;
  padding: 100px 0;
  min-height: 800px;

  &::after {
    content: '';
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    position: absolute;
    // 修改为发光线条
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 150, 255, 0.3) 20%,
      rgba(0, 150, 255, 0.3) 80%,
      transparent
    );
    z-index: 0;
    width: 1px;
    height: 100%;
    box-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
  }
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .content-wrap {
    width: 900px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 900px) {
  .content-wrap {
    width: 100%;
  }
}
</style>
