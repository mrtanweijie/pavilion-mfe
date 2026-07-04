import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { createVue2Router } from './router'
import App from './App.vue'

Vue.use(ElementUI)

// 获取应用代码
const appCode = import.meta.env.VITE_PAVILION_MFE_APP_CODE
const pavilionMfeEnv = import.meta.env.VITE_PAVILION_MFE_ENV || 'develop'
const apiBase = import.meta.env.VITE_BASE_API_URL || ''
const cdn = import.meta.env.VITE_PAVILION_MFE_CDN || ''

const ST_PX = 'color:#42b883;font-weight:bold'
const ST_KEY = 'color:#999'
const ST_VAL = 'color:#00b4d8;font-weight:bold'
console.log(
  '%c[PavilionMfe 微前端]%c %s\n  %cenv%c %s  %capi%c %s  %ccdn%c %s',
  ST_PX, '', appCode,
  ST_KEY, ST_VAL, pavilionMfeEnv,
  ST_KEY, ST_VAL, apiBase || '-',
  ST_KEY, ST_VAL, cdn || '(relative)',
)

/** 被主应用加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
    console.log('[PavilionMfe 微前端] mount', appCode)

    // $mount() 无参 → 创建离屏 DOM，手动 appendChild 精确控制 DOM 归属
    const instance = new Vue({
      router: createVue2Router(),
      render: (h) => h(App),
    }).$mount()

    el.appendChild(instance.$el)

    // 初始化后同步当前路径
    const path = window.location.pathname + window.location.search
    if (path !== '/') {
      instance.$router.replace(path).catch(() => {})
    }

    // 返回框架级清理函数
    return () => {
      instance.$destroy()
      if (instance.$el?.parentNode) {
        instance.$el.parentNode.removeChild(instance.$el)
      }
    }
  },
  unmount: async (_ctx: any, el: HTMLElement) => {
    console.log('[PavilionMfe 微前端] unmount', appCode)
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
if (!window.__PAVILION_MFE_ENV__) {
  const mountEl = document.getElementById('app')
  if (mountEl) {
    console.log('[PavilionMfe 微前端] standalone mount', appCode)
    mountEl.classList.add(`pavilion-mfe-${appCode}`)
    new Vue({
      router: createVue2Router(),
      render: (h) => h(App),
    }).$mount(mountEl)
  }
}
