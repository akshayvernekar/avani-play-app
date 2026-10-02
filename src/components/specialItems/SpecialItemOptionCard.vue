<template>
  <button
    ref="cardRef"
    class="special-item-card"
    :class="{
      'is-disabled': disabled,
      'is-correct': isCorrect,
      'is-hinting': isHinting && !isCorrect,
      'shake-anim': isShaking
    }"
    :style="cardColorStyle"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <!-- Item Illustration / SVG / Fallback Emoji -->
    <div class="card-visual-wrap">
      <div v-if="imgFailed || (!currentImage && item.emoji)" class="fallback-emoji-box">
        <span class="fallback-emoji">{{ item.emoji || '✨' }}</span>
      </div>
      <img
        v-else
        :src="currentImage"
        :alt="item.name"
        class="item-img"
        draggable="false"
        @error="handleImageError"
      />
    </div>

    <!-- Child-friendly Item Name Label -->
    <span class="item-name">{{ item.name }}</span>

    <!-- Correct Star Badge -->
    <transition name="pop-star">
      <div v-if="isCorrect" class="star-badge" aria-label="Correct Choice">
        ⭐
      </div>
    </transition>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DeitySpecialItem } from '../../data/deities';

const props = defineProps<{
  item: DeitySpecialItem;
  disabled?: boolean;
  isCorrect?: boolean;
  isHinting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', item: DeitySpecialItem): void;
}>();

const cardRef = ref<HTMLElement | null>(null);
const isShaking = ref(false);
const imgFailed = ref(false);
const hasTriedFallback = ref(false);

const currentImage = ref(props.item.image || props.item.fallbackImage);

watch(() => props.item, (newItem) => {
  imgFailed.value = false;
  hasTriedFallback.value = false;
  currentImage.value = newItem.image || newItem.fallbackImage;
});

function handleImageError() {
  if (!hasTriedFallback.value && props.item.fallbackImage && currentImage.value !== props.item.fallbackImage) {
    hasTriedFallback.value = true;
    currentImage.value = props.item.fallbackImage;
  } else if (!hasTriedFallback.value && currentImage.value?.match(/\.(webp|png)$/)) {
    hasTriedFallback.value = true;
    currentImage.value = currentImage.value.replace(/\.(webp|png)$/, '.svg');
  } else {
    imgFailed.value = true;
  }
}

// Category-based cheerful pastel backgrounds
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  food:              { bg: '#FFF8E1', border: '#FFB300', text: '#E65100' },
  weapon:            { bg: '#E1F5FE', border: '#4FC3F7', text: '#0277BD' },
  instrument:        { bg: '#F3E5F5', border: '#BA68C8', text: '#6A1B9A' },
  sacred_object:     { bg: '#FFF3E0', border: '#FFB74D', text: '#BF360C' },
  agricultural_tool: { bg: '#E8F5E9', border: '#81C784', text: '#1B5E20' },
  object:            { bg: '#FCE4EC', border: '#F06292', text: '#AD1457' },
};

const cardColorStyle = computed(() => {
  const c = categoryColors[props.item.category] || { bg: '#FFFFFF', border: '#FFD54F', text: '#3E2723' };
  return {
    '--card-bg': c.bg,
    '--card-border': c.border,
    '--card-text': c.text,
  };
});

function triggerIncorrectAnimation() {
  isShaking.value = true;
  setTimeout(() => {
    isShaking.value = false;
  }, 600);
}

function handleClick() {
  if (props.disabled) return;
  emit('select', props.item);
}

defineExpose({
  triggerIncorrectAnimation
});
</script>

<style scoped>
.special-item-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg, #FFFFFF);
  border: clamp(3px, 0.7vh, 5px) solid var(--card-border, #E0E0E0);
  border-radius: clamp(16px, 3vh, 26px);
  padding: clamp(6px, 1.2vh, 12px) clamp(6px, 1vw, 12px);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 clamp(4px, 1vh, 8px) clamp(10px, 2vh, 18px) rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  outline: none;
}

.special-item-card:hover:not(.is-disabled) {
  border-color: #FFB300;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 22px rgba(255, 179, 0, 0.22);
}

.special-item-card:active:not(.is-disabled) {
  transform: scale(0.96);
}

.card-visual-wrap {
  width: 100%;
  height: 68%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 0;
}

.item-img {
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
  pointer-events: none;
}

.fallback-emoji-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-emoji {
  font-size: clamp(2.5rem, 8vh, 4.5rem);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.item-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.2vh, 1.35rem);
  font-weight: 700;
  color: var(--card-text, #3E2723);
  text-align: center;
  margin-top: clamp(2px, 0.8vh, 6px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  line-height: 1.15;
}

/* Success state */
.special-item-card.is-correct {
  border-color: #4CAF50 !important;
  background-color: #F1F8E9 !important;
  transform: scale(1.04);
  box-shadow: 0 10px 24px rgba(76, 175, 80, 0.35);
  animation: bounceCelebration 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.star-badge {
  position: absolute;
  top: clamp(-8px, -1.5vh, -12px);
  right: clamp(-8px, -1.5vh, -12px);
  font-size: clamp(1.4rem, 3.5vh, 2rem);
  animation: starSpin 0.5s ease-out;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
}

/* Hinting pulse */
.special-item-card.is-hinting {
  border-color: #FFB300 !important;
  animation: gentlePulse 1.2s infinite alternate;
}

/* Disabled state */
.special-item-card.is-disabled:not(.is-correct) {
  opacity: 0.65;
  cursor: default;
}

/* Shake on error */
.shake-anim {
  animation: cardShake 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #FF5252 !important;
  background-color: #FFEBEE !important;
}

@keyframes cardShake {
  10%, 90% { transform: translate3d(-3px, 0, 0); }
  20%, 80% { transform: translate3d(5px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

@keyframes bounceCelebration {
  0% { transform: scale(1); }
  40% { transform: scale(1.08); }
  70% { transform: scale(0.98); }
  100% { transform: scale(1.04); }
}

@keyframes gentlePulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4);
    transform: scale(1);
  }
  100% {
    box-shadow: 0 0 0 clamp(8px, 1.5vh, 14px) rgba(255, 179, 0, 0);
    transform: scale(1.02);
  }
}

@keyframes starSpin {
  0% { transform: scale(0) rotate(-180deg); }
  100% { transform: scale(1) rotate(0deg); }
}
</style>
