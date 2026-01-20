<template>
  <span class="tge-wrapper" :class="containerClass">
    <span
      v-for="(ch, i) in letters"
      :key="i"
      class="tge-letter"
      :style="letterStyle(i)"
    >
      {{ ch }}
    </span>
  </span>
</template>

<script lang="ts">
export default {
  name: 'TextGenerateEffect',
  props: {
    words: { type: String, required: true },
    duration: { type: Number, default: 0.7 },
    delay: { type: Number, default: 0 },
    filter: { type: Boolean, default: true },
    class: { type: [String, Array], default: '' }
  },
  computed: {
    containerClass(): string {
      return Array.isArray(this.class) ? (this.class as string[]).join(' ') : (this.class as string)
    },
    letters(): string[] {
      return (this.words || '').split('')
    }
  },
  methods: {
    letterStyle(i: number): Record<string, string> {
      const perCharDelay = 120
      return {
        animationDuration: `${this.duration}s`,
        animationDelay: `${this.delay + i * perCharDelay}ms`,
        '--tge-start-blur': this.filter ? '6px' : '0px'
      }
    }
  }
}
</script>

<style scoped>
.tge-wrapper {
  display: inline-flex;
  align-items: baseline;
}
.tge-letter {
  display: inline-block;
  will-change: transform, opacity, filter;
  animation: tgeShow var(--tge-duration, 0.7s) ease-out both;
}
.tge-letter {
  --tge-start-blur: 6px;
  --tge-duration: 0.7s;
}
@keyframes tgeShow {
  0% {
    opacity: 0;
    transform: translateY(8px);
    filter: blur(var(--tge-start-blur));
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}
</style>
