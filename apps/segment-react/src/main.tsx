import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createSegmentRouter, createStandaloneRouter } from './router'

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

/** 被壳加载时调用 */
export default {
  mount: async (_ctx: any, el: HTMLElement) => {
    
    console.log('[PavilionMfe 微前端] mount', appCode)

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
    console.log('[PavilionMfe 微前端] unmount', appCode)
    el.innerHTML = ''
  },
}

/** 独立运行时自启动 */
if (!window.__PAVILION_MFE_ENV__) {
  const rootEl = document.getElementById('root')
  if (rootEl) {
    console.log('子应用独立运行 standalone', appCode)

    rootEl.classList.add(`pavilion-mfe-${appCode}`)

    const router = createStandaloneRouter()
    const root = createRoot(rootEl)
    root.render(
      <React.StrictMode>
        <App router={router} />
      </React.StrictMode>
    )
  }
}
