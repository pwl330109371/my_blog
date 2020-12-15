<template>
    <div
        class="flex flex-column align-center"
        v-loading.fullscreen.lock="pageLoad"
    >
        <Header />
        <Article :datas="requestDatas" />
    </div>
</template>
<script>
import Article from '@/components/Article'
import { WOW } from 'wowjs'
import { bottomHandle, clearBottomHandle } from '@/utils'
import { getArticleList } from '@/api/article'
export default {
    name: 'articleList',
    components: { Article },
    data() {
        return {
            page: {
                pageSize: 10,
                currentPage: 1
            },
            requestDatas: [],
            pageLoad: true,
            isLoading: false,
            isNext: true,
            wowNum: 0,
            len: 0
        }
    },
    watch: {
        requestDatas: {
            handler() {
                console.log(123123)
                this.$nextTick(() => {
                    new WOW({
                        live: false,
                        offset: 0,
                        boxClass: `wow${this.wowNum++}`
                    }).init()
                })
            }
        }
    },
    created() {
        this.getArticleList()
    },
    activated() {
        bottomHandle(
            () => this.isNext,
            () => {
                this.page.currentPage += 1
                this.getArticleList()
            }
        )
    },
    deactivated() {
        clearBottomHandle()
    },
    methods: {
        async getArticleList() {
            this.isLoading = true
            console.log('11111111111111', this.page)
            const { data } = await getArticleList(this.page)
            const { len, total, list } = data
            setTimeout(() => {
                this.requestDatas.push(...list)
                this.pageLoad = false
                this.isLoading = false
                this.len += len
                this.isNext = this.len !== total
            }, 500)
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    width: 640px;
    padding: 80px 0 0px;
    .monUl {
        .monTitle {
            color: #6e7ab5;
            font-weight: 400;
            font-size: 18px;
            margin: 30px 0 10px;
            list-style: none;
            position: relative;
            &::before {
                content: '';
                width: 12px;
                height: 12px;
                display: inline-block;
                background-color: #dce8ec;
                border: 3px solid #afcfff;
                margin-right: 22px;
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
                    img {
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
                        span:nth-of-type(odd):hover {
                            text-decoration: none;
                            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='blue' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E")
                                repeat-x 0 100%;
                            background-size: 20px auto;
                            animation: waveMove 1s infinite linear;
                        }
                        span {
                            color: #a1a0d6;
                            font-size: 13px;
                            letter-spacing: 0;
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
@media screen and (max-width: 700px) {
    .list {
        width: 100%;
        padding: 80px 20px 20px;
    }
}
</style>
