<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Control Bar (Slim, fits in landscape) -->
    <header class="top-nav">
      <div class="nav-left">
        <h1 class="nav-title">Gods &amp; Vaahanas</h1>
        <!-- Subtle feedback / hint inline pill -->
        <transition name="fade">
          <div v-if="feedbackText" class="feedback-inline" :class="{ 'is-hint': isHintText }">
            <span class="feedback-icon">{{ isHintText ? '💡' : '🎉' }}</span>
            <span class="feedback-message">{{ feedbackText }}</span>
          </div>
        </transition>
      </div>

      <div class="nav-right">
        <!-- Progress counter e.g. 1/6 -->
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

    <!-- Main Game Split Layout: Left (Question/Deity) ~50%, Right (2x2 Answers) ~50% -->
    <main class="game-stage-landscape">
      <!-- LEFT SIDE: Question + Deity card (fills height proportionally) -->
      <section class="left-panel">
        <DeityCard
          ref="deityCardRef"
          :deity="currentDeity"
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
          <VaahanaOption
            v-for="opt in currentOptions"
            :key="opt.id"
            :ref="el => setOptionRef(el, opt.id)"
            :option="opt"
            :disabled="isCurrentSuccess"
            @select="handleOptionSelect"
          />
        </div>
      </section>
    </main>

    <!-- Portrait Orientation Blocker Screen -->
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
import { ref, computed, onMounted, onBeforeUnmount, ComponentPublicInstance, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  vaahanaData, 
  getRandomVaahanaQuestion, 
  DeityItem, 
  VaahanaOptionItem 
} from '../data/vaahana';
import NavigationButton from '../components/NavigationButton.vue';
import DeityCard from '../components/vaahana/DeityCard.vue';
import VaahanaOption from '../components/vaahana/VaahanaOption.vue';
import VaahanaCelebrationModal from '../components/vaahana/VaahanaCelebrationModal.vue';
import { audioManager } from '../audio/AudioManager';
import confetti from 'canvas-confetti';
import { Smartphone } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const currentDeity = ref<DeityItem>(vaahanaData[0]);
const foundCount = ref(0);
const failedAttempts = ref(0);
const isCurrentSuccess = ref(false);
const isPlayingAudio = ref(false);
const feedbackText = ref('');
const isHintText = ref(false);
const showFinalCelebration = ref(false);
const isMuted = ref(audioManager.getMuted());

const currentOptions = ref<VaahanaOptionItem[]>([]);
const deityCardRef = ref<InstanceType<typeof DeityCard> | null>(null);
const optionRefs = ref<Record<string, InstanceType<typeof VaahanaOption>>>({});

const totalDeities = computed(() => vaahanaData.length);
const currentRoundNumber = computed(() => (foundCount.value % vaahanaData.length) + 1);

let feedbackTimer: number | null = null;

function setOptionRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (el) {
    optionRefs.value[id] = el as InstanceType<typeof VaahanaOption>;
  }
}

function playQuestionAudio() {
  const audioFile = `assets/audio_gungun/ride_q_${currentDeity.value.id}.mp3`;
  const played = audioManager.playAudioFile(
    audioFile,
    () => { isPlayingAudio.value = true; },
    () => { isPlayingAudio.value = false; }
  );

  if (!played) {
    audioManager.speak(
      `Who is ${currentDeity.value.deityName}'s Vaahana?`,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );
  }
}

function startNewRound(specificDeityId?: string) {
  if (feedbackTimer) clearTimeout(feedbackTimer);

  let question;
  if (specificDeityId) {
    const deity = vaahanaData.find(d => d.id === specificDeityId) || vaahanaData[0];
    question = {
      targetDeity: deity,
      options: getRandomVaahanaQuestion(currentDeity.value?.id).options
    };
    // Ensure the correct option is included
    const correctVaahana = deity.correctVaahana;
    if (!question.options.some(opt => opt.id === correctVaahana)) {
      question = getRandomVaahanaQuestion(currentDeity.value?.id);
      question.targetDeity = deity;
    }
  } else {
    question = getRandomVaahanaQuestion(currentDeity.value?.id);
  }

  currentDeity.value = question.targetDeity;
  currentOptions.value = question.options;

  isCurrentSuccess.value = false;
  failedAttempts.value = 0;
  feedbackText.value = '';
  isHintText.value = false;

  // Play pre-recorded question audio when starting a round
  setTimeout(() => {
    playQuestionAudio();
  }, 350);
}

function loadScore() {
  const saved = localStorage.getItem('vaahana_found_count');
  if (saved) {
    foundCount.value = parseInt(saved, 10) || 0;
  }
}

function saveScore() {
  localStorage.setItem('vaahana_found_count', foundCount.value.toString());
}

async function requestLandscapeLock() {
  try {
    const orientation = window.screen?.orientation as any;
    if (orientation && typeof orientation.lock === 'function') {
      await orientation.lock('landscape');
    }
  } catch {
    // Gracefully ignore if not supported by browser
  }
}

onMounted(() => {
  loadScore();
  const deityId = route.params.id as string;
  startNewRound(deityId);
  requestLandscapeLock();
});

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer);
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    startNewRound(newId as string);
  }
});

function goHome() {
  audioManager.playTap();
  router.push('/');
}

function toggleMute() {
  isMuted.value = audioManager.toggleMute();
}

function handleOptionSelect(option: VaahanaOptionItem) {
  checkMatch(option);
}

function checkMatch(option: VaahanaOptionItem) {
  if (isCurrentSuccess.value) return;

  if (option.id === currentDeity.value.correctVaahana) {
    // CORRECT MATCH!
    isCurrentSuccess.value = true;
    foundCount.value++;
    saveScore();

    feedbackText.value = 'Good Job! 🎉';
    isHintText.value = false;

    audioManager.playCelebration();

    // Play pre-recorded success audio (e.g. ride_success_ganesha.mp3)
    const successAudio = `assets/audio_gungun/ride_success_${currentDeity.value.id}.mp3`;
    const played = audioManager.playAudioFile(
      successAudio,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );

    if (!played) {
      audioManager.speak(
        currentDeity.value.voiceText,
        () => { isPlayingAudio.value = true; },
        () => { isPlayingAudio.value = false; }
      );
    }

    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.55 }
    });

  } else {
    // INCORRECT MATCH - Gentle encouragement!
    failedAttempts.value++;
    
    // Trigger shake animation on tapped option card
    const optionComp = optionRefs.value[option.id];
    if (optionComp) {
      optionComp.triggerIncorrectAnimation();
    }

    audioManager.playTap();

    if (failedAttempts.value >= 2) {
      feedbackText.value = currentDeity.value.hintText || 'Try another one! 😊';
      isHintText.value = true;

      // Play pre-recorded hint audio (e.g. ride_hint_ganesha.mp3)
      const hintAudio = `assets/audio_gungun/ride_hint_${currentDeity.value.id}.mp3`;
      const played = audioManager.playAudioFile(
        hintAudio,
        () => { isPlayingAudio.value = true; },
        () => { isPlayingAudio.value = false; }
      );

      if (!played) {
        audioManager.speak(
          `Hmm... ${currentDeity.value.hintText}`,
          () => { isPlayingAudio.value = true; },
          () => { isPlayingAudio.value = false; }
        );
      }
    } else {
      feedbackText.value = 'Try again! 😊';
      isHintText.value = false;

      // Play pre-recorded try again audio (ride_try_again.mp3)
      const tryAgainAudio = `assets/audio_gungun/ride_try_again.mp3`;
      const played = audioManager.playAudioFile(
        tryAgainAudio,
        () => { isPlayingAudio.value = true; },
        () => { isPlayingAudio.value = false; }
      );

      if (!played) {
        audioManager.speak(
          'Try again!',
          () => { isPlayingAudio.value = true; },
          () => { isPlayingAudio.value = false; }
        );
      }
    }

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      if (!isCurrentSuccess.value) {
        feedbackText.value = '';
      }
    }, 2800);
  }
}

function handleNextRound() {
  audioManager.playTap();
  startNewRound();
}

function restartGame() {
  showFinalCelebration.value = false;
  foundCount.value = 0;
  localStorage.removeItem('vaahana_found_count');
  startNewRound();
}

const bgStyle = {
  backgroundImage: `url('${import.meta.env.BASE_URL}assets/backgrounds/home_bg.svg')`
};
</script>

<style scoped>
/* Full viewport strictly landscape container, zero scrollbars */
.game-view-container {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  padding: clamp(6px, 1.4vh, 12px) clamp(10px, 2vw, 20px);
  padding-left: max(clamp(10px, 2vw, 20px), env(safe-area-inset-left));
  padding-right: max(clamp(10px, 2vw, 20px), env(safe-area-inset-right));
  padding-top: max(clamp(6px, 1.4vh, 12px), env(safe-area-inset-top));
  padding-bottom: max(clamp(6px, 1.4vh, 12px), env(safe-area-inset-bottom));
  box-sizing: border-box;
  position: fixed;
  inset: 0;
  user-select: none;
}

/* Top Nav */
.top-nav {
  width: 100%;
  height: clamp(38px, 7.5vh, 52px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: clamp(4px, 1vh, 8px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 16px);
}

.nav-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.2rem, 3.2vh, 1.8rem);
  font-weight: 700;
  color: #C2185B;
  margin: 0;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.95);
  white-space: nowrap;
}

.feedback-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFF3E0;
  border: 2px solid #FF9800;
  border-radius: 16px;
  padding: 3px 10px;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
}

.feedback-inline.is-hint {
  background: #FFF8E1;
  border-color: #F57F17;
}

.feedback-icon {
  font-size: clamp(0.9rem, 2vh, 1.15rem);
}

.feedback-message {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1rem);
  font-weight: 700;
  color: #E65100;
  white-space: nowrap;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
}

.progress-pill {
  background: #FFFFFF;
  border: clamp(2px, 0.5vh, 3px) solid #FF9800;
  border-radius: 20px;
  padding: clamp(3px, 0.7vh, 6px) clamp(10px, 1.5vw, 16px);
  box-shadow: 0 3px 8px rgba(255, 152, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-num {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.4vh, 1.25rem);
  font-weight: 700;
  color: #E65100;
  letter-spacing: 0.05em;
}

/* Landscape Split Stage: Left 50%, Right 50% */
.game-stage-landscape {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: clamp(10px, 1.8vw, 20px);
  box-sizing: border-box;
}

.left-panel {
  flex: 1 1 48%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1 1 52%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 2x2 Options Grid fitting exactly inside right panel */
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: clamp(8px, 1.6vh, 14px);
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
}

/* Portrait Blocker Overlay (shown when orientation is portrait) */
.portrait-guard-overlay {
  display: none;
}

@media (orientation: portrait) {
  .portrait-guard-overlay {
    display: flex;
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: radial-gradient(circle at center, #4FC3F7 0%, #0288D1 100%);
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
  }
}

.rotate-phone-card {
  background: #FFFFFF;
  border: 5px solid #FFCA28;
  border-radius: 32px;
  padding: 32px 24px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
}

.phone-icon-anim {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.device-icon {
  width: 58px;
  height: 58px;
  color: #0288D1;
  animation: phoneRotateAnim 2.2s infinite ease-in-out;
}

.rotate-arrow {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 1.8rem;
  color: #FF9800;
  font-weight: 900;
  animation: arrowSpin 2.2s infinite ease-in-out;
}

@keyframes phoneRotateAnim {
  0% { transform: rotate(0deg); }
  35% { transform: rotate(90deg); }
  65% { transform: rotate(90deg); }
  100% { transform: rotate(0deg); }
}

@keyframes arrowSpin {
  0% { transform: rotate(0deg) scale(0.9); opacity: 0.6; }
  35% { transform: rotate(90deg) scale(1.15); opacity: 1; }
  65% { transform: rotate(90deg) scale(1.15); opacity: 1; }
  100% { transform: rotate(0deg) scale(0.9); opacity: 0.6; }
}

.rotate-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #E65100;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.rotate-desc {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #546E7A;
  margin: 0;
  line-height: 1.35;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
