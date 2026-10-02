<template>
  <div 
    class="game-tile"
    :class="{ 
      'is-disabled': !game.enabled,
      [`game-tile-${game.id}`]: true 
    }"
    :style="{
      background: game.bgColor || '#FFFDF9',
      borderColor: game.borderColor || '#FFCC80'
    }"
    @click="handleClick"
  >
    <!-- Upper 75-80%: Large Deity Icon Stage with Subtle Halo -->
    <div class="tile-icon-stage">
      <div class="tile-halo">
        <img 
          v-if="game.customIcon" 
          :src="game.customIcon" 
          class="tile-deity-img" 
          :class="{ 'is-standing': game.id === 'special-item' }"
          :alt="game.title" 
          loading="eager"
        />
        <component v-else :is="iconComponent" class="tile-fallback-icon" />
      </div>
    </div>
    
    <!-- Lower 20-25%: Game Title Only (Subtitles completely removed) -->
    <div class="tile-text-container">
      <span 
        class="tile-title" 
        :style="{ color: game.titleColor || game.textColor }"
      >
        {{ game.title }}
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
  justify-content: space-between;
  padding: clamp(6px, 1.1vh, 10px) clamp(6px, 1.1vw, 10px) clamp(5px, 0.9vh, 8px);
  border-radius: clamp(18px, 2.8vh, 26px);
  /* Slightly stronger colored border for tactile depth */
  border: clamp(3px, 0.45vh, 4px) solid #FFA726;
  /* Very subtle shadow + gentle top highlight for polished physical button feel */
  box-shadow: 
    0 5px 16px rgba(0, 0, 0, 0.08), 
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.65);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1.05 / 1; /* Squarish aspect ratio: 1:1 to 1:1.1 */
}

.game-tile:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.11), 
    0 3px 6px rgba(0, 0, 0, 0.05),
    inset 0 1.5px 0 rgba(255, 255, 255, 0.8);
}

.game-tile:active {
  transform: scale(0.96) translateY(1px);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Upper 75-80%: Large Deity Icon Stage with Subtle Halo */
.tile-icon-stage {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  padding: 0;
}

/* Subtle lighter circular halo highlight area behind deity image */
.tile-halo {
  width: 95%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.46) 50%, rgba(255, 255, 255, 0) 74%);
}

.tile-deity-img {
  width: 95%;
  height: 95%;
  max-width: 95%;
  max-height: 95%;
  object-fit: contain; /* Never crop face, crown, or identifying features */
  filter: drop-shadow(0 4px 7px rgba(0, 0, 0, 0.12));
  transition: transform 0.22s ease;
  pointer-events: none;
}

/* Stage 5: Scaled Krishna image by ~18% so visual presence matches Ganesha & Shiva without cropping */
.tile-deity-img.is-standing {
  transform: scale(1.32);
}

.game-tile:hover .tile-deity-img {
  transform: scale(1.08);
}

.game-tile:hover .tile-deity-img.is-standing {
  transform: scale(1.40);
}

.tile-fallback-icon {
  width: clamp(28px, 4.5vh, 42px);
  height: clamp(28px, 4.5vh, 42px);
  stroke-width: 2.2px;
}

/* Lower 20-25%: Game Title Only */
.tile-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding-top: clamp(2px, 0.4vh, 4px);
  box-sizing: border-box;
  flex-shrink: 0;
  min-height: clamp(20px, 3.2vh, 32px);
}

.tile-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(0.78rem, 1.65vh, 1.02rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  letter-spacing: 0.01em;
}

.tile-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #FF5252;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.6rem, 1vh, 0.68rem);
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 16px;
  box-shadow: 0 3px 6px rgba(255, 82, 82, 0.35);
  white-space: nowrap;
}

.is-disabled {
  opacity: 0.88;
}

/* Landscape mode enhancements */
@media (orientation: landscape) {
  .game-tile {
    padding: clamp(8px, 1.6vh, 12px) clamp(8px, 1.2vw, 12px) clamp(6px, 1.2vh, 10px);
  }

  .tile-title {
    font-size: clamp(0.86rem, 2vh, 1.08rem);
  }
}
</style>
