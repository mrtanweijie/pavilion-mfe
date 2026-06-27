import { defineConfig } from 'vite'
import type { ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pavilion } from '@pavilion/vite'

export default defineConfig(({ command }: ConfigEnv) => ({
  plugins: [
    vue(),
    pavilion({
      role: 'segment',
      name: 'demo-app',
      exposes: {
        './main': './src/main.ts',
      },
      pavilionRemotes: {
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
}))
