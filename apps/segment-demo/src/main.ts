import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createDemoRouter } from './router'
import App from './App.vue'

// 获取应用代码
const appCode = import.meta.env.VITE_PAVILION_APP_CODE

console.log('[Pavilion 微前端] main', appCode)

/** 被壳加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
    console.log('[Pavilion 微前端] mount', appCode)
    const app = createApp(App)
    app.use(ElementPlus)
    const router = createDemoRouter()
    app.use(router)
    app.mount(el)
    // 初始化后同步当前路径
    router.replace(window.location.pathname + window.location.search)
    return () => app.unmount()
  },
  unmount: async (_ctx: any, el: HTMLElement) => {
    console.log('[Pavilion 微前端] unmount', appCode)
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
const mountEl = document.getElementById('app')
if (mountEl && !(mountEl as any).__vue_app__) {
  console.log('[Pavilion 微前端] standalone mount', appCode)
  mountEl.classList.add(`pavilion-${appCode}`)
  const app = createApp(App)
  app.use(ElementPlus)
  const router = createDemoRouter()
  app.use(router)
  app.mount(mountEl)
}
