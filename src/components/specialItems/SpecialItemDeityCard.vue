<template>
  <div 
    class="special-deity-card-panel" 
    :class="{ 
      'is-success': isSuccess,
      'is-hinting': isHinting 
    }"
  >
    <!-- Question Header & Audio Speaker Button -->
    <div class="card-header-bar">
      <button 
        class="speaker-btn"
        :class="{ 'is-playing': isPlayingAudio }"
        aria-label="Replay Question Audio"
        type="button"
        @click="handlePlayAudio"
      >
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <Volume2 class="speaker-icon" :class="{ 'bounce': isPlayingAudio }" />
      </button>

      <div class="question-text-group">
        <span class="question-sub">Can you help?</span>
        <h2 class="question-main">What belongs to {{ deity.name }}?</h2>
      </div>
    </div>

    <!-- Main Deity Illustration Area -->
    <div class="image-stage-area">
      <div class="image-wrapper">
        <transition name="pop-swap" mode="out-in">
          <img 
            :key="deity.id"
            :src="currentImage" 
            :alt="deity.name" 
            class="deity-illustration" 
            draggable="false"
            @error="handleImageError"
          />
        </transition>

        <!-- Matched Special Item Badge on Success -->
        <transition name="pop-badge">
          <div v-if="isSuccess && matchedItem" class="matched-item-badge">
            <span v-if="matchedItem.emoji" class="badge-emoji">{{ matchedItem.emoji }}</span>
            <span class="badge-name">{{ matchedItem.name }}</span>
          </div>
        </transition>
      </div>

      <!-- Success Action Overlay inside the card -->
      <transition name="fade-slide">
        <div v-if="isSuccess" class="success-banner-overlay">
          <div class="celebration-badge">
            <span class="star-pop">⭐</span>
            <span class="good-job-text">Good Job!</span>
            <span class="star-pop">⭐</span>
          </div>

          <p class="success-fact">Yes! The {{ matchedItem?.name }} belongs to {{ deity.name }}!</p>

          <button class="next-round-btn" type="button" @click="handleNext">
            <Sparkles class="action-icon" />
            <span>Try Another</span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CentralDeity, DeitySpecialItem } from '../../data/deities';
import { Sparkles, Volume2 } from 'lucide-vue-next';

const props = defineProps<{
  deity: CentralDeity;
  matchedItem?: DeitySpecialItem;
  isSuccess: boolean;
  isPlayingAudio?: boolean;
  isHinting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'play-audio'): void;
}>();

const currentImage = ref(props.deity.image);
const hasTriedSvg = ref(false);

watch(() => props.deity, (newDeity) => {
  hasTriedSvg.value = false;
  currentImage.value = newDeity.image;
});

function handleImageError() {
  if (!hasTriedSvg.value && currentImage.value.endsWith('.png')) {
    hasTriedSvg.value = true;
    currentImage.value = currentImage.value.replace('.png', '.svg');
  }
}

function handlePlayAudio() {
  emit('play-audio');
}

function handleNext() {
  emit('next');
}
</script>

<style scoped>
.special-deity-card-panel {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #FFFFFF 0%, #FFFDE7 100%);
  border: clamp(3px, 0.8vh, 5px) solid #FFE082;
  border-radius: clamp(18px, 3vh, 28px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 clamp(6px, 1.5vh, 12px) clamp(14px, 2.5vh, 24px) rgba(255, 179, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  padding: clamp(8px, 1.5vh, 16px);
  position: relative;
  overflow: hidden;
}

.special-deity-card-panel.is-success {
  border-color: #81C784;
  background: linear-gradient(145deg, #FFFFFF 0%, #F1F8E9 100%);
}

.special-deity-card-panel.is-hinting {
  border-color: #FFB300;
  animation: cardGlow 1.2s ease-in-out infinite alternate;
}

@keyframes cardGlow {
  0% { box-shadow: 0 4px 12px rgba(255, 179, 0, 0.2); }
  100% { box-shadow: 0 6px 20px rgba(255, 179, 0, 0.45); }
}

/* Header bar with speaker and question */
.card-header-bar {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 14px);
  width: 100%;
  flex-shrink: 0;
  margin-bottom: clamp(4px, 1vh, 8px);
}

.speaker-btn {
  position: relative;
  width: clamp(44px, 7.5vh, 58px);
  height: clamp(44px, 7.5vh, 58px);
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB300 0%, #FF8F00 100%);
  border: 3px solid #FFE082;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 143, 0, 0.35);
  flex-shrink: 0;
  outline: none;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.speaker-btn:hover {
  transform: scale(1.06);
}

.speaker-btn:active {
  transform: scale(0.92);
}

.speaker-icon {
  width: clamp(22px, 3.8vh, 28px);
  height: clamp(22px, 3.8vh, 28px);
  stroke-width: 2.5;
}

.speaker-icon.bounce {
  animation: iconBounce 0.45s infinite alternate ease-in-out;
}

@keyframes iconBounce {
  from { transform: scale(1); }
  to { transform: scale(1.22); }
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #FFB300;
  opacity: 0;
  pointer-events: none;
}

.speaker-btn.is-playing .ring-1 {
  animation: pulseOut 1.2s infinite;
}

.speaker-btn.is-playing .ring-2 {
  animation: pulseOut 1.2s infinite 0.4s;
}

@keyframes pulseOut {
  0% { transform: scale(0.95); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

.question-text-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.question-sub {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.75rem, 1.6vh, 0.95rem);
  font-weight: 600;
  color: #FB8C00;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.question-main {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.1rem, 2.8vh, 1.75rem);
  font-weight: 700;
  color: #D84315;
  margin: 0;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Image Stage Area */
.image-stage-area {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.deity-illustration {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
}

.special-deity-card-panel.is-success .deity-illustration {
  transform: scale(0.94);
}

.matched-item-badge {
  position: absolute;
  bottom: clamp(6px, 1.5vh, 14px);
  right: clamp(6px, 1.5vw, 14px);
  background: #FFFFFF;
  border: 3px solid #4CAF50;
  border-radius: 999px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  animation: badgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.badge-emoji {
  font-size: clamp(1.2rem, 2.5vh, 1.6rem);
}

.badge-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1.1rem);
  font-weight: 700;
  color: #2E7D32;
}

/* Success Banner Overlay */
.success-banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(4px);
  border-radius: clamp(12px, 2vh, 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(8px, 2vh, 18px);
  text-align: center;
  z-index: 10;
}

.celebration-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: clamp(4px, 1vh, 8px);
}

.star-pop {
  font-size: clamp(1.2rem, 3vh, 1.8rem);
  animation: starWiggle 0.6s infinite alternate;
}

.good-job-text {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.3rem, 3.5vh, 2rem);
  font-weight: 700;
  color: #2E7D32;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.success-fact {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.2vh, 1.3rem);
  font-weight: 600;
  color: #E65100;
  margin: 0 0 clamp(8px, 2vh, 16px) 0;
  line-height: 1.25;
  max-width: 90%;
}

.next-round-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
  color: #FFFFFF;
  border: 3px solid #FFFFFF;
  border-radius: 999px;
  padding: clamp(8px, 1.5vh, 14px) clamp(18px, 3vw, 28px);
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1rem, 2.4vh, 1.35rem);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(233, 30, 99, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  outline: none;
}

.next-round-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.45);
}

.next-round-btn:active {
  transform: scale(0.95);
}

.action-icon {
  width: clamp(18px, 2.5vh, 24px);
  height: clamp(18px, 2.5vh, 24px);
}

/* Animations */
@keyframes starWiggle {
  from { transform: rotate(-12deg) scale(0.95); }
  to { transform: rotate(12deg) scale(1.15); }
}

@keyframes badgePop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
