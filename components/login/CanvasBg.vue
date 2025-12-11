<template>
  <div>
    <canvas class="cavs" ref="canvasRef" width="1920" height="927" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 粒子配置
const dots: any = {
  nb: 250,
  distance: 100,
  d_radius: 150,
  array: []
}

const mousePosition = {
  x: 0,
  y: 0
}

/**
 * 生成随机颜色值
 */
function colorValue(min: number) {
  return Math.floor(Math.random() * 255 + min)
}

/**
 * 创建颜色样式
 */
function createColorStyle(r: number, g: number, b: number) {
  return `rgba(${r}, ${g}, ${b}, 0.8)`
}

/**
 * 颜色类
 */
class Color {
  r: number
  g: number
  b: number
  style: string

  constructor(min = 0) {
    this.r = colorValue(min)
    this.g = colorValue(min)
    this.b = colorValue(min)
    this.style = createColorStyle(this.r, this.g, this.b)
  }
}

/**
 * 粒子类
 */
class Dot {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: Color

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = -0.5 + Math.random()
    this.vy = -0.5 + Math.random()
    this.radius = Math.random() * 2
    this.color = new Color()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.fillStyle = this.color.style
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI, false)
    ctx.fill()
  }
}

/**
 * 混合颜色分量
 */
const mixComponents = (comp1: number, weight1: number, comp2: number, weight2: number) => {
  return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
}

/**
 * 计算平均颜色
 */
const averageColorStyles = (dot1: Dot, dot2: Dot) => {
  const color1 = dot1.color
  const color2 = dot2.color

  const r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius)
  const g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius)
  const b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius)

  return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b))
}

/**
 * 创建粒子
 */
const createDots = (canvas: HTMLCanvasElement) => {
  dots.array = []
  for (let i = 0; i < dots.nb; i++) {
    dots.array.push(new Dot(canvas))
  }
}

/**
 * 移动粒子
 */
const moveDots = (canvas: HTMLCanvasElement) => {
  for (let i = 0; i < dots.nb; i++) {
    const dot = dots.array[i]
    if (dot.y < 0 || dot.y > canvas.height) {
      dot.vy = -dot.vy
    } else if (dot.x < 0 || dot.x > canvas.width) {
      dot.vx = -dot.vx
    }
    dot.x += dot.vx
    dot.y += dot.vy
  }
}

/**
 * 连接粒子
 */
const connectDots = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < dots.nb; i++) {
    for (let j = 0; j < dots.nb; j++) {
      const i_dot = dots.array[i]
      const j_dot = dots.array[j]

      if (
        i_dot.x - j_dot.x < dots.distance &&
        i_dot.y - j_dot.y < dots.distance &&
        i_dot.x - j_dot.x > -dots.distance &&
        i_dot.y - j_dot.y > -dots.distance
      ) {
        if (
          i_dot.x - mousePosition.x < dots.d_radius &&
          i_dot.y - mousePosition.y < dots.d_radius &&
          i_dot.x - mousePosition.x > -dots.d_radius &&
          i_dot.y - mousePosition.y > -dots.d_radius
        ) {
          ctx.beginPath()
          ctx.strokeStyle = averageColorStyles(i_dot, j_dot)
          ctx.moveTo(i_dot.x, i_dot.y)
          ctx.lineTo(j_dot.x, j_dot.y)
          ctx.stroke()
          ctx.closePath()
        }
      }
    }
  }
}

/**
 * 绘制粒子
 */
const drawDots = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < dots.nb; i++) {
    dots.array[i].draw(ctx)
  }
}

/**
 * 动画循环
 */
const animateDots = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  moveDots(canvas)
  connectDots(ctx)
  drawDots(ctx)
  requestAnimationFrame(() => animateDots(canvas, ctx))
}

/**
 * 初始化粒子特效
 */
const init = () => {
  if (typeof window === 'undefined') return
  
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 检测是否为移动设备
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return
  }

  try {
    // 设置画布尺寸
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 设置线条样式
    ctx.lineWidth = 0.3
    ctx.strokeStyle = new Color(150).style

    // 初始化鼠标位置
    mousePosition.x = (30 * canvas.width) / 100
    mousePosition.y = (30 * canvas.height) / 100

    // 监听鼠标移动
    canvas.addEventListener('mousemove', (e) => {
      mousePosition.x = e.pageX
      mousePosition.y = e.pageY
    })

    // 监听鼠标离开
    canvas.addEventListener('mouseleave', () => {
      mousePosition.x = canvas.width / 2
      mousePosition.y = canvas.height / 2
    })

    // 创建粒子并开始动画
    createDots(canvas)
    requestAnimationFrame(() => animateDots(canvas, ctx))
  } catch (error) {
    console.error('粒子特效初始化失败:', error)
  }
}

// 组件挂载后初始化
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.cavs {
  z-index: 1;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
