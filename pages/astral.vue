<template>
  <div class="astral-nexus">
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
    
    <!-- UI Overlay -->
    <div class="ui-overlay" :class="{ 'fade-out': isRevealing }">
      <div class="header">
        <div class="title-glitch" data-text="ASTRAL NEXUS">星 际 枢 纽</div>
        <div class="subtitle">星 际 占 卜 系 统</div>
      </div>

      <!-- 交互引导区 -->
      <div class="interaction-zone">
        <!-- 阶段1: 闲置/入口 -->
        <div class="instruction" v-if="phase === 'idle'">
          <div class="text">聚 焦 意 念</div>
          <div class="sub-text">点 击 连 接 虚 空 频 率</div>
          
          <button class="action-btn" @click="openInputModal">连 接 虚 空</button>
        </div>

        <!-- Input Modal -->
        <Transition name="fade">
          <div class="input-modal-overlay" v-if="showInputModal" @click.self="showInputModal = false">
            <div class="input-modal">
              <!-- 1. 标题区 -->
              <div class="modal-header">
                <div class="modal-title">频 率 校 准</div>
                <div class="window-controls">
                  <span class="minimize">—</span>
                  <span class="close-btn" @click="showInputModal = false">×</span>
                </div>
              </div>
              
              <!-- 2. 表单区 -->
              <div class="modal-body">
                <!-- 幸运数字 -->
                <div class="form-group">
                  <div class="input-wrapper glow-border">
                    <input 
                      v-model="userNumber" 
                      type="number" 
                      min="0"
                      max="999"
                      placeholder="输入幸运数字 (0-999)" 
                      class="astral-input"
                      @keyup.enter="confirmAndStart"
                    />
                    <!-- 自定义步进按钮 (样式装饰，实际使用原生 number input 的功能或额外实现) -->
                    <div class="step-controls">
                      <div class="step-btn up">▲</div>
                      <div class="step-btn down">▼</div>
                    </div>
                  </div>
                </div>

                <!-- 灵气颜色 -->
                <div class="form-group color-group">
                  <span class="label">灵 气 颜 色 :</span>
                  <div class="color-picker-container">
                    <div class="color-preview" :style="{ backgroundColor: userColor }"></div>
                    <div class="color-value-tag">
                      {{ userColor }}
                      <input v-model="userColor" type="color" class="color-trigger" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. 操作区 -->
              <div class="modal-footer">
                <button class="action-btn confirm-btn" @click="confirmAndStart" :disabled="!isValidInput">
                  启 动 序 列
                </button>
                <div class="helper-text">将根据幸运数字与颜色生成校准参数</div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 阶段2: 洗牌中 -->
        <div class="shuffling-indicator" v-if="phase === 'shuffling'">
          <div class="loader"></div>
          <div class="text">正 在 校 准 量 子 场...</div>
        </div>

        <!-- 阶段3: 选牌指引 -->
        <div class="pick-instruction" v-if="phase === 'ready'">
          <div class="text">选 择 你 的 频 率</div>
          <div class="sub-text">群 星 等 待 你 的 观 测</div>
        </div>
      </div>
    </div>

    <!-- Result Card Overlay -->
    <Transition name="fade">
      <div class="card-result" v-if="phase === 'result' && drawnCard">
        <div class="card-container">
          <div class="card-visual" :style="drawnCard.image_front ? { backgroundImage: `url(${drawnCard.image_front})`, backgroundSize: 'cover' } : {}">
            <div class="card-holo-effect"></div>
            <div class="card-name" v-if="!drawnCard.image_front">{{ drawnCard.card_name }}</div>
            <div class="card-archetype" v-if="!drawnCard.image_front">{{ drawnCard.archetype_ref }}</div>
            
            <!-- 显示图片时，文字放在底部 -->
             <div class="card-overlay-text" v-if="drawnCard.image_front">
                <div class="name">{{ drawnCard.card_name }}</div>
                <div class="ref">{{ drawnCard.archetype_ref }}</div>
             </div>
          </div>
          
          <div class="card-info">
            <div class="rarity">
              <span v-for="n in drawnCard.rarity_level" :key="n" class="star">★</span>
            </div>
            
            <div class="keywords">
              <span v-for="(kw, idx) in parsedKeywords" :key="idx" class="keyword">
                {{ kw }}
              </span>
            </div>

            <div class="interpretation">
              <div class="daily-guidance">
                <h3>// 今 日 指 引</h3>
                <p>{{ drawnCard.meaning_daily }}</p>
              </div>
              
              <div class="answer-revelation">
                <h3>// 命 运 启 示</h3>
                <p class="highlight">{{ drawnCard.meaning_answer }}</p>
              </div>
            </div>

            <button class="reset-btn" @click="reset">
              重 新 校 准
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useApi } from '../composables/useApi'

// Types
interface AstralCard {
  id: number
  card_name: string
  archetype_ref: string
  keywords: string
  meaning_daily: string
  meaning_answer: string
  rarity_level: number
  image_front?: string
  vfx_theme?: string
}

// State
const canvasRef = ref<HTMLCanvasElement | null>(null)
// 状态流转: idle -> shuffling -> ready (扇形铺开) -> revealing (选中动画) -> result
const phase = ref<'idle' | 'shuffling' | 'ready' | 'revealing' | 'result'>('idle')
const drawnCard = ref<AstralCard | null>(null)
const isRevealing = ref(false)
const userNumber = ref('')
const userColor = ref('#bc13fe')
const showInputModal = ref(false)

const isValidInput = computed(() => {
  if (userNumber.value === '') return false
  const num = parseInt(userNumber.value)
  return !isNaN(num) && num >= 0 && num <= 999
})

// Three.js Variables
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let cards: THREE.Mesh[] = []
let particles: THREE.Points
let frameId: number
let time = 0

// Configuration
const CARD_COUNT = 22 // Major Arcana count
// PC/Mobile 适配参数
let RADIUS = 8
let CARD_WIDTH = 1.5
let CARD_HEIGHT = 2.5
// 扇形展开参数
let FAN_RADIUS = 10 // 扇形半径（手持圆心距离）
let FAN_ANGLE_TOTAL = Math.PI / 3 // 扇形总角度 (60度)

const parsedKeywords = computed(() => {
  if (!drawnCard.value?.keywords) return []
  try {
    return JSON.parse(drawnCard.value.keywords)
  } catch (e) {
    return []
  }
})

// Shader for Card Back (Dynamic Nebula)
const cardBackVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const cardBackFragmentShader = `
  uniform float time;
  varying vec2 vUv;

  // Simple noise function
  float noise(vec2 p) {
    return sin(p.x * 10.0 + time) * cos(p.y * 10.0 + time);
  }

  void main() {
    vec2 uv = vUv;
    float n = noise(uv * 2.0);
    
    // Deep space colors
    vec3 color1 = vec3(0.05, 0.0, 0.2); // Dark purple
    vec3 color2 = vec3(0.0, 0.5, 0.8); // Cyan
    vec3 color3 = vec3(0.8, 0.0, 0.5); // Magenta
    
    vec3 finalColor = mix(color1, color2, n * 0.5 + 0.5);
    finalColor = mix(finalColor, color3, sin(time * 0.5 + uv.y * 5.0) * 0.5 + 0.5);
    
    // Add "circuit" lines
    float line = step(0.98, sin(uv.x * 50.0 + time * 2.0)) + step(0.98, sin(uv.y * 50.0 - time));
    finalColor += vec3(line * 0.5);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const initThree = () => {
  if (!canvasRef.value) return

  // 1. 响应式参数调整
  const isMobile = window.innerWidth < 768
  if (isMobile) {
    RADIUS = 7 // 增大闲置状态半径
    CARD_WIDTH = 1.3
    CARD_HEIGHT = 2.2
    FAN_RADIUS = 7 // 稍微增大扇形半径
    FAN_ANGLE_TOTAL = Math.PI * 0.8 // 144度，展开更开，减少重叠
  } else {
    RADIUS = 12 // 增大闲置状态半径，避免密集
    CARD_WIDTH = 1.6
    CARD_HEIGHT = 2.6
    FAN_RADIUS = 11
    FAN_ANGLE_TOTAL = Math.PI * 0.7 // 126度，展开更宽
  }

  // Scene Setup
  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  
  // 调整相机位置
  if (isMobile) {
    camera.position.z = 14
    camera.position.y = 1
  } else {
    camera.position.z = 10 // 拉近一点看细节
    camera.position.y = 0
  }
  
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x0096ff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  createCards()
  createParticles()

  animate()
}

const createCards = () => {
  const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT)
  
  // Material for card back
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: cardBackVertexShader,
    fragmentShader: cardBackFragmentShader,
    side: THREE.DoubleSide
  })

  for (let i = 0; i < CARD_COUNT; i++) {
    const card = new THREE.Mesh(geometry, material)
    
    // 初始状态：散乱悬浮 (Random Floating) - 还原用户喜欢的"悬浮感"
    // 使用空心球体分布，避开中心文字区域
    const theta = Math.random() * Math.PI * 2 // 水平角度
    // 限制垂直角度，不要太高或太低
    const phi = Math.acos((Math.random() * 1.2) - 0.6) + Math.PI / 2 
    
    const r = RADIUS + Math.random() * 8 // 增大随机范围 (之前是4)，让卡牌分布更深更广
    
    card.position.x = r * Math.cos(theta)
    // 压扁一点Y轴，变成椭球体分布
    // 扩大垂直分布范围 (上下也分散点)
    card.position.y = (Math.random() - 0.5) * 16 - 1 
    // Z轴范围也稍微加大，增加深邃感
    card.position.z = r * Math.sin(theta) * 0.6 - 5
    
    // 随机初始旋转
    card.rotation.x = Math.random() * Math.PI * 2
    card.rotation.y = Math.random() * Math.PI * 2
    card.rotation.z = Math.random() * Math.PI * 2
    
    // Add user data for interaction
    // randomSpeed 用于控制每张卡不同的旋转速度
    card.userData = { 
      id: i, 
      originalPos: card.position.clone(),
      randomSpeed: {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005 + 0.002, // 稍微有点基础自转
        z: (Math.random() - 0.5) * 0.005
      },
      floatOffset: Math.random() * Math.PI * 2 // 浮动相位
    }
    
    scene.add(card)
    cards.push(card)
  }
}

const createParticles = () => {
  const geometry = new THREE.BufferGeometry()
  const count = 2000
  const positions = new Float32Array(count * 3)
  
  for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 40
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

const animate = () => {
  frameId = requestAnimationFrame(animate)
  time += 0.01

  // Update uniforms
  cards.forEach(card => {
    const mat = card.material as THREE.ShaderMaterial
    if (mat.uniforms) {
      mat.uniforms.time.value = time
    }
    
    // Idle Animation: Pure Floating (No Ring) - 纯悬浮状态
    if (phase.value === 'idle') {
      const { originalPos, randomSpeed, floatOffset } = card.userData
      
      // 1. 悬浮微动 (Floating)
      // 在原始随机位置的基础上，上下缓慢浮动
      card.position.y = originalPos.y + Math.sin(time * 0.5 + floatOffset) * 0.5
      
      // 2. 缓慢自转 (Slow Tumble)
      // 每一张卡都按照自己的随机速度旋转，营造失重感
      card.rotation.x += randomSpeed.x
      card.rotation.y += randomSpeed.y
      card.rotation.z += randomSpeed.z
    }
    
    // Ready 状态下的微动 (呼吸感)
    if (phase.value === 'ready') {
      // 只有未被选中的牌才微动
      if (isRevealing) return 
      const hoverOffset = card.userData.isHovered ? 0.5 : 0
      // 基础Y轴位置 + 呼吸波动 + 悬停上浮
      card.position.y = card.userData.baseY + Math.sin(time * 2 + card.userData.id) * 0.05 + hoverOffset
    }
  })

  // Particles rotation
  if (particles) {
    particles.rotation.y = time * 0.02
  }

  renderer.render(scene, camera)
}

// --- New Interaction Logic ---

const openInputModal = () => {
  showInputModal.value = true
}

const confirmAndStart = () => {
  showInputModal.value = false
  startSpread()
}

// 1. 点击 "INITIATE SEQUENCE" 开始洗牌
const startSpread = () => {
  phase.value = 'shuffling'
  
  // 洗牌动画：先聚拢到屏幕中心
  cards.forEach((card, i) => {
    gsap.to(card.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.8,
      ease: 'power2.in',
      delay: i * 0.01
    })
    
    gsap.to(card.rotation, {
      x: 0,
      y: Math.PI * 4, // 快速旋转
      z: 0,
      duration: 1.5,
      ease: 'power1.inOut'
    })
  })

  // 1.5秒后展开成扇形
  setTimeout(() => {
    phase.value = 'ready'
    spreadCardsFan()
  }, 1600)
}

// 2. 真实扇形手牌排列 (Fan Layout)
const spreadCardsFan = () => {
  // 扇形圆心位于屏幕下方 (0, -Y, 0)
  const centerX = 0
  const centerY = -FAN_RADIUS * 0.8 // 稍微往上提一点，让圆心不要太低
  
  const startAngle = Math.PI / 2 + FAN_ANGLE_TOTAL / 2
  const angleStep = FAN_ANGLE_TOTAL / (CARD_COUNT - 1)
  
  cards.forEach((card, i) => {
    // 当前卡牌的角度
    const currentAngle = startAngle - i * angleStep
    
    // 极坐标转笛卡尔坐标
    const x = centerX + Math.cos(currentAngle) * FAN_RADIUS
    const y = centerY + Math.sin(currentAngle) * FAN_RADIUS
    
    // Z轴层级：使用严格的线性递增，模拟手持扑克牌的物理层级
    // 从左到右依次叠加 (或者反过来)
    const z = i * 0.1 // 每一张牌都比前一张靠前 0.1
    
    // 旋转角度：让卡牌底部指向圆心
    const rotZ = currentAngle - Math.PI / 2
    
    // 记录基础位置，用于 hover 动画恢复
    card.userData.baseY = y
    card.userData.baseZ = z // 记录基础Z
    card.userData.baseRotZ = rotZ
    card.userData.baseScale = 1.0 // 记录基础缩放

    // 确保旋转重置（因为idle状态下旋转是乱的）
    gsap.to(card.rotation, {
      x: 0,
      y: 0, 
      z: rotZ,
      duration: 1.2,
      delay: i * 0.02
    })

    gsap.to(card.position, {
      x: x,
      y: y,
      z: z, 
      duration: 1.2,
      ease: 'power3.out', // 更自然的缓动
      delay: i * 0.02
    })
    
    // 确保缩放重置
    gsap.to(card.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5
    })
  })
  
  // 开启交互
  window.addEventListener('click', onCardClick)
  window.addEventListener('touchstart', onCardClick, { passive: false })
  window.addEventListener('mousemove', onCardHover)
}

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 悬停交互
const onCardHover = (event: MouseEvent) => {
  if (phase.value !== 'ready' || isRevealing.value) return
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)
  
  // Reset all cards hover state
  cards.forEach(card => {
    if (card.userData.isHovered) {
      card.userData.isHovered = false
      // 恢复原位
      gsap.to(card.position, {
        y: card.userData.baseY,
        z: card.userData.baseZ,
        duration: 0.3
      })
      gsap.to(card.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3
      })
    }
  })
  
  if (intersects.length > 0) {
    const selectedObj = intersects[0].object
    selectedObj.userData.isHovered = true
    document.body.style.cursor = 'pointer'
    
    // 悬停特效：上浮 + 放大 + 稍微靠前
    gsap.to(selectedObj.position, {
      y: selectedObj.userData.baseY + 0.5,
      z: selectedObj.userData.baseZ + 2.0, // 突出来
      duration: 0.3
    })
    gsap.to(selectedObj.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 0.3
    })
  } else {
    document.body.style.cursor = 'default'
  }
}

const onCardClick = async (event: Event) => {
  if (phase.value !== 'ready') return
  
  let clientX, clientY
  
  if (event.type === 'touchstart') {
    const touch = (event as TouchEvent).touches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    const mouseEvent = event as MouseEvent
    clientX = mouseEvent.clientX
    clientY = mouseEvent.clientY
  }
  
  mouse.x = (clientX / window.innerWidth) * 2 - 1
  mouse.y = -(clientY / window.innerHeight) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cards)
  
  if (intersects.length > 0) {
    const selectedObj = intersects[0].object
    performDraw(selectedObj)
  }
}

const performDraw = async (selectedCardObj: THREE.Object3D) => {
  window.removeEventListener('click', onCardClick)
  window.removeEventListener('touchstart', onCardClick)
  window.removeEventListener('mousemove', onCardHover)
  document.body.style.cursor = 'default'
  
  phase.value = 'revealing'
  isRevealing.value = true
  
  // Fetch data
  try {
    const { data, error } = await useApi('/astral/draw', {
      query: { 
        t: Date.now(),
        userNumber: userNumber.value,
        userColor: userColor.value
      } 
    })
    if (data.value) {
      const res = data.value as any
      if (res.code === 200) {
        drawnCard.value = res.data
      }
    }
  } catch (e) {
    console.error(e)
  }

  // Animation: Selected card flies to screen center
  gsap.to(selectedCardObj.position, {
    x: 0,
    y: 0,
    z: 8,
    duration: 1.0,
    ease: 'power2.inOut',
    onComplete: () => {
      createExplosion(selectedCardObj.position)
      selectedCardObj.visible = false
      setTimeout(() => {
        phase.value = 'result'
      }, 300)
    }
  })
  
  gsap.to(selectedCardObj.rotation, {
    x: 0,
    y: Math.PI * 3, // Flip
    z: 0, // Reset tilt
    duration: 1.0
  })
  
  // Other cards scatter away
  cards.forEach(card => {
    if (card !== selectedCardObj) {
      gsap.to(card.position, {
        y: -15, 
        x: card.position.x * 2, // Spread out
        duration: 0.8,
        delay: Math.random() * 0.2
      })
    }
  })
}

const createExplosion = (pos: THREE.Vector3) => {
  const geometry = new THREE.BufferGeometry()
  const count = 800
  const positions = new Float32Array(count * 3)
  
  for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    color: 0xbc13fe,
    size: 0.15,
    transparent: true
  })
  
  const explosion = new THREE.Points(geometry, material)
  explosion.position.copy(pos)
  scene.add(explosion)
  
  gsap.to(explosion.scale, {
    x: 15,
    y: 15,
    z: 15,
    duration: 0.8,
    ease: 'expo.out'
  })
  
  gsap.to(material, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      scene.remove(explosion)
    }
  })
}

const reset = () => {
  phase.value = 'idle'
  drawnCard.value = null
  isRevealing.value = false
  userNumber.value = ''
  // userColor.value = '#bc13fe' // Keep color or reset? Let's keep color as preference
  
  // Reset scene
  cards.forEach(card => scene.remove(card))
  cards = []
  createCards()
}

onMounted(() => {
  initThree()
  
  window.addEventListener('resize', () => {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      const isMobile = window.innerWidth < 768
      
      // Update config variables
      if (isMobile) {
        RADIUS = 7
        FAN_RADIUS = 7
        FAN_ANGLE_TOTAL = Math.PI * 0.8
        camera.position.z = 14
        camera.position.y = 1
      } else {
        RADIUS = 12
        FAN_RADIUS = 11
        FAN_ANGLE_TOTAL = Math.PI * 0.7
        camera.position.z = 10
        camera.position.y = 0
      }
    }
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('click', onCardClick)
  window.removeEventListener('touchstart', onCardClick)
  window.removeEventListener('mousemove', onCardHover)
  // Clean up Three.js resources
})
</script>

<style lang="scss" scoped>
.astral-nexus {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
  font-family: 'Rajdhani', sans-serif;
  color: #fff;
}

.webgl-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  transition: opacity 1s ease;
  
  &.fade-out {
    opacity: 0;
  }
}

.header {
  position: absolute;
  top: 68px;
  left: 40px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    top: 108px;
    left: 20px;
    right: 20px;
    text-align: center;
  }
  
  .title-glitch {
    font-size: 48px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #bc13fe;
    text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
    
    @media (max-width: 768px) {
      font-size: 32px;
      letter-spacing: 2px;
    }
  }
  
  .subtitle {
    font-size: 14px;
    color: #0096ff;
    letter-spacing: 6px;
    margin-top: 5px;
    
    @media (max-width: 768px) {
      font-size: 10px;
      letter-spacing: 3px;
    }
  }
}

/* 交互区域居中 */
.interaction-zone {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  pointer-events: auto;
}

.instruction {
  .text {
    font-size: 24px;
    letter-spacing: 4px;
    margin-bottom: 10px;
    text-shadow: 0 0 10px #fff;
    
    @media (max-width: 768px) {
        font-size: 18px;
    }
  }
  
  .sub-text {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 30px;
  }
  
  .input-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .astral-input {
    width: 100%;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #0096ff;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    text-align: center;
    outline: none;
    border-radius: 4px;
    transition: all 0.3s;

    &:focus {
      border-color: #bc13fe;
      box-shadow: 0 0 15px rgba(188, 19, 254, 0.3);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .color-selector {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 1px;
    }
    
    .color-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px 15px;
        border: 1px solid #0096ff;
        border-radius: 4px;
    }

    .color-input {
      width: 30px;
      height: 30px;
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      
      &::-webkit-color-swatch-wrapper {
        padding: 0; 
      }
      &::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
        border: 1px solid #fff;
      }
    }
    
    .color-value {
        font-size: 14px;
        color: #0096ff;
        font-family: monospace;
    }
  }
  
  .action-btn {
    padding: 15px 40px;
    background: rgba(188, 19, 254, 0.2);
    border: 1px solid #bc13fe;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 4px;
    
    &:hover {
      background: #bc13fe;
      box-shadow: 0 0 20px #bc13fe;
      transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(100%);
      &:hover {
        background: rgba(188, 19, 254, 0.2);
        box-shadow: none;
        transform: none;
      }
    }

    &.confirm-btn {
      width: 100%;
      margin-top: 0;
    }
  }
}

.input-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* 轻微背景遮罩 */
  backdrop-filter: blur(8px); /* 更强的毛玻璃 */
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直居中 */
  pointer-events: auto;
  /* padding-top: 16vh;  Remove padding-top to allow true centering or slight offset if needed */
  padding-bottom: 20vh; /* Add padding-bottom to push it visually higher than center */
}

.input-modal {
  background: rgba(20, 25, 40, 0.85); /* 半透明深灰 */
  border: 1px solid rgba(0, 150, 255, 0.3); /* 青蓝微光边框 */
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 150, 255, 0.1);
  border-radius: 12px;
  width: 440px; /* 宽420-480px */
  padding: 0; /* 内部布局控制 padding */
  position: relative;
  overflow: hidden;
  
  /* 1. 标题区 */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    .modal-title {
      font-size: 20px;
      color: #00e0ff; /* 青蓝色发光文字 */
      letter-spacing: 1px;
      font-weight: 600;
      text-shadow: 0 0 8px rgba(0, 224, 255, 0.5);
    }
    
    .window-controls {
      display: flex;
      gap: 12px;
      
      span {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.5);
        transition: color 0.3s;
        font-size: 16px;
        
        &:hover { color: #fff; }
      }
      .minimize { font-weight: bold; transform: translateY(-2px); display: inline-block; }
      .close-btn { font-size: 20px; line-height: 1; }
    }
  }

  /* 2. 表单区 */
  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: transparent; /* Ensure no extra background covers inputs */
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    &.color-group {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
    }

    .label {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
  }

  .input-wrapper {
    position: relative;
    width: 100%;
    height: 50px;
    border: 1px solid #bc13fe; /* 紫色边框 */
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(188, 19, 254, 0.2), inset 0 0 10px rgba(188, 19, 254, 0.1); /* 内外发光 */
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
    
    &:focus-within {
      box-shadow: 0 0 20px rgba(188, 19, 254, 0.4), inset 0 0 15px rgba(188, 19, 254, 0.2);
      border-color: #d966ff;
    }

    .astral-input {
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 18px;
      padding: 0 15px;
      text-align: center;
      font-family: 'Rajdhani', monospace;
      letter-spacing: 2px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
        font-size: 14px;
        letter-spacing: 1px;
      }
      
      /* Hide arrows */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    
    .step-controls {
      display: flex;
      flex-direction: column;
      width: 24px;
      height: 100%;
      border-left: 1px solid #bc13fe;
      background: rgba(0, 0, 0, 0.5);
      
      .step-btn {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 8px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: background 0.2s;
        
        &:hover { background: rgba(188, 19, 254, 0.3); color: #fff; }
        &.up { border-bottom: 1px solid rgba(188, 19, 254, 0.5); }
      }
    }
  }

  .color-picker-container {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .color-preview {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 0 10px currentColor;
    }
    
    .color-value-tag {
      position: relative;
      background: #000;
      border: 1px solid #0096ff;
      color: #fff;
      padding: 4px 12px;
      font-family: monospace;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      
      &:hover {
        border-color: #fff;
      }
      
      .color-trigger {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
  }

  /* 3. 操作区 */
  .modal-footer {
    padding: 0 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    
    .action-btn {
      width: 100%;
      height: 48px;
      background: #000;
      border: 1px solid #0096ff; /* 细蓝边框 */
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 4px;
      box-shadow: 0 0 15px rgba(0, 150, 255, 0.2);
      
      &:hover:not(:disabled) {
        background: rgba(0, 150, 255, 0.1);
        box-shadow: 0 0 25px rgba(0, 150, 255, 0.4);
        border-color: #fff;
      }
    }
    
    .helper-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.shuffling-indicator {
  .loader {
    width: 50px;
    height: 50px;
    border: 2px solid rgba(0, 150, 255, 0.3);
    border-top: 2px solid #0096ff;
    border-radius: 50%;
    margin: 0 auto 20px;
    animation: spin 1s linear infinite;
  }
  
  .text {
    color: #0096ff;
    letter-spacing: 2px;
    font-size: 14px;
  }
}

/* 调整指引文字位置，避免挡住扇形牌 */
.pick-instruction {
  pointer-events: none;
  position: absolute;
  top: 20%; /* 放在上方 */
  left: 0;
  width: 100%;
  
  .text {
    font-size: 20px;
    color: #fff;
    text-shadow: 0 0 10px rgba(0, 150, 255, 0.8);
  }
  
  .sub-text {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-top: 5px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card-result {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(15px);
  pointer-events: auto;
  overflow-y: auto;
  
  .card-container {
    display: flex;
    gap: 60px;
    max-width: 1000px;
    width: 90%;
    padding: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 30px;
      margin-top: 40px;
    }
  }
  
  .card-visual {
    width: 300px;
    height: 500px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border: 1px solid #bc13fe;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    box-shadow: 0 0 30px rgba(188, 19, 254, 0.3);
    
    @media (max-width: 768px) {
        width: 240px;
        height: 400px;
    }
    
    .card-holo-effect {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(188,19,254,0.2) 0%, transparent 70%);
      opacity: 0.5;
      mix-blend-mode: screen;
      z-index: 1;
    }
    
    .card-name {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      z-index: 2;
      line-height: 1.2;
    }
    
    .card-archetype {
      font-size: 14px;
      color: #bc13fe;
      margin-top: 5px;
    }
    
    .card-overlay-text {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        z-index: 2;
        
        .name {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            text-shadow: 0 0 10px rgba(0,0,0,0.8);
        }
        
        .ref {
            font-size: 14px;
            color: #bc13fe;
            margin-top: 5px;
        }
    }
  }
  
  .card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    
    @media (max-width: 768px) {
        text-align: center;
        align-items: center;
    }
    
    .rarity {
      color: #ffd700;
      font-size: 20px;
      margin-bottom: 20px;
    }
    
    .keywords {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      
      @media (max-width: 768px) {
          justify-content: center;
      }
      
      .keyword {
        padding: 6px 12px;
        border: 1px solid #0096ff;
        color: #0096ff;
        border-radius: 20px;
        font-size: 12px;
        letter-spacing: 1px;
      }
    }
    
    .interpretation {
      h3 {
        font-size: 14px;
        color: rgba(255,255,255,0.4);
        margin-bottom: 10px;
      }
      
      p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 30px;
        
        @media (max-width: 768px) {
            font-size: 16px;
        }
        
        &.highlight {
          font-size: 24px;
          color: #bc13fe;
          font-weight: 700;
          text-shadow: 0 0 20px rgba(188, 19, 254, 0.4);
          
          @media (max-width: 768px) {
              font-size: 20px;
          }
        }
      }
    }
    
    .reset-btn {
      padding: 15px 40px;
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
      font-family: 'Rajdhani', sans-serif;
      font-size: 16px;
      letter-spacing: 2px;
      cursor: pointer;
      align-self: flex-start;
      transition: all 0.3s;
      
      @media (max-width: 768px) {
          align-self: center;
      }
      
      &:hover {
        background: #fff;
        color: #000;
        box-shadow: 0 0 20px #fff;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
