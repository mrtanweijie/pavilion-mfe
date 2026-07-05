import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/vue2',
    redirect: '/vue2/list',
  },
  {
    path: '/vue2/list',
    name: 'List',
    component: () => import('../pages/list.vue'),
  },
  {
    path: '/vue2/detail',
    name: 'Detail',
    component: () => import('../pages/detail.vue'),
  },
  {
    path: '/vue2/form',
    name: 'Form',
    component: () => import('../pages/form.vue'),
  },
  {
    // catch-all：渲染空内容，实际 404 由 beforeEach 守卫处理
    path: '/vue2/*',
    component: { render: (h: any) => h() },
  },
]

export function createVue2Router(base?: string) {
  const router = new VueRouter({
    mode: 'history',
    base: base || '/',
    routes,
  })

  // 404 守卫：子应用内未匹配路由 → 重定向到主应用 404 页
  router.beforeEach((to, _from, next) => {
    const isCatchAll =
      to.matched.length > 0 &&
      to.matched[0].path === '/vue2/*'
    if (isCatchAll) {
      const isMainApp = !!window.__PAVILION_MFE_ENV__
      if (isMainApp) {
        // 主应用模式：重定向到主应用 /404
        window.history.replaceState(null, '', '/404')
        window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
      } else {
        // 独立模式：重定向到列表页
        next('/vue2/list')
        return
      }
    }
    next()
  })

  return router
}
