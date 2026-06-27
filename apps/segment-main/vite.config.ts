import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import chalk from 'chalk'
import { pavilion } from '@pavilion/vite'
import mfeConfig from './mfe.json'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const isServe = command === 'serve'
  const isBuild = command === 'build'
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
      pavilion({
        role: 'shell',
        name: appCode,
        env: pavilionEnv,
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
