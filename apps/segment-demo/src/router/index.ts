import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'

const routes = [
  {
    path: '/demo',
    redirect: '/demo/list',
  },
  {
    path: '/demo/list',
    name: 'List',
    component: () => import('../pages/list.vue'),
  },
  {
    path: '/demo/detail',
    name: 'Detail',
    component: () => import('../pages/detail.vue'),
  },
  {
    path: '/demo/form',
    name: 'Form',
    component: () => import('../pages/form.vue'),
  },
  {
    path: '/demo/:pathMatch(.*)*',
    redirect: '/demo/list',
  },
]

export function createDemoRouter(history?: RouterHistory) {
  return createRouter({
    history: history ?? createWebHistory(),
    routes,
  })
}
