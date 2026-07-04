/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface ImportMetaEnv {
  PAVILION_MODE?: 'standalone' | 'mfe'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
