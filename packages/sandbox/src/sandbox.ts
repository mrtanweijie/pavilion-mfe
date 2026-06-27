/**
 * Side-effect tracker for micro-frontend segments.
 *
 * Uses a module-level stack to support multiple concurrent sandboxes.
 * Globals are patched once; each side-effect is attributed to the
 * sandbox on top of the stack at creation time.
 */

interface TrackedListener {
  target: EventTarget
  type: string
  handler: any
  options?: any
}

// ─── Module-level: original method references ───
const origSetTimeout = globalThis.setTimeout.bind(globalThis)
const origSetInterval = globalThis.setInterval.bind(globalThis)
const origClearTimeout = globalThis.clearTimeout.bind(globalThis)
const origClearInterval = globalThis.clearInterval.bind(globalThis)
const origAddEventListener = globalThis.addEventListener.bind(globalThis)
const origRemoveEventListener = globalThis.removeEventListener.bind(globalThis)

// ─── Module-level: active sandbox stack ───
const activeStack: Sandbox[] = []
let globalsPatched = false

function patchGlobals(): void {
  if (globalsPatched) return
  globalsPatched = true

  globalThis.setTimeout = ((handler: any, timeout?: any, ...args: any[]) => {
    const id = origSetTimeout(handler, timeout, ...args) as number
    const active = activeStack[activeStack.length - 1]
    if (active) active._timeouts.add(id)
    return id
  }) as any

  globalThis.setInterval = ((handler: any, timeout?: any, ...args: any[]) => {
    const id = origSetInterval(handler, timeout, ...args) as number
    const active = activeStack[activeStack.length - 1]
    if (active) active._intervals.add(id)
    return id
  }) as any

  globalThis.clearTimeout = ((id: any) => {
    for (const s of activeStack) s._timeouts.delete(id)
    origClearTimeout(id)
  }) as any

  globalThis.clearInterval = ((id: any) => {
    for (const s of activeStack) s._intervals.delete(id)
    origClearInterval(id)
  }) as any

  globalThis.addEventListener = ((type: any, handler: any, options?: any) => {
    if (handler) {
      const active = activeStack[activeStack.length - 1]
      if (active) {
        active._listeners.push({ target: globalThis, type, handler, options })
      }
    }
    origAddEventListener(type, handler, options)
  }) as any

  globalThis.removeEventListener = ((type: any, handler: any, options?: any) => {
    for (const s of activeStack) {
      s._listeners = s._listeners.filter(
        (l) => !(l.type === type && l.handler === handler)
      )
    }
    origRemoveEventListener(type, handler, options)
  }) as any
}

export class Sandbox {
  /** @internal — tracked timeouts created while this sandbox was active */
  _timeouts: Set<number> = new Set()
  /** @internal — tracked intervals */
  _intervals: Set<number> = new Set()
  /** @internal — tracked event listeners */
  _listeners: TrackedListener[] = []

  private globalKeys: Set<string> = new Set()
  private activated = false

  constructor(public appCode: string) {}

  activate(): void {
    if (this.activated) return
    patchGlobals()
    activeStack.push(this)
    this.activated = true
  }

  deactivate(): void {
    if (!this.activated) return
    this.activated = false

    // Remove from active stack
    const idx = activeStack.lastIndexOf(this)
    if (idx !== -1) activeStack.splice(idx, 1)

    // Clean up tracked timers
    this._timeouts.forEach((id) => origClearTimeout(id))
    this._timeouts.clear()
    this._intervals.forEach((id) => origClearInterval(id))
    this._intervals.clear()

    // Clean up tracked listeners (use original to avoid re-entering the patched fn)
    this._listeners.forEach(({ type, handler, options }) => {
      origRemoveEventListener(type, handler, options)
    })
    this._listeners = []

    // Clean up tracked global keys
    this.globalKeys.forEach((key) => {
      delete (globalThis as any)[key]
    })
    this.globalKeys.clear()
  }

  trackGlobal(key: string): void {
    this.globalKeys.add(key)
  }
}
