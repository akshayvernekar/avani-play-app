import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PuzzleSelectionView from '../views/PuzzleSelectionView.vue';
import PuzzleGameView from '../views/PuzzleGameView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
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
