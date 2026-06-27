import type { SegmentApp, RegisteredApp } from './types.js'
import { Sandbox } from '@pavilion/sandbox'

/**
 * Micro-frontend lifecycle router.
 * Extracted from chagee's routerManager.js.
 *
 * Manages loading → bootstrap → mount → unmount lifecycle
 * for multiple segment apps based on URL path matching.
 * Attaches Sandbox isolation on mount, cleans up on unmount.
 */
export function createRouter(config?: { apps?: SegmentApp[] }) {
  const apps: RegisteredApp[] = []

  if (config?.apps) {
    config.apps.forEach((app) => register(app))
  }

  function register(app: SegmentApp): void {
    apps.push({
      name: app.name,
      app: app.load,
      activeWhen: app.activeWhen,
      status: 'NOT_LOADED',
      lifecycle: null,
      container: null,
      cleanup: null,
      sandbox: null,
    })
  }

  function getContainer(name: string): HTMLElement {
    const existing = document.getElementById(name)
    if (existing) return existing

    const div = document.createElement('div')
    div.id = name
    div.classList.add(`pavilion-segment-${name}`)
    document.getElementById('pavilion-container')?.appendChild(div)
    return div
  }

  function matchActiveApps(): RegisteredApp[] {
    const path = window.location.pathname
    return apps.filter((app) => app.activeWhen(path))
  }

  async function loadApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'NOT_LOADED') return
    app.status = 'LOADING'
    app.lifecycle = await app.app()
    if (app.lifecycle.bootstrap) {
      await app.lifecycle.bootstrap({ appCode: app.name, basename: '' })
    }
    app.status = 'NOT_MOUNTED'
  }

  async function mountApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'NOT_MOUNTED') return
    app.status = 'MOUNTING'

    // Activate side-effect sandbox before mounting
    const sandbox = new Sandbox(app.name)
    sandbox.activate()
    app.sandbox = sandbox

    const lifecycle = app.lifecycle!
    const container = getContainer(app.name)
    container.style.display = 'block'
    const cleanup = await lifecycle.mount(
      { appCode: app.name, basename: '' },
      container
    )
    app.container = container
    app.cleanup = cleanup ?? null
    app.status = 'MOUNTED'
  }

  async function unmountApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'MOUNTED') return
    app.status = 'UNMOUNTING'

    // Clean up side effects before unmounting
    app.sandbox?.deactivate()
    app.sandbox = null

    // Framework-level cleanup FIRST (React's root.unmount / Vue's app.unmount).
    // The framework owns the DOM inside the container — it must detach before
    // we wipe innerHTML, otherwise React's removeChild throws NotFoundError.
    if (app.cleanup) {
      app.cleanup()
      app.cleanup = null
    }

    const lifecycle = app.lifecycle!
    if (lifecycle.unmount && app.container) {
      await lifecycle.unmount({ appCode: app.name, basename: '' }, app.container)
    }
    if (app.container) {
      app.container.style.display = 'none'
    }
    // Reset to NOT_MOUNTED so the app can be re-mounted when the user
    // navigates back.  lifecycle.mount() creates fresh framework instances
    // (createRoot / createApp) each time, and bootstrap is one-shot init
    // that only needs to run once.
    app.status = 'NOT_MOUNTED'
  }

  async function reroute(): Promise<void> {
    // Loop until no more state transitions occur.
    // loadApp transitions NOT_LOADED → NOT_MOUNTED, which must be
    // picked up by a subsequent mountApp pass.  A single pass would
    // snapshots appsToMount before loadApp runs, missing the transition
    // and leaving the app stuck in NOT_MOUNTED (never rendered).
    // On client-side navigation this was accidentally masked because
    // navigateTo() fires both pushState and a synthetic popstate,
    // giving two reroute() calls; page refresh only gets one.
    //
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const activeApps = matchActiveApps()
      const appsToUnmount = apps.filter(
        (app) => !activeApps.includes(app) && app.status === 'MOUNTED'
      )
      const appsToLoad = activeApps.filter(
        (app) => app.status === 'NOT_LOADED'
      )
      const appsToMount = activeApps.filter(
        (app) => app.status === 'NOT_MOUNTED'
      )

      if (appsToUnmount.length === 0 && appsToLoad.length === 0 && appsToMount.length === 0) {
        break
      }

      await Promise.all(appsToUnmount.map(unmountApp))
      await Promise.all(appsToLoad.map(loadApp))
      await Promise.all(appsToMount.map(mountApp))
    }
  }

  function patchHistory(): void {
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    window.history.pushState = function (state, _title, url) {
      const urlBefore = window.location.href
      const result = originalPushState(state, _title, url)
      const urlAfter = window.location.href
      if (urlBefore !== urlAfter) {
        setTimeout(() => reroute(), 0)
      }
      return result
    } as typeof window.history.pushState

    window.history.replaceState = function (state, _title, url) {
      const urlBefore = window.location.href
      const result = originalReplaceState(state, _title, url)
      const urlAfter = window.location.href
      if (urlBefore !== urlAfter) {
        setTimeout(() => reroute(), 0)
      }
      return result
    } as typeof window.history.replaceState

    window.addEventListener('popstate', () => {
      setTimeout(() => reroute(), 0)
    })
  }

  function start(): void {
    patchHistory()
    setTimeout(() => reroute(), 0)
  }

  return {
    register,
    start,
    reroute,
    getApps: () => apps,
  }
}
