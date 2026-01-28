<template>
  <div class="galaxy-guide">
    <canvas ref="canvasRef" class="starfield-canvas"></canvas>
    
    <div class="ui-overlay">
      <!-- 左上角标题区域 -->
      <div class="header-title">
        <div class="glitch-wrapper">
          <h1 class="glitch-text" data-text="THE WIND">THE WIND</h1>
        </div>
        <p class="subtitle">INTERSTELLAR TERMINAL</p>
      </div>
      
      <!-- 底部控制区域 -->
      <div class="bottom-controls">
        <div class="system-status">
          <div class="status-item">
            <span class="label">SYSTEM</span>
            <span class="value online">ONLINE</span>
          </div>
          <div class="status-item">
            <span class="label">COORDINATES</span>
            <span class="value">{{ coordinates }}</span>
          </div>
        </div>

        <button class="warp-btn" @click="engageWarp" :class="{ 'warping': isWarping }">
          <span class="btn-text">ENGAGE WARP</span>
          <span class="btn-bg"></span>
          <span class="btn-glow"></span>
        </button>
      </div>
      
      <div class="footer-info" @click="goHref">
        <span class="beian">鲁ICP备2025208345号-1</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isWarping = ref(false)
const coordinates = ref('000.000.000')

// 动画相关变量
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number
let stars: Star[] = []
let speed = 0.1
let warpSpeed = 20
let width = 0
let height = 0
let centerX = 0
let centerY = 0

// 太阳系配置
const TILT_ANGLE = 0.3 // 轨道倾角 (弧度)
const PLANET_SCALE = 1.2 // 行星整体缩放
const ORBIT_SCALE = 0.8 // 轨道整体缩放

class Star {
  x: number
  y: number
  z: number
  pz: number
  
  constructor() {
    this.x = (Math.random() - 0.5) * width * 2
    this.y = (Math.random() - 0.5) * height * 2
    this.z = Math.random() * width
    this.pz = this.z
  }
  
  update() {
    // 移动星星（Z轴减小模拟向屏幕飞来）
    this.z = this.z - speed * 20 // 速度倍率
    
    // 如果星星飞过屏幕，重置到远处
    if (this.z < 1) {
      this.z = width
      this.x = (Math.random() - 0.5) * width * 2
      this.y = (Math.random() - 0.5) * height * 2
      this.pz = this.z
    }
  }
  
  draw() {
    if (!ctx) return
    
    // 计算当前位置的投影
    const sx = (this.x / this.z) * width + centerX
    const sy = (this.y / this.z) * height + centerY
    
    // 计算上一帧位置的投影（用于绘制尾迹）
    const r = (1 - this.z / width) * 4 // 距离越近越大
    
    // 尾迹效果
    if (speed > 1) {
       // Warp 模式下绘制线条
       const px = (this.x / (this.z + speed * 5)) * width + centerX
       const py = (this.y / (this.z + speed * 5)) * height + centerY
       
       ctx.beginPath()
       ctx.moveTo(px, py)
       ctx.lineTo(sx, sy)
       ctx.strokeStyle = `rgba(200, 230, 255, ${Math.min(1, (1 - this.z / width) + 0.2)})`
       ctx.lineWidth = r * 0.5
       ctx.stroke()
    } else {
       // 普通模式绘制圆点
       ctx.beginPath()
       ctx.arc(sx, sy, r, 0, Math.PI * 2)
       ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.z / width})`
       ctx.fill()
    }
  }
}

// 太阳系相关
class CelestialBody {
  type: 'sun' | 'planet'
  name: string
  distance: number
  radius: number
  speed: number
  angle: number
  color: string[]
  hasRing: boolean
  
  // 3D 坐标
  x: number = 0
  y: number = 0
  z: number = 0
  scale: number = 1

  constructor(config: any) {
    this.type = config.type
    this.name = config.name
    this.distance = config.distance * ORBIT_SCALE
    this.radius = config.radius * PLANET_SCALE
    this.speed = config.speed
    this.angle = Math.random() * Math.PI * 2
    this.color = config.color
    this.hasRing = config.hasRing || false
  }

  update() {
    if (this.type === 'sun') return

    // 更新角度 (跃迁时加速)
    this.angle += this.speed * (isWarping.value ? 20 : 1)
    
    // 计算 3D 坐标 (假设轨道平面在 XZ 平面)
    const rawX = Math.cos(this.angle) * this.distance
    const rawZ = Math.sin(this.angle) * this.distance
    
    // 应用倾角旋转 (绕 X 轴旋转)
    this.x = rawX
    this.y = -rawZ * Math.sin(TILT_ANGLE)
    this.z = rawZ * Math.cos(TILT_ANGLE)
    
    // 计算透视缩放 (简单的透视投影)
    const cameraZ = 1000
    this.scale = cameraZ / (cameraZ + this.z)
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.type === 'sun') {
      this.drawSun(ctx)
      return
    }

    const screenX = centerX + this.x * this.scale
    const screenY = centerY + this.y * this.scale
    const size = this.radius * this.scale

    // 绘制星球本体
    ctx.beginPath()
    ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
    
    // 星球光影
    const lightAngle = Math.atan2(centerY - screenY, centerX - screenX)
    const highlightX = screenX + Math.cos(lightAngle) * (size * 0.3)
    const highlightY = screenY + Math.sin(lightAngle) * (size * 0.3)
    
    const gradient = ctx.createRadialGradient(
      highlightX, highlightY, size * 0.1,
      screenX, screenY, size
    )
    gradient.addColorStop(0, this.color[0] || '#fff')
    gradient.addColorStop(0.5, this.color[1] || '#ccc')
    gradient.addColorStop(1, '#000') // 背光面
    
    ctx.fillStyle = gradient
    ctx.fill()
    
    // 绘制土星环
    if (this.hasRing) {
      ctx.beginPath()
      ctx.ellipse(screenX, screenY, size * 2.5, size * 0.8, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(200, 180, 150, 0.4)'
      ctx.lineWidth = size * 0.5
      ctx.stroke()
    }
  }

  drawSun(ctx: CanvasRenderingContext2D) {
    // 太阳呼吸效果
    const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05
    const size = this.radius * pulse
    
    // 外发光
    const glow = ctx.createRadialGradient(centerX, centerY, size * 0.5, centerX, centerY, size * 4)
    glow.addColorStop(0, 'rgba(255, 200, 50, 0.8)')
    glow.addColorStop(0.2, 'rgba(255, 100, 0, 0.4)')
    glow.addColorStop(1, 'rgba(255, 50, 0, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(centerX, centerY, size * 4, 0, Math.PI * 2)
    ctx.fill()
    
    // 太阳本体
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size)
    sunGradient.addColorStop(0, '#FFF5E0')
    sunGradient.addColorStop(0.3, '#FFD700')
    sunGradient.addColorStop(0.8, '#FF4500')
    sunGradient.addColorStop(1, '#8B0000')
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
    ctx.fillStyle = sunGradient
    ctx.shadowBlur = 50
    ctx.shadowColor = '#FF8C00'
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

let bodies: CelestialBody[] = []

const initSolarSystem = () => {
  bodies = [
    // 太阳
    new CelestialBody({ type: 'sun', name: 'Sun', distance: 0, radius: 25, speed: 0, color: [] }),
    // 水星
    new CelestialBody({ type: 'planet', name: 'Mercury', distance: 80, radius: 3, speed: 0.04, color: ['#EBE3CF', '#A67F5D'] }),
    // 金星
    new CelestialBody({ type: 'planet', name: 'Venus', distance: 110, radius: 5.5, speed: 0.015, color: ['#FFE4C4', '#C68C53'] }),
    // 地球
    new CelestialBody({ type: 'planet', name: 'Earth', distance: 150, radius: 6, speed: 0.01, color: ['#4B9CD3', '#1E4D8C'] }),
    // 火星
    new CelestialBody({ type: 'planet', name: 'Mars', distance: 190, radius: 4.5, speed: 0.008, color: ['#E27B58', '#8B3E2F'] }),
    // 木星
    new CelestialBody({ type: 'planet', name: 'Jupiter', distance: 280, radius: 14, speed: 0.004, color: ['#E3DCCB', '#C88B3A'] }),
    // 土星
    new CelestialBody({ type: 'planet', name: 'Saturn', distance: 360, radius: 11, speed: 0.003, color: ['#F4E4BC', '#BFA878'], hasRing: true }),
    // 天王星
    new CelestialBody({ type: 'planet', name: 'Uranus', distance: 430, radius: 8, speed: 0.002, color: ['#AFDBF5', '#55ACEE'] }),
    // 海王星
    new CelestialBody({ type: 'planet', name: 'Neptune', distance: 490, radius: 7.8, speed: 0.001, color: ['#7B90D2', '#3E65EF'] })
  ]
}

const drawOrbits = () => {
  if (!ctx) return
  
  ctx.save()
  // 压扁画布以模拟 3D 轨道倾角
  ctx.translate(centerX, centerY)
  ctx.scale(1, Math.sin(TILT_ANGLE)) 
  
  bodies.forEach(body => {
    if (body.type === 'sun') return
    
    ctx!.beginPath()
    ctx!.arc(0, 0, body.distance, 0, Math.PI * 2)
    ctx!.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx!.lineWidth = 1 / Math.sin(TILT_ANGLE) // 修正线宽
    ctx!.stroke()
  })
  
  ctx.restore()
}

const initCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
    centerX = width / 2
    centerY = height / 2
  }
  
  window.addEventListener('resize', resize)
  resize()
  
  // 初始化星星
  stars = Array.from({ length: 800 }, () => new Star())
  
  // 初始化太阳系
  initSolarSystem()
}

const animate = () => {
  if (!ctx || !canvasRef.value) return
  
  // 清空画布
  ctx.fillStyle = isWarping.value ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 1)'
  ctx.fillRect(0, 0, width, height)
  
  // 1. 绘制星星背景
  stars.forEach(star => {
    star.update()
    star.draw()
  })
  
  // 2. 绘制轨道 (在所有星球底层)
  drawOrbits()
  
  // 3. 更新所有天体位置
  bodies.forEach(body => body.update())
  
  // 4. Z-Sort 深度排序 (关键：确保近的遮挡远的，太阳遮挡背后的行星)
  // Z 轴正方向为远离摄像机 (Depth)，所以 Z 越大越远
  // 画家算法：先画远的 (Z 大)，再画近的 (Z 小) -> 降序排列
  const sortedBodies = [...bodies].sort((a, b) => b.z - a.z)
  
  // 5. 按顺序绘制天体
  sortedBodies.forEach(body => body.draw(ctx!))
  
  // 更新坐标显示
  if (Math.random() > 0.9) {
     coordinates.value = `${Math.floor(Math.random()*999)}.${Math.floor(Math.random()*999)}.${Math.floor(Math.random()*999)}`
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

const engageWarp = () => {
  if (isWarping.value) return
  isWarping.value = true
  
  const accelerate = window.setInterval(() => {
    speed = Math.min(warpSpeed, speed * 1.12)
    if (speed >= warpSpeed) window.clearInterval(accelerate)
  }, 50)

  window.setTimeout(() => {
    router.replace('/home')
  }, 3200)
}

const goHref = () => {
  window.open('https://beian.miit.gov.cn/', '_blank')
}

onMounted(() => {
  initCanvas()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', () => {})
})
</script>

<style lang="scss" scoped>
.galaxy-guide {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
  font-family: 'Rajdhani', sans-serif;

  .starfield-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: radial-gradient(circle at center, #1a1a2e 0%, #000000 100%);
  }

  .ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }

  /* 左上角标题区域 */
  .header-title {
    position: absolute;
    top: 60px;
    left: 60px;
    text-align: left;
    pointer-events: auto;
    
    .subtitle {
      color: #0096ff;
      letter-spacing: 8px;
      font-size: 14px;
      margin-top: 5px;
      opacity: 0.8;
      text-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
      font-weight: 500;
    }
  }

  /* 故障文字效果 */
  .glitch-wrapper {
    position: relative;
    display: inline-block;
  }

  .glitch-text {
    font-size: 64px;
    font-weight: 900;
    color: #fff;
    letter-spacing: 4px;
    position: relative;
    margin: 0;
    text-shadow: 2px 2px 0px #0096ff, -2px -2px 0px #ff0055;
    
    &::before, &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
    }

    &::before {
      left: 2px;
      text-shadow: -1px 0 #ff0055;
      clip-path: inset(0 0 0 0);
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }

    &::after {
      left: -2px;
      text-shadow: -1px 0 #0096ff;
      animation: glitch-anim 2.5s infinite linear alternate-reverse;
    }
  }

  /* 底部控制区域 */
  .bottom-controls {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
    width: 100%;
    
    .system-status {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;
      
      .status-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        
        .label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
          letter-spacing: 2px;
        }
        
        .value {
          color: #fff;
          font-family: monospace;
          font-size: 14px;
          
          &.online {
            color: #00ff88;
            text-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
          }
        }
      }
    }
  }

  /* 升级版跃迁按钮 */
  .warp-btn {
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 150, 255, 0.3);
    padding: 18px 60px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(5px);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    /* 引导特效：呼吸发光边框 */
    box-shadow: 0 0 15px rgba(0, 150, 255, 0.2), inset 0 0 10px rgba(0, 150, 255, 0.1);
    animation: btn-breathe 3s infinite ease-in-out;

    &.astral-btn {
      margin-left: 20px;
      border-color: rgba(188, 19, 254, 0.3);

      .btn-text {
        color: #bc13fe;
      }

      .btn-bg {
        background: rgba(188, 19, 254, 0.1);
      }

      &:hover {
        border-color: #bc13fe;
        box-shadow: 0 0 20px rgba(188, 19, 254, 0.4);
      }
    }

    .btn-text {
      color: #fff;
      font-size: 18px;
      letter-spacing: 6px;
      font-weight: 700;
      z-index: 2;
      position: relative;
    }
    
    /* 按钮背景流光 */
    .btn-bg {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 150, 255, 0.2), transparent);
      transition: left 0.5s;
      z-index: 1;
      animation: shine 3s infinite;
    }

    &:hover {
      border-color: #0096ff;
      box-shadow: 0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 20px rgba(0, 150, 255, 0.3);
      transform: scale(1.05);
      background: rgba(0, 150, 255, 0.1);
      
      .btn-text {
        text-shadow: 0 0 10px rgba(255, 255, 255, 1);
      }
    }
    
    &.warping {
      animation: warp-pulse 0.2s infinite;
      border-color: #fff;
      background: #fff;
      box-shadow: 0 0 50px #fff;
      
      .btn-text {
        color: #000;
      }
    }
  }

  .footer-info {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    pointer-events: auto;
    
    .beian {
      color: rgba(255, 255, 255, 0.2);
      font-size: 12px;
      text-decoration: none;
      transition: color 0.3s;
      &:hover { color: #fff; }
    }
  }

  /* 动画定义 */
  @keyframes btn-breathe {
    0%, 100% { box-shadow: 0 0 15px rgba(0, 150, 255, 0.2), inset 0 0 10px rgba(0, 150, 255, 0.1); border-color: rgba(0, 150, 255, 0.3); }
    50% { box-shadow: 0 0 25px rgba(0, 150, 255, 0.5), inset 0 0 15px rgba(0, 150, 255, 0.3); border-color: rgba(0, 150, 255, 0.6); }
  }

  @keyframes shine {
    0% { left: -100%; }
    20% { left: 100%; }
    100% { left: 100%; }
  }

  @keyframes warp-pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes glitch-anim {
    0% { clip-path: inset(10% 0 30% 0); transform: translate(-2px, 1px); }
    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
    80% { clip-path: inset(20% 0 70% 0); transform: translate(-1px, 1px); }
    100% { clip-path: inset(10% 0 30% 0); transform: translate(1px, -1px); }
  }

  @keyframes glitch-anim-2 {
    0% { clip-path: inset(30% 0 10% 0); transform: translate(2px, -1px); }
    20% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 1px); }
    40% { clip-path: inset(50% 0 40% 0); transform: translate(2px, -2px); }
    60% { clip-path: inset(5% 0 80% 0); transform: translate(-2px, 2px); }
    80% { clip-path: inset(70% 0 20% 0); transform: translate(1px, -1px); }
    100% { clip-path: inset(30% 0 10% 0); transform: translate(-1px, 1px); }
  }

  /* 移动端适配 */
  @media screen and (max-width: 768px) {
    .header-title {
      top: 30px;
      left: 30px;
      
      .glitch-text { font-size: 40px; }
      .subtitle { font-size: 10px; letter-spacing: 4px; }
    }
    
    .bottom-controls {
      bottom: 80px;
      
      .system-status { margin-bottom: 20px; gap: 20px; }
      
      .warp-btn {
        padding: 15px 40px;
        .btn-text { font-size: 14px; }
      }
    }
  }
}
</style>
