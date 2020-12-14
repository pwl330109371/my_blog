<!--
 * @Author: your name
 * @Date: 2020-11-21 10:19:06
 * @LastEditTime: 2020-11-21 10:56:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\views\article\components\scrollBar.vue
-->
<template>
    <div class="top" :style="{ width: bar + '%' }"></div>
</template>

<script>
import { throttle } from '@/utils'
export default {
    name: 'scrollBar',
    data() {
        return {
            bar: 0,
            throttleScrollHandle: ''
        }
    },
    created() {
        this.throttleScrollHandle = throttle(this.scrollHandle, 100)
        window.addEventListener('scroll', this.throttleScrollHandle)
    },
    methods: {
        scrollHandle() {
            const scrollTop =
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                window.pageYOffset
            const windowHeight =
                document.documentElement.clientHeight ||
                document.body.clientHeight
            const scrollHeight =
                document.documentElement.scrollHeight ||
                document.body.scrollHeight
            let bar =
                (Math.ceil(scrollTop) /
                    Math.ceil(scrollHeight - windowHeight)) *
                100
            this.bar = bar
        }
    }
}
</script>

<style scoped lang="scss">
.top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 999999;
    background: #409eff;
    height: 2px;
    transition: all 0.3s linear;
}
</style>
