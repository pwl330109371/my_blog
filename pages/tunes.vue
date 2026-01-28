<template>
  <div class="tunes-page">
    <div class="tunes-background">
      <SpaceBackground />
    </div>

    <div class="tunes-container">
      <!-- Top Navigation / Tabs -->
      <div class="tunes-nav">
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'music' }"
          @click="activeTab = 'music'"
        >
          <span class="icon">♪</span>
          <span class="text" data-text="ASTRAL MELODY">星律 · 旋律</span>
        </div>
        <div 
          class="nav-tab" 
          :class="{ active: activeTab === 'rainy' }"
          @click="activeTab = 'rainy'"
        >
          <span class="icon">≋</span>
          <span class="text" data-text="COSMIC TIDE">潮汐 · 白噪</span>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="tunes-content">
        
        <!-- Music Section -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="activeTab === 'music'" class="music-section" key="music">
            <div class="music-player-card">
              <!-- Left: Visualizer & Cover -->
              <div class="player-visual">
                <div class="album-cover-container">
                  <div class="cover-ring" :class="{ spinning: musicStore.isPlaying }"></div>
                  <img 
                    :src="musicStore.currentTrack ? musicStore.currentTrack.cover : '/images/textlogo.png'" 
                    class="album-cover" 
                    :class="{ rotating: musicStore.isPlaying }"
                  />
                  <div class="center-hole"></div>
                </div>
                
                <div class="current-track-info">
                  <h2 class="track-title">{{ musicStore.currentTrack ? musicStore.currentTrack.title : 'Waiting for signal...' }}</h2>
                  <p class="track-artist">{{ musicStore.currentTrack ? musicStore.currentTrack.artist : 'Unknown Frequency' }}</p>
                </div>
              </div>

              <!-- Right: Playlist & Controls -->
              <div class="player-controls-area">
                <div class="playlist-header">
                  <h3>TRANSMISSION LOG</h3>
                  <div class="play-status" :class="{ online: musicStore.isPlaying }">
                    {{ musicStore.isPlaying ? 'BROADCASTING' : 'STANDBY' }}
                  </div>
                </div>

                <div class="playlist-scroll">
                  <div 
                    v-for="(song) in musicStore.playlist" 
                    :key="song.id"
                    class="playlist-item"
                    :class="{ active: musicStore.currentTrack && musicStore.currentTrack.id === song.id }"
                    @click="playSong(song)"
                  >
                    <div class="item-status">
                      <div class="equalizer" v-if="musicStore.currentTrack && musicStore.currentTrack.id === song.id && musicStore.isPlaying">
                        <span></span><span></span><span></span>
                      </div>
                      <span v-else class="index-num">{{ String(song.id).padStart(2, '0') }}</span>
                    </div>
                    <div class="item-info">
                      <span class="item-title">{{ song.title }}</span>
                      <span class="item-artist">{{ song.artist }}</span>
                    </div>
                    <div class="item-duration">{{ song.duration }}</div>
                  </div>
                </div>

                <!-- Main Control Bar -->
                <div class="control-bar">
                  <div class="time-display" v-if="musicAudioRef">
                    {{ formatTime(musicAudioRef.currentTime || 0) }} / {{ formatTime(musicAudioRef.duration || 0) }}
                  </div>
                  <div class="progress-area" @click="seek">
                    <div class="progress-bg">
                      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                    </div>
                  </div>
                  
                  <div class="buttons">
                    <button class="ctrl-btn prev" @click="musicStore.prevTrack">
                      <i class="iconfont icon-shangyishou"></i>
                    </button>
                    <button class="ctrl-btn play" @click="musicStore.togglePlay">
                      <i class="iconfont" :class="musicStore.isPlaying ? 'icon-zanting' : 'icon-bofang'"></i>
                    </button>
                    <button class="ctrl-btn next" @click="musicStore.nextTrack">
                      <i class="iconfont icon-xiayishou"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rainy/Tide Section -->
          <div v-else class="rainy-section" key="rainy">
             <div class="tide-console">
               <div class="console-screen">
                 <div class="radar-scan"></div>
                 <div class="atmosphere-visual">
                   <!-- Visual representation of active sounds -->
                   <div v-for="(item, index) in rainIcon" :key="index" class="sound-node" :class="{ active: item.active }">
                     <div class="node-ring"></div>
                     <div class="node-icon">
                       <img :src="item.active ? item.on : item.off" />
                     </div>
                     <div class="node-label">{{ getSoundName(index) }}</div>
                   </div>
                 </div>
               </div>

               <div class="console-controls">
                 <h3>ATMOSPHERE CONTROLS</h3>
                 <div class="switches-grid">
                   <div 
                      v-for="(item, index) in rainIcon" 
                      :key="index" 
                      class="switch-module"
                      :class="{ active: item.active }"
                      @click="toggleSound(index, item.active)"
                    >
                      <div class="switch-header">
                        <span class="channel">CH-{{ String(index + 1).padStart(2, '0') }}</span>
                        <div class="indicator"></div>
                      </div>
                      <div class="switch-body">
                        <span class="switch-knob"></span>
                      </div>
                      <div class="switch-label">{{ getSoundName(index) }}</div>
                      
                      <!-- Hidden Audio Element -->
                      <audio :ref="el => audioDom[index] = el" class="ambient-audio" loop preload="auto">
                        <source type="audio/mpeg" :src="item.music" />
                      </audio>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </transition>
      </div>
    </div>
    
    <!-- Global Audio Element for Music (Synced with Store) -->
    <audio 
      ref="musicAudioRef" 
      :src="musicStore.currentTrack ? musicStore.currentTrack.url : ''" 
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import SpaceBackground from '@/components/SpaceBackground.vue'
import { useMusicStore, type Song } from '@/stores/music'

definePageMeta({
  layout: 'default' // Ensure we use the default layout which includes Header
})

// --- Tabs State ---
const activeTab = ref('music')

// --- Music Logic ---
const musicStore = useMusicStore()
const musicAudioRef = ref<HTMLAudioElement | null>(null)
const progress = ref(0)

// --- Mock Data ---
const mockSongs: Song[] = [
  {
    id: 1,
    title: 'Interstellar Journey',
    artist: 'Cosmic Voyager',
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/thewind/KWXZ%20-%20ESti%20-%20Wind%20from%20the%20Far%20East%EF%BC%88%E4%B8%8A%E4%BA%AC%EF%BC%89%EF%BC%88%E9%98%BF%E6%B4%B2%20remix%EF%BC%89.mp3',
    duration: '03:45'
  },
  {
    id: 2,
    title: 'Neon Nebula',
    artist: 'Cyber Stardust',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/loudThunder.mp3',
    duration: '04:20'
  },
  {
    id: 3,
    title: 'Deep Space Signal',
    artist: 'SETI Core',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain.mp3',
    duration: '02:55'
  },
  {
    id: 4,
    title: 'Event Horizon',
    artist: 'Gravity Well',
    cover: 'https://images.unsplash.com/photo-1614730341194-75c60740a0d3?w=400&h=400&fit=crop',
    url: 'https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/bizhibian.mp3',
    duration: '03:10'
  },
  {
    id: 5,
    title: 'Solar Wind',
    artist: 'Plasma Flow',
    cover: 'https://images.unsplash.com/photo-1570284613060-766c33850e00?w=400&h=400&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/thewind/KWXZ%20-%20ESti%20-%20Wind%20from%20the%20Far%20East%EF%BC%88%E4%B8%8A%E4%BA%AC%EF%BC%89%EF%BC%88%E9%98%BF%E6%B4%B2%20remix%EF%BC%89.mp3',
    duration: '05:12'
  },
  {
    id: 6,
    title: 'Quantum Echo',
    artist: 'Void Walker',
    cover: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=400&h=400&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain.mp3',
    duration: '03:33'
  },
  {
    id: 7,
    title: 'Galactic Drift',
    artist: 'Star Surfer',
    cover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=400&fit=crop',
    url: 'https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/bizhibian.mp3',
    duration: '04:05'
  }
]

// Sync with global store state
watch(() => musicStore.isPlaying, (newVal) => {
  nextTick(async () => {
    if (musicAudioRef.value) {
      if (newVal) {
        try {
          await musicAudioRef.value.play()
        } catch (e) {
          console.error("Music Play Error", e)
          // Do not reset isPlaying immediately to avoid UI flickering if it's just loading
        }
      } else {
        musicAudioRef.value.pause()
      }
    }
  })
})

// Handle track change
watch(() => musicStore.currentTrack, () => {
  nextTick(async () => {
    if (musicAudioRef.value) {
      // Load the new source explicitly
      musicAudioRef.value.load()
      if (musicStore.isPlaying) {
         try {
          await musicAudioRef.value.play()
        } catch (e) {
          console.error("Track Change Play Error", e)
        }
      }
    }
  })
})

const playSong = (song: Song) => {
  if (musicStore.currentTrack?.id === song.id) {
    musicStore.togglePlay()
  } else {
    musicStore.playTrack(song)
  }
}

const getPlayIcon = (song: Song) => {
   if (musicStore.currentTrack?.id === song.id && musicStore.isPlaying) {
     return 'icon-zanting'
   }
   return 'icon-bofang'
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const onTimeUpdate = () => {
  if (musicAudioRef.value) {
    const { currentTime, duration } = musicAudioRef.value
    if (duration) {
      progress.value = (currentTime / duration) * 100
    }
  }
}

const onEnded = () => {
  musicStore.nextTrack()
}

const seek = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width
  const percent = x / width
  if (musicAudioRef.value && Number.isFinite(musicAudioRef.value.duration)) {
    musicAudioRef.value.currentTime = percent * musicAudioRef.value.duration
  }
}

// --- Rainy/Tide Logic ---
const audioDom = ref<any[]>([])
const rainIcon = ref([
  {
    on: '/images/rain/rain_on.png',
    off: '/images/rain/rain_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/thunder.mp3',
    active: false,
    name: 'THUNDER'
  },
  {
    on: '/images/rain/rain2_on.png',
    off: '/images/rain/rain2_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/loudThunder.mp3',
    active: false,
    name: 'STORM'
  },
  {
    on: '/images/rain/rain3_on.png',
    off: '/images/rain/rain3_off.png',
    music: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain.mp3',
    active: false,
    name: 'RAIN'
  },
  {
    on: '/images/rain/rain4_on.png',
    off: '/images/rain/rain4_off.png',
    music: 'https://qiheizhiya.oss-cn-shenzhen.aliyuncs.com/image/bizhibian.mp3',
    active: false,
    name: 'WIND'
  }
])

const getSoundName = (index: number) => {
  return rainIcon.value[index].name
}

const toggleSound = (index: number, isActive: boolean) => {
  const icon = rainIcon.value[index]
  if (!icon) return
  
  icon.active = !isActive
  const audio = audioDom.value[index]
  if (audio) {
    if (icon.active) {
      audio.play().catch((e: any) => console.log("Ambient play failed", e))
    } else {
      audio.pause()
    }
  }
}

const cleanupAmbient = () => {
  rainIcon.value.forEach((item, index) => {
    item.active = false
    const audio = audioDom.value[index]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  })
}

onUnmounted(() => {
  // Optional: Decide if ambient sounds should stop when leaving the page.
  // Given "Separate Menu Page", usually implies sounds are contained to the page.
  cleanupAmbient()
  
  // Note: Music Player logic is tied to store, but the <audio> element is HERE in this page.
  // So when leaving this page, music will stop. This aligns with "separate menu page" not "global player".
})

onMounted(() => {
  musicStore.setPlaylist(mockSongs)

  // If store says playing, try to recover state if audio ref is ready
  if (musicStore.isPlaying && musicAudioRef.value) {
    // Explicitly load first
    musicAudioRef.value.load()
    musicAudioRef.value.play().catch((e) => {
      console.warn("Autoplay recovered failed:", e)
      musicStore.isPlaying = false
    })
  }
})

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');

.tunes-page {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: #fff;
  padding-top: 80px; // Space for Header
}

.tunes-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.tunes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;
}

/* --- Navigation Tabs --- */
.tunes-nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;

  .nav-tab {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &.active {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);

      .text {
        color: #3b82f6;
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
      }
      
      .icon {
        transform: scale(1.2);
        color: #bc13fe;
      }
    }

    &:hover:not(.active) {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.05);
    }

    .icon {
      font-size: 24px;
      transition: transform 0.3s;
    }

    .text {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
      transition: color 0.3s;
    }
  }
}

/* --- Music Section --- */
.music-player-card {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  min-height: 500px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.player-visual {
  flex: 1;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 70%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;

  .album-cover-container {
    width: 260px;
    height: 260px;
    position: relative;
    margin-bottom: 40px;
    
    .cover-ring {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      border: 2px dashed rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      
      &.spinning {
        animation: spin 10s linear infinite;
        border-color: rgba(59, 130, 246, 0.6);
      }
    }

    .album-cover {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
      border: 4px solid rgba(15, 23, 42, 0.8);
      
      &.rotating {
        animation: spin 20s linear infinite;
      }
    }

    .center-hole {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40px;
      height: 40px;
      background: #0f172a;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid rgba(59, 130, 246, 0.2);
    }
  }

  .current-track-info {
    text-align: center;
    
    .track-title {
      font-size: 28px;
      margin: 0 0 10px;
      background: linear-gradient(135deg, #fff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }

    .track-artist {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }
}

.player-controls-area {
  flex: 1.2;
  padding: 30px;
  display: flex;
  flex-direction: column;

  .playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
      font-size: 16px;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .play-status {
      font-size: 12px;
      color: #64748b;
      
      &.online {
        color: #10b981;
        text-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
      }
    }
  }

  .playlist-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
    max-height: 350px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }
  }

  .playlist-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.active {
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid #3b82f6;

      .item-info .item-title {
        color: #3b82f6;
      }
      
      .index-num {
        color: #3b82f6;
      }
    }

    .item-status {
      width: 40px;
      display: flex;
      justify-content: center;

      .index-num {
        color: rgba(255, 255, 255, 0.2);
        font-family: monospace;
      }

      .equalizer {
        display: flex;
        gap: 2px;
        align-items: flex-end;
        height: 12px;
        span {
          width: 3px;
          background: #3b82f6;
          animation: bounce 0.8s infinite;
          &:nth-child(2) { animation-delay: 0.1s; }
          &:nth-child(3) { animation-delay: 0.2s; }
        }
      }
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .item-title {
        font-weight: 600;
        font-size: 15px;
      }
      .item-artist {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .item-duration {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .control-bar {
    margin-top: 20px;
    
    .time-display {
      text-align: right;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 5px;
      font-family: monospace;
      letter-spacing: 1px;
    }

    .progress-area {
      height: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .progress-bg {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: #3b82f6;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 0px;
          box-shadow: 0 0 10px 2px #3b82f6;
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;

      .ctrl-btn {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;

        &.prev, &.next {
          width: 40px;
          height: 40px;
          &:hover { background: rgba(255, 255, 255, 0.1); }
        }

        &.play {
          width: 60px;
          height: 60px;
          border-color: #3b82f6;
          color: #3b82f6;
          font-size: 24px;
          
          &:hover {
            background: rgba(59, 130, 246, 0.1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            transform: scale(1.05);
          }
        }
      }
    }
  }
}

/* --- Rainy Section --- */
.tide-console {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.console-screen {
  height: 200px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .radar-scan {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.1) 20%, transparent 40%);
    transform: translate(-50%, -50%);
    animation: spin 4s linear infinite;
    pointer-events: none;
  }

  .atmosphere-visual {
    display: flex;
    gap: 40px;
    z-index: 2;

    .sound-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      opacity: 0.3;
      transition: all 0.5s;

      &.active {
        opacity: 1;
        transform: scale(1.1);

        .node-ring {
          border-color: #bc13fe;
          box-shadow: 0 0 15px #bc13fe;
        }
      }

      .node-ring {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
      }

      .node-icon img {
        width: 30px;
        height: auto;
      }

      .node-label {
        font-size: 12px;
        letter-spacing: 2px;
      }
    }
  }
}

.console-controls {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 30px;
    letter-spacing: 4px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }

  .switches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 20px;
  }

  .switch-module {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    &.active {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);

      .switch-header .indicator {
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }

      .switch-body .switch-knob {
        transform: translateY(-50%) translateX(20px);
        background: #3b82f6;
      }
    }

    .switch-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      
      .channel {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.3);
      }
      
      .indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #333;
        transition: all 0.3s;
      }
    }

    .switch-body {
      width: 40px;
      height: 20px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      margin: 0 auto 15px;
      position: relative;

      .switch-knob {
        position: absolute;
        top: 50%;
        left: 2px;
        width: 16px;
        height: 16px;
        background: #666;
        border-radius: 50%;
        transform: translateY(-50%);
        transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      }
    }

    .switch-label {
      text-align: center;
      font-weight: 600;
      letter-spacing: 1px;
      font-size: 14px;
    }
  }
}

/* --- Animations --- */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { height: 4px; }
  50% { height: 100%; }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
