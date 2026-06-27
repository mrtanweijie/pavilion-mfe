export class ProxySandbox {
  private fakeWindow: Record<string | symbol, unknown> = {}
  private proxyWindow: Window
  public active = false

  constructor(public appCode: string) {
    this.proxyWindow = new Proxy(window, {
      get: (target, key) => {
        if (key in this.fakeWindow) {
          return this.fakeWindow[key]
        }
        return (target as unknown as Record<string | symbol, unknown>)[key]
      },
      set: (_target, key, value) => {
        if (this.active) {
          this.fakeWindow[key] = value
        }
        return true
      },
      has: (target, key) => {
        return key in this.fakeWindow || key in target
      },
      getOwnPropertyDescriptor: (_target, key) => {
        if (key in this.fakeWindow) {
          return {
            configurable: true,
            enumerable: true,
            value: this.fakeWindow[key],
          }
        }
        return Reflect.getOwnPropertyDescriptor(window, key)
      },
      ownKeys: () => {
        return [
          ...new Set([
            ...Reflect.ownKeys(this.fakeWindow),
            ...Reflect.ownKeys(window),
          ]),
        ]
      },
    })
  }

  activate(segmentCode: () => void): void {
    this.active = true
    segmentCode()
    this.active = false
  }

  deactivate(): void {
    this.fakeWindow = {}
  }
}
