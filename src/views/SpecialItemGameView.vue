<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Control Bar (Slim, fits in landscape and portrait) -->
    <header class="top-nav">
      <div class="nav-left">
        <h1 class="nav-title">🎁 Find My Special Item</h1>
        <!-- Subtle feedback / hint inline pill -->
        <transition name="fade">
          <div v-if="feedbackText" class="feedback-inline" :class="{ 'is-hint': isHintText, 'is-success': isCurrentSuccess }">
            <span class="feedback-icon">{{ isCurrentSuccess ? '🎉' : (isHintText ? '💡' : '😊') }}</span>
            <span class="feedback-message">{{ feedbackText }}</span>
          </div>
        </transition>
      </div>

      <div class="nav-right">
        <!-- Progress counter e.g. 1/15 -->
        <div class="progress-pill" aria-label="Game Progress">
          <span class="progress-num">{{ currentRoundNumber }}/{{ totalDeities }}</span>
        </div>

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

    <!-- Main Game Split Layout: Left (Question/Deity) ~48%, Right (2x2 Answers) ~52% -->
    <main class="game-stage-landscape">
      <!-- LEFT SIDE: Question + Deity card -->
      <section class="left-panel">
        <SpecialItemDeityCard
          ref="deityCardRef"
          :deity="currentRound.targetDeity"
          :matched-item="currentRound.correctItem"
          :is-success="isCurrentSuccess"
          :is-playing-audio="isPlayingAudio"
          :is-hinting="failedAttempts >= 2 && !isCurrentSuccess"
          @next="handleNextRound"
          @play-audio="playQuestionAudio"
        />
      </section>

      <!-- RIGHT SIDE: 2 x 2 Answer Options Grid -->
      <section class="right-panel">
        <div class="options-grid">
          <SpecialItemOptionCard
            v-for="opt in currentRound.options"
            :key="opt.id"
            :ref="el => setOptionRef(el, opt.id)"
            :item="opt"
            :disabled="isCurrentSuccess"
            :is-correct="isCurrentSuccess && opt.id === currentRound.correctItem.id"
            :is-hinting="failedAttempts >= 2 && opt.id === currentRound.correctItem.id"
            @select="handleOptionSelect"
          />
        </div>
      </section>
    </main>

    <!-- Final Game Completion Modal -->
    <SpecialItemCelebrationModal
      :show="showFinalCelebration"
      :deity-list="specialItemDeities"
      @play-again="restartGame"
      @go-home="goHome"
      @close="showFinalCelebration = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { 
  SpecialItemRound, 
  specialItemDeities, 
  createShuffledSpecialItemsDeck, 
  createRoundForDeity 
} from '../data/specialItems';
import { CentralDeity, DeitySpecialItem } from '../data/deities';
import NavigationButton from '../components/NavigationButton.vue';
import SpecialItemDeityCard from '../components/specialItems/SpecialItemDeityCard.vue';
import SpecialItemOptionCard from '../components/specialItems/SpecialItemOptionCard.vue';
import SpecialItemCelebrationModal from '../components/specialItems/SpecialItemCelebrationModal.vue';
import { audioManager } from '../audio/AudioManager';
import confetti from 'canvas-confetti';

const router = useRouter();

const remainingDeityDeck = ref<CentralDeity[]>([]);
const currentRound = ref<SpecialItemRound>(createRoundForDeity(specialItemDeities[0]));
const foundCount = ref(0);
const failedAttempts = ref(0);
const isCurrentSuccess = ref(false);
const isPlayingAudio = ref(false);
const feedbackText = ref('');
const isHintText = ref(false);
const showFinalCelebration = ref(false);
const isMuted = ref(audioManager.getMuted());

const deityCardRef = ref<InstanceType<typeof SpecialItemDeityCard> | null>(null);
const optionRefs = ref<Record<string, InstanceType<typeof SpecialItemOptionCard>>>({});

const totalDeities = computed(() => specialItemDeities.length);
const currentRoundNumber = computed(() => (foundCount.value % specialItemDeities.length) + 1);

let feedbackTimer: number | null = null;
let autoNextTimer: number | null = null;
let initialAudioTimer: number | null = null;

function setOptionRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (el) {
    optionRefs.value[id] = el as InstanceType<typeof SpecialItemOptionCard>;
  }
}

function showFeedback(text: string, isHint: boolean = false, durationMs: number = 2200) {
  if (feedbackTimer) clearTimeout(feedbackTimer);
  feedbackText.value = text;
  isHintText.value = isHint;
  feedbackTimer = window.setTimeout(() => {
    feedbackText.value = '';
    isHintText.value = false;
  }, durationMs);
}

function playQuestionAudio() {
  const audioFile = currentRound.value.questionAudio;
  const questionText = currentRound.value.questionText;

  isPlayingAudio.value = true;
  audioManager.playAudioWithFallback(
    audioFile,
    questionText,
    () => {
      isPlayingAudio.value = true;
    },
    () => {
      isPlayingAudio.value = false;
    }
  );
}

function initDeckAndStart() {
  const lastDeityId = currentRound.value.targetDeity?.id;
  const deck = createShuffledSpecialItemsDeck(lastDeityId);
  remainingDeityDeck.value = deck;
  startNextDeityFromDeck();
}

function startNextDeityFromDeck() {
  if (remainingDeityDeck.value.length === 0) {
    // Deck completed! Trigger celebration modal
    showFinalCelebration.value = true;
    return;
  }

  const nextDeity = remainingDeityDeck.value.shift()!;
  currentRound.value = createRoundForDeity(nextDeity);
  isCurrentSuccess.value = false;
  failedAttempts.value = 0;
  optionRefs.value = {};

  if (initialAudioTimer) clearTimeout(initialAudioTimer);
  initialAudioTimer = window.setTimeout(() => {
    playQuestionAudio();
  }, 400);
}

function handleOptionSelect(opt: DeitySpecialItem) {
  if (isCurrentSuccess.value) return;

  const isCorrect = opt.id === currentRound.value.correctItem.id;

  if (isCorrect) {
    // ── Correct Answer ──
    isCurrentSuccess.value = true;
    foundCount.value++;

    audioManager.playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 }
    });

    const affirmation = `Yes! That's ${currentRound.value.targetDeity.name}'s ${opt.name}!`;
    showFeedback(affirmation, false, 2800);

    // Play pre-recorded Neural MP3 affirmation with TTS fallback
    const successAudio = currentRound.value.targetDeity.audio?.specialItemSuccess || `assets/audio_gungun/item_success_${currentRound.value.targetDeity.id}.mp3`;
    audioManager.playAudioWithFallback(
      successAudio,
      affirmation
    );

    // Auto advance after 2.8 seconds if child doesn't tap "Try Another"
    if (autoNextTimer) clearTimeout(autoNextTimer);
    autoNextTimer = window.setTimeout(() => {
      if (isCurrentSuccess.value) {
        handleNextRound();
      }
    }, 2800);
  } else {
    // ── Incorrect Answer ──
    failedAttempts.value++;
    audioManager.playAudioWithFallback('assets/audio_gungun/ride_try_again.mp3', 'Try again!');

    // Trigger card shake animation
    const ref = optionRefs.value[opt.id];
    if (ref && typeof ref.triggerIncorrectAnimation === 'function') {
      ref.triggerIncorrectAnimation();
    }

    if (failedAttempts.value >= 2) {
      showFeedback(`Hint: Look for ${currentRound.value.targetDeity.name}'s special item!`, true, 2600);
    } else {
      showFeedback("Try again! 😊", false, 1800);
    }
  }
}

function handleNextRound() {
  if (autoNextTimer) clearTimeout(autoNextTimer);
  audioManager.playTap();
  startNextDeityFromDeck();
}

function restartGame() {
  showFinalCelebration.value = false;
  foundCount.value = 0;
  initDeckAndStart();
}

function toggleMute() {
  isMuted.value = audioManager.toggleMute();
}

function goHome() {
  if (autoNextTimer) clearTimeout(autoNextTimer);
  audioManager.playTap();
  audioManager.stopCurrentAudio();
  router.push('/');
}

onMounted(() => {
  initDeckAndStart();
});

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer);
  if (autoNextTimer) clearTimeout(autoNextTimer);
  if (initialAudioTimer) clearTimeout(initialAudioTimer);
  audioManager.stopCurrentAudio();
});

const bgStyle = {
  backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/home_bg.svg')`
};
</script>

<style scoped>
.game-view-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  padding: clamp(6px, 1.2vh, 12px) clamp(8px, 1.8vw, 18px);
  padding-left: max(clamp(8px, 1.8vw, 18px), env(safe-area-inset-left));
  padding-right: max(clamp(8px, 1.8vw, 18px), env(safe-area-inset-right));
  padding-top: max(clamp(6px, 1.2vh, 12px), env(safe-area-inset-top));
  padding-bottom: max(clamp(6px, 1.2vh, 12px), env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* Top Control Bar */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-bottom: clamp(2px, 0.8vh, 6px);
  z-index: 10;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.2vw, 14px);
  min-width: 0;
}

.nav-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.05rem, 3.2vh, 1.55rem);
  font-weight: 700;
  color: #2E7D32;
  margin: 0;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.95);
  white-space: nowrap;
}

.feedback-inline {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #FFF8E1;
  border: 2px solid #FFB300;
  border-radius: 16px;
  padding: 2px 10px;
  box-shadow: 0 2px 6px rgba(255, 179, 0, 0.2);
}

.feedback-inline.is-hint {
  background: #FFF3E0;
  border-color: #FF9800;
}

.feedback-inline.is-success {
  background: #F1F8E9;
  border-color: #4CAF50;
}

.feedback-icon {
  font-size: clamp(0.85rem, 1.8vh, 1.05rem);
}

.feedback-message {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.78rem, 1.8vh, 0.92rem);
  font-weight: 700;
  color: #2E7D32;
  white-space: nowrap;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 10px);
  flex-shrink: 0;
}

.progress-pill {
  background: #FFFFFF;
  border: clamp(2px, 0.4vh, 3px) solid #4CAF50;
  border-radius: 20px;
  padding: clamp(2px, 0.5vh, 4px) clamp(8px, 1.2vw, 12px);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-num {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.9rem, 2.2vh, 1.15rem);
  font-weight: 700;
  color: #2E7D32;
  letter-spacing: 0.04em;
}

/* Landscape Split Stage: Left ~48%, Right ~52% with clean grid */
.game-stage-landscape {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
  align-items: stretch;
  gap: clamp(8px, 1.5vw, 16px);
  padding: 0 clamp(4px, 1vw, 10px);
  box-sizing: border-box;
}

.left-panel {
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 2x2 Options Grid fitting exactly inside right panel */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: clamp(6px, 1.4vh, 12px);
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

/* Portrait Responsive Layout (dual orientation standard) */
@media (orientation: portrait) {
  .game-stage-landscape {
    grid-template-columns: 1fr;
    grid-template-rows: 45fr 55fr;
    gap: clamp(6px, 1.2vh, 12px);
  }

  .nav-title {
    font-size: clamp(0.95rem, 2.5vh, 1.25rem);
  }

  @media (max-width: 480px) {
    .feedback-inline {
      display: none;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
