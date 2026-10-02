<template>
  <div 
    class="game-tile"
    :class="{ 'is-disabled': !game.enabled }"
    :style="{
      background: game.bgColor,
      borderColor: game.borderColor
    }"
    @click="handleClick"
  >
    <!-- Card Top Illustration Banner -->
    <div class="tile-art-container">
      <img 
        v-if="game.customIcon" 
        :src="game.customIcon" 
        class="tile-art-img" 
        :alt="game.title" 
      />
      <component v-else :is="iconComponent" class="tile-icon" />
    </div>
    
    <!-- Card Text (Title & Subtitle) -->
    <div class="tile-text-container">
      <span 
        class="tile-title" 
        :style="{ color: game.titleColor || game.textColor }"
      >
        {{ game.title }}
      </span>
      <span 
        v-if="game.subtitle" 
        class="tile-subtitle" 
        :style="{ color: game.subtitleColor || game.textColor }"
      >
        {{ game.subtitle }}
      </span>
    </div>

    <!-- Optional Badge -->
    <div v-if="game.badge" class="tile-badge">
      {{ game.badge }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GameCategory } from '../data/games';
import { Puzzle, Dog, Binary, CaseUpper, Palette, Car, Sparkles } from 'lucide-vue-next';
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
    default: return Sparkles;
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
  justify-content: flex-start;
  padding: 0;
  border-radius: clamp(16px, 2.4vh, 24px);
  border: clamp(2.5px, 0.4vh, 3.5px) solid;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
}

.game-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08);
}

.game-tile:active {
  transform: scale(0.96) translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.tile-art-container {
  width: 100%;
  height: clamp(52px, 8.8vh, 85px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.25);
}

.tile-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  transition: transform 0.3s ease;
}

.game-tile:hover .tile-art-img {
  transform: scale(1.04);
}

.tile-icon {
  width: clamp(32px, 5vh, 44px);
  height: clamp(32px, 5vh, 44px);
  stroke-width: 2.4px;
  filter: drop-shadow(0 3px 5px rgba(0,0,0,0.1));
}

.tile-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: clamp(3px, 0.6vh, 6px) clamp(4px, 1vw, 10px) clamp(4px, 0.8vh, 8px);
  box-sizing: border-box;
}

.tile-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(0.72rem, 1.65vh, 0.98rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.tile-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.50rem, 1.05vh, 0.66rem);
  font-weight: 600;
  text-align: center;
  margin-top: 1px;
  line-height: 1.15;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.tile-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #FF5252;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.62rem, 1.1vh, 0.7rem);
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(255, 82, 82, 0.35);
  white-space: nowrap;
}

.is-disabled {
  opacity: 0.9;
}

/* Landscape Mode Card Sizing */
@media (orientation: landscape) {
  .game-tile {
    border-radius: clamp(16px, 2.5vh, 24px);
  }

  .tile-art-container {
    height: clamp(58px, 15vh, 95px);
  }

  .tile-text-container {
    padding: clamp(4px, 0.8vh, 8px) clamp(6px, 1.2vw, 10px) clamp(5px, 1vh, 9px);
  }

  .tile-title {
    font-size: clamp(0.85rem, 2.1vh, 1.12rem);
  }

  .tile-subtitle {
    font-size: clamp(0.62rem, 1.3vh, 0.74rem);
  }
}

@media (max-height: 480px) and (orientation: landscape) {
  .tile-art-container {
    height: clamp(44px, 13vh, 65px);
  }

  .tile-text-container {
    padding: 2px 4px 4px;
  }

  .tile-title {
    font-size: 0.76rem;
  }

  .tile-subtitle {
    font-size: 0.54rem;
  }
}
</style>
