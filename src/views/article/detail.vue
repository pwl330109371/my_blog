<template>
    <div class="flex flex-column align-center">
        <scrollBar />
        <Header @like="likeChange" :isLike="detail.isLike" :midText="detail.title" :showLike="true" :music="detail.musicUrl" />
        <div class="detail">
            <h1 class="title">{{ detail.title }}</h1>
            <div class="status flex align-center">
                <!-- <span>{{ detail.date }}</span> -->
                <span>2020-11-12</span>
                <span>阅读：{{ detail.visitsNum }}</span>
                <span>字数：{{ content.length }}</span>
                <!-- <span>评论：{{ commentList.total }}</span> -->
                <span>评论：10</span>
                <span>喜欢: {{ detail.likeNum }}</span>
            </div>
            <div class="content markdown-body">
                <!-- <pre class="language-markup">
                    <code v-html="detail.content" v-highlight></code>
                </pre> -->
                <div v-html="content" v-highlight></div>
            </div>
            <div id="hash"></div>
            <MessageInput :aiteName="aiteName" @tagClose="tagClose" @comment="comment" :rows="rows" />
            <MessageList @reply="reply" :lists="commentList" :isLoading="isLoading" :isNext="isNext" />
        </div>
    </div>
</template>

<script>
import marked from 'marked'
// import 'highlight.js/styles/monokai-sublime.css'
import MessageList from './components/messageList'
import scrollBar from './components/scrollBar'
import MessageInput from './components/messageInput'
import { addComment, getCommentList } from '@/api/articleComments'
import { getArticleDetail, addFavorite } from '@/api/article'
import { bottomHandle } from '@/utils'
export default {
    name: 'detail',
    components: { MessageList, scrollBar, MessageInput },
    data() {
        return {
            detail: {},
            commentList: [],
            userName: '',
            aiteName: '',
            floorId: '',
            userContent: '',
            content: '',
            page: {
                pageSize: 10,
                pageNum: 1
            },
            len: 0,
            rows: 6, // input的高
            isLoading: false,
            isNext: true
        }
    },
    async created() {
        await this.getDetail(
            this.$route.params.id
            // JSON.parse(localStorage.getItem('userInfo')).id
        ) // 获取详情
        await this.markdownRender() // markdown 加载
        this.setInputHeight()
    },
    mounted() {
        this.getComData() // 加载留言列表
        bottomHandle(
            () => this.isNext,
            () => {
                // 触底监听事件
                this.isLoading = true
                this.page.pageSize += 10
                this.getComData()
            }
        )
    },
    methods: {
        async getDetail(id) {
            let params = {
                articleId: id
            }
            const { data } = await getArticleDetail(params)
            console.log(data)
            // const data = await this.$store.dispatch(
            //     'dataHandle',
            //     result.data.data
            // )
            document.title = data.data.title // 动态设置页面的title
            this.detail = data.data
        },
        markdownRender() {
            marked.setOptions({
                renderer: new marked.Renderer(),
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false
            })
            this.content = marked(this.detail.content)
        },
        // 子层评论
        reply(data) {
            this.aiteName = data.userName
            this.floorId = data.parentId
        },
        // 清楚掉aite后 删除艾特信息
        tagClose() {
            this.aiteName = ''
            this.floorId = ''
        },
        // 评论提交
        async comment(content) {
            const data = {
                articleId: this.$route.params.id,
                userId: JSON.parse(localStorage.getItem('userInfo')).id,
                content
            }
            this.floorId && (data.floorId = this.floorId)
            try {
                const reqResult = await addComment(data)
                this.getComData()
                this.$message({
                    type: 'success',
                    message: '评论成功~~',
                    offset: 60
                })
            } catch (e) {}
        },

        // 获取评论列表
        async getComData() {
            const data = {
                ...this.page,
                articleId: this.$route.params.id
            }
            const result = await getCommentList(data)
            const { len, total } = result.data.data
            setTimeout(() => {
                this.commentList = result.data.data
                console.log(this.commentList)
                this.len += len
                this.isNext = this.len < total
                this.isLoading = false
            }, 1000)
        },
        // 设置喜欢这篇文章
        async likeChange(e) {
            if (!e) {
                // 未喜欢这篇文章
                const data = {
                    articleId: this.detail.id,
                    userId: JSON.parse(localStorage.getItem('userInfo')).id
                }
                const result = await addFavorite(data)
                this.$message({
                    type: 'success',
                    message: '相识虽浅,似是经年',
                    offset: 60
                })
                this.$set(this.detail, 'isLike', true)
                this.$set(this.detail, 'likeNum', this.detail.likeNum + 1)
            } else {
                this.$message({
                    type: 'error',
                    message: '您已经喜欢过这篇文章啦~~',
                    offset: 60
                })
            }
        },

        setInputHeight() {
            const width = document.documentElement.clientWidth
            width <= 600 && (this.rows = 4)
        }
    }
}
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
    }
    .content {
        padding-top: 100px;
        font-size: 14px;
        text-align: left;
        line-height: 30px;
    }
}

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
