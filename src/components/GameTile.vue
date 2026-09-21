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
      <component :is="iconComponent" class="tile-icon" />
    </div>
    
    <span class="tile-title">{{ game.title }}</span>

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
  padding: 20px 12px;
  border-radius: 28px;
  border: 4px solid;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
  min-height: 140px;
}

.game-tile:active {
  transform: scale(0.95) translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.tile-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.tile-icon {
  width: 52px;
  height: 52px;
  stroke-width: 2.5px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.tile-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
}

.tile-badge {
  position: absolute;
  top: -10px;
  right: -6px;
  background: #FF5252;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
}

.coming-soon-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.08);
  color: currentColor;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
}

.is-disabled {
  opacity: 0.9;
}
</style>
