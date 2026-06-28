export { createRouter } from './create-router.js'
export { matchAppByPath, navigateTo, createPathMatcher } from './match-app.js'
export { isPavilionShell } from './env.js'
export type {
  SegmentApp,
  SegmentLifecycle,
  AppContext,
  ShellConfig,
  RegisteredApp,
  AppStatus,
  SegmentRouteConfig,
  RouterConfig,
  RouterHooks,
  HookContext,
} from './types.js'

// Re-export logger from @pavilion/sandbox for convenience
export {
  pavilionLog,
  pavilionError,
  configureLog,
  isLogEnabled,
} from '@pavilion/sandbox'
export type { LogModule, PavilionLogConfig } from '@pavilion/sandbox'
