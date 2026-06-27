import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import chalk from 'chalk'
import { pavilion } from '@pavilion/vite'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appCode = env.VITE_PAVILION_APP_CODE
  const pavilionEnv = env.VITE_PAVILION_ENV || 'develop'
  const cdn = env.VITE_PAVILION_CDN || ''
  const apiBase = env.VITE_BASE_API_URL || ''

  console.log(
    `${chalk.green.bold('[Pavilion 微前端]')} ${chalk.bold(appCode)}\n` +
    `  ${chalk.gray('env')} ${chalk.cyan(pavilionEnv)}  ` +
    `${chalk.gray('api')} ${chalk.cyan(apiBase || '-')}  ` +
    `${chalk.gray('cdn')} ${chalk.cyan(cdn || '(relative)')}`
  )
  
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
