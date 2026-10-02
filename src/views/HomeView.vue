<template>
  <div class="home-screen-wrap">
    <!-- Dedicated Background Layer (Stage 1: Softened, ~30% reduced visual intensity) -->
    <div class="home-bg-layer" :style="bgStyle" aria-hidden="true"></div>
    <div class="home-bg-overlay" aria-hidden="true"></div>

    <div class="home-container">
      
      <!-- Top-Right Settings Button -->
      <button 
        class="top-settings-btn" 
        aria-label="Toggle Audio Sound" 
        title="Toggle Sound"
        @click="handleSettings"
      >
        <Settings class="settings-icon" />
      </button>

      <!-- Top Header: Large Deva Loka Logo Image -->
      <header class="home-header">
        <div class="logo-wrap">
          <img 
            :src="logoUrl" 
            alt="Deva Loka - Play • Discover • Celebrate" 
            class="devaloka-logo-img"
          />
        </div>
      </header>

      <!-- Main Content: Girl in Bottom-Left, Games in Center/Right -->
      <main class="home-content">
        
        <!-- Guide Region: Indian Girl Mascot anchored in Bottom-Left (Purely Visual, Non-interactive) -->
        <section class="guide-region" aria-hidden="true">
          <div class="guide-img-container">
            <img 
              :src="girlAssetUrl" 
              alt=""
              class="guide-character-img"
              loading="eager"
            />
            <div class="guide-ground-shadow"></div>
          </div>
        </section>

        <!-- Games Region: 4 Games (Puja, God, Ride, Special Thing) -->
        <section class="games-region" aria-label="Deva Loka Games">
          <div class="games-grid">
            <GameTile 
              v-for="game in activeGames"
              :key="game.id"
              :game="game"
              :class="`game-card-${game.id}`"
              @select="handleSelectGame"
            />
          </div>
        </section>

      </main>

      <!-- Middle Bottom: Made with Love for Avani (Centered Pill) -->
      <footer class="home-footer">
        <div class="made-with-pill">
          <span>Made with</span>
          <span class="heart" aria-hidden="true">❤️</span>
          <span>for Avani</span>
        </div>
      </footer>

      <!-- Coming Soon Modal for unreleased games -->
      <ComingSoonModal 
        :show="showComingSoon"
        :message="comingSoonMessage"
        @close="showComingSoon = false"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { games, GameCategory } from '../data/games';
import GameTile from '../components/GameTile.vue';
import ComingSoonModal from '../components/ComingSoonModal.vue';
import { Settings } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';

const router = useRouter();

// Filter for exactly the 4 main games (Puzzles is omitted from the home grid)
const activeGames = computed(() => {
  const allowedIds = ['puja', 'identify-god', 'vaahana', 'special-item'];
  return games.filter(g => allowedIds.includes(g.id));
});

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

const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';

const logoUrl = computed(() => {
  return `${base}assets/backgrounds/devaloka_logo.webp`;
});

const girlAssetUrl = computed(() => {
  return `${base}assets/backgrounds/indian_girl_character.webp`;
});

const bgStyle = computed(() => {
  return {
    '--bg-landscape': `url('${base}assets/backgrounds/devaloka_landscape.webp')`,
    '--bg-portrait': `url('${base}assets/backgrounds/devaloka_portait.webp')`
  };
});
</script>

<style scoped>
/* ========================================================
   BASE CONTAINER & BACKGROUND STYLING
   ======================================================== */
.home-screen-wrap {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  inset: 0;
  overflow: hidden;
  user-select: none;
}

/* ========================================================
   STAGE 1: SOFTER BACKGROUND LAYER
   - ~25-35% reduced visual intensity
   - Slightly less saturated, slightly lower contrast
   - Gentle atmospheric softness
   - Foreground (girl, logo, cards) remains 100% vibrant
   ======================================================== */
.home-bg-layer {
  position: absolute;
  inset: -8px; /* Bleed past edges to keep blur crisp */
  background-image: var(--bg-landscape);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: background-image 0.25s ease;
  pointer-events: none;
  z-index: 1;
  filter: saturate(0.70) contrast(0.78) brightness(0.97) blur(0.8px);
  transform: translateZ(0);
}

@media (orientation: portrait) {
  .home-bg-layer {
    background-image: var(--bg-portrait);
  }
}

.home-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 252, 245, 0.08); /* Gentle warm ethereal veil */
  pointer-events: none;
  z-index: 2;
}

.home-container {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: max(clamp(8px, 2vw, 20px), env(safe-area-inset-left));
  padding-right: max(clamp(8px, 2vw, 20px), env(safe-area-inset-right));
  padding-top: max(clamp(6px, 1.2vh, 14px), env(safe-area-inset-top));
  padding-bottom: max(clamp(4px, 1vh, 12px), env(safe-area-inset-bottom));
  margin: 0 auto;
}

/* ========================================================
   TOP-RIGHT SETTINGS BUTTON (Blue circle, white border)
   ======================================================== */
.top-settings-btn {
  position: absolute;
  top: max(clamp(8px, 1.6vh, 18px), env(safe-area-inset-top));
  right: max(clamp(10px, 2.5vw, 22px), env(safe-area-inset-right));
  width: clamp(38px, 5.8vh, 48px);
  height: clamp(38px, 5.8vh, 48px);
  border-radius: 50%;
  background: #0288D1;
  border: clamp(2.5px, 0.4vh, 3.5px) solid #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 25;
  -webkit-tap-highlight-color: transparent;
}

.top-settings-btn:hover {
  transform: scale(1.08);
}

.top-settings-btn:active {
  transform: scale(0.92);
}

.settings-icon {
  width: clamp(20px, 3vh, 26px);
  height: clamp(20px, 3vh, 26px);
  stroke-width: 2.4px;
}

/* ========================================================
   HEADER / DEVA LOKA LOGO (Substantially larger)
   ======================================================== */
.home-header {
  text-align: center;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* ========================================================
   PORTRAIT MODE
   - Logo: 55-70% of viewport width
   - Girl: Large (30-40% width), anchored to BOTTOM-LEFT
   - Games: Centered/Right in 1-column stack (never covers girl)
   ======================================================== */
@media (orientation: portrait) {
  .home-container {
    max-width: 520px;
    padding-left: max(clamp(8px, 2.5vw, 16px), env(safe-area-inset-left));
    padding-right: max(clamp(8px, 2.5vw, 16px), env(safe-area-inset-right));
  }

  .home-header {
    margin-top: clamp(2px, 0.6vh, 6px);
    margin-bottom: clamp(2px, 0.4vh, 6px);
  }

  .devaloka-logo-img {
    width: clamp(220px, 64vw, 350px); /* 55-70% of viewport width */
    max-height: clamp(70px, 13vh, 110px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.22));
  }

  .home-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    min-height: 0;
    position: relative;
    box-sizing: border-box;
  }

  /* ========================================================
     GIRL (PORTRAIT): FULL BODY SHOWN
     - Head to toe: Full head, face, braids, both arms, both hands
       (extended hand NOT cropped!), full dress, both feet.
     - Anchored to bottom-left with ground shadow.
     - Non-interactive (pointer-events: none).
     ======================================================== */
  .guide-region {
    position: absolute;
    bottom: 0;
    left: max(clamp(0px, 0.8vw, 6px), env(safe-area-inset-left));
    width: clamp(140px, 40vw, 225px);
    height: clamp(210px, 48vh, 340px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    pointer-events: none; /* Purely visual guide, no clicks/taps */
    user-select: none;
    z-index: 4;
    overflow: visible; /* Never crop hands or feet */
  }

  .guide-img-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    pointer-events: none;
  }

  .guide-character-img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain; /* Full character preserved cleanly without cropping */
    object-position: bottom left;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.24));
    pointer-events: none;
    user-select: none;
    margin: 0;
  }

  .guide-ground-shadow {
    position: absolute;
    bottom: 2px;
    left: 8%;
    width: 76%;
    height: clamp(8px, 1.5vh, 12px);
    background: radial-gradient(ellipse at center, rgba(30, 20, 10, 0.36) 0%, rgba(30, 20, 10, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  /* GAMES REGION: Stacked vertically on center/right with breathing room from right edge */
  .games-region {
    width: auto;
    margin-left: auto;
    margin-right: clamp(10px, 3.2vw, 24px); /* Moves cards slightly left toward center */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 5;
    box-sizing: border-box;
    padding-right: clamp(4px, 1.2vw, 10px);
  }

  /* Narrow portrait: single-column vertical stack of squarish cards */
  .games-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 1.2vh, 10px);
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  .game-tile {
    /* Slightly increased by 5-10% for improved prominence and comfortable tapping */
    height: clamp(98px, 15.8vh, 134px);
    width: auto; /* Derived from aspect-ratio: 1.05 / 1 in GameTile.vue */
    max-width: clamp(110px, 32vw, 152px);
  }
}

/* Wide Portrait (Tablets >= 560px) */
@media (orientation: portrait) and (min-width: 560px) {
  .home-container {
    max-width: 720px;
  }

  .devaloka-logo-img {
    width: clamp(290px, 54vw, 420px);
  }

  .guide-region {
    position: relative;
    flex: 0 0 clamp(190px, 32vw, 270px);
    width: clamp(190px, 32vw, 270px);
    height: 100%;
    overflow: visible;
  }

  .guide-character-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: bottom center;
  }

  .games-region {
    width: auto;
    max-width: 480px;
    margin-left: 0;
    flex: 1;
    align-items: center;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(8px, 1.5vh, 14px);
    max-width: 460px;
    justify-items: center;
  }

  .game-tile {
    height: clamp(110px, 18vh, 150px);
    width: auto;
    max-width: 170px;
  }
}

/* ========================================================
   LANDSCAPE MODE (Desktop, Tablet, Mobile Landscape)
   - Logo: 25-35% of viewport width
   - Girl on left (preserved)
   - 4 games on right in 2x2 grid of squarish cards
   ======================================================== */
@media (orientation: landscape) {
  .home-container {
    max-width: 1240px;
    padding-top: max(clamp(4px, 1vh, 10px), env(safe-area-inset-top));
    padding-bottom: max(clamp(4px, 0.8vh, 10px), env(safe-area-inset-bottom));
  }

  .home-header {
    margin-top: 0;
    margin-bottom: clamp(1px, 0.4vh, 4px);
  }

  .devaloka-logo-img {
    width: clamp(240px, 28vw, 360px); /* 25-35% of viewport width */
    max-height: clamp(60px, 13vh, 95px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.2));
  }

  .home-content {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    min-height: 0;
    gap: clamp(16px, 3vw, 36px);
    margin-bottom: clamp(2px, 0.4vh, 4px);
  }

  /* LEFT REGION: Preserved left-side placement for girl */
  .guide-region {
    flex: 0 0 clamp(160px, 24vw, 275px);
    width: clamp(160px, 24vw, 275px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    pointer-events: none;
    user-select: none;
    z-index: 5;
  }

  .guide-img-container {
    width: 100%;
    max-height: clamp(180px, 58vh, 400px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  .guide-character-img {
    width: 100%;
    height: auto;
    max-height: clamp(170px, 56vh, 380px);
    object-fit: contain;
    filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.22));
    pointer-events: none;
    user-select: none;
  }

  .guide-ground-shadow {
    width: 68%;
    height: clamp(8px, 1.8vh, 14px);
    background: radial-gradient(ellipse at center, rgba(30, 20, 10, 0.32) 0%, rgba(30, 20, 10, 0) 70%);
    border-radius: 50%;
    margin-top: -5px;
    pointer-events: none;
  }

  /* RIGHT REGION: 4 games in 2x2 grid of squarish cards */
  .games-region {
    flex: 1;
    max-width: clamp(420px, 56vw, 640px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(9px, 2vh, 18px);
    width: 100%;
    max-width: 550px;
    align-content: center;
    justify-items: center;
  }

  .game-tile {
    /* Slightly increased by 5-10% */
    height: clamp(124px, 25.5vh, 178px);
    width: auto; /* Derived from aspect-ratio: 1.05 / 1 in GameTile.vue */
    max-width: clamp(136px, 28vw, 195px);
  }
}

/* ========================================================
   COMPACT SCREEN ADJUSTMENTS (Short viewports / small phones)
   ======================================================== */
@media (max-height: 480px) and (orientation: landscape) {
  .devaloka-logo-img {
    max-height: 46px;
    width: clamp(190px, 24vw, 260px);
  }
  .guide-character-img {
    max-height: 62vh;
  }
  .games-grid {
    gap: 5px;
  }
}

@media (max-height: 670px) and (orientation: portrait) {
  .devaloka-logo-img {
    width: clamp(200px, 60vw, 290px);
    max-height: 68px;
  }
  .guide-region {
    height: clamp(200px, 46vh, 320px);
  }
  .games-grid {
    gap: 4px;
  }
}

/* ========================================================
   MIDDLE BOTTOM FOOTER PILL: "Made with ❤️ for Avani"
   ======================================================== */
.home-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: clamp(2px, 0.5vh, 6px);
  z-index: 10;
  flex-shrink: 0;
}

.made-with-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #FFF4E3;
  border: clamp(2px, 0.35vh, 2.5px) solid #FFCC80;
  border-radius: 999px;
  padding: clamp(2px, 0.5vh, 5px) clamp(14px, 3vw, 22px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.75rem, 1.5vh, 0.9rem);
  font-weight: 700;
  color: #4E342E;
  user-select: none;
}

.heart {
  color: #E53935;
  font-size: 1em;
  display: inline-block;
}
</style>
