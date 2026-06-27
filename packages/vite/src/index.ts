import type { PluginOption } from 'vite'
import { federation as mfFederation } from '@module-federation/vite'
import type { ModuleFederationOptions } from '@module-federation/vite'
import type { PavilionPluginOptions } from './config-types.js'
import { resolveRemotes } from './remote-resolver.js'
import { wsDiscoveryPlugin } from './ws-discovery.js'
import { cssScopePlugin } from './css-scope.js'

export { resolveRemotes, wsDiscoveryPlugin, cssScopePlugin }
export type * from './config-types.js'

export function pavilion(options: PavilionPluginOptions): PluginOption[] {
  const plugins: PluginOption[] = []

  // ─── 1. Build config: base URL ───
  plugins.push({
    name: 'pavilion:build-config',
    apply: 'build',
    config: (config) => {
      if (options.role === 'segment' || options.role === 'runtime') {
        config.base = `${options.cdn ?? ''}/mfe/${options.name ?? 'unknown'}/`
      }
    },
  } as PluginOption)

  // ─── 2. Module Federation ───
  const mfOptions: ModuleFederationOptions = {
    name: options.name ?? 'pavilion-app',
  }

  if (options.pavilionRemotes && Object.keys(options.pavilionRemotes).length > 0) {
    const resolved = resolveRemotes(options.pavilionRemotes)
    mfOptions.remotes = { ...resolved, ...options.remotes }
  } else if (options.remotes && Object.keys(options.remotes).length > 0) {
    mfOptions.remotes = options.remotes
  }

  if (options.exposes) mfOptions.exposes = options.exposes
  if (options.shared) mfOptions.shared = options.shared as ModuleFederationOptions['shared']
  if (options.shareStrategy) mfOptions.shareStrategy = options.shareStrategy
  if (options.runtimePlugins) mfOptions.runtimePlugins = options.runtimePlugins

  // Manifest at root level (no filePath) so relative paths resolve correctly
  if (options.manifest !== false) {
    mfOptions.manifest = typeof options.manifest === 'object'
      ? options.manifest as ModuleFederationOptions['manifest']
      : { fileName: 'mf-manifest-main.json' }
  }

  plugins.push(mfFederation(mfOptions))

  // ─── 3. CSS Scope (segment builds only) ───
  if (options.role === 'segment' || options.role === 'runtime') {
    const scopePrefix = `pavilion-${options.name ?? 'unknown'}`

    plugins.push({
      name: 'pavilion:css-scope',
      enforce: 'post',
      config: (config) => {
        const cssConfig = config.css = config.css ?? {}
        const postcss = (cssConfig as Record<string, unknown>).postcss = 
          (cssConfig as Record<string, unknown>).postcss ?? {}

        const scopePlugin = cssScopePlugin({
          prefix: scopePrefix,
          exclude: options.cssExclude,
        })

        const existingPlugins = ((postcss as { plugins?: unknown[] }).plugins ?? [])
        ;(postcss as { plugins: unknown[] }).plugins = [...existingPlugins, scopePlugin]
      },
    } as PluginOption)
  }

  // ─── 4. Dev-time WS port discovery ───
  if (options.openDevServe && options.role === 'segment' && options.port) {
    plugins.push(
      wsDiscoveryPlugin({ port: options.port, name: options.name })
    )
  }

  return plugins
}
