export { createRouter } from './create-router.js'
export { matchAppByPath, navigateTo } from './match-app.js'
export { setupRoutingIsolation } from './isolate.js'
export type {
  SegmentApp,
  SegmentLifecycle,
  AppContext,
  ShellConfig,
  RegisteredApp,
  AppStatus,
  SegmentRouteConfig,
} from './types.js'

// Re-export logger from @pavilion/sandbox for convenience
export {
  pavilionLog,
  pavilionError,
  configureLog,
  isLogEnabled,
} from '@pavilion/sandbox'
export type { LogModule, PavilionLogConfig } from '@pavilion/sandbox'
