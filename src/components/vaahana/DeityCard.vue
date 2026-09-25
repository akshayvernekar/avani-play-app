<template>
  <div 
    class="deity-card-panel" 
    :class="{ 
      'is-success': isSuccess,
      'is-hinting': isHinting 
    }"
  >
    <!-- Unified Question / Audio Section at top of the panel -->
    <div class="question-header-bar">
      <button 
        class="speaker-btn"
        :class="{ 'is-playing': isPlayingAudio }"
        aria-label="Replay Question Audio"
        type="button"
        @click="handlePlayAudio"
      >
        <Volume2 class="speaker-icon" :class="{ 'bounce': isPlayingAudio }" />
      </button>

      <div class="question-text-group">
        <h2 class="deity-name">{{ deity.titleName }}</h2>
        <p class="question-prompt">Who is my Vaahana?</p>
      </div>
    </div>

    <!-- Main Deity Illustration Area -->
    <div class="image-stage-area">
      <div class="image-wrapper">
        <transition name="pop-swap" mode="out-in">
          <img 
            :key="isSuccess ? 'success' : 'deity'"
            :src="isSuccess ? deity.successImage : deity.deityImage" 
            :alt="deity.deityName" 
            class="deity-illustration" 
          />
        </transition>

        <!-- Matched Emoji Badge on Success -->
        <transition name="pop-badge">
          <div v-if="isSuccess && matchedEmoji" class="matched-vaahana-badge">
            <span class="badge-emoji">{{ matchedEmoji }}</span>
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

          <p class="voice-fact">{{ deity.voiceText }}</p>

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
import { computed } from 'vue';
import { DeityItem, vaahanas } from '../../data/vaahana';
import { Sparkles, Volume2 } from 'lucide-vue-next';

const props = defineProps<{
  deity: DeityItem;
  isSuccess: boolean;
  isPlayingAudio?: boolean;
  isHinting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'play-audio'): void;
}>();

const matchedEmoji = computed(() => {
  const v = vaahanas.find(item => item.id === props.deity.correctVaahana);
  return v ? v.emoji : '';
});

function handleNext() {
  emit('next');
}

function handlePlayAudio() {
  emit('play-audio');
}
</script>

<style scoped>
.deity-card-panel {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 35%, #FFFDE7 0%, #FFF3E0 100%);
  border: clamp(3px, 0.7vh, 5px) solid #FFB300;
  border-radius: clamp(18px, 3vh, 28px);
  padding: clamp(8px, 1.6vh, 14px) clamp(10px, 1.8vw, 16px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(255, 143, 0, 0.22);
  overflow: hidden;
  transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
}

.deity-card-panel.is-success {
  border-color: #66BB6A;
  background: radial-gradient(circle at 50% 35%, #E8F5E9 0%, #C8E6C9 100%);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.25);
}

.deity-card-panel.is-hinting {
  animation: hintPulse 1.2s infinite ease-in-out alternate;
}

@keyframes hintPulse {
  from { border-color: #FFB300; box-shadow: 0 0 10px rgba(255, 179, 0, 0.3); }
  to { border-color: #FF5722; box-shadow: 0 0 24px rgba(255, 87, 34, 0.6); }
}

/* Question Header Bar */
.question-header-bar {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 14px);
  background: rgba(255, 255, 255, 0.9);
  border: clamp(2px, 0.5vh, 3px) solid #FFE082;
  border-radius: clamp(14px, 2.5vh, 22px);
  padding: clamp(4px, 1vh, 8px) clamp(8px, 1.5vw, 14px);
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
}

.speaker-btn {
  width: clamp(38px, 7vh, 52px);
  height: clamp(38px, 7vh, 52px);
  min-width: clamp(38px, 7vh, 52px);
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border: 3px solid #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.35);
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex-shrink: 0;
}

.speaker-btn:hover {
  transform: scale(1.08);
}

.speaker-btn:active {
  transform: scale(0.92);
}

.speaker-icon {
  width: clamp(18px, 3.5vh, 26px);
  height: clamp(18px, 3.5vh, 26px);
  stroke-width: 2.6px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.speaker-icon.bounce {
  animation: speakerPulse 0.6s infinite ease-in-out alternate;
}

@keyframes speakerPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.22); }
}

.question-text-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.deity-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.1rem, 3.2vh, 1.7rem);
  font-weight: 700;
  color: #E65100;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-prompt {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2.2vh, 1.15rem);
  font-weight: 600;
  color: #F57C00;
  margin: 0;
  line-height: 1.15;
  white-space: nowrap;
}

/* Image Stage Area */
.image-stage-area {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(4px, 1vh, 8px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deity-illustration {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.16));
  transition: transform 0.25s ease;
  user-select: none;
}

/* Matched Emoji Badge */
.matched-vaahana-badge {
  position: absolute;
  bottom: clamp(4px, 1vh, 10px);
  right: clamp(4px, 1.5vw, 16px);
  background: #FFFFFF;
  border: clamp(3px, 0.6vh, 4px) solid #4CAF50;
  border-radius: 50%;
  width: clamp(46px, 9vh, 64px);
  height: clamp(46px, 9vh, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.35);
  animation: bounceBadge 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 2;
}

@keyframes bounceBadge {
  0% { transform: scale(0) rotate(-45deg); }
  70% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.badge-emoji {
  font-size: clamp(1.8rem, 4.5vh, 2.8rem);
  line-height: 1;
}

/* Success Banner Overlay */
.success-banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
  border-radius: clamp(12px, 2vh, 18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(8px, 1.5vh, 16px);
  text-align: center;
  box-sizing: border-box;
  z-index: 5;
}

.celebration-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #4CAF50;
  color: #FFFFFF;
  padding: clamp(3px, 0.8vh, 6px) clamp(10px, 1.5vw, 16px);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.25);
}

.good-job-text {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.1rem, 2.8vh, 1.4rem);
  font-weight: 700;
}

.star-pop {
  font-size: clamp(1rem, 2.5vh, 1.25rem);
  animation: spinStar 2s infinite linear;
}

@keyframes spinStar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.voice-fact {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.9rem, 2.2vh, 1.15rem);
  font-weight: 600;
  color: #1B5E20;
  margin: clamp(6px, 1.2vh, 10px) 0;
  text-align: center;
  line-height: 1.25;
  max-width: 90%;
}

.next-round-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(180deg, #66BB6A 0%, #388E3C 100%);
  color: #FFFFFF;
  border: 3px solid #FFFFFF;
  border-radius: 24px;
  padding: clamp(6px, 1.2vh, 10px) clamp(14px, 2.2vw, 20px);
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.4vh, 1.15rem);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 5px 14px rgba(56, 142, 60, 0.35);
  transition: transform 0.15s;
  outline: none;
}

.next-round-btn:active {
  transform: scale(0.94);
}

.action-icon {
  width: clamp(16px, 2.6vh, 20px);
  height: clamp(16px, 2.6vh, 20px);
  stroke-width: 3px;
}

/* Transitions */
.pop-swap-enter-active,
.pop-swap-leave-active {
  transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-swap-enter-from,
.pop-swap-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.pop-badge-enter-active {
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-badge-enter-from {
  transform: scale(0);
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
