import { createApp } from 'vue'
import { createRouter as createPavilionRouter } from '@pavilion/router'
import { loadRemote } from '@module-federation/runtime'
import mfeConfig from '../mfe.json'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

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
