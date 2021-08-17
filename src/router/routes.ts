import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/Index.vue'),
      },
      {
        path: ':log([a-zA-Z0-9]{16})',
        name: 'Fights',
        component: () => import('pages/Fights.vue'),
      },
      {
        path: ':log([a-zA-Z0-9]{16})/:fight([1-9][0-9]*)',
        name: 'Characters',
        component: () => import('pages/Characters.vue'),
      },
      {
        path: '/:log([a-zA-Z0-9]{16})/:fight([1-9][0-9]*)/:char([1-9][0-9]*)',
        name: 'Analysis',
        component: () => import('pages/Analysis.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
