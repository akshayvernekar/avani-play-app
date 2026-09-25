<template>
  <div 
    class="deity-option-card"
    :class="{ 
      'is-disabled': disabled, 
      'is-correct': isCorrect, 
      'is-hinting': isHinting && !isCorrect,
      'shake-anim': isShaking 
    }"
    @click="handleClick"
  >
    <div class="card-image-wrap">
      <img :src="deity.image" :alt="deity.name" class="deity-image" />
    </div>
    <span class="deity-label">{{ deity.name }}</span>

    <div v-if="isCorrect" class="star-badge">
      ⭐
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DeityInfo } from '../../data/identifyGod';

const props = defineProps<{
  deity: DeityInfo;
  disabled?: boolean;
  isCorrect?: boolean;
  isHinting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', deity: DeityInfo): void;
}>();

const isShaking = ref(false);

function triggerIncorrectAnimation() {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 600);
}

function handleClick() {
  if (props.disabled) return;
  emit('select', props.deity);
}

defineExpose({
  triggerIncorrectAnimation
});
</script>

<style scoped>
.deity-option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: clamp(3px, 0.7vh, 5px) solid #E0E0E0;
  border-radius: clamp(16px, 3vh, 26px);
  padding: clamp(6px, 1.2vh, 12px) clamp(6px, 1vw, 12px);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 clamp(4px, 1vh, 10px) clamp(10px, 2vh, 20px) rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

.deity-option-card:hover:not(.is-disabled) {
  border-color: #FFB74D;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 22px rgba(255, 152, 0, 0.2);
}

.deity-option-card:active:not(.is-disabled) {
  transform: scale(0.95);
}

.card-image-wrap {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deity-image {
  max-width: 90%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
  transition: transform 0.3s;
  pointer-events: none;
}

.deity-label {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.5vh, 1.35rem);
  font-weight: 700;
  color: #37474F;
  margin-top: clamp(2px, 0.6vh, 6px);
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
}

/* Correct Answer State */
.is-correct {
  border-color: #4CAF50 !important;
  background: #F1F8E9 !important;
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.35) !important;
  animation: gentleCelebrate 0.8s ease-in-out infinite alternate;
}

.is-correct .deity-image {
  transform: scale(1.08);
}

@keyframes gentleCelebrate {
  0% { transform: scale(1.01) rotate(-1deg); }
  100% { transform: scale(1.04) rotate(1deg); }
}

.star-badge {
  position: absolute;
  top: clamp(-10px, -1.5vh, -6px);
  right: clamp(-8px, -1.2vw, -4px);
  font-size: clamp(1.4rem, 3.5vh, 2rem);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: starPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes starPop {
  0% { transform: scale(0); }
  80% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Hinting State */
.is-hinting {
  border-color: #FFC107 !important;
  box-shadow: 0 0 18px rgba(255, 193, 7, 0.6) !important;
  animation: hintGlow 1.2s infinite ease-in-out alternate;
}

@keyframes hintGlow {
  0% { transform: scale(1); }
  100% { transform: scale(1.04); }
}

/* Shaking Incorrect Animation */
.shake-anim {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #FF5252 !important;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

.is-disabled {
  cursor: default;
}
</style>
