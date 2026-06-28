import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import chalk from 'chalk'
import { PavilionMfe } from '@pavilion-mfe/vite'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appCode = env.VITE_PAVILION_MFE_APP_CODE
  const pavilionMfeEnv = env.VITE_PAVILION_MFE_ENV || 'develop'
  const cdn = env.VITE_PAVILION_MFE_CDN || ''
  const apiBase = env.VITE_BASE_API_URL || ''

  console.log(
    `${chalk.green.bold('[PavilionMfe 微前端]')} ${chalk.bold(appCode)}\n` +
    `  ${chalk.gray('env')} ${chalk.cyan(pavilionMfeEnv)}  ` +
    `${chalk.gray('api')} ${chalk.cyan(apiBase || '-')}  ` +
    `${chalk.gray('cdn')} ${chalk.cyan(cdn || '(relative)')}`
  )
  
  return {
    plugins: [
      vue(),
      PavilionMfe({
        role: 'segment',
        name: appCode,
        exposes: {
          './main': './src/main.ts',
        },
        pavilionMfeRemotes: {
        },
        shared: command === 'build' ? ['vue'] : undefined,
        openDevServe: true,
        port: 6020,
        dts: false,
      }),
    ],
    server: { port: 6020 },
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === 'INVALID_ANNOTATION') return
          defaultHandler(warning)
        },
      },
    },
  }
})
