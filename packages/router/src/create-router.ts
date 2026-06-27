import type { SegmentApp, RegisteredApp } from './types.js'
import { Sandbox, setRouteMatcher, pavilionLog } from '@pavilion/sandbox'

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
  let prevActiveAppCodes: string[] = []

  // Track keep-alive preference per app
  const keepAliveMap = new Map<string, boolean>()

  /**
   * Dispatch a Pavilion routing event.
   * Events: pavilion:before-routing, pavilion:after-routing, pavilion:segment-switch
   */
  function dispatch(name: string, detail: Record<string, unknown>): void {
    pavilionLog('router', name.replace('pavilion:', ''), detail)
    window.dispatchEvent(new CustomEvent(name, { detail }))
  }

  if (config?.apps) {
    config.apps.forEach((app) => register(app))
  }

  function register(app: SegmentApp): void {
    apps.push({
      name: app.name,
      app: app.load,
      activeWhen: app.activeWhen,
      basename: app.basename ?? '',
      status: 'NOT_LOADED',
      lifecycle: null,
      container: null,
      cleanup: null,
      sandbox: null,
    })
    keepAliveMap.set(app.name, app.keepAlive ?? false)
    pavilionLog('router', 'segment-register', { appCode: app.name, keepAlive: app.keepAlive ?? false, basename: app.basename ?? '' })
  }

  function getContainer(name: string): HTMLElement {
    const existing = document.getElementById(name)
    if (existing) return existing

    const div = document.createElement('div')
    div.id = name
    div.classList.add(`pavilion-${name}`)
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
    const t0 = performance.now()
    app.lifecycle = await app.app()
    if (app.lifecycle.bootstrap) {
      await app.lifecycle.bootstrap({ appCode: app.name, basename: '' })
    }
    app.status = 'NOT_MOUNTED'
    pavilionLog('router', 'segment-load', { appCode: app.name, ms: Math.round(performance.now() - t0) })
  }

  /**
   * Restore a CACHED app: re-show container + re-activate sandbox.
   * Framework instance is still alive — skip mount().
   */
  async function restoreApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'CACHED') return
    // Sandbox was kept alive — popstate proxy will now pass events through
    // since the segment's route is active again.
    if (app.container) {
      app.container.style.display = 'block'
    }
    app.status = 'MOUNTED'
    pavilionLog('router', 'segment-restore', { appCode: app.name })
  }

  async function mountApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'NOT_MOUNTED') return
    app.status = 'MOUNTING'

    // Activate side-effect sandbox before mounting
    const sandbox = new Sandbox(app.name)
    sandbox.activate()
    app.sandbox = sandbox

    const t0 = performance.now()
    const lifecycle = app.lifecycle!
    const container = getContainer(app.name)
    container.style.display = 'block'
    const cleanup = await lifecycle.mount(
      { appCode: app.name, basename: app.basename },
      container
    )
    app.container = container
    app.cleanup = cleanup ?? null
    app.status = 'MOUNTED'
    pavilionLog('router', 'segment-mount', { appCode: app.name, ms: Math.round(performance.now() - t0) })
  }

  async function unmountApp(app: RegisteredApp): Promise<void> {
    if (app.status !== 'MOUNTED') return
    app.status = 'UNMOUNTING'
    const t0 = performance.now()

    const useKeepAlive = keepAliveMap.get(app.name) ?? false

    if (useKeepAlive) {
      // Keep-alive: hide container, retain framework instance + DOM + sandbox.
      // Do NOT deactivate sandbox — the popstate proxy will block events
      // when the segment's route is inactive, and pass them through when
      // the user navigates back. Deactivating would remove the popstate
      // listener permanently, breaking the framework router on restore.
      if (app.container) {
        app.container.style.display = 'none'
      }
      app.status = 'CACHED'
      pavilionLog('router', 'segment-cache', { appCode: app.name, ms: Math.round(performance.now() - t0) })
      return
    }

    // Full unmount: deactivate sandbox (timers/listeners cleanup)
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
    app.status = 'NOT_MOUNTED'
    pavilionLog('router', 'segment-unmount', { appCode: app.name, ms: Math.round(performance.now() - t0) })
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
      const appsToRestore = activeApps.filter(
        (app) => app.status === 'CACHED'
      )

      if (appsToUnmount.length === 0 && appsToLoad.length === 0 && appsToMount.length === 0 && appsToRestore.length === 0) {
        break
      }

      await Promise.all(appsToUnmount.map(unmountApp))
      await Promise.all(appsToLoad.map(loadApp))
      await Promise.all(appsToMount.map(mountApp))
      await Promise.all(appsToRestore.map(restoreApp))
    }

    // Detect segment switch after reroute completes
    const currentCodes = matchActiveApps().map((a) => a.name).sort()
    const prevSorted = [...prevActiveAppCodes].sort()
    if (JSON.stringify(currentCodes) !== JSON.stringify(prevSorted)) {
      dispatch('pavilion:segment-switch', { from: prevActiveAppCodes, to: currentCodes })
      prevActiveAppCodes = currentCodes
    }
  }

  function patchHistory(): void {
    const originalPushState = window.history.pushState.bind(window.history)
    const originalReplaceState = window.history.replaceState.bind(window.history)

    function runReroute(trigger: string, url: string): void {
      // Parse path from url for route-guard detail
      let path = url
      try {
        path = new URL(url, location.origin).pathname
      } catch { /* url is already a path */ }
      const activeApps = matchActiveApps()
      const appCode = activeApps.length > 0 ? activeApps[0].name : ''
      dispatch('pavilion:before-routing', { url, trigger, path, appCode })
      setTimeout(() => {
        reroute().then(() => {
          dispatch('pavilion:after-routing', { url, trigger, path, appCode })
        })
      }, 0)
    }

    window.history.pushState = function (state, _title, url) {
      const urlBefore = window.location.href
      const result = originalPushState(state, _title, url)
      const urlAfter = window.location.href
      if (urlBefore !== urlAfter) {
        runReroute('pushState', urlAfter)
      }
      return result
    } as typeof window.history.pushState

    window.history.replaceState = function (state, _title, url) {
      const urlBefore = window.location.href
      const result = originalReplaceState(state, _title, url)
      const urlAfter = window.location.href
      if (urlBefore !== urlAfter) {
        runReroute('replaceState', urlAfter)
      }
      return result
    } as typeof window.history.replaceState

    window.addEventListener('popstate', () => {
      runReroute('popstate', window.location.href)
    })
  }

  function start(): void {
    pavilionLog('router', 'router-start', { segments: apps.length })

    // Set up route isolation: segment popstate listeners only fire when
    // the segment's route is active. This prevents inactive segments from
    // processing navigation events intended for other segments.
    setRouteMatcher((appCode, path) => {
      return apps.some(
        (app) => app.name === appCode && app.activeWhen(path)
      )
    })

    patchHistory()
    // Initial route: dispatch events for the first load
    const url = window.location.href
    const initPath = window.location.pathname
    const initApps = matchActiveApps()
    const initAppCode = initApps.length > 0 ? initApps[0].name : ''
    dispatch('pavilion:before-routing', { url, trigger: 'init', path: initPath, appCode: initAppCode })
    setTimeout(() => {
      reroute().then(() => {
        dispatch('pavilion:after-routing', { url, trigger: 'init', path: initPath, appCode: initAppCode })
      })
    }, 0)
  }

  return {
    register,
    start,
    reroute,
    getApps: () => apps,
  }
}
