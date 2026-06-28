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
    // catch-all：渲染空内容，实际 404 重定向由 beforeEach 守卫处理
    path: '/demo/:pathMatch(.*)*',
    component: { render: () => null },
  },
]

export function createDemoRouter(history?: RouterHistory) {
  const router = createRouter({
    history: history ?? createWebHistory(),
    routes,
  })

  // 404 重定向守卫：在组件加载/渲染之前同步执行，
  // 确保 URL 在 PavilionMfe reroute 运行前就已变为 /404，
  // 避免子应用被 restore 后用户短暂看到 App.vue 内容的竞态问题。
  router.beforeEach((to) => {
    if (
      to.matched.length > 0 &&
      to.matched[0].path === '/demo/:pathMatch(.*)*'
    ) {
      const isMainApp = !!window.__PAVILION_MFE_ENV__
      if (isMainApp) {
        // 主应用模式：重定向到主应用 /404 页面
        window.history.replaceState(null, '', '/404')
        window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
      } else {
        // 独立模式：重定向到列表页
        return '/demo/list'
      }
    }
  })

  return router
}
