import type { Sandbox } from '@pavilion/sandbox'

export interface SegmentApp {
  name: string
  load: () => Promise<SegmentLifecycle>
  activeWhen: (path: string) => boolean
}

export interface SegmentLifecycle {
  bootstrap?: (ctx: AppContext) => void | Promise<void>
  mount: (ctx: AppContext, el: HTMLElement) => (() => void) | Promise<(() => void) | void> | void
  unmount?: (ctx: AppContext, el: HTMLElement) => void | Promise<void>
  update?: (ctx: AppContext, props: Record<string, unknown>) => void | Promise<void>
}

export interface AppContext {
  appCode: string
  basename: string
  [key: string]: unknown
}

export interface ShellConfig {
  apps: SegmentApp[]
}

export type AppStatus =
  | 'NOT_LOADED'
  | 'LOADING'
  | 'NOT_MOUNTED'
  | 'MOUNTING'
  | 'MOUNTED'
  | 'UNMOUNTING'
  | 'UNMOUNTED'

export interface RegisteredApp {
  name: string
  app: () => Promise<SegmentLifecycle>
  activeWhen: (path: string) => boolean
  status: AppStatus
  lifecycle: SegmentLifecycle | null
  container: HTMLElement | null
  cleanup: (() => void) | null
  sandbox: Sandbox | null
}

export interface SegmentRouteConfig {
  name: string
  routes: string[]
}
