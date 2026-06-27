#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const TEMPLATES: Record<string, Record<string, string>> = {
  'segment-main.ts': {
    path: 'src/segment-main.ts',
    content: `/**
 * Pavilion segment lifecycle entry.
 * Export mount/unmount to be loaded by the Shell.
 */
export default {
  mount: async (ctx: { appCode: string; basename: string }, el: HTMLElement) => {
    // Your mount logic here
    el.innerHTML = '<h1>Hello from Pavilion!</h1>'
  },
  unmount: async () => {
    // Cleanup
  },
}
`,
  },
  'vite.config.ts': {
    path: 'vite.config.ts',
    content: `import { defineConfig } from 'vite'
import { pavilion } from '@pavilion/vite'

export default defineConfig({
  plugins: [
    pavilion({
      role: 'segment',
      name: process.env.npm_package_name ?? 'my-app',
      exposes: { './main': './src/segment-main.ts' },
      shared: [],
    }),
  ],
})
`,
  },
  'VERSION': {
    path: 'VERSION',
    content: '0.1.0\n',
  },
  'package.json': {
    path: 'package.json',
    content: JSON.stringify(
      {
        name: 'my-pavilion-segment',
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          'build:mfe': 'vite build --mode mfe',
        },
      },
      null,
      2
    ),
  },
  'index.html': {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>My Pavilion Segment</title></head>
<body><div id="app"></div><script type="module" src="/src/main.ts"></script></body>
</html>
`,
  },
}

async function main(): Promise<void> {
  const projectName = process.argv[2] ?? 'my-pavilion-app'
  const projectDir = resolve(process.cwd(), projectName)

  if (existsSync(projectDir)) {
    console.error(`Directory ${projectName} already exists.`)
    process.exit(1)
  }

  mkdirSync(projectDir, { recursive: true })
  mkdirSync(resolve(projectDir, 'src'))

  for (const [, template] of Object.entries(TEMPLATES)) {
    const filePath = resolve(projectDir, template.path)
    const dir = filePath.substring(0, filePath.lastIndexOf('/'))
    mkdirSync(dir, { recursive: true })
    writeFileSync(filePath, template.content, 'utf-8')
  }

  console.log(`✅ Created Pavilion app at ${projectDir}`)
  console.log()
  console.log('  cd', projectName)
  console.log('  npm install')
  console.log('  npm run dev')
}

main().catch(console.error)
