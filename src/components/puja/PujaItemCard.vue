<template>
  <div 
    class="puja-item-card"
    :class="{ 'is-disabled': disabled }"
    @pointerdown="handlePointerDown"
  >
    <div class="item-visual">
      <img 
        v-if="!imgFailed" 
        :src="item.image" 
        :alt="item.name" 
        class="item-img"
        @error="imgFailed = true" 
      />
      <span v-else class="emoji-fallback">{{ item.emoji }}</span>
    </div>
    <span class="item-name">{{ item.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PujaItem } from '../../data/puja';

const props = defineProps<{
  item: PujaItem;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'dragstart', item: PujaItem, event: PointerEvent): void;
  (e: 'tap', item: PujaItem): void;
}>();

const imgFailed = ref(false);

let startX = 0;
let startY = 0;
let hasDragged = false;

function handlePointerDown(e: PointerEvent) {
  if (props.disabled) return;
  startX = e.clientX;
  startY = e.clientY;
  hasDragged = false;

  const onPointerMove = (moveEvent: PointerEvent) => {
    const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
    if (dist > 6 && !hasDragged) {
      hasDragged = true;
      emit('dragstart', props.item, moveEvent);
    }
  };

  const onPointerUp = (upEvent: PointerEvent) => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    if (!hasDragged) {
      emit('tap', props.item);
    }
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}
</script>

<style scoped>
.puja-item-card {
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  cursor: grab;
  background: #FFFDF9;
  border-radius: clamp(16px, 2.2vh, 22px);
  border: clamp(2px, 0.4vh, 3px) solid #FFE0B2;
  box-shadow: 0 clamp(2px, 0.5vh, 4px) clamp(6px, 1.2vh, 12px) rgba(141, 110, 99, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(6px, 1vh, 10px);
  min-height: clamp(68px, 11vh, 94px);
  transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
  position: relative;
}

.puja-item-card:hover:not(.is-disabled) {
  transform: translateY(-2px);
  border-color: #3B82F6;
  box-shadow: 0 clamp(4px, 0.8vh, 8px) clamp(10px, 2vh, 16px) rgba(59, 130, 246, 0.2);
}

.puja-item-card:active:not(.is-disabled) {
  transform: scale(0.96);
  cursor: grabbing;
}

.puja-item-card.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-visual {
  width: 100%;
  height: clamp(44px, 7.5vh, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
  pointer-events: none;
}

.emoji-fallback {
  font-size: clamp(28px, 5vh, 42px);
  line-height: 1;
  pointer-events: none;
}

.item-name {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(10px, 1.6vh, 13px);
  font-weight: 600;
  color: #5D4037;
  margin-top: clamp(2px, 0.4vh, 4px);
  text-align: center;
  line-height: 1.1;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
