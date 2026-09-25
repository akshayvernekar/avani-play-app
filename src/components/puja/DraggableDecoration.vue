<template>
  <div
    class="draggable-decoration"
    :class="{ 
      'is-dragging': isDraggingThis, 
      'place-bounce': !hasMovedAfterSpawn 
    }"
    :style="decorationStyle"
    @pointerdown="onPointerDown"
  >
    <div class="decoration-content">
      <img
        v-if="!imgFailed"
        :src="decoration.item.image"
        :alt="decoration.item.name"
        class="decoration-img"
        draggable="false"
        @error="imgFailed = true"
      />
      <span v-else class="decoration-emoji">{{ decoration.item.emoji }}</span>

      <!-- Interactive Diya Flame if it's a lit diya -->
      <div v-if="decoration.item.type === 'lights' && decoration.lit !== false" class="diya-flame-anim">
        <div class="flame-core"></div>
        <div class="flame-glow"></div>
      </div>

      <!-- Smoke wisp if it's incense -->
      <div v-if="decoration.item.type === 'incense'" class="incense-smoke-group">
        <div class="smoke-wisp wisp-1"></div>
        <div class="smoke-wisp wisp-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PlacedItem } from '../../data/puja';

const props = defineProps<{
  decoration: PlacedItem;
  isDraggingThis: boolean;
}>();

const emit = defineEmits<{
  (e: 'drag-start', decoration: PlacedItem, event: PointerEvent): void;
  (e: 'tap', decoration: PlacedItem): void;
}>();

const imgFailed = ref(false);
const hasMovedAfterSpawn = ref(false);

const decorationStyle = computed(() => {
  const type = props.decoration.item.type;
  const baseScale = props.decoration.scale ?? 1;

  // Responsive width using cqmin (relative to the smaller canvas dimension)
  // Ensures garland and all decorations scale in exact proportion to Ganesha across all devices
  let widthVal = '10%';
  let maxWidth = 'none';

  switch (type) {
    case 'garlands':
      widthVal = `min(${28 * baseScale}%, ${36 * baseScale}cqmin)`;
      maxWidth = `${300 * baseScale}px`;
      break;
    case 'offerings':
      widthVal = `min(${15 * baseScale}%, ${18 * baseScale}cqmin)`;
      maxWidth = `${140 * baseScale}px`;
      break;
    case 'flowers':
      widthVal = `min(${8.5 * baseScale}%, ${11 * baseScale}cqmin)`;
      maxWidth = `${85 * baseScale}px`;
      break;
    case 'lights':
      widthVal = `min(${11 * baseScale}%, ${14 * baseScale}cqmin)`;
      maxWidth = `${110 * baseScale}px`;
      break;
    case 'incense':
      widthVal = `min(${8.5 * baseScale}%, ${11 * baseScale}cqmin)`;
      maxWidth = `${85 * baseScale}px`;
      break;
    default:
      widthVal = `min(${12 * baseScale}%, ${14 * baseScale}cqmin)`;
      break;
  }

  return {
    left: `${props.decoration.x * 100}%`,
    top: `${props.decoration.y * 100}%`,
    width: widthVal,
    maxWidth,
    zIndex: props.decoration.zIndex,
    transform: `translate(-50%, -50%) rotate(${props.decoration.rotation ?? 0}deg)`
  };
});

function onPointerDown(e: PointerEvent) {
  // Prevent default to disable native image dragging and scroll
  e.preventDefault();
  hasMovedAfterSpawn.value = true;
  emit('drag-start', props.decoration, e);
}
</script>

<style scoped>
.draggable-decoration {
  position: absolute;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  cursor: grab;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.15s ease;
}

.draggable-decoration.is-dragging {
  cursor: grabbing;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.35)) brightness(1.05);
}

.decoration-content {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.22));
}

.decoration-emoji {
  font-size: clamp(32px, 6vh, 56px);
  line-height: 1;
  pointer-events: none;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
}

/* Diya Flame */
.diya-flame-anim {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(14px, 2.8vh, 22px);
  height: clamp(20px, 3.8vh, 32px);
  pointer-events: none;
}

.flame-core {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 80%, #FFFFFF 0%, #FFEE58 40%, #FF9800 80%, #F4511E 100%);
  border-radius: 50% 50% 35% 35% / 60% 60% 40% 40%;
  animation: flicker 0.25s infinite alternate ease-in-out;
}

.flame-glow {
  position: absolute;
  inset: -6px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 0.5s infinite alternate ease-in-out;
}

@keyframes flicker {
  0% { transform: scaleY(1) rotate(-2deg); opacity: 0.95; }
  25% { transform: scaleY(1.08) rotate(2deg); opacity: 1; }
  50% { transform: scaleY(0.92) rotate(-1deg); opacity: 0.92; }
  75% { transform: scaleY(1.05) rotate(1deg); opacity: 1; }
  100% { transform: scaleY(0.98) rotate(-2deg); opacity: 0.96; }
}

@keyframes glowPulse {
  0% { opacity: 0.5; transform: scale(0.95); }
  100% { opacity: 0.9; transform: scale(1.15); }
}

/* Incense Smoke */
.incense-smoke-group {
  position: absolute;
  top: -15px;
  left: 50%;
  pointer-events: none;
}

.smoke-wisp {
  position: absolute;
  top: 0;
  left: 50%;
  width: 14px;
  height: 28px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 60%, transparent 80%);
  filter: blur(3px);
  opacity: 0;
  animation: smokeDrift 2.8s infinite linear;
}

.wisp-1 { animation-delay: 0s; }
.wisp-2 { animation-delay: 1.4s; }

@keyframes smokeDrift {
  0% {
    transform: translate(-50%, 0) scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: translate(calc(-50% + 8px), -30px) scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: translate(calc(-50% - 10px), -65px) scale(1.6);
    opacity: 0;
  }
}

/* Initial Spawn Bounce */
.place-bounce {
  animation: spawnBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes spawnBounce {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>
