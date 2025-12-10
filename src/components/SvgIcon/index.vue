<!--
 * @Author: Peng wenlei
 * @Date: 2021-03-05 18:06:11
 * @Description: SVG 图标组件
 * @FilePath: /my_blog/src/components/SvgIcon/index.vue
 * @Doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
-->
<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  />
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { isExternal as checkExternal } from '@/utils/validate'

// Props
const props = defineProps({
  iconClass: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
})

/**
 * 判断是否为外部链接
 */
const isExternal = computed(() => {
  return checkExternal(props.iconClass)
})

/**
 * 图标名称
 */
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

/**
 * SVG 类名
 */
const svgClass = computed(() => {
  return props.className ? `svg-icon ${props.className}` : 'svg-icon'
})

/**
 * 外部图标样式
 */
const styleExternalIcon = computed(() => {
  return {
    mask: `url(${props.iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
