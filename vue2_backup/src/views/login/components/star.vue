<!--
 * @Description: 流星背景特效
 * @Author: Peng wenlei
 * @Date: 2021-03-05 20:26:23
 * @FilePath: /my_blog/src/views/login/components/star.vue
-->
<template>
  <div class="stars">
    <div class="star" />
    <div class="star" />
    <div class="star" />
  </div>
</template>

<script setup>
// 纯 CSS 动画组件，无需逻辑
</script>

<style lang="scss" scoped>
// 流星特效
.stars {
  position: fixed;
  top: -250px;
  left: -250px;
  width: 100%;
  height: 120%;
  transform: rotate(-45deg);
}

.star {
  --star-color: hsl(196, 78%, 61%);
  --star-tail-length: 6em;
  --star-tail-height: 2px;
  --star-width: calc(var(--star-tail-length) / 6);
  --fall-duration: 9s;
  --tail-fade-duration: var(--fall-duration);
  position: absolute;
  top: var(--top-offset);
  left: 0;
  width: var(--star-tail-length);
  height: var(--star-tail-height);
  color: var(--star-color);
  background: linear-gradient(45deg, currentColor, transparent);
  border-radius: 50%;
  filter: drop-shadow(0 0 6px currentColor);
  transform: translate3d(104em, 0, 0);
  animation: fall var(--fall-duration) var(--fall-delay) linear infinite,
    tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
}

@media screen and (max-width: 750px) {
  .star {
    animation: fall var(--fall-duration) var(--fall-delay) linear infinite;
  }
}

.star:nth-child(1) {
  --star-tail-length: 6.07em;
  --top-offset: 18.71vh;
  --fall-duration: 6.295s;
  --fall-delay: 5.613s;
}

.star:nth-child(2) {
  --star-tail-length: 5.87em;
  --top-offset: 91.61vh;
  --fall-duration: 6.744s;
  --fall-delay: 3.299s;
}

.star:nth-child(3) {
  --star-tail-length: 7.01em;
  --top-offset: 66.77vh;
  --fall-duration: 7.356s;
  --fall-delay: 8.793s;
}

.star::before,
.star::after {
  position: absolute;
  content: '';
  top: 0;
  left: calc(var(--star-width) / -2);
  width: var(--star-width);
  height: 100%;
  background: linear-gradient(45deg, transparent, currentColor, transparent);
  border-radius: inherit;
  animation: blink 2s linear infinite;
}

.star::before {
  transform: rotate(45deg);
}

.star::after {
  transform: rotate(-45deg);
}

@keyframes fall {
  to {
    transform: translate3d(-30em, 0, 0);
  }
}

@keyframes tail-fade {
  0%,
  50% {
    width: var(--star-tail-length);
    opacity: 1;
  }
  70%,
  80% {
    width: 0;
    opacity: 0.6;
  }
  100% {
    width: 0;
    opacity: 0;
  }
}

@keyframes blink {
  50% {
    opacity: 0.6;
  }
}
</style>
