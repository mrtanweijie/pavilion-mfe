/** Built-in MFE events (extracted from chagee's event protocol) */
export enum MFEEvent {
  /** Fired before a child app route changes (from beforeEach) */
  ROUTE_BEFORE_CHANGE = 'pavilion:route-before-change',
  /** Fired after a child app route changes (from afterEach) */
  ROUTE_AFTER_CHANGE = 'pavilion:route-after-change',
  /** Fired when switching from one segment to another */
  SEGMENT_SWITCH = 'pavilion:segment-switch',
  /** Fired before shell routing event (pushState/replaceState) */
  ROUTING_BEFORE = 'pavilion:routing-before',
  /** Fired after shell routing event */
  ROUTING_AFTER = 'pavilion:routing-after',
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
