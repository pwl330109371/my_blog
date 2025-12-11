<!--
 * @Author: Peng wenlei
 * @Date: 2020-11-12 16:13:13
 * @Description: 应用根组件 - Vue 3 版本
 * @FilePath: /my_blog/src/App.vue
-->
<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="whiteList" :exclude="blackList" :max="amount">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 页面缓存配置
 * whiteList: 需要缓存的页面组件名称列表
 * blackList: 不需要缓存的页面组件名称列表
 * amount: 最大缓存数量
 */
const whiteList = ref(['home', 'detail'])
const blackList = ref([])
const amount = ref(3)
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
