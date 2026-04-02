<template>
  <div class="layout-default">
    <SpaceBackground />
    <Header :userInfo="ownerInfo" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import SpaceBackground from '@/components/SpaceBackground.vue'
import Header from '@/components/Header/index.vue'
import { useSiteOwner } from '@/composables/useSiteOwner'

const { ownerInfo, fetchOwnerInfo } = useSiteOwner()

await fetchOwnerInfo()
</script>

<style lang="scss">
body {
  margin: 0;
  background-color: #090A0F;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 全局滚动条样式优化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>

<style lang="scss" scoped>
.layout-default {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}
</style>
