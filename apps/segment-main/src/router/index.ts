import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../pages/test.vue'),
  },
  {
    path: '/env',
    name: 'Env',
    component: () => import('../pages/env.vue'),
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../pages/403.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../pages/404.vue'),
  },
  {
    // catch-all：微前端段路由（/demo/*, /react/* 等）
    // 实际渲染由 #pavilion-container（在 MainLayout 中）处理，
    // 此路由仅用于让 Vue Router 匹配段路径，保持 route.path 正确更新。
    path: '/:pathMatch(.*)*',
    name: 'MFPage',
    component: { render: () => null },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
