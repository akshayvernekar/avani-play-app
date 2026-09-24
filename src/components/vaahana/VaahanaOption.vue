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
  border: 4px solid var(--card-border, #4FC3F7);
  border-radius: 28px;
  padding: 12px 6px 14px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  transition:
    transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.18s ease,
    border-color 0.2s ease;
  min-height: 125px;
  width: 100%;
}

.vaahana-option-card:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
}

.vaahana-option-card:active:not(:disabled) {
  transform: scale(0.94);
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
  height: 74px;
}

.option-emoji {
  font-size: 4rem;
  line-height: 1;
  display: block;
  text-align: center;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.vaahana-option-card:hover:not(:disabled) .option-emoji {
  transform: scale(1.12) rotate(-4deg);
}

/* ── Real Artwork (future) ── */
.option-image-box {
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-image {
  max-width: 100%;
  max-height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

/* ── Name Label ── */
.option-name {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--card-text, #01579B);
  margin-top: 6px;
  text-align: center;
  letter-spacing: 0.01em;
}
</style>
