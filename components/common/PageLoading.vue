<template>
  <transition name="fade">
    <div class="page-loading">
      <div class="loader-content">
        <div class="planet">
          <div class="ring"></div>
          <div class="cover-ring"></div>
          <div class="spots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p class="loading-text">Loading</p>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #090a0f;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.planet {
  width: 60px;
  height: 60px;
  position: relative;
  border-radius: 50%;
  background: #333;
  box-shadow: inset 0 -20px 0px 0px rgba(0, 0, 0, 0.2);
  animation: planet-pulse 2s infinite linear;
  background-image: linear-gradient(to bottom left, #0096ff, #005c99);

  .ring {
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background-color: transparent;
    border: 3px solid rgba(0, 150, 255, 0.5);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotateX(75deg);
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.3);
    animation: ring-rotate 2s infinite linear;
    
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      top: 10px;
      right: 20px;
      box-shadow: 0 0 10px #fff;
    }
  }
}

.loading-text {
  color: #0096ff;
  font-size: 14px;
  letter-spacing: 4px;
  text-transform: uppercase;
  animation: text-blink 1.5s infinite ease-in-out;
  font-family: 'Rajdhani', sans-serif;
  margin: 0;
}

/* Animations */
@keyframes planet-pulse {
  0% { box-shadow: inset 0 -20px 0px 0px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 150, 255, 0.3); }
  50% { box-shadow: inset 0 -20px 0px 0px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 150, 255, 0.6); }
  100% { box-shadow: inset 0 -20px 0px 0px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 150, 255, 0.3); }
}

@keyframes ring-rotate {
  0% { transform: translate(-50%, -50%) rotateX(75deg) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotateX(75deg) rotate(360deg); }
}

@keyframes text-blink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; letter-spacing: 6px; }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
