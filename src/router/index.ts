import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PuzzleSelectionView from '../views/PuzzleSelectionView.vue';
import PuzzleGameView from '../views/PuzzleGameView.vue';
import VaahanaSelectionView from '../views/VaahanaSelectionView.vue';
import VaahanaGameView from '../views/VaahanaGameView.vue';
import IdentifyGodView from '../views/IdentifyGodView.vue';
import PujaGameView from '../views/PujaGameView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/puja',
    name: 'PujaGame',
    component: PujaGameView
  },
  {
    path: '/identify-god',
    name: 'IdentifyGod',
    component: IdentifyGodView
  },
  {
    path: '/vaahana',
    name: 'VaahanaGame',
    component: VaahanaGameView
  },
  {
    path: '/vaahana/:id',
    name: 'VaahanaGameWithId',
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
