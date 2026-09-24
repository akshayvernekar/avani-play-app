<template>
  <div class="deity-card-container">
    <!-- Header Prompt with Audio Speaker -->
    <div class="deity-header">
      <h2 class="deity-name">{{ deity.titleName }}</h2>
      <div class="question-row">
        <button 
          class="inline-speaker-btn"
          :class="{ 'is-playing': isPlayingAudio }"
          aria-label="Replay Question Audio"
          type="button"
          @click="handlePlayAudio"
        >
          <Volume2 class="speaker-icon" :class="{ 'bounce': isPlayingAudio }" />
        </button>
        <p class="deity-question">Who is my Vaahana?</p>
      </div>
    </div>

    <!-- Main Stage Card -->
    <div 
      class="deity-stage" 
      :class="{ 
        'is-success': isSuccess,
        'is-hinting': isHinting 
      }"
    >
      <!-- Deity Image -->
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

      <!-- Success Content Banner -->
      <div v-if="isSuccess" class="success-banner">
        <div class="celebration-badge">
          <span class="star-pop">⭐</span>
          <span class="good-job-text">Good Job!</span>
          <span class="star-pop">⭐</span>
        </div>

        <p class="voice-fact">{{ deity.voiceText }}</p>

        <div class="success-actions">
          <button class="next-round-btn" @click="handleNext">
            <Sparkles class="action-icon" />
            <span>Try Another</span>
          </button>
        </div>
      </div>
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
.deity-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6px 0;
}

.deity-header {
  text-align: center;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.inline-speaker-btn {
  position: relative;
  width: 44px;
  height: 44px;
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
}

.inline-speaker-btn:hover {
  transform: scale(1.08);
}

.inline-speaker-btn:active {
  transform: scale(0.92);
}

.speaker-icon {
  width: 22px;
  height: 22px;
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

.deity-name {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #E65100;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.9);
}

.deity-question {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #F57C00;
  margin: 0;
}

/* Stage Box */
.deity-stage {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: radial-gradient(circle, #FFFDE7 0%, #FFF3E0 100%);
  border: 5px solid #FFB300;
  border-radius: 36px;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(255, 143, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.deity-stage.is-success {
  border-color: #66BB6A;
  background: radial-gradient(circle, #E8F5E9 0%, #C8E6C9 100%);
}

.deity-stage.is-hinting {
  animation: hintPulse 1.2s infinite ease-in-out alternate;
}

@keyframes hintPulse {
  from { border-color: #FFB300; box-shadow: 0 0 10px rgba(255, 179, 0, 0.3); }
  to { border-color: #FF5722; box-shadow: 0 0 24px rgba(255, 87, 34, 0.6); transform: scale(1.02); }
}

/* Image Wrapper - Enlarged for Deity PNGs */
.image-wrapper {
  position: relative;
  width: 100%;
  height: 275px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deity-illustration {
  max-width: 95%;
  max-height: 265px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.16));
  transition: transform 0.25s ease;
}

/* Matched Emoji Badge */
.matched-vaahana-badge {
  position: absolute;
  bottom: 0px;
  right: 15px;
  background: #FFFFFF;
  border: 4px solid #4CAF50;
  border-radius: 50%;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.35);
  animation: bounceBadge 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceBadge {
  0% { transform: scale(0) rotate(-45deg); }
  70% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.badge-emoji {
  font-size: 3rem;
  line-height: 1;
}


/* Success Banner */
.success-banner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.celebration-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #4CAF50;
  color: #FFFFFF;
  padding: 6px 18px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.good-job-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
}

.star-pop {
  font-size: 1.3rem;
  animation: spinStar 2s infinite linear;
}

@keyframes spinStar {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.voice-fact {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1B5E20;
  margin: 6px 0;
  text-align: center;
}

.success-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.choose-deity-btn,
.next-round-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  border: 3px solid #FFFFFF;
  border-radius: 24px;
  padding: 8px 18px;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s;
  outline: none;
}

.choose-deity-btn {
  background: linear-gradient(180deg, #FF9800 0%, #F57C00 100%);
}

.next-round-btn {
  background: linear-gradient(180deg, #66BB6A 0%, #388E3C 100%);
}

.choose-deity-btn:active,
.next-round-btn:active {
  transform: scale(0.94);
}

.action-icon {
  width: 20px;
  height: 20px;
  stroke-width: 3px;
}

/* Image Swap Transition */
.pop-swap-enter-active,
.pop-swap-leave-active {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-swap-enter-from,
.pop-swap-leave-to {
  transform: scale(0.7);
  opacity: 0;
}

.pop-badge-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-badge-enter-from {
  transform: scale(0);
  opacity: 0;
}
</style>
