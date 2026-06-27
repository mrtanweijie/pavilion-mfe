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
        name: 'segment-main',
        remotes: command === 'serve' ? remotes : undefined,
        pavilionRemotes: command === 'build' ? pavilionRemotes : undefined,
        // 开发模式禁用远程 DTS 类型下载（避免段未启动时刷屏警告）
        dts: command === 'serve' ? false : undefined,
      }),
    ],
    server: { port: 6010 },
  }
})
