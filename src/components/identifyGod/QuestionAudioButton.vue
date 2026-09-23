<template>
  <div class="question-audio-container">
    <button 
      class="speaker-button"
      :class="{ 'is-playing': isPlaying }"
      aria-label="Replay Question Audio"
      @click="handleClick"
    >
      <div class="pulse-ring ring-1"></div>
      <div class="pulse-ring ring-2"></div>
      <Volume2 class="speaker-icon" :class="{ 'bounce': isPlaying }" />
    </button>
    <div class="question-text-wrap">
      <span class="question-text">"{{ questionText }}"</span>
      <span class="sub-label">Tap speaker to hear again</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Volume2 } from 'lucide-vue-next';

defineProps<{
  questionText: string;
  isPlaying: boolean;
}>();

const emit = defineEmits<{
  (e: 'play'): void;
}>();

function handleClick() {
  emit('play');
}
</script>

<style scoped>
.question-audio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  user-select: none;
}

.speaker-button {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border: 4px solid #FFFFFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(245, 124, 0, 0.35), 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.speaker-button:active {
  transform: scale(0.92);
}

.speaker-icon {
  width: 36px;
  height: 36px;
  stroke-width: 2.5px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  z-index: 2;
}

.speaker-icon.bounce {
  animation: speakerPulse 0.6s infinite ease-in-out alternate;
}

@keyframes speakerPulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.18); }
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
  100% { transform: scale(1.45); opacity: 0; }
}

.question-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.45rem;
  font-weight: 700;
  color: #4A148C;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.9);
  text-align: center;
}

.sub-label {
  font-family: 'Fredoka', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #7B1FA2;
  opacity: 0.85;
}
</style>
