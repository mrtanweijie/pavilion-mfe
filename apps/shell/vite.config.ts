import { defineConfig } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pavilion } from '@pavilion/vite'
import mfeConfig from './mfe.json'

export default defineConfig(({ command }: ConfigEnv) => {
  const remotes: Record<string, string> = {}
  const pavilionRemotes: Record<string, string> = {}

  mfeConfig.apps.forEach((app) => {
    if (command === 'serve' && app.devPort) {
      remotes[app.appCode] = `${app.appCode}@http://localhost:${app.devPort}/mf-manifest-main.json`
    } else {
      pavilionRemotes[app.appCode] = `${app.appCode}@latest`
    }
  })

  return {
    plugins: [
      vue(),
      pavilion({
        role: 'shell',
        name: 'demo-shell',
        remotes: command === 'serve' ? remotes : undefined,
        pavilionRemotes: command === 'build' ? pavilionRemotes : undefined,
      }),
    ],
    server: { port: 6010 },
  }
})
