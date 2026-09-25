<template>
  <div class="selection-container" :style="bgStyle">
    <!-- Top Navigation Bar -->
    <header class="top-nav">
      <NavigationButton type="back" label="Back to Home" @click="goHome" />
      
      <div class="nav-title-group">
        <h1 class="nav-title">Gods & Vaahanas</h1>
        <span class="nav-subtitle">Choose a Deity</span>
      </div>

      <NavigationButton type="audio" label="Sound Toggle" :is-muted="isMuted" @click="toggleMute" />
    </header>

    <!-- Deity Grid -->
    <main class="deity-grid">
      <div 
        v-for="deity in vaahanaData" 
        :key="deity.id" 
        class="deity-select-card"
        @click="handleSelectDeity(deity.id)"
      >
        <div class="card-img-wrapper">
          <img :src="deity.deityImage" :alt="deity.deityName" class="deity-card-img" />
          <span class="completed-star" v-if="completedIds.includes(deity.id)">⭐</span>
        </div>
        <span class="deity-card-name">{{ deity.deityName }}</span>
      </div>
    </main>

    <!-- Final Celebration Modal if all completed or manually triggered -->
    <VaahanaCelebrationModal
      :show="showFinalCelebration"
      :deity-list="vaahanaData"
      @play-again="restartAll"
      @go-home="goHome"
      @close="showFinalCelebration = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { vaahanaData } from '../data/vaahana';
import NavigationButton from '../components/NavigationButton.vue';
import VaahanaCelebrationModal from '../components/vaahana/VaahanaCelebrationModal.vue';
import { audioManager } from '../audio/AudioManager';

const router = useRouter();
const isMuted = ref(audioManager.getMuted());
const completedIds = ref<string[]>([]);
const showFinalCelebration = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('vaahana_completed');
  if (saved) {
    try {
      completedIds.value = JSON.parse(saved);
      if (completedIds.value.length === vaahanaData.length) {
        showFinalCelebration.value = true;
      }
    } catch {
      completedIds.value = [];
    }
  }
});

function goHome() {
  audioManager.playTap();
  router.push('/');
}

function toggleMute() {
  isMuted.value = audioManager.toggleMute();
}

function handleSelectDeity(id: string) {
  audioManager.playTap();
  router.push(`/vaahana/${id}`);
}

function restartAll() {
  completedIds.value = [];
  localStorage.removeItem('vaahana_completed');
  showFinalCelebration.value = false;
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
  color: #C2185B;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.9);
}

.nav-subtitle {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1.05rem);
  font-weight: 600;
  color: #E65100;
}

.deity-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(10px, 2vh, 16px);
  padding-bottom: 30px;
}

@media (min-aspect-ratio: 4/3) and (min-width: 600px) {
  .deity-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.deity-select-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px 14px 12px;
  border-radius: 26px;
  background: radial-gradient(circle, #FFFDE7 0%, #FFF3E0 100%);
  border: 4px solid #FFB300;
  box-shadow: 0 10px 24px rgba(255, 143, 0, 0.15);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.18s ease;
}

.deity-select-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 14px 28px rgba(255, 143, 0, 0.25);
}

.deity-select-card:active {
  transform: scale(0.94) translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
}

.deity-card-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
}

.completed-star {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 1.4rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.deity-card-name {
  margin-top: 10px;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #E65100;
  text-align: center;
}
</style>
