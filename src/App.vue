<!--
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\App.vue
-->
<template>
    <div id="app">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="whiteList" :exclude="blackList" :max="amount">
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            whiteList: ['home', 'detail'], // 白名单
            blackList: [], // 黑名单
            amount: 3 // 缓存最大数量
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
