<!--
 * @Author: your name
 * @Date: 2020-11-21 10:58:01
 * @LastEditTime: 2020-11-21 10:59:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \my_blog\src\components\Button\index.vue
-->
<template>
    <button class="btn btn-gradient" @click="click" :disabled='disabled' :style="styles">
        {{ text }}
    </button>
</template>
<script>
export default {
    props: {
        text: {
            type: String,
            default: '注册'
        },
        styles: {
            type: Object,
            default: () => {}
        },
		disabled: {
			type: Boolean,
			default: false
		}
    },
    methods: {
        click() {
            this.$emit('onclick')
        }
    }
}
</script>
<style scoped lang="scss">
.btn {
    position: relative;
    text-decoration: none;
    background-color: white;
    border: transparent;
    outline: transparent;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    animation: glow 8s linear infinite;
    z-index: 5;
    &-gradient {
        color: #fff;
        background: linear-gradient(90deg, #63c3ff, #00ffff);
        background-size: 300%;
        border-radius: 2em;
        opacity: 0.8;
        &::before {
            position: absolute;
            content: '';
            top: -5px;
            left: -5px;
            bottom: -5px;
            right: -5px;
            z-index: -1;
            background: inherit;
            background-size: inherit;
            border-radius: 4em;
            opacity: 0;
            transition: 0.5s;
        }

        &:hover::before {
            opacity: 1;
            filter: blur(10px);
            animation: glow 8s linear infinite;
        }
    }
}

@keyframes glow {
    to {
        background-position: 300%;
    }
}
</style>
