import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createDemoRouter } from './router'
import App from './App.vue'

// 获取应用代码
const appCode = import.meta.env.VITE_PAVILION_APP_CODE
const pavilionEnv = import.meta.env.VITE_PAVILION_ENV || 'develop'
const apiBase = import.meta.env.VITE_BASE_API_URL || ''
const cdn = import.meta.env.VITE_PAVILION_CDN || ''

const ST_PX = 'color:#42b883;font-weight:bold'
const ST_KEY = 'color:#999'
const ST_VAL = 'color:#00b4d8;font-weight:bold'
console.log(
  '%c[Pavilion 微前端]%c %s\n  %cenv%c %s  %capi%c %s  %ccdn%c %s',
  ST_PX, '', appCode,
  ST_KEY, ST_VAL, pavilionEnv,
  ST_KEY, ST_VAL, apiBase || '-',
  ST_KEY, ST_VAL, cdn || '(relative)',
)

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
if (!window.__PAVILION_MFE_ENV__) {
  const mountEl = document.getElementById('app')
  if (mountEl) {
    console.log('[Pavilion 微前端] standalone mount', appCode)
    mountEl.classList.add(`pavilion-${appCode}`)
    const app = createApp(App)
    app.use(ElementPlus)
    const router = createDemoRouter()
    app.use(router)
    app.mount(mountEl)
  }
}
