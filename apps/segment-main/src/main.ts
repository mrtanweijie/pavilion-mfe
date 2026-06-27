import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createRouter as createPavilionRouter } from '@pavilion/router'
import { loadRemote } from '@module-federation/runtime'
import mfeConfig from '../mfe.json'
import router from './router'
import App from './App.vue'

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
  })),
})

pavilionRouter.start()
