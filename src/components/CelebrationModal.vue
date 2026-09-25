<template>
  <div v-if="show" class="celebration-overlay" @click="handleBackdropClick">
    <div class="celebration-card" @click.stop>
      <div class="stars-header">
        <span class="star left">⭐</span>
        <span class="star center">✨</span>
        <span class="star right">⭐</span>
      </div>

      <h1 class="victory-title">Yay!</h1>
      <h2 class="victory-subtitle">You did it!</h2>

      <div v-if="puzzle" class="completed-image-box">
        <img :src="puzzle.image" :alt="puzzle.title" class="completed-image" />
        
        <button class="speak-pill" @click="speakWord">
          <span class="word-text">{{ puzzle.vocabulary }}!</span>
          <Volume2 class="speak-icon" />
        </button>
      </div>

      <div class="actions-row">
        <button class="action-btn play-again-btn" @click="handlePlayAgain">
          <RotateCcw class="btn-icon" />
          <span>Play Again</span>
        </button>

        <button class="action-btn next-puzzle-btn" @click="handleNextPuzzle">
          <span>Next Puzzle</span>
          <ArrowRight class="btn-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { PuzzleItem } from '../data/puzzles';
import { Volume2, RotateCcw, ArrowRight } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';
import confetti from 'canvas-confetti';

const props = defineProps<{
  show: boolean;
  puzzle: PuzzleItem | null;
}>();

const emit = defineEmits<{
  (e: 'play-again'): void;
  (e: 'next-puzzle'): void;
  (e: 'close'): void;
}>();

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Fire festive confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
});

function speakWord() {
  if (props.puzzle) {
    const audioPath = `assets/audio_gungun/puzzle_complete_${props.puzzle.id}.mp3`;
    const played = audioManager.playAudioFile(audioPath);
    if (!played) {
      audioManager.speak(props.puzzle.vocabulary);
      audioManager.playObjectSound(props.puzzle.soundEffectName);
    }
  }
}

function handlePlayAgain() {
  audioManager.playTap();
  emit('play-again');
}

function handleNextPuzzle() {
  audioManager.playTap();
  emit('next-puzzle');
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
  background: rgba(13, 71, 161, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  cursor: pointer;
}

.celebration-card {
  background: linear-gradient(180deg, #29B6F6 0%, #0288D1 100%);
  border: clamp(3px, 0.8vh, 6px) solid #FFFFFF;
  border-radius: clamp(20px, 4vh, 36px);
  padding: clamp(12px, 2.5vh, 26px) clamp(14px, 2vw, 22px);
  max-width: 440px;
  width: 100%;
  max-height: 94vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  animation: bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #FFFFFF;
  cursor: default;
  box-sizing: border-box;
}

@keyframes bounceIn {
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.stars-header {
  display: flex;
  gap: 12px;
  margin-bottom: 2px;
}

.star {
  font-size: clamp(1.4rem, 3.5vh, 2rem);
  animation: float 2s infinite ease-in-out alternate;
}
.star.left { animation-delay: 0s; }
.star.center { font-size: clamp(1.8rem, 4.5vh, 2.6rem); animation-delay: 0.3s; }
.star.right { animation-delay: 0.6s; }

@keyframes float {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

.victory-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.8rem, 5vh, 3.2rem);
  font-weight: 700;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  line-height: 1;
}

.victory-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.05rem, 2.5vh, 1.5rem);
  font-weight: 600;
  margin: 4px 0 clamp(8px, 1.5vh, 14px) 0;
  opacity: 0.95;
}

.completed-image-box {
  background: #FFFFFF;
  border-radius: clamp(16px, 3vh, 24px);
  padding: clamp(8px, 1.5vh, 14px);
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: clamp(10px, 2vh, 18px);
}

.completed-image {
  max-width: clamp(100px, 22vh, 180px);
  max-height: clamp(80px, 18vh, 150px);
  object-fit: contain;
  margin-bottom: clamp(6px, 1vh, 10px);
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.1));
}

.speak-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #E3F2FD;
  border: 3px solid #29B6F6;
  border-radius: 24px;
  padding: 8px 20px;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s;
}

.speak-pill:active {
  transform: scale(0.94);
}

.word-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0277BD;
}

.speak-icon {
  width: 26px;
  height: 26px;
  color: #0277BD;
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
  padding: clamp(8px, 1.6vh, 14px) 10px;
  border-radius: 24px;
  border: none;
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.2vh, 1.15rem);
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
  background: #7E57C2;
  color: #FFFFFF;
}

.next-puzzle-btn {
  background: #66BB6A;
  color: #FFFFFF;
}

.btn-icon {
  width: 22px;
  height: 22px;
  stroke-width: 3px;
}
</style>
