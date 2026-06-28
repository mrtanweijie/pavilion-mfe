import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import chalk from 'chalk'
import { PavilionMfe } from '@pavilion-mfe/vite'
import mfeConfig from './mfe.json'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const isServe = command === 'serve'
  const isBuild = command === 'build'
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

  const remotes: Record<string, string> = {}

  mfeConfig.apps.forEach((app) => {
    if (isServe && app.devPort) {
      remotes[app.appCode] = `${app.appCode}@http://localhost:${app.devPort}/mf-manifest-main.json`
    }
    // build mode: preloadPlugin registers remotes at runtime
  })

  return {
    plugins: [
      vue(),
      PavilionMfe({
        role: 'main-app',
        name: appCode,
        env: pavilionMfeEnv,
        cdn,
        remotes: isServe ? remotes : undefined,
        runtimePlugins: isBuild ? ['./src/preloadPlugin'] : undefined,
        shared: isBuild ? ['vue'] : undefined,
        shareStrategy: isBuild ? 'loaded-first' : undefined,
        dts: false,
      }),
    ],
    server: { port: 6010 },
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
