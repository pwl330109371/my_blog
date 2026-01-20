<template>
  <div class="max">
    <!-- 核心内容区 -->
    <div class="content-container">
      <!-- 左侧文字区 -->
      <div class="text-zone">
        <div class="date-badge">{{ date.year }} / {{ date.month }} / {{ date.day }}</div>
        
        <h1 class="main-title">
          <span class="glitch" data-text="THE WIND">THE WIND</span>
        </h1>
        
        <div class="sub-title">
          <TextGenerateEffect
            words="欢迎来到从前慢的时光驿站"
            :duration="1.2"
            class="gradient-text"
          />
        </div>

        <div class="description-box">
          <p class="description-text">
            世间万般美好事物，我们高处再相见。<br>
            在这里，记录技术，感悟生活，仰望星空。
          </p>
          <div class="scroll-tip" v-show="!hiddenText">
            <span class="arrow">↓</span> 向下滚动探索
          </div>
        </div>
      </div>

      <!-- 右侧视觉区：全息反应堆 -->
      <div class="visual-zone">
        <div class="reactor">
          <div class="reactor-ring ring-1"></div>
          <div class="reactor-ring ring-2"></div>
          <div class="reactor-ring ring-3"></div>
          <div class="reactor-core"></div>
          <div class="reactor-particles">
            <span v-for="n in 20" :key="n" :style="{ '--i': n }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDate } from '@/utils'
import TextGenerateEffect from '../TextGenerateEffect.vue'

// 响应式数据
const hiddenText = ref(false)
const date = ref<any>({})

/**
 * 获取并格式化日期
 */
const getYearMonthDay = async () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const result = `${year}-${month}-${day} ${123}`
  date.value = formatDate(result)
}

/**
 * 延迟隐藏提示文字
 */
const hiddenTextEmit = () => {
  setTimeout(() => {
    hiddenText.value = true
  }, 5000)
}

onMounted(() => {
  getYearMonthDay()
  hiddenTextEmit()
})
</script>

<style lang="scss" scoped>
.max {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // 增加径向渐变，突出中心
  background: radial-gradient(circle at 70% 50%, rgba(0, 150, 255, 0.05), transparent 60%);

  /* --- 玻璃拟态导航栏 --- */
  .glass-header {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    height: 60px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    .logo-img {
      height: 30px;
      filter: brightness(100);
    }

    .desktop-menu {
      display: flex;
      gap: 30px;

      .nav-item {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #0096ff;
          transition: width 0.3s;
        }

        &:hover {
          color: #fff;
          text-shadow: 0 0 8px rgba(0, 150, 255, 0.5);
          &::after {
            width: 100%;
          }
        }
        
        &.router-link-active {
          color: #0096ff;
          &::after {
            width: 100%;
          }
        }
      }
    }

    .mobile-menu-btn {
      display: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }
  }

  /* --- 核心内容布局 --- */
  .content-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 40px;
    position: relative;
    z-index: 10;
  }

  /* --- 左侧文字区 --- */
  .text-zone {
    flex: 1;
    z-index: 2;

    .date-badge {
      display: inline-block;
      padding: 6px 16px;
      border: 1px solid rgba(0, 150, 255, 0.3);
      border-radius: 20px;
      color: rgba(0, 150, 255, 0.8);
      font-size: 14px;
      font-family: monospace;
      margin-bottom: 20px;
      background: rgba(0, 150, 255, 0.05);
      letter-spacing: 2px;
    }

    .main-title {
      font-size: 80px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 20px;
      color: #fff;
      
      .glitch {
        position: relative;
        display: inline-block;
        
        &::before, &::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #090A0F; /* Match bg color */
        }
        
        &::before {
          left: 2px;
          text-shadow: -1px 0 #ff00c1;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        
        &::after {
          left: -2px;
          text-shadow: -1px 0 #00fff9;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }
      }
    }

    .sub-title {
      font-size: 24px;
      margin-bottom: 30px;
      height: 40px; // 防止抖动
      
      .gradient-text {
        background: linear-gradient(90deg, #fff, #0096ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .description-box {
      .description-text {
        font-size: 16px;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.6);
        border-left: 2px solid rgba(0, 150, 255, 0.5);
        padding-left: 20px;
        margin-bottom: 40px;
        max-width: 500px;
      }

      .scroll-tip {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        gap: 10px;

        .arrow {
          animation: bounce 2s infinite;
          color: #0096ff;
        }
      }
    }
  }

  /* --- 右侧视觉区：全息反应堆 --- */
  .visual-zone {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;

    .reactor {
      width: 400px;
      height: 400px;
      position: relative;
      transform-style: preserve-3d;
      perspective: 1000px;

      .reactor-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 2px solid rgba(0, 150, 255, 0.3);
        box-shadow: 0 0 20px rgba(0, 150, 255, 0.2);
      }

      .ring-1 {
        width: 300px;
        height: 300px;
        border-top-color: transparent;
        border-bottom-color: transparent;
        animation: spin 10s linear infinite;
      }

      .ring-2 {
        width: 240px;
        height: 240px;
        border-left-color: transparent;
        border-right-color: transparent;
        border-width: 4px;
        animation: spin-reverse 8s linear infinite;
      }

      .ring-3 {
        width: 180px;
        height: 180px;
        border: 1px dashed rgba(255, 255, 255, 0.4);
        animation: spin 15s linear infinite;
      }

      .reactor-core {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, #fff, #0096ff);
        border-radius: 50%;
        box-shadow: 0 0 60px #0096ff;
        animation: pulse 3s ease-in-out infinite;
      }
    }
  }

  /* --- 响应式适配 --- */
  @media screen and (max-width: 900px) {
    .glass-header {
      width: 95%;
      padding: 0 20px;
      
      .desktop-menu {
        display: none;
      }
      
      .mobile-menu-btn {
        display: block;
      }
    }

    .content-container {
      flex-direction: column-reverse;
      justify-content: center;
      padding-top: 80px;
    }

    .text-zone {
      text-align: center;
      flex: 0 0 auto;
      
      .main-title {
        font-size: 48px;
      }
      
      .description-box {
        .description-text {
          margin: 0 auto 30px;
          text-align: left;
          display: inline-block;
        }
        
        .scroll-tip {
          justify-content: center;
        }
      }
    }

    .visual-zone {
      flex: 0 0 300px;
      margin-bottom: 40px;
      
      .reactor {
        transform: scale(0.7);
      }
    }
  }
}

/* --- 动画关键帧 --- */
@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes spin-reverse {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(-360deg); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes glitch-anim {
  0% { clip: rect(20px, 9999px, 80px, 0); }
  20% { clip: rect(60px, 9999px, 10px, 0); }
  40% { clip: rect(40px, 9999px, 90px, 0); }
  60% { clip: rect(80px, 9999px, 50px, 0); }
  80% { clip: rect(10px, 9999px, 30px, 0); }
  100% { clip: rect(50px, 9999px, 60px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(80px, 9999px, 30px, 0); }
  20% { clip: rect(10px, 9999px, 70px, 0); }
  40% { clip: rect(50px, 9999px, 20px, 0); }
  60% { clip: rect(30px, 9999px, 80px, 0); }
  80% { clip: rect(70px, 9999px, 40px, 0); }
  100% { clip: rect(20px, 9999px, 60px, 0); }
}
</style>
