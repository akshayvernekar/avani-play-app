<template>
  <div
    ref="cardRef"
    class="vaahana-option-card"
    :class="{ 'is-dragging': isDragging, 'is-incorrect': isIncorrect, 'is-disabled': disabled }"
    :style="[cardDragStyle, cardColorStyle]"
    @pointerdown="onPointerDown"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VaahanaOptionItem } from '../../data/vaahana';
import { audioManager } from '../../audio/AudioManager';

const props = defineProps<{
  option: VaahanaOptionItem;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'drag-start', option: VaahanaOptionItem, event: PointerEvent): void;
  (e: 'drag-move', pointerX: number, pointerY: number): void;
  (e: 'drag-end', option: VaahanaOptionItem, pointerX: number, pointerY: number): void;
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
const isDragging = ref(false);
const isIncorrect = ref(false);
const dragX = ref(0);
const dragY = ref(0);
let startX = 0;
let startY = 0;
let movedFar = false;

const cardDragStyle = computed(() => {
  if (!isDragging.value) return {};
  return {
    transform: `translate3d(${dragX.value}px, ${dragY.value}px, 0) scale(1.2) rotate(4deg)`,
    zIndex: 9999,
    boxShadow: '0 24px 42px rgba(0,0,0,0.3)',
  };
});

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
  isDragging.value = true;
  movedFar = false;
  startX = e.clientX;
  startY = e.clientY;
  dragX.value = 0;
  dragY.value = 0;
  audioManager.playPickup();
  emit('drag-start', props.option, e);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movedFar = true;
  dragX.value = dx;
  dragY.value = dy;
  emit('drag-move', e.clientX, e.clientY);
}

function onPointerUp(e: PointerEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  emit('drag-end', props.option, e.clientX, e.clientY);
  dragX.value = 0;
  dragY.value = 0;
}

function handleClick() {
  if (props.disabled || movedFar) return;
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
  padding: 10px 6px 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.09);
  cursor: grab;
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.18s ease;
  min-height: 115px;
  width: 100%;
}

.vaahana-option-card:hover:not(.is-disabled) {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
}

.vaahana-option-card.is-dragging {
  cursor: grabbing;
  transition: none !important;
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

.vaahana-option-card.is-disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(0.3);
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

.vaahana-option-card:hover:not(.is-disabled) .option-emoji {
  transform: scale(1.13) rotate(-5deg);
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
  margin-top: 4px;
  text-align: center;
  letter-spacing: 0.01em;
}
</style>
