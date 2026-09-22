<template>
  <div class="deity-card-container">
    <!-- Header Prompt -->
    <div class="deity-header">
      <h2 class="deity-name">{{ deity.titleName }}</h2>
      <p class="deity-question">Who is my Vaahana?</p>
    </div>

    <!-- Main Card Body -->
    <div 
      ref="dropZoneRef" 
      class="deity-stage" 
      :class="{ 
        'is-drag-over': isDragOver, 
        'is-success': isSuccess,
        'is-hinting': isHinting 
      }"
    >
      <!-- Deity Image (Initial or Success) -->
      <div class="image-wrapper">
        <transition name="pop-swap" mode="out-in">
          <img 
            :key="isSuccess ? 'success' : 'deity'"
            :src="isSuccess ? deity.successImage : deity.deityImage" 
            :alt="deity.deityName" 
            class="deity-illustration" 
          />
        </transition>

        <!-- Drop Target Overlay Ring (When matching) -->
        <div v-if="!isSuccess" class="drop-zone-ring" :class="{ 'pulse-active': isDragOver || isHinting }">
          <div class="drop-ring-inner">
            <span class="drop-icon">✨</span>
            <span class="drop-text">{{ isDragOver ? 'Release Here!' : 'Drop Vaahana Here' }}</span>
          </div>
        </div>
      </div>

      <!-- Success Overlay Content -->
      <div v-if="isSuccess" class="success-banner">
        <div class="celebration-badge">
          <span class="star-pop">⭐</span>
          <span class="good-job-text">Good Job!</span>
          <span class="star-pop">⭐</span>
        </div>

        <p class="voice-fact">{{ deity.voiceText }}</p>

        <button class="next-round-btn" @click="handleNext">
          <span>Next</span>
          <ArrowRight class="next-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DeityItem } from '../../data/vaahana';
import { ArrowRight } from 'lucide-vue-next';

defineProps<{
  deity: DeityItem;
  isSuccess: boolean;
  isDragOver: boolean;
  isHinting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
}>();

const dropZoneRef = ref<HTMLElement | null>(null);

function handleNext() {
  emit('next');
}

defineExpose({
  dropZoneRef
});
</script>

<style scoped>
.deity-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.deity-header {
  text-align: center;
  margin-bottom: 8px;
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
  margin: 2px 0 0 0;
}

/* Stage Box */
.deity-stage {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: radial-gradient(circle, #FFFDE7 0%, #FFF3E0 100%);
  border: 5px solid #FFB300;
  border-radius: 36px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(255, 143, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.deity-stage.is-drag-over {
  border-color: #4CAF50;
  background: radial-gradient(circle, #F1F8E9 0%, #DCEDC8 100%);
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
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

.image-wrapper {
  position: relative;
  width: 100%;
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deity-illustration {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
  mix-blend-mode: multiply;
}

/* Drop Zone Ring */
.drop-zone-ring {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.92);
  border: 3px dashed #FF9800;
  border-radius: 30px;
  padding: 6px 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
  pointer-events: none;
}

.drop-zone-ring.pulse-active {
  border-color: #4CAF50;
  background: #E8F5E9;
  animation: ringBounce 0.8s infinite ease-in-out alternate;
}

@keyframes ringBounce {
  from { transform: translateX(-50%) scale(1); }
  to { transform: translateX(-50%) scale(1.1); }
}

.drop-ring-inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.drop-icon {
  font-size: 1.1rem;
}

.drop-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #E65100;
}

/* Success Banner */
.success-banner {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
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
  margin: 8px 0;
  text-align: center;
}

.next-round-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(180deg, #66BB6A 0%, #388E3C 100%);
  color: #FFFFFF;
  border: 3px solid #FFFFFF;
  border-radius: 24px;
  padding: 10px 24px;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(56, 142, 60, 0.3);
  transition: transform 0.15s;
  outline: none;
}

.next-round-btn:active {
  transform: scale(0.94);
}

.next-icon {
  width: 24px;
  height: 24px;
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
</style>
