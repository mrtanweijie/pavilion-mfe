import { lazy, Suspense, useLayoutEffect } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import type { Router } from '@remix-run/router'

// ---------- 工具：深设对象路径值 ----------
function deepSet(obj: Record<string, any>, path: string[], value: any) {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) current[path[i]] = {}
    current = current[path[i]]
  }
  current[path[path.length - 1]] = value
}

// ---------- 扫描 pages 目录自动生成路由 ----------
const pageModules = import.meta.glob('/src/pages/**/*.tsx')

function generatePathConfig() {
  const pathConfig: Record<string, unknown> = {}
  Object.keys(pageModules).forEach((filePath) => {
    const routePath = filePath
      .replace('/src/pages/', '')
      .replace(/.tsx?$/, '')
      // 转换动态路由 $[foo].tsx => :foo
      .replace(/\$\[([\w-]+)]/, ':$1')
      .split('/')
    deepSet(pathConfig, routePath, pageModules[filePath])
  })
  return pathConfig
}

function wrapSuspense(importer: (() => Promise<{ default: React.ComponentType }>) | undefined) {
  if (!importer) return undefined
  const Component = lazy(importer)
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
}

type GlobImporter = () => Promise<{ default: React.ComponentType }>

function mapPathConfigToRoute(cfg: Record<string, unknown>): any[] {
  return Object.entries(cfg).map(([routePath, child]) => {
    if (typeof child === 'function') {
      const isIndex = routePath === 'index'
      return {
        index: isIndex,
        path: isIndex ? undefined : routePath,
        element: wrapSuspense(child as GlobImporter),
      }
    }
    const { layout, ...rest } = child as Record<string, unknown>
    return {
      path: routePath,
      element: wrapSuspense(layout as GlobImporter | undefined),
      children: mapPathConfigToRoute(rest as Record<string, unknown>),
    }
  })
}

/**
 * In Shell mode: redirect to the Shell's /404 page via replaceState +
 * synthetic popstate (triggers PavilionMfe router to unmount this segment
 * and Shell's router to render the 404 page).
 * Uses useLayoutEffect to fire before browser paint, preventing the
 * user from briefly seeing the segment's App.tsx heading.
 * In standalone mode: render the segment's own 404 component.
 */
function RedirectToShell404({ fallback }: { fallback?: React.ReactNode }) {
  const isShell = !!window.__PAVILION_MFE_ENV__

  useLayoutEffect(() => {
    if (isShell) {
      window.history.replaceState(null, '', '/404')
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
    }
  }, [isShell])

  if (isShell) return null
  return <>{fallback}</>
}

export function generateRouteConfig() {
  const { '404': notFound, ...pathConfig } = generatePathConfig() as Record<string, unknown>

  return [
    {
      path: '/',
      children: mapPathConfigToRoute(pathConfig),
    },
    {
      path: '*',
      element: <RedirectToShell404 fallback={wrapSuspense(notFound as GlobImporter)} />,
    },
  ]
}

/**
 * Create a browser router for segment mode (inside Shell).
 * Called inside mount() where the Sandbox is already active,
 * so popstate listeners are properly isolated — they only fire
 * when the segment's route is active, preventing basename
 * mismatch warnings when navigating to other segments.
 */
export function createSegmentRouter(basename: string = '/react'): Router {
  return createBrowserRouter(generateRouteConfig(), {
    basename,
  })
}

/**
 * Create a browser router for standalone mode.
 */
export function createStandaloneRouter(): Router {
  return createBrowserRouter(generateRouteConfig(), {
    basename: '/react',
  })
}
