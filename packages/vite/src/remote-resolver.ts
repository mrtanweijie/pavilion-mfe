/**
 * Remote dependency resolver.
 * Extracted from chagee's @xx/module-federation-vite.
 *
 * Converts pkg@version notation to CDN manifest URLs.
 */

export interface RemoteConfig {
  [name: string]: string // "pkg@latest" or "pkg@1.2.3"
}

export interface ResolvedRemote {
  [name: string]: string // resolved manifest URL
}

/**
 * @latest    → /mfe/{pkg}/mf-manifest-main.json
 * @1.2.3     → /static/mfe/{pkg}/1.2.3/mf-manifest-main.json
 */
export function resolveRemotes(remotes: RemoteConfig): ResolvedRemote {
  const resolved: ResolvedRemote = {}

  for (const [key, value] of Object.entries(remotes)) {
    const match = value.match(/(.+)@(.+)/)
    if (!match) {
      throw new Error(
        `[Pavilion] Invalid remote format for '${key}': '${value}'. Expected 'pkg@version'.`
      )
    }

    const [, pkg, version] = match

    if (version === 'latest') {
      resolved[key] = `/mfe/${pkg}/mf-manifest-main.json`
    } else {
      resolved[key] = `/static/mfe/${pkg}/${version}/mf-manifest-main.json`
    }
  }

  return resolved
}

/**
 * Build-time: generate the base URL for this segment's versioned output
 */
export function resolveBuildBase(cdn: string, pkg: string, version: string): string {
  return `${cdn}/mfe/${pkg}/${version}/`
}

/**
 * Dev-time: resolve to local dev server
 */
export function resolveDevBase(port: number, pkg: string): string {
  return `http://localhost:${port}/mfe/${pkg}/`
}
