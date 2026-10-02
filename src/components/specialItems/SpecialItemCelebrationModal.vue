<template>
  <div v-if="show" class="celebration-overlay" @click="handleBackdropClick">
    <div class="celebration-card" @click.stop>
      <div class="stars-header">
        <span class="star left">⭐</span>
        <span class="star center">🌟</span>
        <span class="star right">⭐</span>
      </div>

      <h1 class="victory-title">Amazing!</h1>
      <h2 class="victory-subtitle">You found all the special items!</h2>

      <!-- Grid of all 15 completed deities with their special items -->
      <div class="deities-gallery-grid">
        <div v-for="item in deityList" :key="item.id" class="gallery-item">
          <div class="gallery-img-box">
            <img :src="item.image" :alt="item.name" class="gallery-img" @error="handleImgError($event, item.id)" />
            <span class="gallery-item-badge">{{ getItemEmoji(item) }}</span>
          </div>
          <span class="gallery-name">{{ item.name }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions-row">
        <button class="action-btn play-again-btn" type="button" @click="handlePlayAgain">
          <RotateCcw class="btn-icon" />
          <span>Play Again</span>
        </button>

        <button class="action-btn home-btn" type="button" @click="handleGoHome">
          <Home class="btn-icon" />
          <span>Avani's World</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { CentralDeity } from '../../data/deities';
import { RotateCcw, Home } from 'lucide-vue-next';
import { audioManager } from '../../audio/AudioManager';
import confetti from 'canvas-confetti';

const props = defineProps<{
  show: boolean;
  deityList: CentralDeity[];
}>();

const emit = defineEmits<{
  (e: 'play-again'): void;
  (e: 'go-home'): void;
  (e: 'close'): void;
}>();

function getItemEmoji(deity: CentralDeity): string {
  if (deity.specialItems && deity.specialItems.length > 0) {
    return deity.specialItems[0].emoji || '✨';
  }
  return '✨';
}

function handleImgError(event: Event, id: string) {
  const target = event.target as HTMLImageElement;
  if (target && target.src.endsWith('.png')) {
    target.src = target.src.replace('.png', '.svg');
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    audioManager.playCelebration();
    audioManager.playAudioWithFallback(
      'assets/audio_gungun/item_game_complete.mp3',
      'Amazing! You found all the special items!'
    );
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
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
  emit('close');
}
</script>

<style scoped>
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.25s ease-out;
}

.celebration-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFFDE7 100%);
  border: clamp(4px, 1vh, 6px) solid #FFD54F;
  border-radius: clamp(20px, 3vh, 32px);
  padding: clamp(12px, 2vh, 24px);
  width: 92%;
  max-width: 680px;
  max-height: 90vh;
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
  animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.stars-header {
  display: flex;
  gap: 12px;
  font-size: clamp(1.6rem, 4vh, 2.5rem);
  margin-bottom: 2px;
}

.star.center {
  transform: scale(1.2);
  animation: starPulse 1s infinite alternate;
}

.victory-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.8rem, 4.5vh, 2.8rem);
  font-weight: 700;
  color: #E65100;
  margin: 0;
  text-shadow: 0 2px 4px rgba(230, 81, 0, 0.2);
}

.victory-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1rem, 2.2vh, 1.4rem);
  font-weight: 600;
  color: #5D4037;
  margin: 2px 0 clamp(8px, 1.5vh, 14px) 0;
}

/* Gallery grid of all deities */
.deities-gallery-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(6px, 1.2vw, 10px);
  width: 100%;
  overflow-y: auto;
  max-height: 48vh;
  max-height: 48dvh;
  padding: 4px;
  margin-bottom: clamp(10px, 2vh, 18px);
  box-sizing: border-box;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FFFFFF;
  border: 2.5px solid #FFE082;
  border-radius: clamp(10px, 2vh, 16px);
  padding: clamp(4px, 1vh, 8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.gallery-img-box {
  position: relative;
  width: clamp(42px, 8vh, 64px);
  height: clamp(42px, 8vh, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gallery-item-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  font-size: clamp(0.9rem, 2vh, 1.2rem);
  background: #FFF;
  border-radius: 50%;
  padding: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.gallery-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.7rem, 1.6vh, 0.85rem);
  font-weight: 700;
  color: #3E2723;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.actions-row {
  display: flex;
  gap: clamp(10px, 2vw, 18px);
  width: 100%;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: clamp(10px, 1.8vh, 14px) clamp(16px, 3vw, 24px);
  border-radius: 999px;
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.2vh, 1.2rem);
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: scale(0.94);
}

.play-again-btn {
  background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
  color: #FFFFFF;
  border: 3px solid #FFFFFF;
}

.home-btn {
  background: linear-gradient(135deg, #FF9800 0%, #E65100 100%);
  color: #FFFFFF;
  border: 3px solid #FFCC80;
}

.btn-icon {
  width: clamp(18px, 2.5vh, 22px);
  height: clamp(18px, 2.5vh, 22px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes starPulse {
  from { transform: scale(1.1); }
  to { transform: scale(1.35); }
}
</style>
