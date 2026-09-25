<template>
  <button
    ref="cardRef"
    class="vaahana-option-card"
    :class="{ 
      'is-incorrect': isIncorrect, 
      'is-disabled': disabled 
    }"
    :style="cardColorStyle"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <!-- Large Emoji (shown when no real image yet) -->
    <div v-if="!option.image" class="emoji-wrapper">
      <span class="option-emoji">{{ option.emoji }}</span>
    </div>

    <!-- Real artwork (auto-activates when image field added to data) -->
    <div v-else class="option-image-box">
      <img :src="option.image" :alt="option.name" class="option-image" draggable="false" />
    </div>

    <span class="option-name">{{ option.name }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VaahanaOptionItem } from '../../data/vaahana';

const props = defineProps<{
  option: VaahanaOptionItem;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', option: VaahanaOptionItem): void;
}>();

// Unique warm pastel color palette per vaahana id
const emojiColorMap: Record<string, { bg: string; border: string; text: string }> = {
  mouse:   { bg: '#F3E5F5', border: '#CE93D8', text: '#6A1B9A' },
  nandi:   { bg: '#E3F2FD', border: '#90CAF9', text: '#0D47A1' },
  lion:    { bg: '#FFF8E1', border: '#FFD54F', text: '#E65100' },
  peacock: { bg: '#E8F5E9', border: '#A5D6A7', text: '#1B5E20' },
  garuda:  { bg: '#FFF3E0', border: '#FFCC80', text: '#BF360C' },
  swan:    { bg: '#E0F7FA', border: '#80DEEA', text: '#006064' },
};

const cardColorStyle = computed(() => {
  const c = emojiColorMap[props.option.id] ?? { bg: '#FFFFFF', border: '#4FC3F7', text: '#01579B' };
  return {
    '--card-bg': c.bg,
    '--card-border': c.border,
    '--card-text': c.text,
    backgroundColor: c.bg,
    borderColor: c.border,
  };
});

const cardRef = ref<HTMLElement | null>(null);
const isIncorrect = ref(false);

function handleClick() {
  if (props.disabled) return;
  emit('select', props.option);
}

function triggerIncorrectAnimation() {
  isIncorrect.value = true;
  setTimeout(() => { isIncorrect.value = false; }, 650);
}

defineExpose({ cardRef, triggerIncorrectAnimation });
</script>

<style scoped>
.vaahana-option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: clamp(3px, 0.7vh, 5px) solid var(--card-border, #4FC3F7);
  border-radius: clamp(16px, 3vh, 26px);
  padding: clamp(6px, 1.2vh, 12px) clamp(6px, 1vw, 12px);
  box-shadow: 0 clamp(4px, 1vh, 10px) clamp(10px, 2vh, 20px) rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  transition:
    transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.18s ease,
    border-color 0.2s ease;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

.vaahana-option-card:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
}

.vaahana-option-card:active:not(:disabled) {
  transform: scale(0.95);
}

.vaahana-option-card.is-incorrect {
  animation: shakeReturn 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #FF7043 !important;
  background-color: #FBE9E7 !important;
}

@keyframes shakeReturn {
  10%, 90% { transform: translate3d(-4px, 0, 0); }
  20%, 80% { transform: translate3d(6px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

.vaahana-option-card:disabled,
.vaahana-option-card.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(0.3);
  pointer-events: none;
}

/* ── Emoji Display ── */
.emoji-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: clamp(2px, 0.5vh, 6px);
  box-sizing: border-box;
}

.option-emoji {
  font-size: clamp(2.8rem, 11vh, 5.2rem);
  line-height: 1;
  display: block;
  text-align: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.vaahana-option-card:hover:not(:disabled) .option-emoji {
  transform: scale(1.08) rotate(-3deg);
}

/* ── Artwork Display ── */
.option-image-box {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2px, 0.5vh, 6px) clamp(4px, 1vw, 10px);
  box-sizing: border-box;
}

.option-image {
  width: 100%;
  height: 100%;
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
  pointer-events: none;
  transition: transform 0.18s ease;
}

.vaahana-option-card:hover:not(:disabled) .option-image {
  transform: scale(1.06);
}

/* ── Name Label ── */
.option-name {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(0.9rem, 2.3vh, 1.25rem);
  font-weight: 700;
  color: var(--card-text, #01579B);
  margin-top: clamp(1px, 0.4vh, 4px);
  margin-bottom: clamp(1px, 0.4vh, 4px);
  text-align: center;
  letter-spacing: 0.01em;
  line-height: 1.1;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
