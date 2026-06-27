import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createRouter as createPavilionRouter, configureLog } from '@pavilion/router'
import { loadRemote } from '@module-federation/runtime'
import mfeConfig from '../mfe.json'
import router from './router'
import App from './App.vue'

// ─── Pavilion log configuration ───
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

// ─── Pavilion config info ───
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

// 启动 Pavilion 微前端路由
const pavilionRouter = createPavilionRouter({
  maxCache: 5,
  apps: mfeConfig.apps.map((seg) => ({
    name: seg.appCode,
    load: async () => {
      try {
        const mod = await loadRemote(`${seg.appCode}/main`) as any
        return (mod as any).default ?? mod
      } catch (err) {
        console.error(`[Pavilion] Failed to load ${seg.appCode}:`, err)
        return {
          mount: async (_ctx: any, el: HTMLElement) => {
            el.innerHTML = `<p style="color:#999;">${seg.name} 未加载</p>`
          },
        }
      }
    },
    activeWhen: (path: string) =>
      seg.routes.some((route: string) =>
        path.replace(/\/?$/, '/').startsWith(route.replace(/\/?$/, '/'))
      ),
    basename: seg.routes[0] ?? '',
    keepAlive: seg.keepAlive ?? false,
  })),
})

pavilionRouter.start()
