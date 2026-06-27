import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createSegmentRouter, createStandaloneRouter } from './router'

const appCode = import.meta.env.VITE_PAVILION_APP_CODE

console.log('[Pavilion 微前端] main', appCode)

/** 被壳加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
    
    console.log('[Pavilion 微前端] mount', appCode)

    const router = createSegmentRouter(_ctx?.basename)
    const root = createRoot(el)
    root.render(
      <React.StrictMode>
        <App router={router} />
      </React.StrictMode>
    )
    return () => root.unmount()
  },
  unmount: async (_ctx: any, el: HTMLElement) => {
    console.log('[Pavilion 微前端] unmount', appCode)
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
const rootEl = document.getElementById('root')
if (rootEl && !(rootEl as any)._reactRootContainer) {
  
  console.log('子应用独立运行 standalone', appCode)

  rootEl.classList.add(`pavilion-${appCode}`)

  const router = createStandaloneRouter()
  const root = createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App router={router} />
    </React.StrictMode>
  )
}
