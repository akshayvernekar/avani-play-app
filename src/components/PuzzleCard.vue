<template>
  <div 
    class="puzzle-card"
    :style="{ backgroundColor: puzzle.cardBgColor }"
    @click="handleClick"
  >
    <div class="card-image-wrapper">
      <img :src="puzzle.image" :alt="puzzle.title" class="card-image" />
    </div>
    <span class="card-title">{{ puzzle.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { PuzzleItem } from '../data/puzzles';
import { audioManager } from '../audio/AudioManager';

const props = defineProps<{
  puzzle: PuzzleItem;
}>();

const emit = defineEmits<{
  (e: 'select', puzzle: PuzzleItem): void;
}>();

function handleClick() {
  audioManager.playTap();
  emit('select', props.puzzle);
}
</script>

<style scoped>
.puzzle-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px 14px 12px;
  border-radius: 26px;
  border: 4px solid #FFFFFF;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
}

.puzzle-card:active {
  transform: scale(0.94) translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.card-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px;
}

.card-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
}

.card-title {
  margin-top: 10px;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #263238;
  text-align: center;
}
</style>
