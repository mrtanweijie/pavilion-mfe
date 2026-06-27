import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { pavilion } from '@pavilion/vite'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appCode = env.VITE_PAVILION_APP_CODE

  console.log('[Pavilion 微前端] appCode', appCode)
  
  return {
    plugins: [
      react(),
      pavilion({
        role: 'segment',
        name: appCode,
        exposes: {
          './main': './src/main.tsx',
        },
        openDevServe: true,
        port: 6030,
        dts: false,
      }),
    ],
    server: { port: 6030 },
  }
})
