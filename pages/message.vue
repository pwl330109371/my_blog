<template>
  <div class="message-board">
    <SpaceBackground class="bg-layer" />
    
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="title-container">
        <h1 class="main-title" data-text="银河档案库">银河档案库</h1>
        <div class="subtitle-wrapper">
          <span class="line"></span>
          <span class="subtitle">星际通讯网络</span>
          <span class="line"></span>
        </div>
      </div>
    </div>

    <!-- Floating Message Capsules -->
    <div class="cosmos-container">
      <div 
        v-for="msg in activeMessages" 
        :key="msg.id" 
        class="capsule-wrapper"
        :style="msg.style"
        @mouseenter="hoverCapsule(msg.id)"
        @mouseleave="unhoverCapsule"
      >
        <!-- The Floating Object -->
        <div class="data-orb">
          <div class="orb-core"></div>
          <div class="orb-ring ring-1"></div>
          <div class="orb-ring ring-2"></div>
        </div>
        
        <!-- Hover Hologram -->
        <Transition name="hologram">
          <div v-if="hoveredId === msg.id" class="hologram-card">
            <div class="card-glass">
              <div class="scan-line"></div>
              <div class="card-header">
                <span class="user-id">代号: {{ msg.nickname }}</span>
                <span class="signal-strength">信号: 强</span>
              </div>
              <div class="card-location" v-if="msg.ip_city">
                来源: {{ msg.ip_city.toUpperCase() }}
              </div>
              <div class="card-body">
                {{ msg.content }}
              </div>
              <div class="card-footer">
                时间: {{ formatDate(msg.createdAt) }}
              </div>
              <div class="corner-deco top-left"></div>
              <div class="corner-deco top-right"></div>
              <div class="corner-deco bottom-left"></div>
              <div class="corner-deco bottom-right"></div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Transmission Console (Wish Station) -->
    <div class="console-dock" :class="{ 'dock-hidden': showForm }">
      <button class="transmit-btn" @click="openForm">
        <span class="btn-text">发射信号</span>
        <div class="btn-glitch"></div>
      </button>
    </div>

    <!-- Transmission Interface (Modal) -->
    <Transition name="cyber-modal">
      <div v-if="showForm" class="cyber-overlay" @click.self="showForm = false">
        <div class="cyber-interface">
          <div class="interface-header">
            <h3>新建传输</h3>
            <div class="header-deco"></div>
            <button class="close-btn" @click="showForm = false">×</button>
          </div>
          
          <div class="interface-body">
            <div class="cyber-input-group">
              <label>代号</label>
              <input v-model="form.nickname" type="text" placeholder="请输入代号..." maxlength="20">
              <div class="input-line"></div>
            </div>
            <div class="cyber-input-group">
              <label>信息数据</label>
              <textarea v-model="form.content" placeholder="输入信息内容..." rows="5" maxlength="200"></textarea>
              <div class="input-line"></div>
            </div>
          </div>
          
          <div class="interface-footer">
            <button class="send-btn" @click="submitWish" :disabled="submitting">
              <span class="btn-content">
                {{ submitting ? '上传中...' : '上传至网络' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import SpaceBackground from '../components/SpaceBackground.vue'
import { useMessageApi } from '../composables/useMessageApi'

const { getMessageList, addMessage } = useMessageApi()

interface Message {
  id: number
  nickname: string
  content: string
  ip_city: string
  createdAt: string
  style?: Record<string, string | number>
}

interface ApiResponse {
  code: number | string
  msg?: string
  data?: {
    messageList: Message[]
    count: number
  }
  result?: {
    messageList: Message[]
  }
}

const allMessages = ref<Message[]>([])
const activeMessages = ref<Message[]>([])
const showForm = ref(false)
const submitting = ref(false)
const hoveredId = ref<number | null>(null)
const form = reactive({
  nickname: '',
  content: ''
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`
}

const fetchMessages = async () => {
  try {
    const { data: res } = await getMessageList()
    const responseData = res.value as any
    if (responseData && (responseData.code === 200 || responseData.code === '200')) {
      const list = responseData.data?.messageList || responseData.result?.messageList || []
      allMessages.value = list
      initOrbs()
    }
  } catch (e) {
    console.error('Fetch error:', e)
  }
}

const createOrbStyle = () => {
  const top = Math.random() * 70 + 15 
  const left = Math.random() * 80 + 10 
  const scale = Math.random() * 0.5 + 0.5 
  const duration = Math.random() * 4 + 4 
  const delay = Math.random() * 5
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `scale(${scale})`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    '--orb-color': getRandomNeonColor()
  }
}

const getRandomNeonColor = () => {
  const colors = ['#00f3ff', '#bc13fe', '#ff0055', '#4dff91']
  return colors[Math.floor(Math.random() * colors.length)] || '#00f3ff'
}

const initOrbs = () => {
  activeMessages.value = []
  const limit = Math.min(allMessages.value.length, 30) 
  for (let i = 0; i < limit; i++) {
    const msg = allMessages.value[i]!
    activeMessages.value.push({   id: msg.id,
      nickname: msg.nickname,
      content: msg.content,
      ip_city: msg.ip_city,
      createdAt: msg.createdAt,
      style: createOrbStyle()
    })
  }
}

const hoverCapsule = (id: number) => {
  hoveredId.value = id
}

const unhoverCapsule = () => {
  hoveredId.value = null
}

const openForm = () => {
  showForm.value = true
}

const submitWish = async () => {
  if (!form.nickname || !form.content) return
  
  submitting.value = true
  try {
    const { data: res } = await addMessage(form)
    
    const responseData = res.value as any
    // console.log('res', responseData)

    if (responseData && (responseData.code === 200 || responseData.code === '200')) {
      const newMsg = {
        id: Date.now(),
        nickname: form.nickname,
        content: form.content,
        ip_city: 'UNKNOWN', 
        createdAt: new Date().toISOString(),
        style: createOrbStyle()
      }
      activeMessages.value.unshift(newMsg)
      
      form.nickname = ''
      form.content = ''
      showForm.value = false
      
      setTimeout(() => fetchMessages(), 1000)
    } else {
      const msg = (responseData && responseData.msg) ? responseData.msg : 'Transmission Interrupted'
      alert(msg)
    }
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');

.message-board {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: #fff;
  perspective: 1000px;
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Typography & Hero */
.hero-section {
  position: absolute;
  top: 10vh;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.title-container {
  text-align: center;
}

.main-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem; /* Reduced from 5rem */
  font-weight: 900;
  letter-spacing: 0.5rem; /* Adjusted spacing */
  margin: 0;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
  position: relative;
  text-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
  
  &::before {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    color: #00f3ff;
    border-right: 4px solid #00f3ff;
    overflow: hidden;
    animation: typeReveal 3s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }
}

.subtitle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  opacity: 0;
  animation: fadeIn 1s 2s forwards;
  
  .subtitle {
    font-size: 1rem; /* Reduced from 1.2rem */
    letter-spacing: 0.3rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .line {
    width: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00f3ff, transparent);
  }
}

/* Floating Orbs */
.cosmos-container {
  position: absolute;
  inset: 0;
  z-index: 5;
}

.capsule-wrapper {
  position: absolute;
  cursor: pointer;
  
  &:hover {
    z-index: 50; 
  }
}

.data-orb {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  animation: floatOrb 6s ease-in-out infinite;
  
  .orb-core {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #fff, 0 0 20px var(--orb-color), 0 0 40px var(--orb-color);
  }
  
  .orb-ring {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    box-shadow: 0 0 5px var(--orb-color);
  }
  
  .ring-1 {
    width: 100%;
    height: 100%;
    animation: spin 4s linear infinite;
    border-left-color: transparent;
    border-right-color: transparent;
  }
  
  .ring-2 {
    width: 160%;
    height: 160%;
    animation: spin 7s linear infinite reverse;
    border: 1px dashed rgba(255, 255, 255, 0.1);
  }
}

.capsule-wrapper:hover .data-orb {
  transform: scale(1.5);
  
  .orb-core {
    background: var(--orb-color);
  }
}

/* Hologram Card */
.hologram-card {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  pointer-events: none;
}

.card-glass {
  background: rgba(10, 20, 40, 0.85);
  border: 1px solid rgba(0, 243, 255, 0.3);
  backdrop-filter: blur(10px);
  padding: 20px;
  position: relative;
  clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%);
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
  
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 243, 255, 0.5);
    animation: scan 2s linear infinite;
    opacity: 0.5;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    color: #00f3ff;
  }
  
  .card-location {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 15px;
    letter-spacing: 1px;
  }
  
  .card-body {
    font-size: 1rem;
    line-height: 1.5;
    color: #fff;
    margin-bottom: 15px;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
  
  .card-footer {
    text-align: right;
    font-size: 0.7rem;
    color: #bc13fe;
    letter-spacing: 2px;
  }
  
  .corner-deco {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid #00f3ff;
    
    &.top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
    &.top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
    &.bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
    &.bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }
  }
}

/* Console Dock */
.console-dock {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  
  &.dock-hidden {
    transform: translateX(-50%) translateY(200%);
    opacity: 0;
  }
}

.transmit-btn {
  background: rgba(0, 243, 255, 0.1);
  border: 1px solid #00f3ff;
  color: #00f3ff;
  padding: 15px 40px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
  transition: all 0.3s;
  
  &:hover {
    background: #00f3ff;
    color: #000;
    box-shadow: 0 0 30px #00f3ff;
  }
}

/* Cyber Interface Modal */
.cyber-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cyber-interface {
  width: 400px; /* Reduced from 500px */
  background: rgba(10, 15, 25, 0.95);
  border: 1px solid #00f3ff;
  padding: 2px;
  position: relative;
  box-shadow: 0 0 50px rgba(0, 243, 255, 0.2);
  clip-path: polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(0, 243, 255, 0.1);
    z-index: -1;
  }
}

.interface-header {
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.2), transparent);
  padding: 15px 20px; /* Reduced padding */
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #00f3ff;
  
  h3 {
    font-family: 'Orbitron', sans-serif;
    color: #00f3ff;
    margin: 0;
    letter-spacing: 2px;
    font-size: 1.2rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: #00f3ff;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
    &:hover { color: #fff; }
  }
}

.interface-body {
  padding: 30px; /* Reduced padding */
}

.cyber-input-group {
  margin-bottom: 30px;
  position: relative;
  
  label {
    display: block;
    font-family: 'Orbitron', sans-serif;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    margin-bottom: 10px;
    letter-spacing: 1px;
    text-align: left;
  }
  
  input, textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    padding: 10px 0;
    font-size: 1.1rem;
    
    &:focus { outline: none; }
  }
  
  .input-line {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      height: 2px;
      background: #00f3ff;
      transition: width 0.3s ease;
    }
  }
  
  input:focus + .input-line::after,
  textarea:focus + .input-line::after {
    width: 100%;
  }
  &:last-child {
    margin-bottom: 0;
  }
}

.interface-footer {
  padding: 20px;
  text-align: right;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.send-btn {
  background: #00f3ff;
  color: #000;
  border: none;
  padding: 15px 40px;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: all 0.3s;
  
  &:hover:not(:disabled) {
    background: #fff;
    box-shadow: 0 0 20px #00f3ff;
  }
  
  &:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
  }
}

/* Animations */
@keyframes typeReveal {
  to { width: 100%; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes floatOrb {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Vue Transitions */
.hologram-enter-active, .hologram-leave-active {
  transition: all 0.3s ease;
}
.hologram-enter-from, .hologram-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.9);
}

.cyber-modal-enter-active, .cyber-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.cyber-modal-enter-from, .cyber-modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(10px);
}
</style>
