<!--
 * @Author: your name
 * @Date: 2021-03-29 17:39:21
 * @LastEditTime: 2021-04-30 15:11:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\components\Menu\index.vue
-->
<template>
    <div class="menu-container">
        <el-drawer :visible.sync="drawer" :append-to-body="true" direction="ttb" size="100%" :before-close="handleClose">
            <ul class="menu-group">
                <router-link tag="li" class="menu-item" :to="{ name: 'Home' }">首页</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'ArticleList' }">文章</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Rainy' }">听雨</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Login' }">登录</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Wode' }">站主</router-link>
            </ul>
        </el-drawer>
    </div>
</template>

<script>
export default {
    props: {
        showMenu: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            direction: 'rtl',
            drawer: false
        }
    },
    watch: {
        $route() {
            this.drawer = false
        },
        showMenu(val) {
            this.drawer = val
        }
    },
    methods: {
        handleClose() {
            // done()
            this.$emit('showModal')
        }
    }
}
</script>
<style lang="scss" scoped>
.menu-group {
    width: 60%;
    display: flex;
    .menu-item {
        flex: 1;
        font-size: 24px;
        cursor: pointer;
        color: #222;
        text-align: center;
        // letter-spacing: 1px;
        &:hover {
            text-decoration: none;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='blue' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E") repeat-x 0 100%;
            background-size: 20px auto;
            animation: waveMove 1s infinite linear;
        }
    }
}
@media screen and (max-width: 900px) {
    .menu-group {
        width: 90%;
        .menu-item {
            font-size: 16px;
        }
    }
}
</style>
