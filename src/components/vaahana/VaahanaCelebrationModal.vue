<template>
  <div v-if="show" class="celebration-overlay" @click="handleBackdropClick">
    <div class="celebration-card" @click.stop>
      <div class="stars-header">
        <span class="star left">⭐</span>
        <span class="star center">🌟</span>
        <span class="star right">⭐</span>
      </div>

      <h1 class="victory-title">Amazing!</h1>
      <h2 class="victory-subtitle">You found all the Vaahanas!</h2>

      <!-- Grid of all 6 completed Deities -->
      <div class="deities-gallery-grid">
        <div v-for="item in deityList" :key="item.id" class="gallery-item">
          <div class="gallery-img-box">
            <img :src="item.deityImage" :alt="item.deityName" class="gallery-img" />
            <span class="gallery-emoji-badge">{{ getEmoji(item.correctVaahana) }}</span>
          </div>
          <span class="gallery-name">{{ item.deityName }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions-row">
        <button class="action-btn play-again-btn" @click="handlePlayAgain">
          <RotateCcw class="btn-icon" />
          <span>Play Again</span>
        </button>

        <button class="action-btn home-btn" @click="handleGoHome">
          <Home class="btn-icon" />
          <span>Avani's World</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { DeityItem, vaahanas } from '../../data/vaahana';
import { RotateCcw, Home } from 'lucide-vue-next';
import { audioManager } from '../../audio/AudioManager';
import confetti from 'canvas-confetti';

const props = defineProps<{
  show: boolean;
  deityList: DeityItem[];
}>();

const emit = defineEmits<{
  (e: 'play-again'): void;
  (e: 'go-home'): void;
  (e: 'close'): void;
}>();

function getEmoji(vaahanaId: string): string {
  const v = vaahanas.find(item => item.id === vaahanaId);
  return v ? v.emoji : '✨';
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    audioManager.playCelebration();
    const gameCompleteAudio = 'assets/audio_gungun/ride_game_complete.mp3';
    const played = audioManager.playAudioFile(gameCompleteAudio);
    if (!played) {
      audioManager.speak("Amazing! You found all the Vaahanas!");
    }
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  }
});

function handlePlayAgain() {
  audioManager.playTap();
  emit('play-again');
}

function handleGoHome() {
  audioManager.playTap();
  emit('go-home');
}

function handleBackdropClick() {
  audioManager.playTap();
  emit('close');
}
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(27, 94, 32, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  cursor: pointer;
}

.celebration-card {
  background: linear-gradient(180deg, #66BB6A 0%, #2E7D32 100%);
  border: 6px solid #FFFFFF;
  border-radius: 36px;
  padding: 24px 18px;
  max-width: 440px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);
  animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #FFFFFF;
  cursor: default;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.stars-header {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.star {
  font-size: 2rem;
  animation: float 2s infinite ease-in-out alternate;
}
.star.left { animation-delay: 0s; }
.star.center { font-size: 2.8rem; animation-delay: 0.3s; }
.star.right { animation-delay: 0.6s; }

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

.victory-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  line-height: 1;
}

.victory-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  margin: 4px 0 16px 0;
  text-align: center;
  opacity: 0.95;
}

.deities-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FFFDE7;
  border: 2px solid #FFE082;
  border-radius: 16px;
  padding: 8px 4px 6px;
  position: relative;
}

.gallery-img-box {
  position: relative;
  width: 100%;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-img {
  max-width: 90%;
  max-height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12));
}

.gallery-emoji-badge {
  position: absolute;
  bottom: -4px;
  right: 2px;
  font-size: 1.4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.gallery-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #E65100;
  margin-top: 4px;
}

.actions-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 10px;
  border-radius: 24px;
  border: none;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  outline: none;
  transition: transform 0.15s;
}

.action-btn:active {
  transform: scale(0.94);
}

.play-again-btn {
  background: #FF9800;
  color: #FFFFFF;
}

.home-btn {
  background: #0288D1;
  color: #FFFFFF;
}

.btn-icon {
  width: 22px;
  height: 22px;
  stroke-width: 3px;
}
</style>
