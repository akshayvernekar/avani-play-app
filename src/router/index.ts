import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/special-item',
    name: 'SpecialItemGame',
    component: () => import('../views/SpecialItemGameView.vue')
  },
  {
    path: '/puja',
    name: 'PujaGame',
    component: () => import('../views/PujaGameView.vue')
  },
  {
    path: '/identify-god',
    name: 'IdentifyGod',
    component: () => import('../views/IdentifyGodView.vue')
  },
  {
    path: '/vaahana',
    name: 'VaahanaGame',
    component: () => import('../views/VaahanaGameView.vue')
  },
  {
    path: '/vaahana/:id',
    name: 'VaahanaGameWithId',
    component: () => import('../views/VaahanaGameView.vue')
  },
  {
    path: '/puzzles',
    name: 'PuzzleSelection',
    component: () => import('../views/PuzzleSelectionView.vue')
  },
  {
    path: '/puzzle/:id',
    name: 'PuzzleGame',
    component: () => import('../views/PuzzleGameView.vue')
  }
];

const router = createRouter({
  history: createWebHistory('/avani-play-app/'),
  routes
});

export default router;
