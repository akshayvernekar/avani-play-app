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
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 4px solid #1E88E5;
  color: #1E88E5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.nav-button:active {
  transform: scale(0.92);
  background: #E3F2FD;
}

.nav-icon {
  width: 28px;
  height: 28px;
  stroke-width: 3px;
}
</style>
