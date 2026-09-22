<template>
  <div class="progress-bar-container">
    <div class="progress-dots">
      <div 
        v-for="(isCompleted, idx) in dotsState" 
        :key="idx" 
        class="dot"
        :class="{
          'is-active': idx === currentIndex,
          'is-done': isCompleted
        }"
      >
        <span v-if="isCompleted" class="dot-icon">⭐</span>
        <span v-else-if="idx === currentIndex" class="dot-icon">✨</span>
        <span v-else class="dot-number">{{ idx + 1 }}</span>
      </div>
    </div>
    
    <div class="progress-badge">
      {{ currentIndex + 1 }} / {{ total }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentIndex: number;
  total: number;
  completedIndices: number[];
}>();

const dotsState = computed(() => {
  return Array.from({ length: props.total }, (_, i) => props.completedIndices.includes(i));
});
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 3px solid #FFE082;
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.15);
  gap: 12px;
}

.progress-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FFF9C4;
  border: 2px solid #FFC107;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #F57F17;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dot.is-active {
  transform: scale(1.25);
  background: #FFB300;
  border-color: #E65100;
  color: #FFFFFF;
  box-shadow: 0 0 10px rgba(255, 179, 0, 0.6);
}

.dot.is-done {
  background: #81C784;
  border-color: #2E7D32;
  color: #FFFFFF;
}

.dot-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.progress-badge {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #E65100;
  background: #FFE082;
  padding: 4px 12px;
  border-radius: 16px;
}
</style>
