<template>
  <button 
    class="nav-button"
    :aria-label="label"
    @click="handleClick"
  >
    <component :is="iconComponent" class="nav-icon" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, Home, Volume2, VolumeX } from 'lucide-vue-next';
import { audioManager } from '../audio/AudioManager';

const props = defineProps<{
  type: 'back' | 'home' | 'audio';
  label?: string;
  isMuted?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const iconComponent = computed(() => {
  if (props.type === 'back') return ArrowLeft;
  if (props.type === 'home') return Home;
  if (props.type === 'audio') return props.isMuted ? VolumeX : Volume2;
  return ArrowLeft;
});

function handleClick() {
  audioManager.playTap();
  emit('click');
}
</script>

<style scoped>
.nav-button {
  width: clamp(38px, 6.5vh, 48px);
  height: clamp(38px, 6.5vh, 48px);
  border-radius: 50%;
  background: #FFFFFF;
  border: clamp(2.5px, 0.5vh, 3.5px) solid #1E88E5;
  color: #1E88E5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.nav-button:active {
  transform: scale(0.92);
  background: #E3F2FD;
}

.nav-icon {
  width: clamp(20px, 3.6vh, 26px);
  height: clamp(20px, 3.6vh, 26px);
  stroke-width: 2.6px;
}
</style>
