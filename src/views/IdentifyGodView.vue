<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Bar Navigation & Counter -->
    <header class="top-nav">
      <NavigationButton type="back" label="Home" @click="goHome" />

      <div class="nav-center">
        <h1 class="nav-title">🛕 Identify the God</h1>
        <div class="score-counter-badge">
          ⭐ {{ foundCount }} Gods Found
        </div>
      </div>

      <NavigationButton type="audio" label="Sound Toggle" :is-muted="isMuted" @click="toggleMute" />
    </header>

    <!-- Feedback Banner -->
    <transition name="fade-slide">
      <div v-if="feedbackText" class="feedback-banner" :class="{ 'is-hint': isHintText, 'is-success': isAnswered }">
        <span class="feedback-icon">{{ isAnswered ? '🎉' : (isHintText ? '💡' : '😊') }}</span>
        <span class="feedback-message">{{ feedbackText }}</span>
      </div>
    </transition>

    <!-- Main Game Area -->
    <main class="game-stage">
      <!-- Question Audio & Speaker Button -->
      <QuestionAudioButton 
        :question-text="targetDeity.questionText"
        :is-playing="isPlayingAudio"
        @play="playQuestionAudio"
      />

      <!-- 2x2 Deity Options Grid -->
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

      <!-- Try New Round Button (Shows after correct answer) -->
      <transition name="pop">
        <div v-if="isAnswered" class="try-new-container">
          <button class="try-new-button" @click="handleTryNew">
            <Sparkles class="try-new-icon" />
            <span>✨ Try New</span>
          </button>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { 
  DeityInfo, 
  getRandomIdentifyGodQuestion, 
  identifyGodDeities 
} from '../data/identifyGod';
import NavigationButton from '../components/NavigationButton.vue';
import QuestionAudioButton from '../components/identifyGod/QuestionAudioButton.vue';
import DeityOptionCard from '../components/identifyGod/DeityOptionCard.vue';
import { Sparkles } from 'lucide-vue-next';
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

const optionRefs = ref<Record<string, InstanceType<typeof DeityOptionCard>>>({});

function setOptionRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (el) {
    optionRefs.value[id] = el as InstanceType<typeof DeityOptionCard>;
  }
}

function startNewRound() {
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
  }, 300);
}

function playQuestionAudio() {
  audioManager.speak(
    targetDeity.value.questionText,
    () => { isPlayingAudio.value = true; },
    () => { isPlayingAudio.value = false; }
  );
}

function handleSelectOption(selectedDeity: DeityInfo) {
  if (isAnswered.value) return;

  if (selectedDeity.id === targetDeity.value.id) {
    // CORRECT ANSWER!
    isAnswered.value = true;
    foundCount.value++;
    saveScore();

    feedbackText.value = '🎉 Good Job! 🎉';
    isHintText.value = false;

    audioManager.playCelebration();
    audioManager.speak(
      targetDeity.value.successText,
      () => { isPlayingAudio.value = true; },
      () => { isPlayingAudio.value = false; }
    );

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });

  } else {
    // INCORRECT ANSWER - Gentle encouragement
    incorrectAttempts.value++;

    const cardRef = optionRefs.value[selectedDeity.id];
    if (cardRef) {
      cardRef.triggerIncorrectAnimation();
    }

    audioManager.playTap();

    if (incorrectAttempts.value >= 2) {
      feedbackText.value = 'Look carefully! 💡';
      isHintText.value = true;
      audioManager.speak('Look carefully!', () => { isPlayingAudio.value = true; }, () => { isPlayingAudio.value = false; });
    } else {
      feedbackText.value = 'Try again! 😊';
      isHintText.value = false;
      audioManager.speak('Try again!', () => { isPlayingAudio.value = true; }, () => { isPlayingAudio.value = false; });
    }
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

onMounted(() => {
  loadScore();
  startNewRound();
});

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
  font-size: 1.5rem;
  font-weight: 700;
  color: #C2185B;
  margin: 0;
  text-shadow: 0 2px 6px rgba(255, 255, 255, 0.9);
  text-align: center;
}

.score-counter-badge {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #E65100;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #FFE082;
  border-radius: 16px;
  padding: 2px 10px;
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

.feedback-banner.is-success {
  background: #E8F5E9;
  border-color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
}

.feedback-icon {
  font-size: 1.2rem;
}

.feedback-message {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2E7D32;
}

/* Stage */
.game-stage {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  width: 100%;
  margin-top: 8px;
}

/* Try New Container & Button */
.try-new-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.try-new-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #FF4081 0%, #E91E63 100%);
  border: 4px solid #FFFFFF;
  color: #FFFFFF;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 14px 36px;
  border-radius: 30px;
  box-shadow: 0 8px 24px rgba(233, 30, 99, 0.4);
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: pulseButton 1.5s infinite ease-in-out alternate;
}

.try-new-button:active {
  transform: scale(0.94);
}

.try-new-icon {
  width: 28px;
  height: 28px;
}

@keyframes pulseButton {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.pop-enter-active {
  animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: opacity 0.2s;
}
.pop-leave-to {
  opacity: 0;
}

@keyframes popIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
