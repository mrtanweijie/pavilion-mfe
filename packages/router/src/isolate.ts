/**
 * Routing event isolation.
 * Extracted from chagee's routeingIsolation.js.
 */
export type PathMatcher = (path: string) => { appCode?: string } | null

export function setupRoutingIsolation(matchByPath: PathMatcher): void {
  const listenerMap = new WeakMap<EventListenerOrEventListenerObject, EventListener>()
  const origAdd = window.addEventListener.bind(window) as (...args: unknown[]) => void
  const origRemove = window.removeEventListener.bind(window) as (...args: unknown[]) => void

  window.addEventListener = function (
    type: unknown,
    listener: unknown,
    options?: unknown
  ): void {
    if (!listener || type !== 'popstate') {
      origAdd(type, listener, options)
      return
    }

    const appCode = (listener as Record<string, unknown>).__pavilion_app_code as string | undefined
    if (!appCode) {
      origAdd(type, listener, options)
      return
    }

    const proxyListener = ((event: Event) => {
      const matched = matchByPath(location.pathname)
      if (matched?.appCode === appCode) {
        ;(listener as EventListener)(event)
      }
    }) as EventListener

    listenerMap.set(listener as EventListenerOrEventListenerObject, proxyListener)
    origAdd(type, proxyListener, options)
  } as typeof window.addEventListener

  window.removeEventListener = function (
    type: unknown,
    listener: unknown,
    options?: unknown
  ): void {
    if (type === 'popstate' || type === 'hashchange') {
      const mapped = listener ? listenerMap.get(listener as EventListenerOrEventListenerObject) : undefined
      if (mapped) {
        origRemove(type, mapped, options)
        return
      }
    }
    origRemove(type, listener, options)
  } as typeof window.removeEventListener
}
