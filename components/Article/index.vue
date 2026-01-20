<template>
  <div>
    <div
      class="article flex align-center fadeInUp"
      :class="`wow${item.index}`"
      v-for="item in datas"
      :key="item.id || item._id"
    >
      <div
        class="img-outer flex align-center justify-center"
        @click="toDetail(item.id || item._id)"
      >
        <img :src="$qiniu(item.picture, { scene: 'list' })"
        loading="lazy" />
      </div>
      <div class="text-outer">
        <div class="info">
          <div class="time">
            {{ formatDateFilter(item.createdAt) }}
          </div>
          <div class="title" @click="toDetail(item._id || item.id)">
            <a>{{ item.title }}</a>
          </div>
          <div class="description">{{ item.describe }}</div>
          <div class="handle flex align-center">
            <div class="handle-thunk flex align-center">
              <i class="iconfont icon-view"></i>
              <span>{{ item.visitsNum }}</span>
            </div>
            <div class="handle-thunk flex align-center">
              <i class="iconfont icon-xinheart118"></i>
              <span>{{ item.likeNum }}</span>
            </div>
            <div class="handle-thunk flex align-center">
              <i class="el-icon-edit"></i>
              <span>{{ item.content ? item.content.length : 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loader flex align-center justify-center">
      <Loading v-show="isLoading" />
      <span class="notMany" v-show="!isLoading && !isNext">
        没有更多了~~O(∩_∩)O
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onDeactivated, onUnmounted, onMounted } from 'vue'
// Remove static import
// import { WOW } from 'wowjs'

// Props
const props = defineProps({
  datas: {
    type: Array as any,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isNext: {
    type: Boolean,
    default: true
  }
})

// Router
const router = useRouter()

// 响应式数据
const wowNum = ref(0)

/**
 * 格式化日期
 */
const formatDateFilter = (val: string) => {
  return val
}

/**
 * 跳转到文章详情
 */
const toDetail = (id: string) => {
  router.push({ name: 'detail-id', params: { id } })
}

// 监听数据变化，初始化 WOW 动画
watch(
  () => props.datas,
  async () => {
    await nextTick()
    // Check if client-side
    if (typeof window !== 'undefined') {
        try {
            const { WOW } = await import('wowjs')
            new WOW({
                live: false,
                offset: 0,
                boxClass: `wow${wowNum.value}`
            }).init()
            wowNum.value++
        } catch (e) {
            console.error('WOW.js init failed', e)
        }
    }
  }
)

</script>

<style lang="scss" scoped>
.article {
  position: relative;
  z-index: 1;
  margin-bottom: 60px; // 增加间距
  padding: 0 20px;

  &:not(:first-of-type) {
    margin-top: 100px;
  }

  &:nth-of-type(odd) {
    flex-direction: row-reverse;
  }

  // 悬停效果
  &:hover {
    .img-outer {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 150, 255, 0.2);
      border-color: rgba(0, 150, 255, 0.5);
    }
    .text-outer {
      border-color: rgba(0, 150, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }
  }

  .img-outer {
    width: 680px;
    height: 440px;
    font-size: 0;
    position: relative;
    cursor: pointer;
    z-index: 1;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
    flex: 0 0 auto;
    background: rgba(0,0,0,0.2);

    img {
      flex: 0 0 auto;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  .text-outer {
    padding: 60px 80px;
    border-radius: 12px;
    height: 400px;
    width: 550px; // 稍微加宽
    // 玻璃拟态核心样式
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;

    // 调整重叠部分，制造层次感
    margin-left: -50px; 
    margin-right: -50px;
    position: relative;
    z-index: 2;

    .info {
      .time {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        margin-bottom: 10px;
        letter-spacing: 1px;
      }

      .title {
        margin: 10px 0 15px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-weight: 600;

        a {
          font-size: 28px;
          line-height: 1.4;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s;
          text-decoration: none;
          background: linear-gradient(90deg, #fff, #0096ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          background-position: 0 0;

          &:hover {
            background-position: 100% 0;
            text-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
          }
        }
      }

      .description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        line-height: 1.8;
        margin-top: 15px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      .handle {
        margin-top: 40px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
        display: flex;
        gap: 20px;

        .handle-thunk {
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.3s;

          i {
            font-size: 16px;
          }

          &:hover {
            color: #0096ff;
          }
        }
      }
    }
  }

  // 偶数项调整边距方向
  &:nth-of-type(even) {
    .text-outer {
      margin-left: -50px;
      margin-right: 0;
    }
  }
  
  &:nth-of-type(odd) {
    .text-outer {
      margin-right: -50px;
      margin-left: 0;
    }
  }
}

.loader {
  margin-top: 50px;
  .notMany {
    color: rgba(255, 255, 255, 0.3);
    font-size: 14px;
  }
}

// 响应式适配
@media screen and (max-width: 1200px) {
  .article {
    flex-direction: column !important; // 强制垂直排列
    align-items: center;
    margin-top: 60px !important;
    
    .img-outer {
      width: 100%;
      height: 300px;
      margin-bottom: -30px; // 重叠效果
    }
    
    .text-outer {
      width: 90%;
      height: auto;
      padding: 50px 30px 30px;
      margin: 0 !important; // 清除负边距
    }
  }
}
</style>
