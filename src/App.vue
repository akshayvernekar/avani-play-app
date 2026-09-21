<template>
  <div id="app-root">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* Global CSS Resets & Touch Optimization */
* {
  box-sizing: border-box;
  -webkit-touch-callout: none;
  user-select: none;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: 'Fredoka', 'Outfit', system-ui, -apple-system, sans-serif;
  background-color: #E0F7FA;
  -webkit-font-smoothing: antialiased;
}

#app-root {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
