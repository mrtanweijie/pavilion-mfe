/** Built-in PavilionMfe routing events dispatched by createRouter.
 *  These match the event names used by window.dispatchEvent in create-router.ts. */
export enum MFEEvent {
  /** Fired before shell routing (pushState/replaceState/popstate/init) */
  BEFORE_ROUTING = 'pavilion-mfe:before-routing',
  /** Fired after shell routing completes */
  AFTER_ROUTING = 'pavilion-mfe:after-routing',
  /** Fired when switching from one segment to another */
  SEGMENT_SWITCH = 'pavilion-mfe:segment-switch',
  /** Fired before a segment is cached (keep-alive) */
  BEFORE_CACHE = 'pavilion-mfe:before-cache',
  /** Fired after a cached segment is restored */
  AFTER_RESTORE = 'pavilion-mfe:after-restore',
  /** Fired when a segment encounters an error */
  SEGMENT_ERROR = 'pavilion-mfe:segment-error',
}

export interface RouteChangeDetail {
  matched: string[]
  componentName?: string
  name?: string
  href: string
  fullPath: string
  path: string
  query: Record<string, string>
  params: Record<string, string>
  meta: Record<string, unknown>
}

export interface SwitchAppDetail {
  previousApp?: { appCode?: string }
  nextApp?: { appCode?: string }
}

export interface BridgeOptions {
  /** Identifies the app in the bridge */
  appCode: string
  /** 'shell' for the host, 'segment' for child apps */
  role: 'shell' | 'segment'
}

export type EventCallback<T = unknown> = (detail: T) => void

export interface Subscription {
  event: string
  /** Unique id for tracking */
  id: string
  unsubscribe: () => void
}
