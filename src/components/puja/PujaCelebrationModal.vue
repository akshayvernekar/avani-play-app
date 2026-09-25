<template>
  <transition name="fade">
    <div v-if="show" class="puja-celebration-overlay" role="dialog" aria-modal="true">
      <!-- Falling Flower Petals Animation -->
      <div class="falling-petals-container" aria-hidden="true">
        <span 
          v-for="i in 16" 
          :key="i" 
          class="petal-particle"
          :style="getPetalStyle(i)"
        >
          {{ petalEmojis[i % petalEmojis.length] }}
        </span>
      </div>

      <div class="celebration-card-content">
        <div class="divine-blessing-icon">🙏</div>
        <h2 class="celebration-heading">Puja Complete!</h2>
        <p class="celebration-subtext">Ganesha is smiling with all your love &amp; offerings! 🌺✨</p>

        <div class="celebration-actions">
          <button class="celebrate-btn btn-play-again" @click="$emit('play-again')">
            <span class="btn-icon">🔄</span>
            <span>Do Puja Again</span>
          </button>
          
          <button class="celebrate-btn btn-home" @click="$emit('go-home')">
            <span class="btn-icon">🏠</span>
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { audioManager } from '../../audio/AudioManager';
import confetti from 'canvas-confetti';

const props = defineProps<{
  show: boolean;
}>();

defineEmits<{
  (e: 'play-again'): void;
  (e: 'go-home'): void;
}>();

const petalEmojis = ['🌸', '🌺', '🌼', '🏵️', '✨', '🪷'];

function getPetalStyle(index: number) {
  const left = (index * 6.25) + (index % 3 * 2);
  const duration = 2.5 + (index % 4) * 0.7;
  const delay = (index % 5) * 0.4;
  const size = 18 + (index % 3) * 8;
  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    fontSize: `${size}px`
  };
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    audioManager.playCelebration();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF9800', '#FF4081', '#4CAF50', '#00BCD4']
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }
});
</script>

<style scoped>
.puja-celebration-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(46, 26, 71, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Falling Flower Petals */
.falling-petals-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.petal-particle {
  position: absolute;
  top: -40px;
  animation: fallPetal linear infinite;
  opacity: 0.9;
}

@keyframes fallPetal {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0.9;
  }
  50% {
    transform: translateY(50vh) rotate(180deg) translateX(25px);
    opacity: 0.95;
  }
  100% {
    transform: translateY(105vh) rotate(360deg) translateX(-15px);
    opacity: 0;
  }
}

/* Card */
.celebration-card-content {
  position: relative;
  z-index: 2;
  background: radial-gradient(circle at 50% 30%, #FFFDE7 0%, #FFF8E1 55%, #FFE082 100%);
  border: clamp(3px, 0.6vh, 5px) solid #FFB300;
  border-radius: clamp(22px, 3.5vw, 36px);
  padding: clamp(18px, 3vh, 32px) clamp(24px, 4vw, 44px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), 0 0 24px rgba(255, 179, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 90vw;
  width: clamp(340px, 55vw, 520px);
  animation: zoomCelebration 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes zoomCelebration {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.divine-blessing-icon {
  font-size: clamp(48px, 9vh, 72px);
  line-height: 1;
  margin-bottom: clamp(6px, 1vh, 12px);
  animation: pulseGlow 1.5s infinite alternate ease-in-out;
}

@keyframes pulseGlow {
  0% { transform: scale(0.95); }
  100% { transform: scale(1.12); }
}

.celebration-heading {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(24px, 4.5vh, 36px);
  font-weight: 700;
  color: #E65100;
  margin: 0;
  text-shadow: 0 2px 4px rgba(255, 179, 0, 0.3);
}

.celebration-subtext {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(13px, 2.2vh, 17px);
  font-weight: 600;
  color: #6D4C41;
  margin: clamp(6px, 1vh, 10px) 0 clamp(16px, 2.5vh, 24px);
  line-height: 1.3;
}

.celebration-actions {
  display: flex;
  gap: clamp(10px, 2vw, 18px);
  width: 100%;
  justify-content: center;
}

.celebrate-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: clamp(10px, 1.6vh, 14px) clamp(16px, 2.5vw, 24px);
  border-radius: 999px;
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(14px, 2.4vh, 18px);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
  min-height: 48px;
  border: none;
}

.celebrate-btn:active {
  transform: scale(0.95);
}

.btn-play-again {
  background: linear-gradient(135deg, #FF9800 0%, #FFB300 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 14px rgba(255, 152, 0, 0.4);
  border: 2px solid #FFE082;
}

.btn-play-again:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 152, 0, 0.5);
}

.btn-home {
  background: #FFFFFF;
  color: #795548;
  border: 2px solid #BCAAA4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-home:hover {
  background: #EFEBE9;
  transform: translateY(-2px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
