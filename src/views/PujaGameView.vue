<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Nav Bar (Slim, consistent with App conventions) -->
    <header class="top-nav">
      <div class="nav-left">
        <h1 class="nav-title">Puja Time 🙏</h1>
        <transition name="fade">
          <div v-if="feedbackText" class="feedback-inline">
            <span class="feedback-icon">{{ feedbackIcon }}</span>
            <span class="feedback-message">{{ feedbackText }}</span>
          </div>
        </transition>
      </div>

      <div class="nav-right">
        <!-- Clear / Reset Scene Button -->
        <button 
          v-if="placedItems.length > 0 && !isAartiActive" 
          class="reset-pill-btn"
          title="Reset Decoration"
          @click="resetScene"
        >
          <span>🔄</span>
          <span class="reset-label">Reset</span>
        </button>

        <NavigationButton 
          type="audio" 
          label="Sound Toggle" 
          :is-muted="isMuted" 
          @click="toggleMute" 
        />

        <NavigationButton 
          type="home" 
          label="Home" 
          @click="goHome" 
        />
      </div>
    </header>

    <!-- Main Game Split Layout: Left Scene (~66%), Right Tools Panel (~34%) -->
    <main class="game-stage-landscape">
      <!-- Left Scene Area -->
      <section class="left-panel" :class="{ 'is-dragging-active': !!draggingItemId }">
        <PujaScene
          ref="sceneRef"
          :deity="deityConfig"
          :placed-items="placedItems"
          :dragging-item-id="draggingItemId"
          :is-aarti-active="isAartiActive"
          :is-celebration="showCelebration"
          @item-drag-start="handleCanvasItemDragStart"
        />

        <!-- Aarti Interactive Gesture Overlay -->
        <AartiOverlay
          v-if="isAartiActive && activeAartiItem"
          :item="activeAartiItem"
          :deity-config="deityConfig"
          :active="isAartiActive"
          @progress-update="onAartiProgress"
          @complete="onAartiComplete"
        />
      </section>

      <!-- Right Tools Panel -->
      <section class="right-panel">
        <PujaToolsPanel
          ref="toolsPanelRef"
          :items="pujaItems"
          :active-category="activeCategory"
          :is-drag-over-panel="isOverDeleteZone"
          @category-change="handleCategoryChange"
          @item-drag-start="handleToolItemDragStart"
          @item-tap="handleToolItemTap"
        />
      </section>
    </main>

    <!-- Completion Celebration Modal -->
    <PujaCelebrationModal
      :show="showCelebration"
      @play-again="handlePlayAgain"
      @go-home="goHome"
    />

    <!-- Portrait Blocker Overlay -->
    <div class="portrait-guard-overlay" aria-live="assertive">
      <div class="rotate-phone-card">
        <div class="phone-icon-anim">
          <Smartphone class="device-icon" />
          <div class="rotate-arrow">↻</div>
        </div>
        <h2 class="rotate-title">Turn your device sideways!</h2>
        <p class="rotate-desc">Rotate to landscape for the best playful experience! 🌈</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Smartphone } from 'lucide-vue-next';
import NavigationButton from '../components/NavigationButton.vue';
import PujaScene from '../components/puja/PujaScene.vue';
import PujaToolsPanel from '../components/puja/PujaToolsPanel.vue';
import AartiOverlay from '../components/puja/AartiOverlay.vue';
import PujaCelebrationModal from '../components/puja/PujaCelebrationModal.vue';
import { 
  pujaItems, 
  ganeshaPujaConfig, 
  PujaCategory, 
  PujaItem, 
  PlacedItem 
} from '../data/puja';
import { audioManager } from '../audio/AudioManager';

const router = useRouter();
const deityConfig = ganeshaPujaConfig;

// State
const activeCategory = ref<PujaCategory>('flowers');
const placedItems = ref<PlacedItem[]>([]);
const isMuted = ref(audioManager.getMuted());
const feedbackText = ref('Tap an item to decorate Ganesha! ✨');
const feedbackIcon = ref('🌸');
const showCelebration = ref(false);

// Canvas & Drag State
const sceneRef = ref<InstanceType<typeof PujaScene> | null>(null);
const toolsPanelRef = ref<InstanceType<typeof PujaToolsPanel> | null>(null);

// Item being dragged on canvas
const draggingItemId = ref<string | null>(null);
const isOverDeleteZone = ref(false);
let nextZIndex = 10;

// Drag Offset tracking (in normalized coordinate delta)
let dragOffsetNormX = 0;
let dragOffsetNormY = 0;

// Spawning offset counter to prevent newly tapped items stacking on exact same pixel
let spawnOffsetIndex = 0;

// Aarti State
const isAartiActive = ref(false);
const activeAartiItem = ref<PujaItem | null>(null);
let stopAartiMantra: (() => void) | null = null;
let stopAartiBells: (() => void) | null = null;

const bgStyle = computed(() => ({
  background: `linear-gradient(135deg, #FFFDE7 0%, #FFF3E0 50%, #FFE082 100%)`
}));

function toggleMute() {
  audioManager.toggleMute();
  isMuted.value = audioManager.getMuted();
}

function goHome() {
  cleanupAartiAudio();
  audioManager.playTap();
  router.push('/');
}

function handleCategoryChange(category: PujaCategory) {
  audioManager.playTap();
  activeCategory.value = category;

  if (category === 'aarti') {
    feedbackText.value = 'Tap an Aarti thali to begin the Aarti! 🌟';
    feedbackIcon.value = '✨';
  } else if (category === 'flowers') {
    feedbackText.value = 'Tap or drag flowers anywhere around Ganesha! 🌸';
    feedbackIcon.value = '🌸';
  } else if (category === 'garlands') {
    feedbackText.value = 'Add a garland and adjust it on Ganesha! 📿';
    feedbackIcon.value = '📿';
  } else if (category === 'offerings') {
    feedbackText.value = 'Place delicious modak & sweets in front of Ganesha! 🍬';
    feedbackIcon.value = '🍬';
  } else if (category === 'lights') {
    feedbackText.value = 'Place diyas and light them up! 🪔';
    feedbackIcon.value = '🪔';
  } else if (category === 'incense') {
    feedbackText.value = 'Place fragrant agarbatti! 💨';
    feedbackIcon.value = '💨';
  }
}

/**
 * 1. SPAWN FROM TOOL PANEL:
 * When user taps or starts dragging an item from the tool panel:
 * Create a new instance, add to canvas, place at appropriate initial position,
 * and immediately make it draggable if from dragstart.
 */
function handleToolItemTap(item: PujaItem) {
  if (item.type === 'aarti') {
    startAarti(item);
    return;
  }
  spawnDecoration(item);
}

function handleToolItemDragStart(item: PujaItem, e: PointerEvent) {
  if (item.type === 'aarti') {
    startAarti(item);
    return;
  }

  // Create new decoration and immediately start dragging it
  const newDec = spawnDecoration(item, false);
  startDraggingDecoration(newDec, e, true);
}

function spawnDecoration(item: PujaItem, playSound = true): PlacedItem {
  // Give an intuitive initial position near deity
  let initialX = 0.5;
  let initialY = 0.65;

  if (item.type === 'garlands') {
    initialX = 0.5;
    initialY = 0.58;
  } else if (item.type === 'flowers') {
    // Stagger slightly so multiple flowers don't stack directly on top
    const offsets = [
      { x: 0.5, y: 0.85 },
      { x: 0.38, y: 0.86 },
      { x: 0.62, y: 0.86 },
      { x: 0.44, y: 0.88 },
      { x: 0.56, y: 0.88 }
    ];
    const off = offsets[spawnOffsetIndex % offsets.length];
    spawnOffsetIndex++;
    initialX = off.x;
    initialY = off.y;
  } else if (item.type === 'offerings') {
    const offsets = [
      { x: 0.5, y: 0.90 },
      { x: 0.36, y: 0.91 },
      { x: 0.64, y: 0.91 }
    ];
    const off = offsets[spawnOffsetIndex % offsets.length];
    spawnOffsetIndex++;
    initialX = off.x;
    initialY = off.y;
  } else if (item.type === 'lights') {
    initialX = 0.22;
    initialY = 0.85;
  } else if (item.type === 'incense') {
    initialX = 0.78;
    initialY = 0.85;
  }

  nextZIndex++;
  const newPlaced: PlacedItem = {
    id: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    item,
    x: initialX,
    y: initialY,
    scale: 1.0,
    rotation: 0,
    zIndex: nextZIndex,
    lit: true
  };

  placedItems.value.push(newPlaced);

  if (playSound) {
    if (item.sound === 'bell') {
      audioManager.playBell();
    } else if (item.sound === 'whoosh') {
      audioManager.playFlameWhoosh();
    } else {
      audioManager.playChime();
    }
  }

  feedbackText.value = `Added ${item.name}! Drag anywhere to position or drag to panel to remove. ✨`;
  feedbackIcon.value = item.emoji;

  return newPlaced;
}

/**
 * 2. DRAGGING DECORATION ON CANVAS:
 * Calculates drag offset (offsetX = pointerX - itemX) to prevent jump.
 * Updates item position continuously in normalized coordinates (0 to 1).
 * Detects tool panel overlap for drop-to-delete.
 */
function handleCanvasItemDragStart(decoration: PlacedItem, e: PointerEvent) {
  startDraggingDecoration(decoration, e, false);
}

function startDraggingDecoration(decoration: PlacedItem, e: PointerEvent, fromPanelSpawn = false) {
  const sceneEl = sceneRef.value?.sceneContainerRef;
  if (!sceneEl) return;

  const rect = sceneEl.getBoundingClientRect();

  // Bring to top z-index
  nextZIndex++;
  decoration.zIndex = nextZIndex;
  draggingItemId.value = decoration.id;

  if (fromPanelSpawn) {
    // Pointer is coming from tool panel: position decoration under pointer directly
    const currentNormX = (e.clientX - rect.left) / rect.width;
    const currentNormY = (e.clientY - rect.top) / rect.height;
    decoration.x = Math.max(0.05, Math.min(0.95, currentNormX));
    decoration.y = Math.max(0.05, Math.min(0.95, currentNormY));
    dragOffsetNormX = 0;
    dragOffsetNormY = 0;
  } else {
    // Normal drag start on canvas: calculate offset to prevent jumping
    const pointerNormX = (e.clientX - rect.left) / rect.width;
    const pointerNormY = (e.clientY - rect.top) / rect.height;
    dragOffsetNormX = pointerNormX - decoration.x;
    dragOffsetNormY = pointerNormY - decoration.y;
  }

  audioManager.playPickup();

  const onGlobalPointerMove = (moveEvent: PointerEvent) => {
    moveEvent.preventDefault();
    if (!draggingItemId.value) return;

    const currentDec = placedItems.value.find(d => d.id === draggingItemId.value);
    if (!currentDec) return;

    const currentRect = sceneEl.getBoundingClientRect();
    const pointerNormX = (moveEvent.clientX - currentRect.left) / currentRect.width;
    const pointerNormY = (moveEvent.clientY - currentRect.top) / currentRect.height;

    // Apply offset
    currentDec.x = pointerNormX - dragOffsetNormX;
    currentDec.y = pointerNormY - dragOffsetNormY;

    // Check if pointer/item overlaps the tools panel (delete drop zone)
    checkDeleteZoneOverlap(moveEvent.clientX, moveEvent.clientY);
  };

  const onGlobalPointerUp = (upEvent: PointerEvent) => {
    window.removeEventListener('pointermove', onGlobalPointerMove);
    window.removeEventListener('pointerup', onGlobalPointerUp);
    window.removeEventListener('pointercancel', onGlobalPointerUp);

    const activeId = draggingItemId.value;
    const wasOverDelete = isOverDeleteZone.value;

    draggingItemId.value = null;
    isOverDeleteZone.value = false;

    if (!activeId) return;

    if (wasOverDelete) {
      // 4. DRAG BACK TO TOOL PANEL = DELETE
      deleteDecoration(activeId);
    } else {
      // Keep on canvas - keep within reasonable visual bounds
      const dec = placedItems.value.find(d => d.id === activeId);
      if (dec) {
        dec.x = Math.max(0.04, Math.min(0.96, dec.x));
        dec.y = Math.max(0.08, Math.min(0.96, dec.y));
        audioManager.playTap();
      }
    }
  };

  window.addEventListener('pointermove', onGlobalPointerMove, { passive: false });
  window.addEventListener('pointerup', onGlobalPointerUp);
  window.addEventListener('pointercancel', onGlobalPointerUp);
}

function checkDeleteZoneOverlap(clientX: number, clientY: number) {
  const panelEl = toolsPanelRef.value?.panelRootRef;
  if (!panelEl) {
    isOverDeleteZone.value = false;
    return;
  }

  const pRect = panelEl.getBoundingClientRect();
  // Buffer margin for forgiving kid-friendly drag
  const isInside = 
    clientX >= pRect.left - 20 &&
    clientX <= pRect.right + 20 &&
    clientY >= pRect.top - 20 &&
    clientY <= pRect.bottom + 20;

  isOverDeleteZone.value = isInside;
}

function deleteDecoration(id: string) {
  const itemToDelete = placedItems.value.find(d => d.id === id);
  placedItems.value = placedItems.value.filter(d => d.id !== id);

  audioManager.playTap();
  if (itemToDelete) {
    feedbackText.value = `Removed ${itemToDelete.item.name}! 🗑️`;
    feedbackIcon.value = '🗑️';
  }
}

// Aarti Flow
function startAarti(item: PujaItem) {
  isAartiActive.value = true;
  activeAartiItem.value = item;
  feedbackText.value = 'Turn the Aarti plate around Ganesha! ✨';
  feedbackIcon.value = '🌟';

  cleanupAartiAudio(false);
  audioManager.playBell();
  stopAartiMantra = audioManager.playAartiMantra();
}

function onAartiProgress(_progress: number) {}

function onAartiComplete() {
  cleanupAartiAudio(true);
  isAartiActive.value = false;
  activeAartiItem.value = null;

  feedbackText.value = 'Aarti Complete! Divine Blessings! 🙏🌟';
  feedbackIcon.value = '🙏';

  setTimeout(() => {
    showCelebration.value = true;
  }, 900);
}

function cleanupAartiAudio(fade: boolean = false) {
  if (stopAartiMantra) {
    stopAartiMantra();
    stopAartiMantra = null;
  }
  if (stopAartiBells) {
    stopAartiBells();
    stopAartiBells = null;
  }
  audioManager.stopAartiMantra(fade);
}

function resetScene() {
  audioManager.playTap();
  placedItems.value = [];
  feedbackText.value = 'Ready to decorate Ganesha! 🌸';
  feedbackIcon.value = '🌸';
}

function handlePlayAgain() {
  showCelebration.value = false;
  resetScene();
}

onMounted(() => {
  try {
    (screen.orientation as any)?.lock?.('landscape').catch(() => {});
  } catch (e) {}
});

onBeforeUnmount(() => {
  cleanupAartiAudio();
});
</script>

<style scoped>
.game-view-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
  user-select: none;
}

/* Slim Top Navigation */
.top-nav {
  height: clamp(40px, 7.5vh, 52px);
  padding: 0 clamp(12px, 2vw, 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(255, 179, 0, 0.25);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 16px);
  min-width: 0;
}

.nav-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(16px, 3vh, 22px);
  font-weight: 700;
  color: #E65100;
  margin: 0;
  white-space: nowrap;
}

.feedback-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFF8E1;
  border: 1.5px solid #FFE082;
  border-radius: 999px;
  padding: 3px clamp(8px, 1.2vw, 14px);
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(11px, 1.8vh, 14px);
  font-weight: 600;
  color: #795548;
  max-width: clamp(180px, 32vw, 360px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feedback-icon {
  font-size: 1.1em;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.2vw, 14px);
  flex-shrink: 0;
}

.reset-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: clamp(4px, 0.8vh, 6px) clamp(10px, 1.2vw, 14px);
  background: #FFFDE7;
  border: 1.5px solid #FFD54F;
  border-radius: 999px;
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(11px, 1.8vh, 13px);
  font-weight: 600;
  color: #E65100;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 179, 0, 0.2);
  transition: transform 0.15s ease;
}

.reset-pill-btn:hover {
  transform: scale(1.04);
}

.reset-pill-btn:active {
  transform: scale(0.96);
}

/* Main Split Stage */
.game-stage-landscape {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 65fr 35fr;
  gap: clamp(8px, 1.5vw, 18px);
  padding: clamp(6px, 1.2vh, 12px) clamp(10px, 2vw, 20px) clamp(8px, 1.5vh, 14px);
  box-sizing: border-box;
}

.left-panel {
  position: relative;
  height: 100%;
  min-height: 0;
  transition: z-index 0s;
}

.left-panel.is-dragging-active {
  z-index: 25;
}

.right-panel {
  height: 100%;
  min-height: 0;
}

/* Drag Ghost */
.floating-drag-ghost {
  position: fixed;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  width: clamp(60px, 11vh, 90px);
  height: clamp(60px, 11vh, 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.35));
  animation: ghostFloating 0.2s ease-out;
}

@keyframes ghostFloating {
  0% { transform: translate(-50%, -50%) scale(0.7); }
  100% { transform: translate(-50%, -50%) scale(1.1); }
}

.ghost-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ghost-emoji {
  font-size: clamp(40px, 8vh, 64px);
  line-height: 1;
}

/* Responsive Portrait Layout */
@media (orientation: portrait) {
  .game-stage-landscape {
    grid-template-columns: 1fr;
    grid-template-rows: 58fr 42fr;
    gap: clamp(6px, 1vh, 10px);
    padding: clamp(4px, 0.8vh, 8px) clamp(8px, 2vw, 14px) clamp(6px, 1vh, 10px);
  }

  .left-panel {
    height: 100%;
    min-height: 0;
  }

  .right-panel {
    height: 100%;
    min-height: 0;
  }

  .portrait-guard-overlay {
    display: none !important;
  }
}

.portrait-guard-overlay {
  display: none;
}

.rotate-phone-card {
  background: #FFFDE7;
  border: 4px solid #FFD54F;
  border-radius: 28px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 320px;
  box-shadow: 0 16px 32px rgba(0,0,0,0.25);
}

.phone-icon-anim {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.device-icon {
  width: 52px;
  height: 52px;
  color: #E65100;
  animation: rotateDevice 2s infinite ease-in-out;
}

.rotate-arrow {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 26px;
  color: #FFB300;
  font-weight: bold;
}

@keyframes rotateDevice {
  0%, 15% { transform: rotate(0deg); }
  50%, 65% { transform: rotate(90deg); }
  100% { transform: rotate(0deg); }
}

.rotate-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #E65100;
  margin: 0 0 8px;
}

.rotate-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #795548;
  margin: 0;
}

/* Route transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
