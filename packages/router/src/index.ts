export { createRouter } from './create-router.js'
export { matchAppByPath, navigateTo, createPathMatcher } from './match-app.js'
export { isPavilionMfeShell } from './env.js'
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

// Re-export logger from @pavilion-mfe/sandbox for convenience
export {
  pavilionMfeLog,
  pavilionMfeError,
  configureLog,
  isLogEnabled,
} from '@pavilion-mfe/sandbox'
export type { LogModule, PavilionMfeLogConfig } from '@pavilion-mfe/sandbox'
