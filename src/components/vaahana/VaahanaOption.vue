<template>
  <div
    ref="cardRef"
    class="vaahana-option-card"
    :class="{ 
      'is-dragging': isDragging, 
      'is-incorrect': isIncorrect,
      'is-disabled': disabled 
    }"
    :style="cardStyle"
    @pointerdown="onPointerDown"
    @click="handleClick"
  >
    <div class="option-image-box">
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

const cardRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const isIncorrect = ref(false);
const dragX = ref(0);
const dragY = ref(0);

let startX = 0;
let startY = 0;
let movedFar = false;

const cardStyle = computed(() => {
  if (isDragging.value) {
    return {
      transform: `translate3d(${dragX.value}px, ${dragY.value}px, 0) scale(1.15) rotate(3deg)`,
      zIndex: 9999,
      boxShadow: '0 20px 35px rgba(0,0,0,0.25)'
    };
  }
  return {};
});

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return;
  
  // Set pointer capture if element supports it
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

  if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
    movedFar = true;
  }

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

  const endX = e.clientX;
  const endY = e.clientY;

  emit('drag-end', props.option, endX, endY);

  // Reset drag position after drop check
  dragX.value = 0;
  dragY.value = 0;
}

function handleClick() {
  if (props.disabled || movedFar) return;
  emit('select', props.option);
}

function triggerIncorrectAnimation() {
  isIncorrect.value = true;
  setTimeout(() => {
    isIncorrect.value = false;
  }, 600);
}

defineExpose({
  cardRef,
  triggerIncorrectAnimation
});
</script>

<style scoped>
.vaahana-option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 4px solid #4FC3F7;
  border-radius: 28px;
  padding: 12px 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  cursor: grab;
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease, border-color 0.2s;
  min-height: 115px;
  width: 100%;
}

.vaahana-option-card:hover:not(.is-disabled) {
  transform: translateY(-4px);
  border-color: #0288D1;
  box-shadow: 0 12px 24px rgba(2, 136, 209, 0.18);
}

.vaahana-option-card:active:not(.is-disabled) {
  cursor: grabbing;
}

.vaahana-option-card.is-dragging {
  cursor: grabbing;
  border-color: #FFB300 !important;
  background: #FFFDE7;
  transition: none !important;
}

.vaahana-option-card.is-incorrect {
  animation: shakeReturn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  border-color: #FF7043 !important;
  background: #FBE9E7;
}

@keyframes shakeReturn {
  10%, 90% { transform: translate3d(-3px, 0, 0); }
  20%, 80% { transform: translate3d(5px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-7px, 0, 0); }
  40%, 60% { transform: translate3d(7px, 0, 0); }
}

.vaahana-option-card.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.2);
}

.option-image-box {
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-image {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

.option-name {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #01579B;
  margin-top: 4px;
  text-align: center;
}
</style>
