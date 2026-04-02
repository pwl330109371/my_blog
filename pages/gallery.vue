<template>
  <div class="gallery-page">
    <SpaceBackground />
    
    <div class="content-container">
      <div class="header-section">
        <h1 class="title wow animate__fadeInDown">时光图库</h1>
        <p class="subtitle wow animate__fadeInUp">定格美好瞬间，留住流年光影</p>
      </div>

      <div class="waterfall-container" ref="containerRef">
        <div 
          v-for="(col, colIndex) in columns" 
          :key="colIndex" 
          class="waterfall-column"
        >
          <div 
            v-for="item in col" 
            :key="item.id" 
            class="img-card wow animate__fadeInUp"
            :style="{ animationDelay: `${Math.random() * 0.3}s` }"
            @click="openPreview(item)"
          >
            <div class="img-wrapper">
              <img
                :src="getImageUrl(item)"
                loading="lazy"
                class="gallery-image"
                :alt="item.categoryName || 'gallery image'"
                @error="handleImageError"
              />
              <div class="img-overlay">
                <div class="overlay-content">
                  <span class="category-tag" v-if="item.categoryName">{{ item.categoryName }}</span>
                  <span class="date-tag">{{ formatDate(item.createdAt) }}</span>
                </div>
                <el-icon class="zoom-icon"><ZoomIn /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-state" ref="loadingRef">
        <div v-if="loading" class="loader">
          <span></span><span></span><span></span>
        </div>
        <div v-if="!hasMore && imgList.length > 0" class="no-more">
          - THE END -
        </div>
      </div>
    </div>

    <!-- 自定义全屏预览 Modal -->
    <Transition name="fade">
      <div v-if="previewVisible" class="preview-modal" @click.self="closePreview">
        <div class="preview-toolbar">
          <span class="preview-count">{{ currentImageIndex + 1 }} / {{ allImages.length }}</span>
          <button class="close-btn" @click="closePreview">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <div class="preview-content">
          <button class="nav-btn prev" @click.stop="prevImage" v-if="allImages.length > 1">
            <el-icon><ArrowLeft /></el-icon>
          </button>
          
          <div class="image-container" @click.stop v-if="currentImage">
            <img 
              :src="getImageUrl(currentImage)" 
              class="preview-image" 
              alt="Preview"
              @error="handleImageError"
            />
            <div class="preview-info">
              <h3>{{ currentImage.categoryName || '未分类' }}</h3>
              <p>{{ formatDate(currentImage.createdAt) }}</p>
            </div>
          </div>

          <button class="nav-btn next" @click.stop="nextImage" v-if="allImages.length > 1">
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useImg } from '@/composables/useImg'
import { ZoomIn, Close, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
// SpaceBackground 应该是全局注册或者自动导入的，如果没有需要手动导入
// import SpaceBackground from '@/components/SpaceBackground.vue'
import { parseTime } from '@/utils/index'

// 状态定义
const { getImgList } = useImg()
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(15)
const imgList = ref<any[]>([])
const allImages = ref<any[]>([]) // 扁平化数组，用于预览导航
const columns = ref<any[][]>([])
const columnHeights = ref<number[]>([])
const containerRef = ref<HTMLElement | null>(null)
const loadingRef = ref<HTMLElement | null>(null)

// 预览相关状态
const previewVisible = ref(false)
const currentImageIndex = ref(0)
const currentImage = computed(() => allImages.value[currentImageIndex.value] || null)

const buildRawImageUrl = (url: string) => {
  if (!url) return ''
  const trimmed = String(url).trim()
  if (/^https?:\/\//.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return trimmed
}

const getImageUrl = (item: any) => {
  return buildRawImageUrl(item?.imgUrl || '')
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.style.display = 'none'
}

// 瀑布流配置
const getColumnCount = () => {
  if (typeof window === 'undefined') return 3
  const width = window.innerWidth
  if (width < 768) return 2
  if (width < 1200) return 3
  return 4
}

// 初始化列
const initColumns = () => {
  const count = getColumnCount()
  columns.value = Array.from({ length: count }, () => [])
  columnHeights.value = new Array(count).fill(0)
}

// 格式化日期
const formatDate = (date: string) => {
  return parseTime(date, '{y}-{m}-{d}')
}

// 图片预加载并分配列
const distributeImages = async (newImages: any[]) => {
  if (!newImages.length) return

  for (const img of newImages) {
    // 添加到扁平数组
    allImages.value.push(img)
    
    await new Promise<void>((resolve) => {
      const image = new Image()
      image.src = getImageUrl(img)
      image.onload = () => {
        const aspectRatio = image.height / image.width
        
        const minHeight = Math.min(...columnHeights.value)
        const minIndex = columnHeights.value.indexOf(minHeight)
        
        columns.value[minIndex].push(img)
        columnHeights.value[minIndex] += aspectRatio
        resolve()
      }
      image.onerror = () => {
        // 失败也要 resolve
        const minHeight = Math.min(...columnHeights.value)
        const minIndex = columnHeights.value.indexOf(minHeight)
        columns.value[minIndex].push(img)
        columnHeights.value[minIndex] += 1 // 默认 1:1
        resolve()
      }
    })
  }
}

// 加载数据
const loadData = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true

  try {
    const { data } = await getImgList({
      pageIndex: page.value,
      pageSize: pageSize.value
    })

    if (data.value && data.value.code === 200) {
      const { rows, count } = data.value.data
      if (rows && rows.length > 0) {
        await distributeImages(rows)
        imgList.value = [...imgList.value, ...rows]
        page.value++
        if (imgList.value.length >= count) {
          hasMore.value = false
        }
      } else {
        hasMore.value = false
      }
    }
  } catch (error) {
    console.error('Failed to load images:', error)
  } finally {
    loading.value = false
  }
}

// 预览操作
const openPreview = (item: any) => {
  const index = allImages.value.findIndex(img => img.id === item.id)
  if (index !== -1) {
    currentImageIndex.value = index
    previewVisible.value = true
    document.body.style.overflow = 'hidden' // 禁止背景滚动
  }
}

const closePreview = () => {
  previewVisible.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = allImages.value.length - 1 // 循环
  }
}

const nextImage = () => {
  if (currentImageIndex.value < allImages.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0 // 循环
  }
}

// 键盘导航
const handleKeydown = (e: KeyboardEvent) => {
  if (!previewVisible.value) return
  if (e.key === 'Escape') closePreview()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

// 滚动监听
let observer: IntersectionObserver | null = null

const startObserver = () => {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadData()
      }
    })
  }, options)

  if (loadingRef.value) {
    observer.observe(loadingRef.value)
  }
}

onMounted(async () => {
  initColumns()
  await loadData()
  window.addEventListener('keydown', handleKeydown)
  
  nextTick(() => {
    startObserver()
    if (import.meta.client) {
      import('wowjs').then(({ WOW }) => {
        new WOW({
          boxClass: 'wow',
          animateClass: 'animate__animated',
          offset: 0,
          mobile: true,
          live: true
        }).init()
      })
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.gallery-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  color: #fff;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  
  .title {
    font-size: 1.8rem; /* 再次调小 */
    font-weight: 900;
    margin-bottom: 15px;
    color: #fff;
    text-shadow: 
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 20px #0096ff,
      0 0 40px #0096ff,
      0 0 80px #0096ff;
    letter-spacing: 8px;
    animation: neon 1.5s ease-in-out infinite alternate;
  }
  
  .subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 4px;
    font-weight: 300;
    text-transform: uppercase;
    position: relative;
    display: inline-block;
    padding: 0 10px;
    
    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30px;
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
    
    &::before { right: 100%; }
    &::after { left: 100%; }
  }
}

@keyframes neon {
  from {
    text-shadow: 
      0 0 5px #fff,
      0 0 10px #fff,
      0 0 20px #0096ff,
      0 0 40px #0096ff,
      0 0 80px #0096ff;
  }
  to {
    text-shadow: 
      0 0 2px #fff,
      0 0 5px #fff,
      0 0 10px #0096ff,
      0 0 20px #0096ff,
      0 0 40px #0096ff;
  }
}

.waterfall-container {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  min-height: 50vh;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 卡片样式优化 */
.img-card {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  /* 移除 transform: translateY 以防止闪屏，改为内部元素动画或仅 box-shadow */
  transition: box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 150, 255, 0.25);
    border-color: rgba(0, 150, 255, 0.4);
    
    .img-overlay {
      opacity: 1;
    }
    
    .gallery-image {
      transform: scale(1.1);
    }
  }
}

.img-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  /* 添加一个黑色背景，防止图片加载前的透明 */
  background: #1a1a1a; 
}

.gallery-image {
  width: 100%;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 100px;
  backface-visibility: hidden; /* 优化性能 */
}

/* 遮罩层优化 */
.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0); /* 初始透明 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  transition: background 0.3s ease;
  
  .overlay-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* 默认显示，不需要 transform 和 opacity 隐藏 */
  }
  
  .zoom-icon {
    align-self: center;
    font-size: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
    margin-top: auto;
    margin-bottom: auto;
    transform: scale(0.5);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    /* 添加毛玻璃背景给图标 */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    padding: 15px;
    width: 70px;
    height: 70px;
  }
}

.img-card:hover {
  .img-overlay {
    background: rgba(0, 0, 0, 0.2); /* 悬停时稍微变暗 */
  }
  .zoom-icon {
    transform: scale(1);
    opacity: 1;
  }
}

.category-tag {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '#';
    color: #0096ff;
    font-weight: bold;
  }
}

.date-tag {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

/* 预览 Modal 样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.preview-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10001;

  .preview-count {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 2px;
  }

  .close-btn {
    background: rgba(0, 0, 0, 0.5); /* 加深背景 */
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    padding: 0; /* 移除 padding，由 flex 控制居中 */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    width: 48px; /* 稍微加大尺寸 */
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px); /* 添加毛玻璃 */
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    
    .el-icon {
      font-size: 24px;
      font-weight: bold;
    }
    
    &:hover {
      transform: rotate(90deg) scale(1.1);
      background: rgba(255, 59, 59, 0.8); /* 悬停变为红色 */
      border-color: rgba(255, 59, 59, 0.8);
      box-shadow: 0 4px 15px rgba(255, 59, 59, 0.4);
    }
  }
}

.preview-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.image-container {
  max-width: 90%;
  max-height: 85%;
  position: relative;
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
  border-radius: 4px;
  overflow: hidden;
  
  .preview-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    display: block;
    user-select: none;
  }

  .preview-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    color: #fff;
    transform: translateY(0); /* Make it always visible */
    transition: transform 0.3s ease;
    
    h3 {
      font-size: 18px;
      margin-bottom: 5px;
    }
    p {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
    }
  }

  /* Remove hover effect since it's always visible */
  /* &:hover .preview-info {
    transform: translateY(0);
  } */
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 100;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev { left: 40px; }
  &.next { right: 40px; }
  
  .el-icon {
    font-size: 24px;
  }
}

/* Loading 动画 */
.loader {
  display: inline-flex;
  gap: 6px;
  
  span {
    width: 6px;
    height: 6px;
    background: #0096ff;
    border-radius: 50%;
    animation: bounce 0.5s infinite alternate;
    
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-section .title { font-size: 1.8rem; }
  .preview-toolbar { padding: 15px 20px; }
  .nav-btn { width: 36px; height: 36px; }
  .nav-btn.prev { left: 10px; }
  .nav-btn.next { right: 10px; }
}
</style>
