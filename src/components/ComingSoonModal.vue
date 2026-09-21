<template>
  <div v-if="show" class="modal-backdrop" @click="close">
    <div class="modal-card" @click.stop>
      <div class="modal-header">
        <span class="modal-emoji">🌟</span>
        <h2>Coming Soon!</h2>
      </div>
      <p class="modal-text">{{ message }}</p>
      <button class="ok-button" @click="close">
        Got it! 👍
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { audioManager } from '../audio/AudioManager';

defineProps<{
  show: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function close() {
  audioManager.playTap();
  emit('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-card {
  background: #FFFFFF;
  border-radius: 32px;
  border: 5px solid #FFD54F;
  padding: 30px 24px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-emoji {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 8px;
}

h2 {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.8rem;
  color: #E65100;
  margin: 0 0 10px 0;
}

.modal-text {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.15rem;
  color: #555555;
  margin-bottom: 24px;
}

.ok-button {
  background: linear-gradient(185deg, #4CAF50, #388E3C);
  color: #FFFFFF;
  border: none;
  font-family: 'Fredoka', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  padding: 14px 28px;
  border-radius: 24px;
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  cursor: pointer;
  outline: none;
  transition: transform 0.15s;
}

.ok-button:active {
  transform: scale(0.94);
}
</style>
