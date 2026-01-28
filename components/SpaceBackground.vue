<template>
  <div class="background-layer">
    <!-- Deep Space Gradient -->
    <div class="deep-space"></div>
    
    <!-- Nebulas -->
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="nebula nebula-3"></div>
    
    <!-- Distant Stars -->
    <div class="stars-container">
      <div v-for="n in 3" :key="n" :class="`star-layer layer-${n}`"></div>
    </div>

    <!-- Floating Planets -->
    <div class="planet planet-1"></div>
    <div class="planet planet-2"></div>
    
    <!-- Grid/Horizon -->
    <div class="horizon-glow"></div>

    <!-- Dynamic Meteors -->
    <div class="meteors-container">
      <div 
        v-for="meteor in meteors" 
        :key="meteor.id" 
        class="meteor"
        :style="{
          left: meteor.x + '%',
          top: meteor.y + '%',
          animationDuration: meteor.duration + 's',
          animationDelay: meteor.delay + 's',
          '--angle': meteor.angle + 'deg',
          '--scale': meteor.scale,
          '--meteor-color': meteor.color
        }"
      >
        <div class="meteor-body"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Meteor {
  id: number
  x: number
  y: number
  duration: number
  delay: number
  angle: number
  scale: number
  color: string
}

const meteors = ref<Meteor[]>([])
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth) * 2 - 1
  mouseY.value = (e.clientY / window.innerHeight) * 2 - 1
}

const createMeteors = () => {
  const count = 6 
  const newMeteors: Meteor[] = []
  
  // Lighter/Pastel Neon colors
  const colors = ['#a3f9fd', '#ff9ebc', '#e4aaff', '#adffce', '#fff5ad']
  
  for (let i = 0; i < count; i++) {
    newMeteors.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50 - 20,
      duration: 4 + Math.random() * 5, 
      delay: Math.random() * 15, 
      angle: -45 + (Math.random() * 10 - 5),
      scale: 0.4 + Math.random() * 0.4, 
      color: colors[Math.floor(Math.random() * colors.length)]!
    })
  }
  
  meteors.value = newMeteors
}

onMounted(() => {
  createMeteors()
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style lang="scss" scoped>
.background-layer {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #050510;
  overflow: hidden;
  pointer-events: none;
}

.deep-space {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 50% 120%, rgba(20, 30, 60, 0.4) 0%, transparent 70%),
    radial-gradient(circle at 50% -20%, rgba(10, 10, 20, 0.8) 0%, transparent 70%);
  z-index: 1;
}

.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: nebulaPulse 15s ease-in-out infinite alternate;
  z-index: 2;
  transition: transform 0.2s ease-out;
}

.nebula-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, #4c1d95 0%, transparent 70%);
  animation-duration: 20s;
  transform: translate(v-bind('mouseX * -20 + "px"'), v-bind('mouseY * -20 + "px"'));
}

.nebula-2 {
  bottom: 20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #0c4a6e 0%, transparent 70%);
  animation-duration: 25s;
  animation-delay: -5s;
  transform: translate(v-bind('mouseX * -30 + "px"'), v-bind('mouseY * -30 + "px"'));
}

.nebula-3 {
  top: 40%;
  left: 30%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, #be185d 0%, transparent 70%);
  opacity: 0.2;
  animation-duration: 18s;
  animation-delay: -10s;
  transform: translate(v-bind('mouseX * -15 + "px"'), v-bind('mouseY * -15 + "px"'));
}

.stars-container {
  position: absolute;
  inset: 0;
  z-index: 3;
  transition: transform 0.1s ease-out;
  transform: translate(v-bind('mouseX * -10 + "px"'), v-bind('mouseY * -10 + "px"'));
}

@function box-shadow-stars($n) {
  $value: '#{random(2000)}px #{random(2000)}px #fff';
  @for $i from 2 through $n {
    $value: '#{$value}, #{random(2000)}px #{random(2000)}px #fff';
  }
  @return unquote($value);
}

.star-layer {
  position: absolute;
  border-radius: 50%;
  background: transparent;
}

.layer-1 {
  width: 1px;
  height: 1px;
  box-shadow: box-shadow-stars(200);
  animation: moveStars 100s linear infinite;
  opacity: 0.8;
}

.layer-2 {
  width: 2px;
  height: 2px;
  box-shadow: box-shadow-stars(100);
  animation: moveStars 150s linear infinite;
  opacity: 0.6;
}

.layer-3 {
  width: 3px;
  height: 3px;
  box-shadow: box-shadow-stars(50);
  animation: moveStars 200s linear infinite;
  opacity: 0.4;
  filter: blur(1px);
}

.planet {
  position: absolute;
  border-radius: 50%;
  z-index: 4;
  box-shadow: inset -10px -10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.1);
}

.planet-1 {
  top: 15%;
  right: 15%;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #1e293b, #334155);
  opacity: 0.8;
  animation: floatPlanet 20s ease-in-out infinite alternate;
}

.planet-2 {
  bottom: 25%;
  left: 10%;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4c1d95, #312e81);
  opacity: 0.6;
  animation: floatPlanet 15s ease-in-out infinite alternate-reverse;
}

.horizon-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  background: linear-gradient(to top, rgba(56, 189, 248, 0.1), transparent);
  z-index: 5;
  pointer-events: none;
}

/* Meteors */
.meteors-container {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}

.meteor {
  position: absolute;
  /* transform is handled inline */
  opacity: 0;
  animation: meteor-fall linear infinite;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 0 6px var(--meteor-color));
}

.meteor-body {
  --star-tail-length: 200px; /* Reduced length */
  --star-tail-height: 2px; /* Thinner tail */
  --star-width: 30px; /* Smaller head */
  
  position: relative;
  width: var(--star-tail-length);
  height: var(--star-tail-height);
  background: linear-gradient(45deg, var(--meteor-color), transparent);
  border-radius: 50%;
  opacity: 0.8; /* Make it fainter overall */
}

.meteor-body::before,
.meteor-body::after {
  content: '';
  position: absolute;
  top: 0;
  left: calc(var(--star-width) / -2);
  width: var(--star-width);
  height: 100%;
  background: linear-gradient(45deg, transparent, var(--meteor-color), transparent);
  border-radius: inherit;
  animation: blink 2s linear infinite;
}

.meteor-body::before {
  transform: rotate(45deg);
}

.meteor-body::after {
  transform: rotate(-45deg);
}

@keyframes meteor-fall {
  0% {
    opacity: 0;
    transform: rotate(var(--angle)) scale(var(--scale)) translateX(0);
    width: 0; /* Start small */
  }
  10% {
    opacity: 1;
    width: var(--star-tail-length); /* Grow to full size */
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) scale(var(--scale)) translateX(-600px); /* Shorter distance */
    width: 0; /* Shrink to nothing */
  }
}

@keyframes blink {
  50% { opacity: 0.6; }
}

@keyframes spinStar {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes nebulaPulse {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.1); opacity: 0.5; }
}

@keyframes moveStars {
  from { transform: translateY(0); }
  to { transform: translateY(-2000px); }
}

@keyframes floatPlanet {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-20px) rotate(5deg); }
}
</style>
