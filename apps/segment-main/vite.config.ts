import { defineConfig, loadEnv } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pavilion } from '@pavilion/vite'
import mfeConfig from './mfe.json'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const env = loadEnv(mode, process.cwd(), '')
  const appCode = env.VITE_PAVILION_APP_CODE

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
