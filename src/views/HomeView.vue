<template>
  <div class="home-container" :style="bgStyle">
    <!-- Header Section -->
    <header class="home-header">
      <div class="title-wrap">
        <h1 class="main-title">
          <span>Avani's</span>
          <span class="sun-icon">☀️</span>
        </h1>
        <h1 class="sub-title">Little World</h1>
      </div>
      <p class="tagline">
        <span>Play</span>
        <span class="heart">❤️</span>
        <span>Learn</span>
        <span class="heart">❤️</span>
        <span>Grow</span>
      </p>
    </header>

    <!-- Game Tiles Grid -->
    <main class="tiles-grid">
      <GameTile 
        v-for="game in games"
        :key="game.id"
        :game="game"
        @select="handleSelectGame"
      />
    </main>

    <!-- Footer -->
    <footer class="home-footer">
      <button class="settings-btn" aria-label="Settings" @click="handleSettings">
        <Settings class="settings-icon" />
      </button>
      
      <div class="made-with">
        <span>Made with</span>
        <span class="heart">❤️</span>
        <span>for Avani</span>
      </div>
    </footer>

    <!-- Coming Soon Modal -->
    <ComingSoonModal 
      :show="showComingSoon"
      :message="comingSoonMessage"
      @close="showComingSoon = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { games, GameCategory } from '../data/games';
import GameTile from '../components/GameTile.vue';
import ComingSoonModal from '../components/ComingSoonModal.vue';
import { Settings } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';

const router = useRouter();

const showComingSoon = ref(false);
const comingSoonMessage = ref('');

function handleSelectGame(game: GameCategory) {
  if (game.enabled) {
    router.push(game.route || '/puzzles');
  } else {
    comingSoonMessage.value = game.comingSoonText || `${game.title} games are coming soon!`;
    showComingSoon.value = true;
  }
}

function handleSettings() {
  audioManager.playTap();
  const isMuted = audioManager.toggleMute();
  alert(isMuted ? "Audio Sound Muted 🔇" : "Audio Sound Enabled 🔊");
}

const bgStyle = {
  backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/home_bg.svg')`
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: center top / cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 24px 20px;
  box-sizing: border-box;
  max-width: 540px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.8));
}

.title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.95;
}

.main-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 3.2rem;
  font-weight: 700;
  color: #FF4081;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 4px 12px rgba(255, 64, 129, 0.2), 0 0 10px #FFFFFF;
}

.sun-icon {
  font-size: 2.8rem;
  animation: spinSlow 12s linear infinite;
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sub-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #651FFF;
  margin: 0;
  text-shadow: 0 4px 12px rgba(101, 31, 255, 0.2), 0 0 10px #FFFFFF;
}

.tagline {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1A237E;
  margin: 10px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.9);
}

.heart {
  color: #FF4081;
  font-size: 1.1rem;
}

/* Grid Layout */
.tiles-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

/* Footer */
.home-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
}

.settings-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3.5px solid #29B6F6;
  color: #0288D1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s;
}

.settings-btn:active {
  transform: scale(0.92);
}

.settings-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2.5px;
}

.made-with {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
