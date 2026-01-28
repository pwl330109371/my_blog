<template>
  <div>
    <transition name="console-fade">
      <div v-if="musicStore.showPlayer" class="music-console-wrapper">
        <div class="music-console-backdrop" @click="musicStore.togglePlayer"></div>
        <div class="music-console">
          <!-- Header / Decoration -->
          <div class="console-header">
            <div class="hologram-text" data-text="ENERGY CONSOLE">ENERGY CONSOLE</div>
            <div class="console-status">
              <span class="status-dot"></span> SYSTEM ONLINE
            </div>
            <div class="close-btn" @click="musicStore.togglePlayer">×</div>
          </div>

          <!-- Background Effects -->
          <div class="console-bg">
            <div class="nebula"></div>
            <div class="stars"></div>
          </div>

          <!-- Playlist -->
          <div class="playlist-container">
            <div 
              v-for="(song) in musicStore.playlist" 
              :key="song.id"
              class="song-item"
              :class="{ 'active': musicStore.currentTrack && musicStore.currentTrack.id === song.id }"
              @click="playSong(song)"
            >
              <!-- Left: Cover -->
              <div class="song-cover-wrapper">
                <div class="cover-ring"></div>
                <div class="song-cover">
                  <img :src="song.cover" :alt="song.title" />
                </div>
                <div class="playing-indicator" v-if="musicStore.currentTrack && musicStore.currentTrack.id === song.id && musicStore.isPlaying">
                  <span></span><span></span><span></span>
                </div>
              </div>

              <!-- Middle: Info -->
              <div class="song-info">
                <div class="song-title" :data-text="song.title">{{ song.title }}</div>
                <div class="song-artist">{{ song.artist }}</div>
              </div>

              <!-- Right: Controls -->
              <div class="song-controls">
                <div class="duration">{{ song.duration }}</div>
                <div class="play-btn-small">
                  <i class="iconfont" :class="getPlayIcon(song)"></i>
                </div>
              </div>
              
              <!-- Active Background Effect -->
              <div class="active-bg" v-if="musicStore.currentTrack && musicStore.currentTrack.id === song.id"></div>
            </div>
          </div>

          <!-- Bottom: Progress & Main Control (Optional, kept minimal as per list focus) -->
          <div class="console-footer">
            <div class="progress-bar-wrapper" @click="seek">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Hidden Audio Element -->
    <audio 
      ref="audioRef" 
      :src="musicStore.currentTrack ? musicStore.currentTrack.url : ''" 
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      crossorigin="anonymous"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useMusicStore } from '@/stores/music'
import type { Song } from '@/stores/music'

const musicStore = useMusicStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const progress = ref(0)

// Mock Data
const mockSongs: Song[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist: 'Cosmic Vibes',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&h=200&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/thewind/KWXZ%20-%20ESti%20-%20Wind%20from%20the%20Far%20East%EF%BC%88%E4%B8%8A%E4%BA%AC%EF%BC%89%EF%BC%88%E9%98%BF%E6%B4%B2%20remix%EF%BC%89.mp3',
    duration: '03:45'
  },
  {
    id: 2,
    title: 'Neon Dreams',
    artist: 'Cyber Soul',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&h=200&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/loudThunder.mp3', // Placeholder
    duration: '04:20'
  },
  {
    id: 3,
    title: 'Galaxy Voyage',
    artist: 'Stardust',
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/rain.mp3', // Placeholder
    duration: '02:55'
  },
  {
    id: 4,
    title: 'Quantum Leap',
    artist: 'Flux Core',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
    url: 'https://thewind-1302955814.cos.ap-shanghai.myqcloud.com/rainy/thunder.mp3', // Placeholder
    duration: '03:10'
  }
]

onMounted(() => {
  musicStore.setPlaylist(mockSongs)
})

watch(() => musicStore.isPlaying, (newVal) => {
  nextTick(async () => {
    if (audioRef.value) {
      try {
        if (newVal) {
          await audioRef.value.play()
        } else {
          audioRef.value.pause()
        }
      } catch (error) {
        console.error('Audio playback failed:', error)
        musicStore.isPlaying = false // Revert state if play failed
      }
    }
  })
})

watch(() => musicStore.currentTrack, () => {
  nextTick(async () => {
    if (audioRef.value) {
      try {
        await audioRef.value.play()
        musicStore.isPlaying = true
      } catch (error) {
        console.error('Audio playback failed (track change):', error)
        musicStore.isPlaying = false
      }
    }
  })
})

const playSong = (song: Song) => {
  if (musicStore.currentTrack && musicStore.currentTrack.id === song.id) {
    musicStore.togglePlay()
  } else {
    musicStore.playTrack(song)
  }
}

const getPlayIcon = (song: Song) => {
  if (musicStore.currentTrack && musicStore.currentTrack.id === song.id && musicStore.isPlaying) {
    return 'icon-zanting' // pause icon
  }
  return 'icon-bofang' // play icon
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    const { currentTime, duration } = audioRef.value
    progress.value = (currentTime / duration) * 100
  }
}

const onEnded = () => {
  musicStore.nextTrack()
}

const seek = (e: MouseEvent) => {
  // Simple seek implementation
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const width = rect.width
  const percent = x / width
  
  if (audioRef.value) {
    audioRef.value.currentTime = percent * audioRef.value.duration
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');

.music-console-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rajdhani', sans-serif;
}

.music-console-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.music-console {
  position: relative;
  width: 400px;
  max-width: 90vw;
  height: 600px;
  max-height: 80vh;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.2),
    inset 0 0 20px rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(20px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #fff;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.5), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.console-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;

  .nebula {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.2), transparent 60%);
    animation: rotate 20s linear infinite;
  }
  
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 20% 30%, #fff 100%, transparent),
      radial-gradient(1px 1px at 40% 70%, #fff 100%, transparent),
      radial-gradient(2px 2px at 60% 40%, #fff 100%, transparent),
      radial-gradient(1px 1px at 80% 80%, #fff 100%, transparent);
    opacity: 0.5;
  }
}

.console-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);

  .hologram-text {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #3b82f6;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    position: relative;
    
    &::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      color: #bc13fe;
      opacity: 0.5;
      transform: translate(-1px, 0);
      mix-blend-mode: multiply;
      animation: glitch 2s infinite;
    }
  }

  .console-status {
    font-size: 12px;
    color: #10b981;
    display: flex;
    align-items: center;
    gap: 5px;
    
    .status-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 5px #10b981;
      animation: pulse 2s infinite;
    }
  }

  .close-btn {
    font-size: 24px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.3s;
    
    &:hover {
      color: #fff;
      transform: rotate(90deg);
    }
  }
}

.playlist-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.song-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(59, 130, 246, 0.1);
    
    .song-cover-wrapper {
      .cover-ring {
        opacity: 1;
      }
      .song-cover img {
        transform: scale(1.1);
      }
    }

    .song-title {
      color: #3b82f6;
      text-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
    }
  }

  .active-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent);
    z-index: -1;
  }
}

.song-cover-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  .cover-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #3b82f6;
    border-right-color: #bc13fe;
    opacity: 0;
    transition: opacity 0.3s;
    animation: spin 3s linear infinite;
  }

  .song-cover {
    width: 40px;
    height: 40px;
    border-radius: 50%; // Circular
    overflow: hidden;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
  }

  .playing-indicator {
    position: absolute;
    z-index: 2;
    display: flex;
    gap: 2px;
    align-items: flex-end;
    height: 12px;

    span {
      width: 3px;
      background: #fff;
      animation: bounce 1s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: 0s; height: 6px; }
      &:nth-child(2) { animation-delay: 0.2s; height: 10px; }
      &:nth-child(3) { animation-delay: 0.4s; height: 8px; }
    }
  }
}

.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .song-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
    transition: all 0.3s;
  }

  .song-artist {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.song-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;

  .duration {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    font-family: 'Exo 2', sans-serif;
  }

  .play-btn-small {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &:hover {
      background: #3b82f6;
      box-shadow: 0 0 10px #3b82f6;
    }

    .iconfont {
      font-size: 12px;
      color: #fff;
    }
  }
}

.console-footer {
  padding: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  position: relative;

  .progress-bar-wrapper {
    width: 100%;
    height: 100%;
    
    &:hover .progress-bar {
      box-shadow: 0 0 10px #3b82f6;
    }
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #bc13fe);
    width: 0%;
    position: relative;
    transition: width 0.1s linear;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  &:hover .progress-bar::after {
    opacity: 1;
  }
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

@keyframes bounce {
  0%, 100% { height: 4px; }
  50% { height: 100%; }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

/* Transitions */
.console-fade-enter-active,
.console-fade-leave-active {
  transition: all 0.4s ease;
}

.console-fade-enter-from,
.console-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
