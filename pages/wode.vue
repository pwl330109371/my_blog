<template>
  <div class="universe-container">
    <!-- 背景层：银河与星云 -->
    <div class="galaxy-bg"></div>
    <div class="nebula"></div>
    
    <!-- Canvas层：星星与流星 -->
    <canvas ref="spaceCanvas" class="space-canvas"></canvas>
    
    <!-- 装饰层：星球与飞船 -->
    <div class="planet planet-dynamic">
      <div class="surface-texture"></div>
      <div class="atmosphere-glow"></div>
    </div>
    <div class="planet planet-ringed">
      <div class="ring"></div>
    </div>
    <div class="spaceship-container">
      <svg class="spaceship" viewBox="0 0 512 512" width="60" height="60">
        <path d="M420.6 301.9a24 24 0 00-15.6-7.8l-14.7-2.5c4.2-17.7 7.4-40.2 8.7-62.9 1.9-33.1-4.7-63.4-18.7-85.3-13.8-21.6-35.3-35.6-60.5-39.5-6.8-1-12.7 3.5-14 10.3-1.2 6.4 2.8 12.6 9.2 14.1 16.5 3.8 30.6 14 40.5 29.5 10.8 16.9 16 41.2 14.4 68.3-1.3 22.1-4.7 43.6-9.6 59.8l-161.4-27.1c3.1-13.7 4.9-28.7 4.9-44.4 0-48.4-15.7-90.8-40.8-115.8C137.9 73.6 95.5 57.9 47.1 57.9c-6.8 0-12.8 4.7-14.3 11.4-1.6 7 2.3 14 9.1 16.3 32.5 10.9 57.2 41.6 66.8 82 4.1 17.3 5.4 34.2 4.1 49.8l-23-3.9c-6.6-1.1-12.9 3.2-14.1 9.8-1.2 6.6 3.2 12.9 9.8 14.1l23.5 4c-2.4 12-5.9 23.3-10.4 33.6-14.8 34.2-40.2 59.6-71.6 71.6-6.4 2.4-9.7 9.5-7.3 15.9 2.4 6.4 9.5 9.7 15.9 7.3 37.3-14.3 67.8-44.8 85.3-85.4 4.1-9.5 7.4-19.6 9.8-30.2l161.5 27.2c-5.7 20.2-16.1 38.6-30.2 52.7-14.3 14.3-33.1 23.5-52.7 25.8-6.7.8-11.4 6.9-10.6 13.6.7 6 5.8 10.5 11.8 10.5.6 0 1.2 0 1.8-.1 25.8-3 50.4-15.1 69.3-34 16.1-16.1 27.6-36.8 33.3-59.5l14.2 2.4c1.6.3 3.2.4 4.8.4 10.7 0 20.3-7.1 23-17.6zM133.3 220c-11.3-48-40.7-83.8-77.1-95.6 19.3 23.9 31.8 59.7 31.8 99.6 0 13.6-1.5 26.7-4.2 39.1 17.1-8.5 32.6-20.9 45.4-36.1 1.7-2 3.1-4.6 4.1-7z" fill="currentColor"/>
        <path d="M466.3 349.5c-48.4 0-90.8 15.7-115.8 40.8-25.1 25.1-40.8 67.5-40.8 115.8 0 6.8 4.7 12.8 11.4 14.3 1.3.3 2.6.4 3.9.4 5.3 0 10.3-3.3 12.4-8.2 10.9-32.5 41.6-57.2 82-66.8 17.3-4.1 34.2-5.4 49.8-4.1 6.6.6 12.6-4 13.2-10.6.6-6.6-4-12.6-10.6-13.2-16.3-1.4-34.6.1-53.1 4.5 10.3-4.5 21.6-8 33.6-10.4 34.2-6.9 70.8-2.6 103 12 2.1 1 4.4 1.5 6.7 1.5 4.3 0 8.5-2 11.1-5.6 3.9-5.4 2.7-13-2.7-16.9-38.3-27.4-81.8-32.5-123.6-14.4-10.6-2.4-20.7-5.7-30.2-9.8 40.6-17.5 71.1-52.5 85.4-85.3 2.4-5.6 1.4-12.1-2.8-16.8-4.1-4.7-10.8-6.2-16.5-3.8-5.7 2.4-9.3 8.3-8.8 14.5.1 1.5.3 3 .6 4.5 2.1 12.5-1 25.4-8.5 36.1-12.4-12.8-28.7-23-47.5-29.2-6.5-2.1-13.5 1.4-15.6 7.9-2.1 6.5 1.4 13.5 7.9 15.6 15.7 5.2 29.3 13.7 39.7 24.4-15.2 12.8-27.6 28.3-36.1 45.4-12.4-2.7-25.5-5.8-39.1-4.2-39.9 0-75.7 12.5-99.6 31.8 11.8-36.4 47.6-65.8 95.6-77.1 2.4 1 5 2.4 7 4.1 10.7-7.5 23.6-10.8 36.1-8.5 6.5 1.2 12.8-3.1 14-9.6 1.2-6.5-3.1-12.8-9.6-14-22.1-4.1-45.2 2.7-62.9 17.5 2.4-14.7 1.1-30.1-4.3-45.1-2.2-6.2-9-9.5-15.2-7.3-6.2 2.2-9.5 9-7.3 15.2 4.4 12.3 5.4 25.1 3.5 37.4l-27.2 161.5c10.6-2.4 20.7-5.7 30.2-9.8 20.6 17.5 44.9 27.2 70.3 27.2z" fill="currentColor"/>
      </svg>
      <div class="engine-trail"></div>
    </div>

    <div class="content-wrapper">
      <Header midText="时光驿站" class="custom-header" />
      
      <div class="hologram-card">
        <div class="card-header">
          <!-- <h1 class="glitch-text" data-text="个人简介">个人简介</h1> -->
          <div class="hologram-title-box">
            <!-- <span class="hologram-icon">◈</span> -->
            <!-- <h3 class="neon-title">个人简介</h3> -->
            <!-- <span class="hologram-icon">◈</span> -->
          </div>
          <div class="scan-line"></div>
        </div>
        
        <div class="card-body markdown-body">
          <div v-html="displayedHtml" v-highlight></div>
          <span class="cursor" v-if="isTyping">|</span>
        </div>

        <div class="card-footer">
          <div class="social-links">
            <div class="social-item">
              <i class="iconfont icon-weixin1"></i>
              <div class="qr-popup">
                <img src="https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210415142905.jpg" alt="WeChat" />
              </div>
            </div>
            <div class="social-item">
              <i class="iconfont icon-QQ"></i>
              <div class="popup-text">330109371</div>
            </div>
            <a href="https://github.com/pwl330109371/my_blog" target="_blank" class="social-item">
              <i class="iconfont icon-GitHub"></i>
              <div class="popup-text">GitHub Project</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import { SITE_OWNER_ID } from '@/composables/useSiteOwner'

// 响应式数据
const content = ref('')
const displayedHtml = ref('')
const isTyping = ref(true)
const spaceCanvas = ref<HTMLCanvasElement | null>(null)
const config = useRuntimeConfig()

// Typewriter Logic
let typeInterval: any = null
const fullHtmlContent = ref('')

const startTypewriter = () => {
  const fullText = fullHtmlContent.value
  let index = 0
  displayedHtml.value = ''
  isTyping.value = true

  if (typeInterval) clearInterval(typeInterval)

  typeInterval = setInterval(() => {
    if (index >= fullText.length) {
      clearInterval(typeInterval)
      isTyping.value = false
      return
    }

    if (fullText[index] === '<') {
      const closeTagIndex = fullText.indexOf('>', index)
      if (closeTagIndex !== -1) {
        displayedHtml.value += fullText.substring(index, closeTagIndex + 1)
        index = closeTagIndex + 1
        return
      }
    }
    
    if (fullText[index] === '&') {
      const semiIndex = fullText.indexOf(';', index)
      if (semiIndex !== -1 && semiIndex - index < 10) {
        displayedHtml.value += fullText.substring(index, semiIndex + 1)
        index = semiIndex + 1
        return
      }
    }

    displayedHtml.value += fullText[index]
    index++
  }, 20)
}

/**
 * Markdown 渲染
 */
const markdownRender = (markdownContent: string) => {
  let html = ''
  const anyMarked = marked as any
  if (anyMarked && typeof anyMarked.parse === 'function') {
    html = anyMarked.parse(markdownContent)
  } else if (typeof anyMarked === 'function') {
    html = anyMarked(markdownContent)
  } else {
    html = markdownContent
  }
  
  fullHtmlContent.value = html
  startTypewriter()
}

// Data Fetching
const { data: aboutRes, error } = await useAsyncData(
  'wode-about-me',
  async () => {
    return await $fetch('/about/getAboutContent', {
      baseURL: config.public.apiBase,
      params: { userId: SITE_OWNER_ID },
      credentials: 'include'
    })
  },
  { server: false, immediate: true }
)

watch(error, (e) => {
  if (e) console.error('获取关于我失败:', e)
}, { immediate: true })

watch(aboutRes, (res: any) => {
  const payload = (res && (res.data != null ? res.data : res)) || null
  const markdownContent = payload && payload.content ? String(payload.content) : ''
  if (markdownContent) markdownRender(markdownContent)
}, { immediate: true })

// Advanced Space Animation
let animationFrameId: number
const initSpace = () => {
  const canvas = spaceCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height

  // Stars
  const stars: { x: number; y: number; z: number; size: number; color: string }[] = []
  const starCount = 1200
  const colors = ['#ffffff', '#ffe9c4', '#d4fbff']

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      size: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)] || '#ffffff'
    })
  }

  // Meteors
  const meteors: { x: number; y: number; length: number; speed: number; angle: number; opacity: number }[] = []
  
  const createMeteor = () => {
    meteors.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.5, // Start from top half
      length: Math.random() * 80 + 20,
      speed: Math.random() * 15 + 10,
      angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // ~45 degrees
      opacity: 1
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height) // Transparent clear for CSS bg visibility

    const cx = width / 2
    const cy = height / 2

    // Update & Draw Stars
    stars.forEach(star => {
      star.z -= 1.5 // Speed
      if (star.z <= 0) {
        star.z = width
        star.x = (Math.random() - 0.5) * width * 2
        star.y = (Math.random() - 0.5) * height * 2
      }

      const x = (star.x / star.z) * width + cx
      const y = (star.y / star.z) * height + cy
      const size = (1 - star.z / width) * 2.5 * star.size

      if (x >= 0 && x < width && y >= 0 && y < height) {
        const alpha = 1 - star.z / width
        ctx.fillStyle = star.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    })

    // Randomly spawn meteors
    if (Math.random() < 0.02) createMeteor()

    // Update & Draw Meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]
      if (!m) continue
      
      m.x -= m.speed * Math.cos(m.angle)
      m.y += m.speed * Math.sin(m.angle)
      m.opacity -= 0.01

      if (m.opacity <= 0 || m.x < -100 || m.y > height + 100) {
        meteors.splice(i, 1)
        continue
      }

      const endX = m.x + m.length * Math.cos(m.angle)
      const endY = m.y - m.length * Math.sin(m.angle)

      const gradient = ctx.createLinearGradient(m.x, m.y, endX, endY)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
  })
}

onMounted(() => {
  initSpace()
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (typeInterval) clearInterval(typeInterval)
})
</script>

<style lang="scss" scoped>
.universe-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  font-family: 'Orbitron', 'Segoe UI', sans-serif; /* Tech font if available, fallback safe */
  color: #fff;
}

/* Background Layers */
.galaxy-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vmax;
  height: 100vmax;
  background: radial-gradient(circle, rgba(76, 29, 149, 0.2) 0%, rgba(0,0,0,0) 60%);
  transform: translate(-50%, -50%);
  z-index: 0;
  animation: pulseGalaxy 10s infinite alternate;
}

.nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(4, 107, 153, 0.15), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(109, 4, 153, 0.15), transparent 40%);
  z-index: 0;
  filter: blur(30px);
}

@keyframes pulseGalaxy {
  0% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.space-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Planets */
.planet {
  position: absolute;
  border-radius: 50%;
  z-index: 2;
  box-shadow: inset -20px -20px 50px rgba(0,0,0,0.8);
}

.planet-dynamic {
  bottom: -60px;
  right: -60px;
  width: 320px;
  height: 320px;
  background: #000;
  overflow: hidden;
  box-shadow: 
    inset -40px -40px 80px rgba(0,0,0,0.9), /* Deep Shadow */
    0 0 60px rgba(44, 83, 100, 0.4); /* Outer Glow */
  animation: floatPlanetDynamic 15s ease-in-out infinite alternate;
}

.surface-texture {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    -30deg,
    #050a14 0%,
    #102a43 15%,
    #243b55 25%,
    #1488cc 35%,
    #050a14 50%
  );
  opacity: 0.8;
  animation: rotateTexture 60s linear infinite;
}

.atmosphere-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%);
  z-index: 3;
}

@keyframes floatPlanetDynamic {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-10px, -20px) scale(1.02); }
}

@keyframes rotateTexture {
  0% { transform: rotate(0deg) translateY(0); }
  100% { transform: rotate(0deg) translateY(-25%); }
}

.planet-ringed {
  top: 100px;
  left: 50px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe);
  transform: rotate(25deg);
  animation: floatPlanet 20s ease-in-out infinite;

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 40px;
    border: 8px solid rgba(255, 255, 255, 0.3);
    border-top-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}

@keyframes floatPlanet {
  0%, 100% { transform: translate(0, 0) rotate(25deg); }
  50% { transform: translate(20px, -30px) rotate(30deg); }
}

/* Spaceship */
.spaceship-container {
  position: absolute;
  z-index: 5;
  top: 20%;
  left: -100px;
  animation: flyShip 40s linear infinite;
  filter: drop-shadow(0 0 10px #00ffff);
}

.spaceship {
  color: #e0e0e0;
  transform: rotate(45deg);
}

.engine-trail {
  position: absolute;
  top: 50%;
  left: -20px;
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00ffff);
  transform: translateY(-50%);
  filter: blur(2px);
  opacity: 0.8;
}

@keyframes flyShip {
  0% { left: -100px; top: 80%; transform: scale(0.5); }
  100% { left: 110vw; top: 10%; transform: scale(0.8); }
}

/* Hologram Card */
.content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.custom-header {
  position: absolute;
  top: 0;
  width: 100%;
  background: transparent !important;
  color: #fff !important;
  text-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.hologram-card {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: rgba(10, 20, 40, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.05),
    inset 0 0 50px rgba(0, 255, 255, 0.02);
  padding: 40px;
  position: relative;
  overflow: hidden;
  margin-top: 60px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 40px rgba(0, 255, 255, 0.15);
    border-color: rgba(0, 255, 255, 0.3);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.hologram-title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.hologram-icon {
  color: #00ffff;
  font-size: 1.2rem;
  opacity: 0.7;
}

.neon-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 6px;
  text-shadow: 
    0 0 5px #00ffff,
    0 0 10px #00ffff,
    0 0 20px #00aaff;
}

.scan-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  margin-top: 15px;
  opacity: 0.5;
  animation: scan 4s infinite linear;
}

@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.card-body {
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.8;
  min-height: 200px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background: #00ffff;
  vertical-align: middle;
  animation: blink 1s infinite;
  box-shadow: 0 0 8px #00ffff;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.card-footer {
  margin-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.social-item {
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  i {
    font-size: 32px;
  }

  &:hover {
    color: #fff;
    transform: translateY(-5px) scale(1.1);
    text-shadow: 0 0 15px #00ffff;
  }

  .qr-popup, .popup-text {
    position: absolute;
    bottom: 140%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(5, 10, 20, 0.95);
    border: 1px solid #00ffff;
    padding: 12px;
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 20;
    white-space: nowrap;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: #00ffff;
    }
  }

  .qr-popup img {
    width: 140px;
    height: 140px;
    display: block;
    border-radius: 4px;
  }

  &:hover .qr-popup,
  &:hover .popup-text {
    opacity: 1;
    visibility: visible;
    bottom: 125%;
  }
}

:deep(.markdown-body) {
  color: #e0e0e0 !important;
  background: transparent !important;
  font-family: inherit;
  
  h1, h2, h3 {
    color: #00ffff;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    padding-bottom: 0.3em;
  }
  
  p { margin-bottom: 1.2em; }
  
  a {
    color: #ff00ff;
    text-decoration: none;
    border-bottom: 1px dashed #ff00ff;
    transition: all 0.2s;
    &:hover { 
      color: #fff;
      border-bottom-style: solid;
      text-shadow: 0 0 8px #ff00ff;
    }
  }
  
  blockquote {
    border-left: 4px solid #00ffff;
    color: #aaa;
    background: linear-gradient(90deg, rgba(0, 255, 255, 0.05), transparent);
    padding: 10px 15px;
  }
  
  code {
    background: rgba(0, 0, 0, 0.3);
    color: #76ff03;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', monospace;
  }
}
</style>
