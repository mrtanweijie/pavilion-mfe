/// <reference types="vite/client" />

interface ImportMetaEnv {
  PAVILION_MODE?: 'standalone' | 'mfe'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
