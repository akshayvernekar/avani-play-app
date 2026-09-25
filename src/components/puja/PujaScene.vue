<template>
  <div 
    ref="sceneContainerRef" 
    class="puja-scene-container"
    :class="{ 'aarti-glowing': isAartiActive || isCelebration }"
  >
    <!-- Layer 1: Background (Clean Temple Sanctum) -->
    <div class="scene-layer layer-bg">
      <img 
        v-if="!bgFailed" 
        :src="deity.sceneBackground" 
        alt="Temple Background" 
        class="bg-image"
        draggable="false"
        @error="bgFailed = true" 
      />
      <div v-else class="bg-gradient-fallback"></div>
    </div>

    <!-- Layer 2: Fixed Deity Idol Figure -->
    <div class="scene-layer layer-deity">
      <div class="deity-wrapper" :class="{ 'celebration-radiance': isCelebration }">
        <img 
          :src="deity.image" 
          :alt="deity.name" 
          class="deity-image"
          draggable="false"
        />
        <!-- Golden halo / divine aura -->
        <div class="divine-aura"></div>
      </div>
    </div>

    <!-- Layer 3: Interactive Draggable Decorations Canvas -->
    <div class="scene-layer layer-decorations-canvas">
      <DraggableDecoration
        v-for="dec in placedItems"
        :key="dec.id"
        :decoration="dec"
        :is-dragging-this="draggingItemId === dec.id"
        @drag-start="(item, e) => $emit('item-drag-start', item, e)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PujaDeityConfig, PlacedItem } from '../../data/puja';
import DraggableDecoration from './DraggableDecoration.vue';

defineProps<{
  deity: PujaDeityConfig;
  placedItems: PlacedItem[];
  draggingItemId?: string | null;
  isAartiActive?: boolean;
  isCelebration?: boolean;
}>();

defineEmits<{
  (e: 'item-drag-start', decoration: PlacedItem, event: PointerEvent): void;
}>();

const sceneContainerRef = ref<HTMLElement | null>(null);
const bgFailed = ref(false);

defineExpose({
  sceneContainerRef
});
</script>

<style scoped>
.puja-scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: clamp(18px, 2.5vw, 26px);
  container-type: size;
  overflow: visible;
  box-shadow: 0 clamp(4px, 1vh, 10px) clamp(12px, 2vh, 24px) rgba(255, 111, 0, 0.2);
  border: clamp(2.5px, 0.5vh, 4px) solid #FFE082;
  user-select: none;
  touch-action: none;
  background: #FFF8E1;
}

/* Layer Base */
.scene-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Layer 1: Temple BG */
.layer-bg {
  z-index: 1;
  overflow: hidden;
  border-radius: inherit;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.bg-gradient-fallback {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 40%, #FFFDE7 0%, #FFE082 45%, #FFB300 85%, #E65100 100%);
}

/* Layer 2: Deity */
.layer-deity {
  z-index: 2;
  overflow: hidden;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deity-wrapper {
  position: relative;
  width: 72%;
  height: 92%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.4s ease;
}

.deity-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 clamp(6px, 1.2vh, 14px) clamp(12px, 2vh, 22px) rgba(0,0,0,0.22));
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.divine-aura {
  position: absolute;
  top: 15%;
  left: 20%;
  right: 20%;
  bottom: 25%;
  background: radial-gradient(circle, rgba(255, 238, 88, 0.45) 0%, rgba(255, 179, 0, 0.25) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(12px);
  z-index: 1;
  pointer-events: none;
  animation: auraPulse 3.5s ease-in-out infinite alternate;
}

@keyframes auraPulse {
  0% { transform: scale(0.95); opacity: 0.6; }
  100% { transform: scale(1.08); opacity: 0.95; }
}

.puja-scene-container.aarti-glowing .deity-image {
  filter: drop-shadow(0 0 clamp(20px, 4vh, 36px) #FFD54F) brightness(1.06);
}

.celebration-radiance .deity-image {
  filter: drop-shadow(0 0 clamp(28px, 5vh, 48px) #FFB300) brightness(1.12);
  animation: gentleCelebrate 2.5s ease-in-out infinite alternate;
}

@keyframes gentleCelebrate {
  0% { transform: scale(1); }
  100% { transform: scale(1.03); }
}

/* Layer 3: Interactive Draggable Decorations Canvas */
.layer-decorations-canvas {
  z-index: 10;
  pointer-events: none; /* Children handle pointer events */
}
</style>
