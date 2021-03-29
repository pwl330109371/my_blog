<!--
 * @Author: your name
 * @Date: 2021-03-29 17:39:21
 * @LastEditTime: 2021-03-29 18:29:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\components\Menu\index.vue
-->
<template>
    <div class="menu-container">
        <el-drawer :visible.sync="showMenu" direction="ttb" :before-close="handleClose" :modal="false">
            <ul class="menu-group">
                <router-link tag="li" class="menu-item" :to="{ name: 'Home' }">首页</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'ArticleList' }">文章列表</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Rainy' }">听雨</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Login' }">登录</router-link>
                <router-link tag="li" class="menu-item" :to="{ name: 'Wode' }">关于作者</router-link>
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
            direction: 'rtl'
        }
    },
    methods: {
        handleClose(done) {
            done()
            this.$emit('showModal')
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep.menu-container {
    .el-drawer__body {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .el-drawer__header {
        color: #ff3600;
    }
    .menu-group {
        width: 60%;
        display: flex;
        .menu-item {
            flex: 1;
            font-size: 26px;
            font-weight: bold;
            cursor: pointer;
        }
    }
}
</style>
