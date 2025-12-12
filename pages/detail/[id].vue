<template>
  <div class="flex flex-column align-center">
    <ScrollBar />
    <Header
      @like="likeChange"
      :isLike="isStar"
      :midText="detail.title"
      :userInfo="detail.user"
      :showLike="true"
      :music="detail.musicUrl"
    />
    <div class="detail">
      <h1 class="title">{{ detail.title }}</h1>
      <div class="status flex align-center">
        <span>{{ formatDateFilter(detail.createdAt) }}</span>
        <span>阅读：{{ detail.visitsNum }}</span>
        <span>字数：{{ content?.length || 0 }}</span>
        <span>评论：{{ commentList?.length || 0 }}</span>
        <span v-if="detail.user">
          作者:
          <span
            :class="
              detail.user.gender == '1'
                ? 'boy'
                : detail.user.gender == '2'
                ? 'girl'
                : ''
            "
          >
            {{ detail.user.nickName }}
          </span>
          <SvgIcon
            :icon-class="
              detail.user.gender == '1'
                ? 'boy'
                : detail.user.gender == '2'
                ? 'girl'
                : ''
            "
          />
        </span>
      </div>
      <div class="content markdown-body">
        <div class="picture">
          <img :src="(detail.picture || '') + '/thumbnail/900x540'" alt="文章封面" v-if="detail.picture" />
        </div>
        <div v-html="content" v-highlight></div>
      </div>
      <div id="hash"></div>
      <MessageInput
        :aiteName="aiteName"
        @tagClose="tagClose"
        @comment="handleComment"
        :rows="rows"
      />
      <MessageList
        @reply="reply"
        :lists="commentList"
        :isLoading="isLoading"
        :isNext="isNext"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onActivated } from 'vue'
import { marked } from 'marked'
// Imports removed
// Correct ussage:
const { getArticleDetail } = useArticle()
const { isCollection, collectionArticle } = useCollection()
const { addComment, getCommentList } = useArticleComments()
import { bottomHandle, formatDate } from '@/utils'
import MessageList from '@/components/article/MessageList.vue'
import ScrollBar from '@/components/article/ScrollBar.vue'
import MessageInput from '@/components/article/MessageInput.vue'

// Auto-imported: useUserStore, useRoute, useRouter, ElMessage

// Router
const router = useRouter()
const route = useRoute()

// Store
const userStore = useUserStore()

// 响应式数据
const detail = ref<any>({})
const commentList = ref<any[]>([])
const aiteName = ref('')
const floorId = ref('')
const toUid = ref('')
const content = ref('')
const isStar = ref(2) // 1 收藏 2 未收藏
const page = ref({
  pageSize: 10,
  pageNum: 1 // Changed from pageIndex to match usages, verify API
})
const len = ref(0)
const rows = ref(6)
const isLoading = ref(false)
const isNext = ref(true)

/**
 * 计算属性
 */
const token = computed(() => userStore.token)
// const userId = computed(() => userStore.userId)
const articleId = computed(() => route.params.id)

/**
 * 格式化日期
 */
const formatDateFilter = (val: string) => {
    const d = formatDate(val)
    if (d && d.year) return `${d.year}-${d.month}-${d.day} ${d.hour || ''}:${d.minute || ''}`
    // Original util probably returned string format
    return val
}

/**
 * 检查是否已收藏
 */
const checkIsCollection = async () => {
  try {
    const params = {
      articleId: articleId.value
    }
    const { data: fetchData, error } = await isCollection(params)
    if (error.value) throw error.value
    
    const res = fetchData.value as any
    if (!res) return
    
    // 获取收藏状态
    const data = res.data !== undefined ? res.data : res
    isStar.value = data
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

/**
 * 获取文章详情
 */
const getDetail = async (id: string | string[]) => {
  try {
    const params = {
      articleId: id
    }
    const { data: fetchData, error } = await getArticleDetail(params)
    if (error.value) throw error.value
    
    const res = fetchData.value as any
    if (!res) {
      console.warn('文章详情返回数据为空')
      return
    }
    
    const data = res.data || res
    
    // Setting title in Nuxt 4
    useHead({
        title: data.title
    })
    
    detail.value = data
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

/**
 * Markdown 渲染
 */
const markdownRender = () => {
  marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  })
  content.value = marked(detail.value.content || '') as string
}

/**
 * 子层评论回复
 */
const reply = (data: any) => {
  aiteName.value = data.nickName
  floorId.value = data.parentId
  toUid.value = data.id
}

/**
 * 清除艾特信息
 */
const tagClose = () => {
  aiteName.value = ''
  floorId.value = ''
}

/**
 * 提交评论
 */
const handleComment = async (commentContent: string) => {
  const data = {
    articleId: articleId.value,
    commentId: floorId.value,
    content: commentContent,
    type: aiteName.value ? 2 : 1,
    toUid: toUid.value
  }

  try {
    const { error } = await addComment(data)
    if (error.value) throw error.value
    
    await getComData()
    ElMessage({
      type: 'success',
      message: '评论成功~~',
      offset: 60
    })
  } catch (error) {
    console.error('评论失败:', error)
    ElMessage({
      type: 'error',
      message: '评论失败，请重试',
      offset: 60
    })
  }
}

/**
 * 获取评论列表
 */
const getComData = async () => {
  try {
    const { data: fetchData, error } = await getCommentList(route.params.id)
    if (error.value) throw error.value
    
    const result = fetchData.value as any
    if (!result) {
      console.warn('评论列表返回数据为空')
      isLoading.value = false
      return
    }
    
    const responseData = result.data || result
    const dataLen = responseData.len || 0
    const total = responseData.total || 0
    const list = responseData.commentList || responseData.list || []

    setTimeout(() => {
      commentList.value = list
      len.value += dataLen
      isNext.value = len.value < total
      isLoading.value = false
    }, 1000)
  } catch (error) {
    console.error('获取评论列表失败:', error)
    isLoading.value = false
  }
}

/**
 * 收藏/取消收藏文章
 */
const likeChange = async (e: number) => {
  if (e === 2) {
    try {
      const payload = {
        articleId: detail.value.id
      }
      const { data: fetchData, error } = await collectionArticle(payload)
      if (error.value) throw error.value
      
      const res = fetchData.value as any
      const code = res?.code || (res?.data && res.data.code)

      if (code === 200) {
        ElMessage({
          type: 'success',
          message: '相识虽浅,似是经年',
          offset: 60
        })
        isStar.value = 1
        detail.value.likeNum = (detail.value.likeNum || 0) + 1
      }
    } catch (error) {
      console.error('收藏失败:', error)
    }
  } else {
    ElMessage({
      type: 'error',
      message: '您已经喜欢过这篇文章啦~~',
      offset: 60
    })
  }
}

/**
 * 设置输入框高度（响应式）
 */
const setInputHeight = () => {
  if (typeof window !== 'undefined') {
    const width = document.documentElement.clientWidth
    if (width <= 600) {
        rows.value = 4
    }
  }
}

/**
 * 初始化页面数据
 */
const initPage = async () => {
  await getDetail(route.params.id)
  markdownRender()
  setInputHeight()
}

/**
 * 监听 token 变化
 */
watch(token, () => {
  nextTick(() => {
    likeChange(2)
  })
})

// 生命周期钩子
onMounted(async () => {
  await initPage()
  await getComData()

  // 设置底部加载监听
  bottomHandle(
    isNext.value,
    () => {
      isLoading.value = true
      page.value.pageSize += 10
      getComData()
    }
  )

  // 检查收藏状态
  if (token.value) {
    checkIsCollection()
  }
})

onActivated(async () => {
  await initPage()
})
</script>

<style lang="scss" scoped>
#hash {
  margin-bottom: 100px;
}

.detail {
  width: 960px;

  .title {
    font-size: 30px;
    padding: 80px 0 22px;
    color: #333;
  }

  .status {
    color: #6a737d;
    position: relative;
    line-height: 22px;

    &::before {
      content: '';
      width: 100%;
      height: 1px;
      background: #eaeaeaa6;
      position: absolute;
      left: 0;
      bottom: -30px;
    }

    span {
      font-size: 13px;
      margin-right: 10px;
    }

    .boy {
      color: rgb(117, 185, 235);
      margin-right: 0;
    }

    .girl {
      color: rgb(255, 62, 201);
      margin-right: 0;
    }
  }

  .content {
    padding-top: 40px;
    font-size: 14px;
    text-align: left;
    line-height: 30px;
  }

  .picture {
    margin-bottom: 20px;
    max-height: 540px;
    overflow: hidden;
    border-radius: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
}

// 响应式设计
@media screen and (max-width: 800px) {
  .detail {
    width: 90%;
  }
}

@media screen and (max-width: 600px) {
  .detail {
    .content {
      padding-top: 30px;
    }

    .title {
      font-size: 26px;
      padding-top: 88px;
    }

    .status {
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
