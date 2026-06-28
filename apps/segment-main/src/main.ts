import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createRouter as createPavilionMfeRouter, configureLog, createPathMatcher } from '@pavilion-mfe/router'
import { loadRemote } from '@module-federation/runtime'
import mfeConfig from '../mfe.json'
import router from './router'
import App from './App.vue'

// ─── PavilionMfe log configuration ───
// Toggle per-module: router | sandbox | preload | bridge
// Set to false to silence that module's logs.
configureLog({
  enabled: true,
  modules: {
    router: true,
    sandbox: true,
    preload: true,
    bridge: true,
  },
})

// ─── PavilionMfe config info ───
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

const app = createApp(App)

// 注册 Vue Router
app.use(router)

// 注册 Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

// 启动 PavilionMfe 微前端路由
const pavilionMfeRouter = createPavilionMfeRouter({
  maxCache: 5,
  apps: mfeConfig.apps.map((seg) => ({
    name: seg.appCode,
    load: async () => {
      try {
        const mod = await loadRemote(`${seg.appCode}/main`) as any
        return (mod as any).default ?? mod
      } catch (err) {
        console.error(`[PavilionMfe] Failed to load ${seg.appCode}:`, err)
        return {
          mount: async (_ctx: any, el: HTMLElement) => {
            el.innerHTML = `<p style="color:#999;">${seg.name} 未加载</p>`
          },
        }
      }
    },
    activeWhen: createPathMatcher(seg.routes),
    basename: seg.routes[0] ?? '',
    keepAlive: seg.keepAlive ?? false,
  })),
})

pavilionMfeRouter.start()
