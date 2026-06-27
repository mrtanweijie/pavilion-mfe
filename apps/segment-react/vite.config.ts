import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pavilion } from '@pavilion/vite'

export default defineConfig({
  plugins: [
    react(),
    pavilion({
      role: 'segment',
      name: 'react-app',
      exposes: {
        './main': './src/main.tsx',
      },
      openDevServe: true,
      port: 6030,
    }),
  ],
  server: { port: 6030 },
})
