<!--
 * @Author: Peng wenlei
 * @Date: 2020-11-12 18:47:15
 * @Description: 首页 - 展示文章列表
 * @FilePath: /my_blog/src/views/home/index.vue
-->
<template>
  <div class="outer" @scroll="handleScroll" ref="mainCenterRef">
    <GiantScreen />
    <div class="content-wrap">
      <Article :datas="requestDatas" :isLoading="isLoading" :isNext="isNext" />
    </div>
    <div style="padding-bottom: 15px; cursor: pointer" @click="goHref">
      鄂ICP备2021007829号-1
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onActivated, onDeactivated, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import GiantScreen from '@/components/GiantScreen'
import Article from '@/components/Article'
import { bottomHandle, clearBottomHandle } from '@/utils'
import { getArticleList } from '@/api/article'

// Route
const route = useRoute()

// Refs
const mainCenterRef = ref(null)

// 响应式数据
const requestDatas = ref([])
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
 * 计算属性：是否登录
 */
const isLoginWatch = computed(() => {
  return !!localStorage.getItem('loginStatus')
})

/**
 * 获取当前容器的滚动位置
 */
const handleScroll = () => {
  if (mainCenterRef.value) {
    scroll.value = mainCenterRef.value.scrollTop
  }
}

/**
 * 获取文章列表
 */
const getArticleListData = async () => {
  try {
    const { data } = await getArticleList(page.value)
    console.log(data)
    const { total, rows } = data

    setTimeout(() => {
      requestDatas.value.push(...rows)
      isLoading.value = false
      len.value = requestDatas.value.length
      isNext.value = len.value !== total
      scroll.value =
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset
    }, 500)
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

// 初始化加载文章列表
getArticleListData()

// 组件激活时恢复滚动位置并监听底部
onActivated(() => {
  if (scroll.value > 0) {
    window.scrollTo(0, scroll.value)
    scroll.value = 0
  }

  bottomHandle(
    () => isNext.value,
    () => {
      isLoading.value = true
      page.value.pageIndex += 1
      getArticleListData()
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
  overflow: hidden;
}

.content-wrap {
  position: relative;
  padding: 100px 0;

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
  }
}

@media screen and (max-width: 900px) {
  .content-wrap {
    width: 100%;
  }
}
</style>
