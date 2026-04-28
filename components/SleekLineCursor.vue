<template>
  <div class="sleek-cursor" :class="containerClass">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  class?: string | string[]
  trails?: number
  size?: number
  friction?: number
  dampening?: number
  tension?: number
}>()

const containerClass = computed(() => {
  if (Array.isArray(props.class)) return props.class.join(' ')
  return props.class ?? ''
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let width = 0
let height = 0
let dpr = 1

const pos = { x: 0, y: 0 }
let lines: Line[] = []

const E = {
  friction: props.friction ?? 0.5,
  trails: props.trails ?? 20,
  size: props.size ?? 50,
  dampening: props.dampening ?? 0.25,
  tension: props.tension ?? 0.98
}

class Node {
  x = 0
  y = 0
  vx = 0
  vy = 0
}

class Osc {
  phase: number
  offset: number
  frequency: number
  amplitude: number
  private e = 0
  constructor(init: Partial<Osc>) {
    this.phase = init.phase ?? 0
    this.offset = init.offset ?? 0
    this.frequency = init.frequency ?? 0.001
    this.amplitude = init.amplitude ?? 1
  }
  update() {
    this.phase += this.frequency
    this.e = this.offset + Math.sin(this.phase) * this.amplitude
    return this.e
  }
  value() {
    return this.e
  }
}

class Line {
  spring: number
  friction: number
  nodes: Node[] = []
  constructor(init: { spring: number }) {
    this.spring = init.spring + 0.1 * Math.random() - 0.02
    this.friction = E.friction + 0.01 * Math.random() - 0.002
    for (let n = 0; n < E.size; n++) {
      const t = new Node()
      t.x = pos.x
      t.y = pos.y
      this.nodes.push(t)
    }
  }
  update() {
    const first = this.nodes[0]
    if (!first) return
    let e = this.spring
    let t = first
    t.vx += (pos.x - t.x) * e
    t.vy += (pos.y - t.y) * e
    for (let i = 0; i < this.nodes.length; i++) {
      const current = this.nodes[i]
      if (!current) continue
      t = current
      if (i > 0) {
        const n = this.nodes[i - 1]
        if (!n) continue
        t.vx += (n.x - t.x) * e
        t.vy += (n.y - t.y) * e
        t.vx += n.vx * E.dampening
        t.vy += n.vy * E.dampening
      }
      t.vx *= this.friction
      t.vy *= this.friction
      t.x += t.vx
      t.y += t.vy
      e *= E.tension
    }
  }
  draw() {
    if (this.nodes.length < 2) return
    const first = this.nodes[0]
    if (!first) return
    let n = first.x
    let i = first.y
    ctx!.beginPath()
    ctx!.moveTo(n, i)
    for (let a = 1, o = this.nodes.length - 2; a < o; a++) {
      const e = this.nodes[a]
      const t = this.nodes[a + 1]
      if (!e || !t) continue
      n = 0.5 * (e.x + t.x)
      i = 0.5 * (e.y + t.y)
      ctx!.quadraticCurveTo(e.x, e.y, n, i)
    }
    const e = this.nodes[this.nodes.length - 2]
    const t = this.nodes[this.nodes.length - 1]
    if (!e || !t) return
    ctx!.quadraticCurveTo(e.x, e.y, t.x, t.y)
    ctx!.stroke()
    ctx!.closePath()
  }
}

function resize() {
  const c = canvasRef.value
  if (!c) return
  width = window.innerWidth
  height = window.innerHeight
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  c.width = Math.floor(width * dpr)
  c.height = Math.floor(height * dpr)
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

function onMousemove(e: MouseEvent | TouchEvent) {
  function initLines() {
    lines = []
    for (let t = 0; t < E.trails; t++) {
      lines.push(new Line({ spring: 0.4 + (t / E.trails) * 0.025 }))
    }
  }
  function cursor(e: MouseEvent | TouchEvent) {
    if ('touches' in e && e.touches.length) {
      const touch = e.touches[0]
      if (touch) {
        pos.x = touch.pageX
        pos.y = touch.pageY
      }
    } else {
      const me = e as MouseEvent
      pos.x = me.clientX
      pos.y = me.clientY
    }
  }
  function touchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      if (touch) {
        pos.x = touch.pageX
        pos.y = touch.pageY
      }
    }
  }
  document.removeEventListener('mousemove', onMousemove as any)
  document.removeEventListener('touchstart', onMousemove as any)
  document.addEventListener('mousemove', cursor as any, { passive: true })
  document.addEventListener('touchmove', cursor as any, { passive: true })
  document.addEventListener('touchstart', touchStart as any, { passive: true })
  cursor(e)
  initLines()
  render()
}

function render() {
  const c: any = ctx
  if (c.running) {
    ctx!.globalCompositeOperation = 'source-over'
    ctx!.clearRect(0, 0, (ctx!.canvas as HTMLCanvasElement).width, (ctx!.canvas as HTMLCanvasElement).height)
    ctx!.globalCompositeOperation = 'lighter'
    ctx!.strokeStyle = `hsla(${Math.round(osc.update())},50%,50%,0.2)`
    ctx!.lineWidth = 1
    for (let t = 0; t < E.trails; t++) {
      const line = lines[t]
      if (!line) continue
      line.update()
      line.draw()
    }
    c.frame++
    window.requestAnimationFrame(render)
  }
}

let osc = new Osc({ phase: Math.random() * 2 * Math.PI, amplitude: 85, frequency: 0.0015, offset: 285 })

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  ctx = c.getContext('2d')
  resize()
  const _ctx: any = ctx
  _ctx.running = true
  _ctx.frame = 1
  document.addEventListener('mousemove', onMousemove as any, { passive: true })
  document.addEventListener('touchstart', onMousemove as any, { passive: true })
  document.body.addEventListener('orientationchange', resize)
  window.addEventListener('resize', resize)
  window.addEventListener('focus', () => {
    if (!_ctx.running) {
      _ctx.running = true
      render()
    }
  })
  window.addEventListener('blur', () => {
    _ctx.running = true
  })
  resize()
})

onUnmounted(() => {
  const _ctx: any = ctx
  if (_ctx) _ctx.running = false
  document.removeEventListener('mousemove', onMousemove as any)
  document.removeEventListener('touchstart', onMousemove as any)
  document.body.removeEventListener('orientationchange', resize)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.sleek-cursor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
