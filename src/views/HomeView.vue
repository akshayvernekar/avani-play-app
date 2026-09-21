<template>
  <div class="home-container">
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

    <!-- Banner Graphic -->
    <div class="hero-banner">
      <div class="hero-illustration">
        <div class="character-girl">👧🏻</div>
        <div class="character-puppy">🐶</div>
        <div class="rainbow-mini">🌈</div>
      </div>
    </div>

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
    router.push('/puzzles');
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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(180deg, #E0F7FA 0%, #FFF9C4 50%, #E8F5E9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 20px 20px;
  box-sizing: border-box;
  max-width: 540px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 12px;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.95;
}

.main-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #FF5252;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 4px 10px rgba(255, 82, 82, 0.15);
}

.sun-icon {
  font-size: 2.4rem;
  animation: spinSlow 12s linear infinite;
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sub-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 2.6rem;
  font-weight: 700;
  color: #7E57C2;
  margin: 0;
  text-shadow: 0 4px 10px rgba(126, 87, 194, 0.15);
}

.tagline {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #5C6BC0;
  margin: 8px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.heart {
  color: #FF5252;
  font-size: 0.95rem;
}

/* Hero Illustration Graphic */
.hero-banner {
  width: 100%;
  background: linear-gradient(180deg, #A5D6A7 0%, #81C784 100%);
  border-radius: 32px;
  border: 4px solid #FFFFFF;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.hero-illustration {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 3.8rem;
}

.character-girl {
  animation: bounceSlow 2s infinite ease-in-out alternate;
}
.character-puppy {
  font-size: 3.2rem;
  animation: bounceSlow 2s infinite ease-in-out alternate;
  animation-delay: 0.3s;
}
.rainbow-mini {
  font-size: 3rem;
}

@keyframes bounceSlow {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}

/* Grid Layout */
.tiles-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3px solid #B0BEC5;
  color: #546E7A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s;
}

.settings-btn:active {
  transform: scale(0.92);
}

.settings-icon {
  width: 22px;
  height: 22px;
}

.made-with {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #78909C;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
