<template>
  <div 
    class="game-tile"
    :class="{ 'is-disabled': !game.enabled }"
    :style="{
      backgroundColor: game.bgColor,
      borderColor: game.borderColor,
      color: game.textColor
    }"
    @click="handleClick"
  >
    <div class="tile-icon-container">
      <img v-if="game.customIcon" :src="game.customIcon" class="custom-tile-icon" :alt="game.title" />
      <component v-else :is="iconComponent" class="tile-icon" />
    </div>
    
    <span class="tile-title">{{ game.title }}</span>
    <span v-if="game.subtitle" class="tile-subtitle">{{ game.subtitle }}</span>

    <div v-if="game.badge" class="tile-badge">
      {{ game.badge }}
    </div>
    
    <div v-else-if="!game.enabled" class="coming-soon-tag">
      Soon
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GameCategory } from '../data/games';
import { Puzzle, Dog, Binary, CaseUpper, Palette, Car } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';

const props = defineProps<{
  game: GameCategory;
}>();

const emit = defineEmits<{
  (e: 'select', game: GameCategory): void;
}>();

const iconComponent = computed(() => {
  switch (props.game.iconName) {
    case 'Puzzle': return Puzzle;
    case 'Dog': return Dog;
    case 'Binary': return Binary;
    case 'CaseUpper': return CaseUpper;
    case 'Palette': return Palette;
    case 'Car': return Car;
    default: return Puzzle;
  }
});

function handleClick() {
  audioManager.playTap();
  emit('select', props.game);
}
</script>

<style scoped>
.game-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(10px, 1.8vh, 18px) clamp(8px, 1.5vw, 14px);
  border-radius: clamp(20px, 3vh, 28px);
  border: clamp(3px, 0.6vh, 4px) solid;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08), 0 3px 5px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
  min-height: clamp(100px, 16vh, 145px);
  box-sizing: border-box;
}

.game-tile:active {
  transform: scale(0.95) translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.tile-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(4px, 0.8vh, 8px);
}

.tile-icon {
  width: clamp(38px, 6vh, 52px);
  height: clamp(38px, 6vh, 52px);
  stroke-width: 2.5px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.custom-tile-icon {
  width: clamp(42px, 7vh, 60px);
  height: clamp(42px, 7vh, 60px);
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.tile-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(1.05rem, 2.5vh, 1.35rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
}

.tile-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.72rem, 1.6vh, 0.85rem);
  font-weight: 600;
  text-align: center;
  margin-top: 3px;
  opacity: 0.9;
}

.tile-badge {
  position: absolute;
  top: -8px;
  right: -6px;
  background: #FF5252;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
}

.coming-soon-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.08);
  color: currentColor;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 12px;
}

.is-disabled {
  opacity: 0.9;
}
</style>
