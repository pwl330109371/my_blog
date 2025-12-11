<template>
  <div class="outer" @scroll="handleScroll" ref="mainCenterRef">
    <GiantScreen />
    <div class="content-wrap">
      <Article :datas="requestDatas" :isLoading="isLoading" :isNext="isNext" />
    </div>
    <div style="padding-bottom: 15px; cursor: pointer; text-align: center;" @click="goHref">
      鄂ICP备2021007829号-1
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onActivated, onDeactivated, onUnmounted, onMounted } from 'vue'
import { bottomHandle, clearBottomHandle } from '@/utils'
// Use useArticle composable
const { getArticleList } = useArticle()

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

/**
 * 获取当前的滚动位置
 */
const handleScroll = () => {
  if (mainCenterRef.value) {
    scroll.value = mainCenterRef.value.scrollTop
  }
}

/**
 * 获取文章列表
 */
const loadData = async () => {
  try {
    const { data, error } = await getArticleList(page.value)
    if (error.value) throw error.value
    
    // According to useApi logic, data is Ref.
    const res = data.value as any
    const { total, rows } = res.data || res 
    
    if (page.value.pageIndex === 1) {
       requestDatas.value = rows
    } else {
       requestDatas.value.push(...rows)
    }

    isLoading.value = false
    len.value = requestDatas.value.length
    isNext.value = len.value !== total
    
  } catch (error) {
    console.error('获取文章列表失败:', error)
    isLoading.value = false
  }
}

/**
 * 跳转工信部网站
 */
const goHref = () => {
  window.open('https://beian.miit.gov.cn/', '_blank')
}

// 初始化
onMounted(() => {
    loadData()
})

// 组件激活时恢复滚动位置并监听底部
onActivated(() => {
  if (scroll.value > 0 && mainCenterRef.value) {
    mainCenterRef.value.scrollTo(0, scroll.value)
    scroll.value = 0
  }

  bottomHandle(
    isNext.value,
    () => {
      isLoading.value = true
      page.value.pageIndex += 1
      loadData()
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
  overflow-y: auto; // Ensure updated for scroll handling
  height: 100vh;
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
    background: #eaeaea;
    z-index: 0;
    width: 1px;
    height: 100%;
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
