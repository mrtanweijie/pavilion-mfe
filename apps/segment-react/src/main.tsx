import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

/** 被壳加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
    const root = createRoot(el)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    return () => root.unmount()
  },
  unmount: async (_ctx: any, el: HTMLElement) => {
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
const rootEl = document.getElementById('root')
if (rootEl && !(rootEl as any)._reactRootContainer) {
  const root = createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
