<template>
  <div class="flex flex-column align-center">
    <PageLoading v-if="pageLoad" />
    <Header />
    <div class="list">
      <ul class="monUl">
        <li
          v-for="thunk in requestDatas"
          :key="thunk.id"
          class="mContent fadeInUp"
          :class="`wow${thunk.index}`"
        >
          <div class="monTitle">{{ formatDateFilter(thunk.createdAt) }}</div>
          <div class="mCLi flex space-between">
            <div class="mCLeft flex align-center">
              <el-image
                :src="(thunk.picture || '')"
                :title="thunk.title"
                :alt="thunk.title"
                fit="cover"
              />
              <div class="mCLText flex flex-column space-around">
                <nuxt-link :to="{ name: 'detail-id', params: { id: thunk.id } }">
                    <span>{{ thunk.title }}</span>
                </nuxt-link>
                <span>{{ thunk.likeNum }} 喜欢 / {{ thunk.visitsNum }} 读</span>
              </div>
            </div>
            <span class="mCRight flex align-center">{{ thunk.day }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <Loading v-show="isLoading && !pageLoad" />
      <span class="notMany" v-show="!isLoading && !pageLoad">
        没有更多了~~O(∩_∩)O
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onActivated, onDeactivated, onMounted } from 'vue'
import { bottomHandle, clearBottomHandle, formatDate } from '@/utils'
import PageLoading from '@/components/common/PageLoading.vue'
// Use useArticle composable
const { getArticleList: fetchArticleList } = useArticle()

// 响应式数据
const page = ref({
  pageSize: 10,
  pageIndex: 1,
  keyword: ''
})
const requestDatas = ref<any[]>([])
const pageLoad = ref(true)
const isLoading = ref(false)
const isNext = ref(true)
const wowNum = ref(0)
const len = ref(0)

/**
 * 格式化日期
 */
const formatDateFilter = (val: string) => {
    const d = formatDate(val)
    if (d && d.year) return `${d.year}-${d.month}-${d.day}`
    return val
}

/**
 * 获取文章列表
 */
const getArticleList = async () => {
  isLoading.value = true
  try {
    const { data, error } = await fetchArticleList(page.value)
    if (error.value) throw error.value
    
    const res = data.value as any
    const { total, rows } = res.data || res

    setTimeout(() => {
      requestDatas.value.push(...rows)
      pageLoad.value = false
      isLoading.value = false
      len.value = requestDatas.value.length
      isNext.value = len.value !== total
    }, 500)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    isLoading.value = false
    pageLoad.value = false
  }
}

/**
 * 监听数据变化，初始化 WOW 动画
 */
watch(
  requestDatas,
  async () => {
    await nextTick()
      if (typeof window !== 'undefined') {
        try {
            const { WOW } = await import('wowjs')
            new WOW({
                live: false,
                offset: 0,
                boxClass: `wow${wowNum.value++}`
            }).init()
        } catch (e) {
            console.error('WOW init failed', e)
        }
      }
  }
)

// 初始化加载
onMounted(() => {
    getArticleList()
})

// 组件激活时设置底部加载监听
onActivated(() => {
  bottomHandle(
    () => isNext.value,
    () => {
      page.value.pageIndex += 1
      getArticleList()
    }
  )
})

// 组件失活时清除监听
onDeactivated(() => {
  clearBottomHandle()
})
</script>

<style lang="scss" scoped>
.list {
  width: 960px;
  padding: 80px 0 0px;

  .monUl {
    padding: 0;
    list-style: none;

    .monTitle {
      color: #6e7ab5;
      font-weight: 400;
      font-size: 18px;
      margin: 30px 0 10px;
      list-style: none;
      position: relative;
      text-align: left;

      &::before {
        content: '';
        width: 12px;
        height: 12px;
        display: inline-block;
        background-color: #dce8ec;
        border: 3px solid #afcfff;
        margin-right: 10px;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }

    .mContent {
      padding-left: 30px;
      border-left: 1px solid #f3fafd;
      margin-left: 6px;

      .mCLi {
        padding: 25px 0;
        border-bottom: 1px solid #f3fafd;

        .mCLeft {
          .el-image {
            flex-shrink: 0;
            width: 45px;
            height: 45px;
            border-radius: 4px;
            margin-right: 15px;
            overflow: hidden;
            cursor: pointer;
            border: 1px solid #f3fafd;
          }

          .mCLText {
            span:first-of-type {
              color: #5b6773;
              cursor: pointer;
              font-size: 15px;
              padding-bottom: 10px;
              transition: all 0.6s;
            }
            
            a {
                text-decoration: none;
                color: inherit;
            }

            span:nth-of-type(odd):hover {
              text-decoration: none;
              background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='blue' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10 3 5 3 10 3'/%3E%3C/svg%3E")
                repeat-x 0 100%;
              background-size: 20px auto;
              animation: waveMove 1s infinite linear;
            }

            span {
              color: #a1a0d6;
              font-size: 13px;
              letter-spacing: 0;
              text-align: left;
            }
          }
        }

        .mCRight {
          color: #d2c6a3;
          font-size: 13px;
        }
      }
    }
  }
}

.notMany {
  padding: 20px 0 0;
  color: #909090;
  letter-spacing: 2px;
  transition: all 0.3s;
  border-radius: 4px;
  text-align: center;
  display: inline-block;
  width: 100%;
}

.footer {
  height: 40px;
  margin-bottom: 40px;
}

// 响应式设计
@media screen and (max-width: 700px) {
  .list {
    width: 100%;
    padding: 80px 20px 20px;
  }
}
</style>
