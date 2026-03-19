<template>
  <div class="page-container">
    <ScrollBar />
    <Header
      @like="likeChange"
      :isLike="isStar"
      :midText="detail.title"
      :userInfo="detail.user"
      :showLike="true"
      :music="detail.music"
    />
    <div class="article-wrapper">
      <div class="detail-card">
        <h1 class="title">{{ detail.title }}</h1>
        <div class="status flex align-center justify-center">
          <div class="meta-item">
            <i class="el-icon-time"></i>
            <span>{{ formatDateFilter(detail.createdAt) }}</span>
          </div>
          <div class="meta-item">
            <i class="el-icon-view"></i>
            <span>阅读：{{ detail.visitsNum || 0 }}</span>
          </div>
          <div class="meta-item">
            <i class="el-icon-document"></i>
            <span>字数：{{ wordCount }}</span>
          </div>
          <div class="meta-item">
            <i class="el-icon-chat-dot-round"></i>
            <span>评论：{{ commentList.length || 0 }}</span>
          </div>
          <div v-if="detail.user" class="meta-item author">
            <span>作者:</span>
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
          </div>
        </div>
        
        <div class="content markdown-body">
          <div class="picture" v-if="pictureUrl">
            <img :src="pictureUrl" loading="lazy" />
          </div>
          <div v-html="renderedContent" class="markdown-content" v-highlight></div>
        </div>

        <div class="divider"></div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
const { isCollection, collectionArticle } = useCollection()
const { addComment, getCommentList } = useArticleComments()
import { formatDate } from '@/utils'
import { createQiniuImage } from '@/utils/qiniuImage'
import MessageList from '@/components/Article/MessageList.vue'
import ScrollBar from '@/components/Article/ScrollBar.vue'
import MessageInput from '@/components/Article/MessageInput.vue'

const route = useRoute()
const config = useRuntimeConfig()
const cookieToken = useCookie<string | null>('token')
const requestUrl = useRequestURL()

// Store
const userStore = useUserStore()

// 响应式数据
const detail = ref<any>({})
const commentList = ref<any[]>([])
const aiteName = ref('')
const floorId = ref('')
const toUid = ref('')
const isStar = ref(2) // 1 收藏 2 未收藏
const rows = ref(6)
const isLoading = ref(false)
const isNext = ref(true)

/**
 * 计算属性
 */
const token = computed(() => userStore.token)
// const userId = computed(() => userStore.userId)
const articleId = computed(() => {
  const id = route.params.id
  if (Array.isArray(id)) return id[0] ? String(id[0]) : ''
  return id ? String(id) : ''
})

const qiniuImage = createQiniuImage(config.public.qiniuCdn)

const pictureUrl = computed(() => {
  const p = detail.value && detail.value.picture ? String(detail.value.picture) : ''
  return p ? qiniuImage(p, { scene: 'detail' }) : ''
})

const renderMarkdown = (rawContent: string) => {
  const anyMarked = marked as any
  if (anyMarked && typeof anyMarked.parse === 'function') return anyMarked.parse(rawContent)
  if (typeof anyMarked === 'function') return anyMarked(rawContent)
  return rawContent
}

const renderedContent = computed(() => {
  const rawContent = (detail.value && detail.value.content) ? String(detail.value.content) : ''
  try {
    return renderMarkdown(rawContent)
  } catch (e) {
    return rawContent
  }
})

const plainText = computed(() => {
  const html = renderedContent.value || ''
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
})

const wordCount = computed(() => {
  const t = plainText.value
  return t ? t.length : 0
})

const canonicalUrl = computed(() => {
  const u = new URL(requestUrl.href)
  u.pathname = route.path
  u.search = ''
  u.hash = ''
  return u.toString()
})

const seoTitle = computed(() => {
  const t = detail.value && detail.value.title ? String(detail.value.title) : ''
  return t ? `${t} | TheWind` : 'TheWind'
})

const seoDescription = computed(() => {
  const t = plainText.value
  if (!t) return 'TheWind\'s blog'
  return t.length > 160 ? t.slice(0, 160) : t
})

useHead(() => ({
  title: seoTitle.value,
  link: [
    { rel: 'canonical', href: canonicalUrl.value }
  ]
}))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: computed(() => detail.value && detail.value.title ? String(detail.value.title) : 'TheWind'),
  ogDescription: seoDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogImage: computed(() => pictureUrl.value || undefined)
})

/**
 * 格式化日期
 */
const formatDateFilter = (val: string) => {
    const d = formatDate(val)
    if (d && (d as any).year) return `${(d as any).year}-${(d as any).month}-${(d as any).day}`
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
    const { data, error } = await isCollection(params) as any
    if (error && error.value) throw error.value
    const res = data ? (data.value as any) : null
    isStar.value = (res && res.data != null ? res.data : res) as number
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

/**
 * 获取文章详情
 */
const fetchDetail = async () => {
  const idStr = articleId.value
  if (!idStr) return null

  const res = await $fetch('/article/getArticleDetail', {
    baseURL: config.public.apiBase,
    params: { articleId: idStr },
    headers: cookieToken.value ? { Authorization: cookieToken.value } : {},
    credentials: 'include'
  })
  const article = (res && (res as any).data != null ? (res as any).data : res) as any
  return article || null
}

const { data: detailData } = await useAsyncData(
  () => `detail-${articleId.value}`,
  fetchDetail,
  { watch: [articleId] }
)

watch(detailData, (v) => {
  detail.value = v || {}
}, { immediate: true })

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
    const { error } = await addComment(data) as any
    if (error && error.value) throw error.value
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
    isLoading.value = true
    const res = await $fetch('/comment/getCommentList', {
      baseURL: config.public.apiBase,
      params: { articleId: articleId.value },
      headers: cookieToken.value ? { Authorization: cookieToken.value } : {},
      credentials: 'include'
    })
    const payload = res && (res as any).data != null ? (res as any).data : res
    commentList.value = (payload && payload.commentList ? payload.commentList : []) as any[]
    isNext.value = false
    isLoading.value = false
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
      const data = {
        articleId: detail.value.id
      }
      const { error } = await collectionArticle(data) as any
      if (error && error.value) throw error.value
      ElMessage({
        type: 'success',
        message: '相识虽浅,似是经年',
        offset: 60
      })
      isStar.value = 1
      detail.value.likeNum = (detail.value.likeNum || 0) + 1
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
 * 监听 token 变化
 */
watch(
  token,
  (val) => {
    if (!val) {
      isStar.value = 2
      return
    }
    nextTick(() => {
      checkIsCollection()
    })
  },
  { immediate: true }
)

watch(
  articleId,
  async (id) => {
    if (!import.meta.client) return
    if (!id) return
    await getComData()
    setInputHeight()
    if (token.value) {
      nextTick(() => {
        checkIsCollection()
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  setInputHeight()
})
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.article-wrapper {
  display: flex;
  justify-content: center;
  padding: 100px 20px 40px;
}

.detail-card {
  width: 100%;
  max-width: 960px;
  background: rgba(16, 20, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px 50px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .title {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 1px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .status {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    gap: 20px;
    flex-wrap: wrap;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      
      i {
        font-size: 16px;
      }
    }

    .author {
      .author-name {
        margin: 0 5px;
        font-weight: 600;
        
        &.boy { color: #75b9eb; }
        &.girl { color: #ff3ec9; }
      }
    }
  }
  .markdown-content {
    text-align: left;
  }
  .content {
    color: #e0e0e0;
    font-size: 16px;
    line-height: 1.8;
    min-height: 300px;
    
    .picture {
      width: 100%;
      margin-bottom: 30px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      
      img {
        width: 100%;
        display: block;
        transition: transform 0.5s;
        
        &:hover {
          transform: scale(1.02);
        }
      }
    }
  }
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 60px 0 40px;
}

/* Markdown Styles Override */
:deep(.markdown-body) {
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  
  h1, h2, h3, h4, h5, h6 {
    color: #fff;
    border-bottom-color: rgba(255, 255, 255, 0.1);
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  p {
    margin-bottom: 16px;
  }

  a {
    color: #58a6ff;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  blockquote {
    color: #8b949e;
    border-left: 0.25em solid #30363d;
    background: rgba(255, 255, 255, 0.05);
    padding: 0 1em;
    margin-left: 0;
  }

  code {
    background-color: rgba(110, 118, 129, 0.4);
    border-radius: 6px;
    padding: 0.2em 0.4em;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 85%;
    color: #e0e0e0;
  }

  pre {
    background-color: #161b22;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    
    code {
      background-color: transparent;
      padding: 0;
      color: #c9d1d9;
    }
  }
  
  img {
    max-width: 100%;
    box-sizing: border-box;
    background-color: transparent;
  }
  
  table {
    tr {
      background-color: transparent;
      border-top: 1px solid #21262d;
      
      &:nth-child(2n) {
        background-color: rgba(22, 27, 34, 0.5);
      }
    }
    
    th, td {
      border: 1px solid #30363d;
      padding: 6px 13px;
    }
  }
}

/* Responsive */
@media screen and (max-width: 800px) {
  .article-wrapper {
    padding: 80px 15px 30px;
  }
  
  .detail-card {
    padding: 30px 20px;
    
    .title {
      font-size: 24px;
    }
    
    .status {
      justify-content: flex-start;
      gap: 15px;
      font-size: 12px;
    }
  }
}
</style>
