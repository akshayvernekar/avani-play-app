<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Bar Navigation & Progress -->
    <header class="top-nav">
      <NavigationButton type="back" label="Back to Home" @click="goHome" />

      <div class="nav-center">
        <h1 class="nav-title">Find My Vaahana</h1>
        <GameProgress
          :current-index="currentIndex"
          :total="totalDeities"
          :completed-indices="completedIndices"
        />
      </div>

      <NavigationButton type="audio" label="Sound Toggle" :is-muted="isMuted" @click="toggleMute" />
    </header>

    <!-- Friendly Hint / Feedback Banner -->
    <transition name="fade-slide">
      <div v-if="feedbackText" class="feedback-banner" :class="{ 'is-hint': isHintText }">
        <span class="feedback-icon">{{ isHintText ? '💡' : '😊' }}</span>
        <span class="feedback-message">{{ feedbackText }}</span>
      </div>
    </transition>

    <!-- Center Deity Stage -->
    <main class="game-stage">
      <DeityCard
        ref="deityCardRef"
        :deity="currentDeity"
        :is-success="isCurrentSuccess"
        :is-drag-over="isDragOverDropZone"
        :is-hinting="failedAttempts >= 2 && !isCurrentSuccess"
        @next="handleNextRound"
      />

      <!-- Bottom Animal Options Grid -->
      <div class="options-container" :class="{ 'is-hidden': isCurrentSuccess }">
        <div class="options-grid">
          <VaahanaOption
            v-for="opt in currentOptions"
            :key="opt.id"
            :ref="el => setOptionRef(el, opt.id)"
            :option="opt"
            :disabled="isCurrentSuccess"
            @drag-start="handleDragStart"
            @drag-move="handleDragMove"
            @drag-end="handleDragEnd"
            @select="handleOptionSelect"
          />
        </div>
      </div>
    </main>

    <!-- Final Game Completion Modal -->
    <VaahanaCelebrationModal
      :show="showFinalCelebration"
      :deity-list="vaahanaData"
      @play-again="restartGame"
      @go-home="goHome"
      @close="showFinalCelebration = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { vaahanaData, getRandomVaahanaOptions, DeityItem, VaahanaOptionItem } from '../data/vaahana';
import NavigationButton from '../components/NavigationButton.vue';
import GameProgress from '../components/vaahana/GameProgress.vue';
import DeityCard from '../components/vaahana/DeityCard.vue';
import VaahanaOption from '../components/vaahana/VaahanaOption.vue';
import VaahanaCelebrationModal from '../components/vaahana/VaahanaCelebrationModal.vue';
import { audioManager } from '../audio/AudioManager';
import confetti from 'canvas-confetti';

const router = useRouter();

const currentIndex = ref(0);
const completedIndices = ref<number[]>([]);
const failedAttempts = ref(0);
const isCurrentSuccess = ref(false);
const isDragOverDropZone = ref(false);
const feedbackText = ref('');
const isHintText = ref(false);
const showFinalCelebration = ref(false);
const isMuted = ref(audioManager.getMuted());

const currentOptions = ref<VaahanaOptionItem[]>([]);
const deityCardRef = ref<InstanceType<typeof DeityCard> | null>(null);
const optionRefs = ref<Record<string, InstanceType<typeof VaahanaOption>>>({});

let autoAdvanceTimer: number | null = null;
let feedbackTimer: number | null = null;

const totalDeities = computed(() => vaahanaData.length);
const currentDeity = computed<DeityItem>(() => vaahanaData[currentIndex.value]);

function setOptionRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (el) {
    optionRefs.value[id] = el as InstanceType<typeof VaahanaOption>;
  }
}

function loadRound(index: number) {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  if (feedbackTimer) clearTimeout(feedbackTimer);

  currentIndex.value = index;
  isCurrentSuccess.value = false;
  isDragOverDropZone.value = false;
  failedAttempts.value = 0;
  feedbackText.value = '';
  isHintText.value = false;

  currentOptions.value = getRandomVaahanaOptions(currentDeity.value.correctVaahana);

  // Spoken prompt when starting a round
  setTimeout(() => {
    audioManager.speak(`Who is ${currentDeity.value.deityName}'s Vaahana?`);
  }, 400);
}

onMounted(() => {
  loadRound(0);
});

function goHome() {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  router.push('/');
}

function toggleMute() {
  isMuted.value = audioManager.toggleMute();
}

function isOverDropZone(x: number, y: number): boolean {
  if (!deityCardRef.value || !deityCardRef.value.dropZoneRef) return false;
  
  const rect = deityCardRef.value.dropZoneRef.getBoundingClientRect();
  // Expand hit radius by 30px for toddlers
  const padding = 30;
  return (
    x >= rect.left - padding &&
    x <= rect.right + padding &&
    y >= rect.top - padding &&
    y <= rect.bottom + padding
  );
}

function handleDragStart(_option: VaahanaOptionItem) {
  isDragOverDropZone.value = false;
}

function handleDragMove(x: number, y: number) {
  isDragOverDropZone.value = isOverDropZone(x, y);
}

function handleDragEnd(option: VaahanaOptionItem, endX: number, endY: number) {
  const droppedOnTarget = isOverDropZone(endX, endY);
  isDragOverDropZone.value = false;

  if (droppedOnTarget) {
    checkMatch(option);
  }
}

function handleOptionSelect(option: VaahanaOptionItem) {
  checkMatch(option);
}

function checkMatch(option: VaahanaOptionItem) {
  if (isCurrentSuccess.value) return;

  if (option.id === currentDeity.value.correctVaahana) {
    // CORRECT MATCH!
    isCurrentSuccess.value = true;
    if (!completedIndices.value.includes(currentIndex.value)) {
      completedIndices.value.push(currentIndex.value);
    }

    feedbackText.value = '🎉 Good Job! 🎉';
    isHintText.value = false;

    audioManager.playCelebration();
    audioManager.speak(currentDeity.value.voiceText);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto advance after 2.6 seconds
    autoAdvanceTimer = window.setTimeout(() => {
      handleNextRound();
    }, 2600);

  } else {
    // INCORRECT MATCH - Gentle encouragement!
    failedAttempts.value++;
    
    // Trigger return shake animation on card
    const optionComp = optionRefs.value[option.id];
    if (optionComp) {
      optionComp.triggerIncorrectAnimation();
    }

    audioManager.playTap();

    if (failedAttempts.value >= 2) {
      feedbackText.value = currentDeity.value.hintText || 'Try another one! 😊';
      isHintText.value = true;
      audioManager.speak(`Hmm... ${currentDeity.value.hintText}`);
    } else {
      feedbackText.value = 'Try again! 😊';
      isHintText.value = false;
      audioManager.speak('Try again! 😊');
    }

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      if (!isCurrentSuccess.value) {
        feedbackText.value = '';
      }
    }, 3000);
  }
}

function handleNextRound() {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);

  if (currentIndex.value < totalDeities.value - 1) {
    loadRound(currentIndex.value + 1);
  } else {
    // All 6 completed! Show final celebration!
    showFinalCelebration.value = true;
  }
}

function restartGame() {
  showFinalCelebration.value = false;
  completedIndices.value = [];
  loadRound(0);
}

const bgStyle = {
  backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/home_bg.svg')`
};
</script>

<style scoped>
.game-view-container {
  min-height: 100vh;
  min-height: 100dvh;
  background: center top / cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 24px 16px;
  box-sizing: border-box;
  max-width: 540px;
  margin: 0 auto;
}

/* Top Nav */
.top-nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.nav-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #C2185B;
  margin: 0;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.9);
}

/* Feedback Banner */
.feedback-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFF3E0;
  border: 3px solid #FF9800;
  border-radius: 20px;
  padding: 8px 18px;
  margin-bottom: 6px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
}

.feedback-banner.is-hint {
  background: #FFF8E1;
  border-color: #F57F17;
}

.feedback-icon {
  font-size: 1.2rem;
}

.feedback-message {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #E65100;
}

/* Stage */
.game-stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Options Grid */
.options-container {
  width: 100%;
  margin-top: 10px;
  transition: opacity 0.2s, transform 0.2s;
}

.options-container.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(10px);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
