import { createApp } from 'vue'
import App from './App.vue'

/** 被壳加载时调用 */
export default {
  mount: async (ctx, el) => {
    const app = createApp(App)
    app.mount(el)
    return () => app.unmount()
  },
  unmount: async (_ctx, el) => {
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
// 使用 __vue_app__ 检测：如果 #app 上已有 Vue 实例（壳应用），不执行独立挂载
const mountEl = document.getElementById('app')
if (mountEl && !(mountEl as any).__vue_app__) {
  const app = createApp(App)
  app.mount(mountEl)
}
