import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createDemoRouter } from './router'
import App from './App.vue'

/** 被壳加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
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
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
const mountEl = document.getElementById('app')
if (mountEl && !(mountEl as any).__vue_app__) {
  mountEl.classList.add('pavilion-demo-app')
  const app = createApp(App)
  app.use(ElementPlus)
  const router = createDemoRouter()
  app.use(router)
  app.mount(mountEl)
}
