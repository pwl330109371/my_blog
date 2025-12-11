<template>
  <div class="index-page">
    <div class="index-page-left">
      <div class="index-page-title">
        <h3>从前慢</h3>
        <p>BEFORE SLOW</p>
      </div>
      <transition name="bounce">
        <div class="index-page-text" v-show="show">
          <h1 class="welcome-title">欢迎来到从前慢的时光驿站!</h1>
          <div class="welcome-xian"></div>
          <div class="welcome-text">Welcome to time station!</div>
          <div class="index-page-btn">
            <button @click="goHome" class="enter-btn">
              <span>点击进入</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <transition name="el-zoom-in-center">
      <div class="index-page-right" v-show="show">
        <!-- 主图片容器 -->
        <div class="image-container">
          <img src="/images/indexPageBg.jpg" alt="欢迎页背景" class="main-image" />
          
          <!-- 星星特效层 -->
          <div class="stars-container">
            <!-- 闪烁的星星 -->
            <div
              v-for="star in stars"
              :key="star.id"
              class="star"
              :style="{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration
              }"
            ></div>
            
            <!-- 流星效果 -->
            <div
              v-for="meteor in meteors"
              :key="meteor.id"
              class="meteor"
              :style="{
                left: meteor.left,
                top: meteor.top,
                animationDelay: meteor.delay
              }"
            ></div>
          </div>

          <!-- 小人跑动动画遮罩 -->
          <div class="character-animation"></div>
        </div>
      </div>
    </transition>

    <div class="wb-href" @click="goHref">鄂ICP备2021007829号-1</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false // Landing page usually doesn't use the default layout
})

// Router
const router = useRouter()

// 响应式数据
const show = ref(false)

// 生成随机星星位置
interface Star {
  id: number
  left: string
  top: string
  delay: string
  duration: string
}
interface Meteor {
  id: number
  left: string
  top: string
  delay: string
}

const stars = ref<Star[]>([])
const meteors = ref<Meteor[]>([])

/**
 * 生成星星数据
 */
const generateStars = () => {
  const starCount = 30
  const newStars: Star[] = []
  
  for (let i = 0; i < starCount; i++) {
    newStars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`, // 主要在上半部分
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`
    })
  }
  
  stars.value = newStars
}

/**
 * 生成流星数据
 */
const generateMeteors = () => {
  const meteorCount = 5
  const newMeteors: Meteor[] = []
  
  for (let i = 0; i < meteorCount; i++) {
    newMeteors.push({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${Math.random() * 40}%`,
      delay: `${i * 3 + Math.random() * 2}s`
    })
  }
  
  meteors.value = newMeteors
}

/**
 * 进入首页
 */
const goHome = () => {
  router.replace('/home')
}

/**
 * 跳转工信部网站
 */
const goHref = () => {
  window.open('https://beian.miit.gov.cn/', '_blank')
}

// 组件挂载后显示动画
onMounted(() => {
  generateStars()
  generateMeteors()
  
  setTimeout(() => {
    show.value = true
  }, 500)
})
</script>

<style lang="scss" scoped>
.index-page {
  padding: 3.65%;
  background: #fff;
  color: #000;
  display: flex;
  position: relative;
  overflow: hidden;
  height: 100vh;
  box-sizing: border-box;

  .index-page-left {
    height: 100%;
    flex: 1;
    position: relative;

    h1,
    h3,
    p {
      padding: 0;
      margin: 0;
    }

    .index-page-title {
      width: 149px;
      text-align: justify;
      text-align-last: justify;

      h3 {
        font-size: 36px;
        font-weight: bold;
        text-align: justify;
        text-align-last: justify;
        animation: titleFadeIn 1s ease-out;
      }

      p {
        font-size: 14px;
        color: #0f1741;
        text-align: justify;
        text-align-last: justify;
        letter-spacing: 1px;
        white-space: nowrap;
        animation: titleFadeIn 1s ease-out 0.3s backwards;
      }
    }

    .index-page-text {
      max-width: 413px;
      margin: 8.6% 100px;

      .welcome-title {
        font-size: 0.9rem;
        color: #0f1741;
        font-weight: 400; // Regular
        font-family: '华康简综艺', Times, serif;
      }

      .welcome-xian {
        width: 100px;
        height: 3px;
        margin-top: 5%;
        margin-left: 5px;
        margin-bottom: 4%;
        background: rgba(15, 23, 65, 1);
        opacity: 1;
        border-radius: 33px;
        animation: lineGrow 0.8s ease-out 0.5s backwards;
      }

      .welcome-text {
        font-size: 30px;
        font-family: 'DIN';
        font-weight: bold;
        line-height: 49px;
      }

      .index-page-btn {
        margin-top: 7%;

        .enter-btn {
          width: 200px;
          height: 71px;
          background: linear-gradient(
            180deg,
            rgba(178, 228, 254, 1) 0%,
            rgba(136, 212, 248, 1) 100%
          );
          box-shadow: 0px 10px 20px rgba(120, 204, 243, 0.6);
          opacity: 1;
          border-radius: 333px;
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 800;
          cursor: pointer;
          outline: none;
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;

          span {
            position: relative;
            z-index: 2;
          }

          .btn-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 70%
            );
            animation: btnGlow 3s infinite;
          }

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0px 15px 30px rgba(120, 204, 243, 0.8);
          }

          &:active {
            transform: translateY(-1px);
          }
        }
      }
    }

    .tip-text {
      position: absolute;
      bottom: 60px;
      left: 40px;
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      animation: fadeInUp 1s ease-out 1s backwards;

      p {
        margin: 0;
      }
    }
  }

  .index-page-right {
    width: 50%;
    max-width: 1000px;
    position: relative;

    .image-container {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      // box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

      .main-image {
        width: 100%;
        height: 100%;
        display: block;
        animation: imageFloat 6s ease-in-out infinite;
      }

      // 星星容器
      .stars-container {
        position: absolute;
        top: 0; 
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;

        // 闪烁的星星
        .star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ffd700;
          animation: starTwinkle 2s ease-in-out infinite;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
          }

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            width: 6px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
          }
        }

        // 流星效果
        .meteor {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px #fff;
          animation: meteorFall 3s linear infinite;
          opacity: 0;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 2px;
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.8),
              transparent
            );
            transform-origin: left center;
            transform: rotate(-45deg);
          }
        }
      }

      // 小人跑动动画遮罩
      .character-animation {
        position: absolute;
        bottom: 30%;
        left: 35%;
        width: 100px;
        height: 100px;
        pointer-events: none;
        z-index: 3;
        animation: characterRun 3s ease-in-out infinite;
      }
    }
  }

  // 动画定义
  .bounce-enter-active {
    animation: bounce-in 1s;
  }

  .bounce-leave-active {
    animation: bounce-in 1s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  // 标题淡入动画
  @keyframes titleFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 线条生长动画
  @keyframes lineGrow {
    from {
      width: 0;
    }
    to {
      width: 100px;
    }
  }

  // 按钮光晕动画
  @keyframes btnGlow {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  // 图片浮动动画
  @keyframes imageFloat {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-10px) scale(1.02);
    }
  }

  // 星星闪烁动画
  @keyframes starTwinkle {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.5);
    }
  }

  // 流星下落动画
  @keyframes meteorFall {
    0% {
      opacity: 0;
      transform: translate(0, 0);
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
      transform: translate(-200px, 200px);
    }
  }

  // 小人跑动动画（模拟上下摆动和轻微旋转）
  @keyframes characterRun {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
      filter: brightness(1);
    }
    25% {
      transform: translateY(-8px) rotate(-2deg);
      filter: brightness(1.1);
    }
    50% {
      transform: translateY(0) rotate(0deg);
      filter: brightness(1);
    }
    75% {
      transform: translateY(-8px) rotate(2deg);
      filter: brightness(1.1);
    }
  }

  // 文字淡入上浮动画
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.wb-href {
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 15px;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 10;

  &:hover {
    color: #409eff;
  }
}

// 响应式设计
@media screen and (max-width: 900px) {
  .index-page {
    padding: 0;

    .index-page-left {
      width: 100%;
      position: absolute;
      box-sizing: border-box;
      z-index: 1;

      .index-page-title {
        margin-left: 15px;
        margin-top: 15px;

        h3 {
          font-size: 24px;
        }
      }

      .index-page-text {
        max-width: 100%;
        margin: 8.6% 15px;
        text-align: center;

        .welcome-title {
          text-align: left;
        }

        .welcome-text {
          font-size: 24px;
        }

        .index-page-btn {
          margin-top: 3%;

          .enter-btn {
            width: 150px;
            height: 50px;
          }
        }
      }

      .tip-text {
        left: 15px;
        bottom: 80px;
        font-size: 12px;
      }
    }

    .index-page-right {
      width: 100%;
      padding: 15px;
      box-sizing: border-box;
      position: absolute;
      top: 40%;
      z-index: 0;

      .image-container {
        .character-animation {
          bottom: 25%;
          left: 30%;
        }
      }
    }
  }
}
</style>
