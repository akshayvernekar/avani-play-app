<template>
  <div 
    v-if="active" 
    ref="overlayRef"
    class="aarti-overlay-container"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Hint instruction card -->
    <div class="aarti-hint-bubble">
      <span class="hint-hand">✨</span>
      <span>Turn the Aarti in a circle around Ganesha!</span>
    </div>

    <!-- Circular Orbit Track SVG -->
    <svg class="orbit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <!-- Background Guide Track -->
      <circle
        :cx="deityConfig.aartiCenter.cx"
        :cy="deityConfig.aartiCenter.cy"
        :r="deityConfig.aartiOrbitRadius"
        class="orbit-guide-circle"
      />
      <!-- Progress Arc -->
      <circle
        :cx="deityConfig.aartiCenter.cx"
        :cy="deityConfig.aartiCenter.cy"
        :r="deityConfig.aartiOrbitRadius"
        class="orbit-progress-circle"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <!-- Draggable Aarti Thali Plate -->
    <div 
      class="aarti-plate-interactive"
      :style="plateTransformStyle"
      @pointerdown="onPointerDown"
    >
      <div class="plate-visual-wrapper">
        <img 
          v-if="!imgFailed"
          :src="item.image" 
          :alt="item.name" 
          class="aarti-plate-img"
          @error="imgFailed = true"
        />
        <span v-else class="plate-emoji-fallback">{{ item.emoji }}</span>

        <!-- Flame lights on plate -->
        <div class="plate-flame-halo"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { PujaItem, PujaDeityConfig } from '../../data/puja';

const props = defineProps<{
  item: PujaItem;
  deityConfig: PujaDeityConfig;
  active: boolean;
}>();

const emit = defineEmits<{
  (e: 'progress-update', progress: number): void;
  (e: 'complete'): void;
}>();

const overlayRef = ref<HTMLElement | null>(null);
const imgFailed = ref(false);
const isInteracting = ref(false);

// Geometry
const plateX = ref(50); // % of overlay width
const plateY = ref(78); // % of overlay height
let lastAngle: number | null = null;
let totalAngleSwept = 0;
const targetSweep = 300; // degrees required to complete

const radiusPercent = computed(() => props.deityConfig.aartiOrbitRadius);
const circumference = computed(() => 2 * Math.PI * radiusPercent.value);
const progressRatio = ref(0);

const dashOffset = computed(() => {
  return circumference.value * (1 - progressRatio.value);
});

const plateTransformStyle = computed(() => ({
  left: `${plateX.value}%`,
  top: `${plateY.value}%`,
  transform: 'translate(-50%, -50%)'
}));

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function onPointerDown(e: PointerEvent) {
  if (!props.active) return;
  isInteracting.value = true;
  lastAngle = null;
  (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  updatePositionFromEvent(e);
}

function onPointerMove(e: PointerEvent) {
  if (!isInteracting.value || !overlayRef.value) return;
  updatePositionFromEvent(e);
}

function onPointerUp(e: PointerEvent) {
  isInteracting.value = false;
  lastAngle = null;
  try {
    (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
  } catch (err) {
    // Ignore capture release error
  }
}

function updatePositionFromEvent(e: PointerEvent) {
  if (!overlayRef.value) return;
  const rect = overlayRef.value.getBoundingClientRect();
  const currentPxX = e.clientX - rect.left;
  const currentPxY = e.clientY - rect.top;

  const currentPercentX = (currentPxX / rect.width) * 100;
  const currentPercentY = (currentPxY / rect.height) * 100;

  // Center coordinates
  const cx = props.deityConfig.aartiCenter.cx;
  const cy = props.deityConfig.aartiCenter.cy;

  // Track sweep angle
  const dx = currentPercentX - cx;
  const dy = currentPercentY - cy;
  const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (lastAngle !== null) {
    const delta = angleDiff(currentAngle, lastAngle);
    // Add swept absolute angle
    totalAngleSwept += Math.abs(delta);
    progressRatio.value = Math.min(totalAngleSwept / targetSweep, 1);
    emit('progress-update', progressRatio.value);

    if (totalAngleSwept >= targetSweep) {
      emit('complete');
    }
  }
  lastAngle = currentAngle;

  // Snap plate along orbit circle for smooth beautiful feel
  const targetR = props.deityConfig.aartiOrbitRadius;
  const angleRad = currentAngle * (Math.PI / 180);
  plateX.value = cx + targetR * Math.cos(angleRad);
  plateY.value = cy + targetR * Math.sin(angleRad);
}

onMounted(() => {
  // Initial position at bottom of circle
  plateX.value = props.deityConfig.aartiCenter.cx;
  plateY.value = props.deityConfig.aartiCenter.cy + props.deityConfig.aartiOrbitRadius;
});
</script>

<style scoped>
.aarti-overlay-container {
  position: absolute;
  inset: 0;
  z-index: 20;
  touch-action: none;
  user-select: none;
}

.aarti-hint-bubble {
  position: absolute;
  top: 4%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 248, 225, 0.95);
  border: 2px solid #FFB300;
  border-radius: 999px;
  padding: clamp(6px, 1vh, 10px) clamp(14px, 2vw, 20px);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(12px, 1.8vh, 15px);
  font-weight: 600;
  color: #E65100;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25);
  animation: bounceHint 2s infinite ease-in-out;
  pointer-events: none;
  white-space: nowrap;
}

@keyframes bounceHint {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

.hint-hand {
  font-size: 1.2em;
}

.orbit-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orbit-guide-circle {
  fill: none;
  stroke: rgba(255, 179, 0, 0.35);
  stroke-width: 2;
  stroke-dasharray: 4 6;
}

.orbit-progress-circle {
  fill: none;
  stroke: #FF9800;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
  filter: drop-shadow(0 0 6px rgba(255, 152, 0, 0.8));
}

.aarti-plate-interactive {
  position: absolute;
  cursor: grab;
  touch-action: none;
  z-index: 25;
}

.aarti-plate-interactive:active {
  cursor: grabbing;
}

.plate-visual-wrapper {
  position: relative;
  width: clamp(75px, 14vh, 120px);
  height: clamp(75px, 14vh, 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 6px 14px rgba(255, 111, 0, 0.45));
}

.aarti-plate-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.plate-emoji-fallback {
  font-size: clamp(48px, 9vh, 80px);
  line-height: 1;
}

.plate-flame-halo {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 193, 7, 0.4) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
  animation: haloPulsing 1s infinite alternate ease-in-out;
}

@keyframes haloPulsing {
  0% { transform: scale(0.9); opacity: 0.5; }
  100% { transform: scale(1.15); opacity: 0.9; }
}
</style>
