<template>
  <div class="selection-container">
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
</script>

<style scoped>
.selection-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: url('/assets/backgrounds/home_bg.svg') center top / cover no-repeat;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  max-width: 540px;
  margin: 0 auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.nav-title-group {
  text-align: center;
}

.nav-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1565C0;
  margin: 0;
  line-height: 1;
}

.nav-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #5C6BC0;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding-bottom: 60px;
}
</style>
