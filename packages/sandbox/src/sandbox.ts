/**
 * Side-effect tracker for micro-frontend segments.
 *
 * Hooks into common side-effect APIs at mount time,
 * cleans up all tracked resources at unmount time.
 */

interface TrackedListener {
  target: EventTarget
  type: string
  handler: any
  options?: any
}

export class Sandbox {
  private timeouts: Set<number> = new Set()
  private intervals: Set<number> = new Set()
  private listeners: TrackedListener[] = []
  private globalKeys: Set<string> = new Set()
  private activated = false

  // Store originals as `any` to avoid TS overload mismatches with runtime overrides
  private origSetTimeout: any
  private origSetInterval: any
  private origClearTimeout: any
  private origClearInterval: any
  private origAddEventListener: any
  private origRemoveEventListener: any

  constructor(public appCode: string) {
    this.origSetTimeout = globalThis.setTimeout.bind(globalThis)
    this.origSetInterval = globalThis.setInterval.bind(globalThis)
    this.origClearTimeout = globalThis.clearTimeout.bind(globalThis)
    this.origClearInterval = globalThis.clearInterval.bind(globalThis)
    this.origAddEventListener = globalThis.addEventListener.bind(globalThis)
    this.origRemoveEventListener = globalThis.removeEventListener.bind(globalThis)
  }

  activate(): void {
    if (this.activated) return
    this.activated = true

    globalThis.setTimeout = ((handler: any, timeout?: any, ...args: any[]) => {
      const id = this.origSetTimeout(handler, timeout, ...args) as number
      this.timeouts.add(id)
      return id
    }) as any

    globalThis.setInterval = ((handler: any, timeout?: any, ...args: any[]) => {
      const id = this.origSetInterval(handler, timeout, ...args) as number
      this.intervals.add(id)
      return id
    }) as any

    globalThis.clearTimeout = ((id: any) => {
      this.timeouts.delete(id)
      this.origClearTimeout(id)
    }) as any

    globalThis.clearInterval = ((id: any) => {
      this.intervals.delete(id)
      this.origClearInterval(id)
    }) as any

    globalThis.addEventListener = ((type: any, handler: any, options?: any) => {
      if (handler) {
        this.listeners.push({ target: globalThis, type, handler, options })
      }
      this.origAddEventListener(type, handler, options)
    }) as any
  }

  deactivate(): void {
    if (!this.activated) return
    this.activated = false

    this.timeouts.forEach((id) => this.origClearTimeout(id))
    this.timeouts.clear()
    this.intervals.forEach((id) => this.origClearInterval(id))
    this.intervals.clear()

    this.listeners.forEach(({ target, type, handler, options }) => {
      target.removeEventListener(type, handler, options)
    })
    this.listeners = []

    globalThis.setTimeout = this.origSetTimeout
    globalThis.setInterval = this.origSetInterval
    globalThis.clearTimeout = this.origClearTimeout
    globalThis.clearInterval = this.origClearInterval
    globalThis.addEventListener = this.origAddEventListener
    globalThis.removeEventListener = this.origRemoveEventListener

    this.globalKeys.forEach((key) => {
      delete (globalThis as any)[key]
    })
    this.globalKeys.clear()
  }

  trackGlobal(key: string): void {
    this.globalKeys.add(key)
  }
}
