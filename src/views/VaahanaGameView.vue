<template>
  <div class="game-view-container" :style="bgStyle">
    <!-- Top Bar Navigation & Progress -->
    <header class="top-nav">
      <NavigationButton type="back" label="Home" @click="goHome" />

      <div class="nav-center">
        <h1 class="nav-title">Gods & Vaahanas</h1>
        <div class="deity-counter-badge">
          ⭐ {{ foundCount }} Vaahanas Found
        </div>
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
        :is-playing-audio="isPlayingAudio"
        :is-hinting="failedAttempts >= 2 && !isCurrentSuccess"
        @next="handleNextRound"
        @play-audio="playQuestionAudio"
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
import { ref, onMounted, ComponentPublicInstance, watch } from 'vue';
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

onMounted(() => {
  loadScore();
  const deityId = route.params.id as string;
  startNewRound(deityId);
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

    feedbackText.value = '🎉 Good Job! 🎉';
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
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
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
    }, 3000);
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

.deity-counter-badge {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #E65100;
  background: rgba(255, 255, 255, 0.85);
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
