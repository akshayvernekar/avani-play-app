<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Control Bar (Slim, fits in landscape) -->
    <header class="top-nav">
      <div class="nav-left">
        <h1 class="nav-title">🛕 Identify the God</h1>
        <!-- Subtle feedback / hint inline pill -->
        <transition name="fade">
          <div v-if="feedbackText" class="feedback-inline" :class="{ 'is-hint': isHintText, 'is-success': isAnswered }">
            <span class="feedback-icon">{{ isAnswered ? '🎉' : (isHintText ? '💡' : '😊') }}</span>
            <span class="feedback-message">{{ feedbackText }}</span>
          </div>
        </transition>
      </div>

      <div class="nav-right">
        <!-- Progress counter e.g. 1/6 -->
        <div class="progress-pill" aria-label="Gods Found Progress">
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

    <!-- Main Game Split Layout: Left (Question/Speaker) ~46%, Right (2x2 Deity Options) ~54% -->
    <main class="game-stage-landscape">
      <!-- LEFT SIDE: Question Card with prominent speaker & Try New button on success -->
      <section class="left-panel">
        <div class="question-panel" :class="{ 'is-success': isAnswered }">
          <div class="speaker-section">
            <button 
              class="speaker-button"
              :class="{ 'is-playing': isPlayingAudio }"
              aria-label="Replay Question Audio"
              type="button"
              @click="playQuestionAudio"
            >
              <div class="pulse-ring ring-1"></div>
              <div class="pulse-ring ring-2"></div>
              <Volume2 class="speaker-icon" :class="{ 'bounce': isPlayingAudio }" />
            </button>
            <span class="speaker-hint">Tap to listen</span>
          </div>

          <div class="question-content">
            <p class="question-prompt">Can you find?</p>
            <h2 class="target-question-text">"{{ targetDeity.questionText }}"</h2>
          </div>

          <!-- Try New Button or Success badge inside left panel -->
          <div class="bottom-action-area">
            <transition name="pop" mode="out-in">
              <div v-if="isAnswered" class="success-action-wrap">
                <div class="celebration-tag">
                  <span>⭐ Great Job! ⭐</span>
                </div>
                <button class="try-new-button" type="button" @click="handleTryNew">
                  <Sparkles class="try-new-icon" />
                  <span>Try New God</span>
                </button>
              </div>
              <div v-else class="hint-tag">
                <span>Select the matching God 👉</span>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- RIGHT SIDE: 2 x 2 Deity Options Grid -->
      <section class="right-panel">
        <div class="options-grid">
          <DeityOptionCard
            v-for="deity in currentOptions"
            :key="deity.id"
            :ref="el => setOptionRef(el, deity.id)"
            :deity="deity"
            :disabled="isAnswered"
            :is-correct="isAnswered && deity.id === targetDeity.id"
            :is-hinting="incorrectAttempts >= 2 && deity.id === targetDeity.id"
            @select="handleSelectOption"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { 
  DeityInfo, 
  getRandomIdentifyGodQuestion, 
  identifyGodDeities 
} from '../data/identifyGod';
import NavigationButton from '../components/NavigationButton.vue';
import DeityOptionCard from '../components/identifyGod/DeityOptionCard.vue';
import { Sparkles, Volume2, Smartphone } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';
import confetti from 'canvas-confetti';

const router = useRouter();

const targetDeity = ref<DeityInfo>(identifyGodDeities[0]);
const currentOptions = ref<DeityInfo[]>([]);
const isAnswered = ref(false);
const isPlayingAudio = ref(false);
const incorrectAttempts = ref(0);
const feedbackText = ref('');
const isHintText = ref(false);
const foundCount = ref(0);
const isMuted = ref(audioManager.getMuted());

const totalDeities = computed(() => identifyGodDeities.length);
const currentRoundNumber = computed(() => (foundCount.value % identifyGodDeities.length) + 1);

const optionRefs = ref<Record<string, InstanceType<typeof DeityOptionCard>>>({});

let feedbackTimer: number | null = null;

function setOptionRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (el) {
    optionRefs.value[id] = el as InstanceType<typeof DeityOptionCard>;
  }
}

function startNewRound() {
  if (feedbackTimer) clearTimeout(feedbackTimer);

  const question = getRandomIdentifyGodQuestion(targetDeity.value?.id);
  targetDeity.value = question.targetDeity;
  currentOptions.value = question.options;

  isAnswered.value = false;
  incorrectAttempts.value = 0;
  feedbackText.value = '';
  isHintText.value = false;

  // Play question audio automatically when round starts
  setTimeout(() => {
    playQuestionAudio();
  }, 350);
}

function playQuestionAudio() {
  const audioFile = `assets/audio_gungun/find_god_${targetDeity.value.id}.mp3`;
  const played = audioManager.playAudioFile(
    audioFile,
    () => { isPlayingAudio.value = true; },
    () => { isPlayingAudio.value = false; }
  );

  if (!played) {
    audioManager.speak(
      targetDeity.value.questionText,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );
  }
}

function handleSelectOption(selectedDeity: DeityInfo) {
  if (isAnswered.value) return;

  if (selectedDeity.id === targetDeity.value.id) {
    // CORRECT ANSWER!
    isAnswered.value = true;
    foundCount.value++;
    saveScore();

    feedbackText.value = 'Good Job! 🎉';
    isHintText.value = false;

    audioManager.playCelebration();
    const successAudio = `assets/audio_gungun/find_god_success.mp3`;
    const played = audioManager.playAudioFile(
      successAudio,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );

    if (!played) {
      audioManager.speak(
        targetDeity.value.successText,
        () => { isPlayingAudio.value = true; },
        () => { isPlayingAudio.value = false; }
      );
    }

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.55 }
    });

  } else {
    // INCORRECT ANSWER - Gentle encouragement
    incorrectAttempts.value++;

    const cardRef = optionRefs.value[selectedDeity.id];
    if (cardRef) {
      cardRef.triggerIncorrectAnimation();
    }

    // Play ride_try_again.mp3 when correct God is not selected
    feedbackText.value = incorrectAttempts.value >= 2 ? 'Look carefully! 💡' : 'Try again! 😊';
    isHintText.value = incorrectAttempts.value >= 2;

    const tryAgainAudio = `assets/audio_gungun/ride_try_again.mp3`;
    const played = audioManager.playAudioFile(
      tryAgainAudio,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );

    if (!played) {
      audioManager.speak('Try again!', () => { isPlayingAudio.value = true; }, () => { isPlayingAudio.value = false; });
    }

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      if (!isAnswered.value) {
        feedbackText.value = '';
      }
    }, 2800);
  }
}

function handleTryNew() {
  audioManager.playTap();
  startNewRound();
}

function goHome() {
  audioManager.playTap();
  router.push('/');
}

function toggleMute() {
  isMuted.value = audioManager.toggleMute();
}

function loadScore() {
  const saved = localStorage.getItem('identify_god_count');
  if (saved) {
    foundCount.value = parseInt(saved, 10) || 0;
  }
}

function saveScore() {
  localStorage.setItem('identify_god_count', foundCount.value.toString());
}

async function requestLandscapeLock() {
  try {
    const orientation = window.screen?.orientation as any;
    if (orientation && typeof orientation.lock === 'function') {
      await orientation.lock('landscape');
    }
  } catch {
    // Gracefully ignore
  }
}

onMounted(() => {
  loadScore();
  startNewRound();
  requestLandscapeLock();
});

onBeforeUnmount(() => {
  if (feedbackTimer) clearTimeout(feedbackTimer);
});

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

.feedback-inline.is-success {
  background: #E8F5E9;
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.25);
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

.feedback-inline.is-success .feedback-message {
  color: #2E7D32;
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

/* Landscape Split Stage: Left 46%, Right 54% */
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
  flex: 1 1 46%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.question-panel {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 35%, #FFFDE7 0%, #FFF3E0 100%);
  border: clamp(3px, 0.7vh, 5px) solid #FFB300;
  border-radius: clamp(18px, 3vh, 28px);
  padding: clamp(10px, 2vh, 20px) clamp(12px, 2vw, 22px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 8px 24px rgba(255, 143, 0, 0.22);
  overflow: hidden;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.question-panel.is-success {
  border-color: #66BB6A;
  background: radial-gradient(circle at 50% 35%, #E8F5E9 0%, #C8E6C9 100%);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.25);
}

.speaker-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 0.8vh, 8px);
}

.speaker-button {
  position: relative;
  width: clamp(54px, 12vh, 80px);
  height: clamp(54px, 12vh, 80px);
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border: clamp(3px, 0.6vh, 5px) solid #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(245, 124, 0, 0.38);
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.speaker-button:hover {
  transform: scale(1.08);
}

.speaker-button:active {
  transform: scale(0.92);
}

.speaker-icon {
  width: clamp(24px, 5.5vh, 38px);
  height: clamp(24px, 5.5vh, 38px);
  stroke-width: 2.6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  z-index: 2;
}

.speaker-icon.bounce {
  animation: speakerPulse 0.6s infinite ease-in-out alternate;
}

@keyframes speakerPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.22); }
}

.pulse-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  border: 3px solid rgba(255, 152, 0, 0.6);
  opacity: 0;
  pointer-events: none;
}

.speaker-button.is-playing .ring-1 {
  animation: ringPulse 1.2s infinite ease-out;
}
.speaker-button.is-playing .ring-2 {
  animation: ringPulse 1.2s infinite ease-out 0.4s;
}

@keyframes ringPulse {
  0% { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

.speaker-hint {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.75rem, 1.8vh, 0.95rem);
  font-weight: 600;
  color: #E65100;
  opacity: 0.9;
}

.question-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-prompt {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.9rem, 2.2vh, 1.15rem);
  font-weight: 600;
  color: #F57C00;
  margin: 0 0 4px 0;
}

.target-question-text {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(1.2rem, 3.4vh, 1.85rem);
  font-weight: 700;
  color: #4A148C;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.85);
}

.bottom-action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: clamp(40px, 9vh, 60px);
}

.success-action-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(4px, 1vh, 8px);
}

.celebration-tag {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1.05rem);
  font-weight: 700;
  color: #2E7D32;
}

.try-new-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
  border: 3px solid #FFFFFF;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.95rem, 2.4vh, 1.2rem);
  font-weight: 700;
  padding: clamp(6px, 1.2vh, 10px) clamp(16px, 2.5vw, 24px);
  border-radius: 26px;
  box-shadow: 0 6px 16px rgba(233, 30, 99, 0.35);
  cursor: pointer;
  outline: none;
  transition: transform 0.15s;
}

.try-new-button:active {
  transform: scale(0.94);
}

.try-new-icon {
  width: clamp(16px, 2.6vh, 22px);
  height: clamp(16px, 2.6vh, 22px);
}

.hint-tag {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(0.85rem, 2vh, 1.05rem);
  font-weight: 600;
  color: #E65100;
  opacity: 0.85;
}

/* RIGHT PANEL & 2x2 GRID */
.right-panel {
  flex: 1 1 54%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

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

.pop-enter-active {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: opacity 0.15s;
}
.pop-leave-to {
  opacity: 0;
}

@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
