import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PuzzleSelectionView from '../views/PuzzleSelectionView.vue';
import PuzzleGameView from '../views/PuzzleGameView.vue';
import VaahanaGameView from '../views/VaahanaGameView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/vaahana',
    name: 'VaahanaGame',
    component: VaahanaGameView
  },
  {
    path: '/puzzles',
    name: 'PuzzleSelection',
    component: PuzzleSelectionView
  },
  {
    path: '/puzzle/:id',
    name: 'PuzzleGame',
    component: PuzzleGameView
  }
];

const router = createRouter({
  history: createWebHistory('/avani-play-app/'),
  routes
});

export default router;
