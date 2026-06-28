import type { Sandbox } from '@pavilion-mfe/sandbox'

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

// ─── Router configuration ───

/** Hook context passed to router lifecycle hooks */
export interface HookContext {
  appCode: string
  basename: string
  path: string
  trigger: 'init' | 'pushState' | 'replaceState' | 'popstate'
  ms?: number
  error?: unknown
}

/** Lifecycle hooks for external APM / observability integration */
export interface RouterHooks {
  beforeLoad?: (ctx: HookContext) => void
  afterLoad?: (ctx: HookContext) => void
  beforeMount?: (ctx: HookContext) => void
  afterMount?: (ctx: HookContext) => void
  beforeUnmount?: (ctx: HookContext) => void
  afterUnmount?: (ctx: HookContext) => void
  beforeCache?: (ctx: HookContext) => void
  afterRestore?: (ctx: HookContext) => void
  onError?: (ctx: HookContext) => void
}

/** Configuration for createRouter */
export interface RouterConfig {
  apps?: SegmentApp[]
  /** Global max cached segments (LRU eviction). Default: 5 */
  maxCache?: number
  /** Lifecycle hooks for external monitoring */
  hooks?: RouterHooks
}
