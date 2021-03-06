<!--
 * @Author: your name
 * @Date: 2020-11-12 18:47:15
 * @LastEditTime: 2021-03-05 20:19:49
 * @LastEditors: Peng wenlei
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\views\home\index.vue
-->
<template>
    <div class="outer">
        <GiantScreen />
        <div class="content-wrap">
            <Article
                :datas="requestDatas"
                :isLoading="isLoading"
                :isNext="isNext"
            />
        </div>
    </div>
</template>
<script>
import GiantScreen from '@/components/GiantScreen'
import Article from '@/components/Article'
import { bottomHandle, clearBottomHandle } from '@/utils'
import { getArticleList } from '@/api/article'
export default {
    name: 'home',
    components: { GiantScreen, Article },
    data() {
        return {
            requestDatas: [],
            page: {
                keyword: '',
                pageSize: 10,
                pageIndex: 1
            },
            len: 0,
            isLoading: false,
            isNext: true
        }
    },
    created() {
        this.getArticleList()
    },
    computed: {
        // isLoginWatch 为 true 为登录状态  false 没有登录
        isLoginWatch() {
            return localStorage.getItem('loginStatus') ? true : false
        }
    },
    activated() {
        console.log(123)
        bottomHandle(
            () => this.isNext,
            () => {
                this.isLoading = true
                this.page.pageIndex += 1
                this.getArticleList()
            }
        )
    },
    deactivated() {
        clearBottomHandle()
    },
	destroyed() {
		clearBottomHandle()
	},
    methods: {
        async getArticleList() {
            const { data } = await getArticleList(this.page)
            console.log(data)
            const { total, rows } = data
            setTimeout(() => {
                this.requestDatas.push(...rows)
                this.pageLoad = false
                this.isLoading = false
                this.len = this.requestDatas.length
                this.isNext = this.len !== total
            }, 500)
        }
    }
}
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
