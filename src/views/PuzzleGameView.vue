<template>
  <div class="game-view-container">
    <!-- Top Bar Overlay -->
    <div class="game-overlay-header">
      <NavigationButton type="back" label="Back to Puzzles" @click="goBackToSelection" />

      <div class="header-right">
        <NavigationButton type="audio" :isMuted="isMuted" label="Toggle Sound" @click="toggleSound" />
        <NavigationButton type="home" label="Home" @click="goHome" />
      </div>
    </div>

    <!-- Phaser Canvas Container -->
    <div id="phaser-container" class="phaser-container"></div>

    <!-- Celebration Modal -->
    <CelebrationModal
      :show="showCelebration"
      :puzzle="currentPuzzle"
      @close="showCelebration = false"
      @play-again="handlePlayAgain"
      @next-puzzle="handleNextPuzzle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Phaser from 'phaser';
import { getPuzzleById, getNextPuzzleId, PuzzleItem } from '../data/puzzles';
import { PuzzleScene } from '../games/puzzle/PuzzleScene';
import NavigationButton from '../components/NavigationButton.vue';
import CelebrationModal from '../components/CelebrationModal.vue';
import { audioManager } from '../audio/AudioManager';

const route = useRoute();
const router = useRouter();

const currentPuzzle = ref<PuzzleItem | null>(null);
const showCelebration = ref(false);
const isMuted = ref(audioManager.getMuted());

let phaserGame: Phaser.Game | null = null;

onMounted(() => {
  nextTick(() => {
    loadPuzzleGame();
  });
});

onUnmounted(() => {
  destroyPhaserGame();
});

watch(
  () => route.params.id,
  () => {
    nextTick(() => {
      loadPuzzleGame();
    });
  }
);

function loadPuzzleGame() {
  showCelebration.value = false;
  const puzzleId = (route.params.id as string) || 'fish';
  const puzzle = getPuzzleById(puzzleId);

  if (!puzzle) {
    router.replace('/puzzles');
    return;
  }

  currentPuzzle.value = puzzle;

  destroyPhaserGame();

  const container = document.getElementById('phaser-container');
  if (!container) return;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [], // No default scenes in config; added dynamically
    input: {
      activePointers: 2
    }
  };

  phaserGame = new Phaser.Game(config);

  // Add scene and start with puzzleData payload
  phaserGame.scene.add('PuzzleScene', PuzzleScene, true, { puzzleData: currentPuzzle.value });

  // Listen for puzzle completion event emitted from Phaser
  phaserGame.events.on('puzzle-complete', (completedPuzzle: PuzzleItem) => {
    showCelebration.value = true;
  });
}

function destroyPhaserGame() {
  if (phaserGame) {
    phaserGame.events.off('puzzle-complete');
    phaserGame.destroy(true);
    phaserGame = null;
  }
}

function goBackToSelection() {
  router.push('/puzzles');
}

function goHome() {
  router.push('/');
}

function toggleSound() {
  isMuted.value = audioManager.toggleMute();
}

function handlePlayAgain() {
  showCelebration.value = false;
  if (phaserGame && currentPuzzle.value) {
    phaserGame.scene.stop('PuzzleScene');
    phaserGame.scene.start('PuzzleScene', { puzzleData: currentPuzzle.value });
  }
}

function handleNextPuzzle() {
  showCelebration.value = false;
  if (currentPuzzle.value) {
    const nextId = getNextPuzzleId(currentPuzzle.value.id);
    router.push(`/puzzle/${nextId}`);
  }
}
</script>

<style scoped>
.game-view-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  touch-action: none;
  background: #0288D1;
  z-index: 1000;
}

.game-overlay-header {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1100;
  pointer-events: none;
}

.game-overlay-header :deep(button) {
  pointer-events: auto;
}

.header-right {
  display: flex;
  gap: 12px;
}

.phaser-container {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
