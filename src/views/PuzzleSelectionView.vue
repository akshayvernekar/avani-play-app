<template>
  <div class="selection-container" :style="bgStyle">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <NavigationButton type="back" label="Back to Home" @click="goHome" />
      
      <div class="nav-title-group">
        <h1 class="nav-title">Puzzles</h1>
        <span class="nav-subtitle">Choose a puzzle</span>
      </div>

      <NavigationButton type="home" label="Home" @click="goHome" />
    </header>

    <!-- Puzzle Grid -->
    <main class="puzzle-grid">
      <PuzzleCard
        v-for="puzzle in puzzles"
        :key="puzzle.id"
        :puzzle="puzzle"
        @select="handleSelectPuzzle"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { puzzles, PuzzleItem } from '../data/puzzles';
import NavigationButton from '../components/NavigationButton.vue';
import PuzzleCard from '../components/PuzzleCard.vue';

const router = useRouter();

function goHome() {
  router.push('/');
}

function handleSelectPuzzle(puzzle: PuzzleItem) {
  router.push(`/puzzle/${puzzle.id}`);
}

const bgStyle = {
  backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/home_bg.svg')`
};
</script>

<style scoped>
.selection-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  padding: clamp(10px, 2vh, 20px);
  padding-left: max(clamp(10px, 2vh, 20px), env(safe-area-inset-left));
  padding-right: max(clamp(10px, 2vh, 20px), env(safe-area-inset-right));
  padding-top: max(clamp(10px, 2vh, 20px), env(safe-area-inset-top));
  padding-bottom: max(clamp(10px, 2vh, 20px), env(safe-area-inset-bottom));
  box-sizing: border-box;
  max-width: 900px;
  margin: 0 auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(12px, 2vh, 24px);
}

.nav-title-group {
  text-align: center;
}

.nav-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.4rem, 4vh, 2.2rem);
  font-weight: 700;
  color: #1565C0;
  margin: 0;
  line-height: 1;
}

.nav-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1.05rem);
  font-weight: 600;
  color: #5C6BC0;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(10px, 2vh, 16px);
  padding-bottom: 40px;
}

@media (min-aspect-ratio: 4/3) and (min-width: 600px) {
  .puzzle-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
