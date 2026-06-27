import type { Sandbox } from '@pavilion/sandbox'

export interface SegmentApp {
  name: string
  load: () => Promise<SegmentLifecycle>
  activeWhen: (path: string) => boolean
  /** Route prefix passed to the segment as ctx.basename (e.g. '/react') */
  basename?: string
  /** Keep this segment's framework instance alive when unmounted (display:none only) */
  keepAlive?: boolean
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
  | 'CACHED'  // keep-alive: framework instance retained, display:none

export interface RegisteredApp {
  name: string
  app: () => Promise<SegmentLifecycle>
  activeWhen: (path: string) => boolean
  basename: string
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
