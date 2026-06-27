/**
 * Path matching utility.
 * Extracted from chagee's app.js — prefix-based routing.
 */

export interface SegmentRouteConfig {
  name: string
  routes: string[]
}

/**
 * Match a URL path to a segment by prefix.
 * Both sides normalize trailing slashes for consistent matching.
 */
export function matchAppByPath(
  path: string,
  segments: SegmentRouteConfig[]
): SegmentRouteConfig | null {
  if (!path) return null

  // Extract pathname from full URLs
  if (/^(https?:\/\/)/.test(path)) {
    path = new URL(path, location.origin).pathname || ''
  }

  for (const seg of segments) {
    const matched = seg.routes.some((route) =>
      path.replace(/\/?$/, '/').startsWith(route.replace(/\/?$/, '/'))
    )
    if (matched) return seg
  }
  return null
}

export function navigateTo(
  url: string,
  options: { replace?: boolean; open?: boolean } = {}
): void {
  if (options.open) {
    window.open(url)
    return
  }

  if (options.replace) {
    window.history.replaceState(null, '', url)
  } else {
    window.history.pushState(null, '', url)
  }

  // Dispatch synthetic popstate so custom routers pick up the change
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
}
