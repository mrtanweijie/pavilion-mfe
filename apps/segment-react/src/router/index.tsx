import { lazy, Suspense } from 'react'
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

function generateRouteConfig() {
  const { '404': notFound, ...pathConfig } = generatePathConfig() as Record<string, unknown>

  return [
    {
      path: '/',
      children: mapPathConfigToRoute(pathConfig),
    },
    {
      path: '*',
      element: wrapSuspense(notFound as GlobImporter),
    },
  ]
}

export const router: Router = createBrowserRouter(generateRouteConfig(), {
  basename: '/react',
})
