<!--
 * @Author: your name
 * @Date: 2020-11-12 16:13:13
<<<<<<< HEAD
 * @LastEditTime: 2021-03-01 18:26:52
 * @LastEditors: Please set LastEditors
=======
 * @LastEditTime: 2020-12-15 22:57:44
 * @LastEditors: Peng wenlei
>>>>>>> d8664bb4a792a39748528e3a03e1d1eb8a87000b
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\App.vue
-->
<template>
    <div id="app">
        <keep-alive :include="whiteList" :exclude="blackList" :max="amount">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
export default {
    data() {
        return {
            whiteList: ['home'], // 白名单
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
