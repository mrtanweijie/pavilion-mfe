import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { createPathMatcher } from '@pavilion-mfe/router'
import mfeConfig from '../../mfe.json'

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
    // catch-all：微前端子应用路由（/demo/*, /react/* 等）
    // 实际渲染由 #pavilion-mfe-container（在 MainLayout 中）处理，
    // 此路由仅用于让 Vue Router 匹配子应用路径，保持 route.path 正确更新。
    // 非子应用路径（如 /env/test）重定向到 404。
    path: '/:pathMatch(.*)*',
    name: 'MFPage',
    component: { render: () => null },
    beforeEnter: (to: RouteLocationNormalized) => {
      const isSubAppRoute = mfeConfig.apps.some((app) =>
        createPathMatcher(app.routes)(to.path)
      )
      if (!isSubAppRoute) {
        return '/404'
      }
    },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
