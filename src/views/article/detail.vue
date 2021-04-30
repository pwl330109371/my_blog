<template>
    <div class="flex flex-column align-center">
        <scrollBar />
        <Header @like="likeChange" :isLike="isStar" :midText="detail.title" :userInfo="detail.user" :showLike="true" :music="detail.musicUrl" />
        <div class="detail">
            <h1 class="title">{{ detail.title }}</h1>
            <div class="status flex align-center">
                <span>{{ detail.createdAt | formatDate }}</span>
                <span>阅读：{{ detail.visitsNum }}</span>
                <span>字数：{{ content.length }}</span>
                <!-- <span>评论：{{ commentList.total }}</span> -->
                <span>评论：{{ commentList.length }}</span>
                <span v-if="detail.user">
                    作者: <span :class="detail.user.gender == '1' ? 'boy' : detail.user.gender == '2' ? 'girl' : ''">{{ detail.user.nickName }}</span>
                    <svg-icon :icon-class="detail.user.gender == '1' ? 'boy' : detail.user.gender == '2' ? 'girl' : ''" />
                </span>
            </div>
            <div class="content markdown-body">
                <div class="picture">
                    <img :src="detail.picture" alt="" srcset="" />
                </div>
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
import { getArticleDetail } from '@/api/article'
import { isCollection, collectionArticle, unCollectionArticle } from '@/api/collection'
import { bottomHandle, clearBottomHandle, formatDate } from '@/utils'
export default {
    name: 'detail',
    components: { MessageList, scrollBar, MessageInput },
    data() {
        return {
            detail: {}, // 详情数据
            commentList: [], // 评论列表
            aiteName: '', // 被评论人昵称
            floorId: '', // 主评论id
            toUid: '', // 被评论人id
            content: '', // 评论输入框内容
            isStar: 2, // 是否收藏 1 收藏 2 未收藏
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
    computed: {
        token() {
            return this.$store.state.user.token
        },
        userId() {
            return this.$store.state.user.userId
        },
        articleId() {
            return this.$route.params.id
        }
    },
    watch: {
        token() {
            this.$nextTick(() => {
                this.likeChange(2)
                // this.isCollection()
            })
        }
    },
    filters: {
        formatDate(val) {
            return formatDate(val, 'yyyy-MM-dd hh:mm')
        }
    },
    async activated() {
        await this.getDetail(this.$route.params.id) // 获取详情
        await this.markdownRender() // markdown 加载
        this.setInputHeight()
    },
    async created() {
        await this.getDetail(this.$route.params.id) // 获取详情
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
        if (this.token) {
            this.isCollection()
        }
    },
    methods: {
        // 收藏文章
        async isCollection() {
            const params = {
                articleId: this.articleId
                // articleId: 1
            }
            const { data } = await isCollection(params)
            this.isStar = data
        },
        // 获取文章详情数据
        async getDetail(id) {
            let params = {
                articleId: id
            }
            const { data } = await getArticleDetail(params)
            document.title = data.title // 动态设置页面的title
            this.detail = data
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
            this.aiteName = data.nickName
            this.floorId = data.parentId
            this.toUid = data.id
        },
        // 清楚掉aite后 删除艾特信息
        tagClose() {
            this.aiteName = ''
            this.floorId = ''
        },
        // 评论提交
        async comment(content) {
            const data = {
                articleId: this.articleId, // 文章id
                commentId: this.floorId, // 主评论id
                content, // 评论内容
                type: this.aiteName ? 2 : 1, // 如果 this.aiteName 那么便是二级回复,
                toUid: this.toUid // 被评论人id
            }
            try {
                await addComment(data)
                this.getComData()
                this.$message({
                    type: 'success',
                    message: '评论成功~~',
                    offset: 60
                })
            } catch (e) {
                console.log(e)
            }
        },
        // 获取评论列表
        async getComData() {
            const result = await getCommentList(this.$route.params.id)
            console.log(result)
            const { len, total } = result.data
            setTimeout(() => {
                this.commentList = result.data.commentList
                console.log(this.commentList)
                this.len += len
                this.isNext = this.len < total
                this.isLoading = false
            }, 1000)
        },
        // 设置喜欢这篇文章
        async likeChange(e) {
            // 未喜欢这篇文章
            if (e === 2) {
                const data = {
                    articleId: this.detail.id
                }
                const { code } = await collectionArticle(data)
                if (code === 200) {
                    this.$message({
                        type: 'success',
                        message: '相识虽浅,似是经年',
                        offset: 60
                    })
                    this.isStar = 1
                    this.$set(this.detail, 'likeNum', this.detail.likeNum + 1)
                }
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
        },
        deactivated() {
            clearBottomHandle()
        },
        destroyed() {
            clearBottomHandle()
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
