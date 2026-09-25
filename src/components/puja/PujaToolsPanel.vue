<template>
  <aside 
    ref="panelRootRef"
    class="puja-tools-panel"
    :class="{ 'is-drop-delete-target': isDragOverPanel }"
  >
    <!-- Drop to Delete Visual Feedback Overlay -->
    <transition name="fade">
      <div v-if="isDragOverPanel" class="delete-drop-overlay">
        <span class="delete-icon">🗑️</span>
        <span class="delete-text">Release to Remove</span>
      </div>
    </transition>

    <!-- Left: Vertical Category Tabs matching reference image -->
    <div class="category-tabs-column" role="tablist">
      <button
        v-for="cat in pujaCategories"
        :key="cat.id"
        role="tab"
        :aria-selected="activeCategory === cat.id"
        class="cat-vertical-tab"
        :class="{ 'is-active': activeCategory === cat.id }"
        @click="$emit('category-change', cat.id)"
      >
        <span class="cat-tab-icon">{{ cat.emoji }}</span>
        <span class="cat-tab-label">{{ cat.label }}</span>
      </button>
    </div>

    <!-- Right: Header + 2-column Item Grid -->
    <div class="items-content-column">
      <div class="items-header">
        <h3 class="items-header-title">{{ currentCategoryLabel }}</h3>
      </div>

      <div class="items-grid-scroll">
        <div class="items-grid">
          <PujaItemCard
            v-for="item in currentItems"
            :key="item.id"
            :item="item"
            @dragstart="(item, e) => $emit('item-drag-start', item, e)"
            @tap="(item) => $emit('item-tap', item)"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PujaCategory, PujaItem, pujaCategories } from '../../data/puja';
import PujaItemCard from './PujaItemCard.vue';

const props = defineProps<{
  items: Record<PujaCategory, PujaItem[]>;
  activeCategory: PujaCategory;
  isDragOverPanel?: boolean;
}>();

defineEmits<{
  (e: 'category-change', category: PujaCategory): void;
  (e: 'item-drag-start', item: PujaItem, event: PointerEvent): void;
  (e: 'item-tap', item: PujaItem): void;
}>();

const panelRootRef = ref<HTMLElement | null>(null);

const currentCategoryLabel = computed(() => {
  return pujaCategories.find(c => c.id === props.activeCategory)?.label || 'Items';
});

const currentItems = computed(() => {
  return props.items[props.activeCategory] || [];
});

defineExpose({
  panelRootRef
});
</script>

<style scoped>
.puja-tools-panel {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 0;
  background: #FFFDF7;
  border-radius: clamp(18px, 2.5vw, 28px);
  border: clamp(2.5px, 0.4vh, 3.5px) solid #FFE0B2;
  box-shadow: 0 clamp(4px, 1vh, 10px) clamp(12px, 2vh, 22px) rgba(141, 110, 99, 0.16);
  padding: clamp(6px, 1vh, 10px);
  gap: clamp(8px, 1.2vw, 14px);
  box-sizing: border-box;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.puja-tools-panel.is-drop-delete-target {
  border-color: #EF4444;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.35);
}

.delete-drop-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(254, 242, 242, 0.92);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: none;
}

.delete-icon {
  font-size: clamp(32px, 6vh, 48px);
  animation: bounceDelete 0.8s infinite alternate ease-in-out;
}

.delete-text {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(14px, 2.4vh, 18px);
  font-weight: 700;
  color: #DC2626;
}

@keyframes bounceDelete {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}

/* Left Vertical Tabs Column */
.category-tabs-column {
  display: flex;
  flex-direction: column;
  gap: clamp(5px, 0.9vh, 8px);
  width: clamp(58px, 10vw, 78px);
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
  scrollbar-width: none;
}

.category-tabs-column::-webkit-scrollbar {
  display: none;
}

.cat-vertical-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(6px, 1vh, 9px) clamp(4px, 0.8vw, 8px);
  background: transparent;
  border: 1.5px solid transparent;
  border-radius: clamp(12px, 1.8vh, 18px);
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
  min-height: clamp(50px, 8.5vh, 66px);
}

.cat-vertical-tab:hover {
  background: #FFF8E1;
}

.cat-vertical-tab.is-active {
  background: #3B82F6;
  border-color: #2563EB;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.35);
  transform: scale(1.04);
}

.cat-tab-icon {
  font-size: clamp(18px, 3vh, 26px);
  line-height: 1.1;
  pointer-events: none;
}

.cat-tab-label {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(10px, 1.5vh, 12px);
  font-weight: 600;
  color: #6D4C41;
  margin-top: 3px;
  text-align: center;
  line-height: 1;
  pointer-events: none;
}

.cat-vertical-tab.is-active .cat-tab-label {
  color: #FFFFFF;
}

/* Right Content Column */
.items-content-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.items-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(2px, 0.5vh, 6px) clamp(4px, 0.8vw, 8px);
  flex-shrink: 0;
}

.items-header-title {
  font-family: 'Fredoka', 'Outfit', sans-serif;
  font-size: clamp(15px, 2.6vh, 20px);
  font-weight: 700;
  color: #4E342E;
  margin: 0;
}

.items-grid-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 2px;
  scrollbar-width: thin;
  scrollbar-color: #FFB300 transparent;
}

.items-grid-scroll::-webkit-scrollbar {
  width: 5px;
}
.items-grid-scroll::-webkit-scrollbar-thumb {
  background: #FFB300;
  border-radius: 4px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(8px, 1.4vh, 12px);
}
</style>

