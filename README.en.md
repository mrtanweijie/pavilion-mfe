# PavilionMfe

A **Module Federation**-based micro-frontend open-source framework. Extracted from production micro-frontend practices, featuring a custom-built router scheduler, JS sandbox isolation, CSS scope isolation, routing event system, event bridge, and developer toolchain.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Main App                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐       │
│  │  Router   │  │ EventBus │  │  Log System   │       │
│  │ Lifecycle │  │ Cross-App │  │ Per-Module    │       │
│  │ +Events   │  │ Comms     │  │ configureLog()│       │
│  └────┬─────┘  └────┬─────┘  └───────────────┘       │
│       │             │                                  │
│  ┌────▼─────────────▼───────────────────────────────┐  │
│  │              #pavilion-mfe-container              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ Sub-App A │  │ Sub-App B │  │ Sub-App C │       │  │
│  │  │ (Vue)     │  │ (React)   │  │ (Any)     │       │  │
│  │  │ + Sandbox │  │ + Sandbox │  │ + Sandbox │       │  │
│  │  │ +CSS:where│  │ +CSS:where│  │ +CSS:where│       │  │
│  │  │ +Route Iso│  │ +Route Iso│  │ +Route Iso│       │  │
│  │  └──────────┘  └──────────┘  └──────────┘        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│         preloadPlugin (MF runtime remote reg + preload) │
└──────────────────────────────────────────────────────┘
```

The **main app** handles layout, lifecycle orchestration, route distribution, and sub-app preloading.  
**Sub-apps** are independent micro-frontend applications that follow a unified `mount` / `unmount` lifecycle contract and can use any framework. Sub-apps have **zero `@pavilion-mfe/*` runtime code** — only `@pavilion-mfe/vite` as a build-time dependency.

### Package Dependency Graph

```
bridge (zero deps)    sandbox (zero deps, +logger)    tabs (zero deps)
    │                       │                            │
    │                       ▼                            │
    │                   router ─────────────────────────┘
    │                       │
    ▼                       ▼
  runtime (aggregation layer, MF Remote shared)
    │
    ▼
  vite (Vite plugin, wraps @module-federation/vite, build-time only)
```

## Packages

| Package | Description | Dependencies |
|---------|-------------|-------------|
| `@pavilion-mfe/bridge` | Main-sub app event communication (EventBus + StorageSync) | Zero deps |
| `@pavilion-mfe/sandbox` | JS sandbox isolation (stack-based side-effect tracking + route isolation + logger) | Zero deps |
| `@pavilion-mfe/tabs` | Multi-tab state management (Vue/React plugins + sessionStorage persistence) | Zero deps |
| `@pavilion-mfe/router` | Micro-frontend lifecycle router (routing events + popstate isolation) | `@pavilion-mfe/sandbox` `@pavilion-mfe/tabs` |
| `@pavilion-mfe/runtime` | Shared runtime kernel, exported as MF Remote to ensure singleton instances | `@pavilion-mfe/router` `@pavilion-mfe/bridge` `@pavilion-mfe/sandbox` |
| `@pavilion-mfe/vite` | Vite plugin wrapping Module Federation + CSS scoping | `@module-federation/vite` |
| `@pavilion-mfe/cli` | CLI tool (`pavilion-mfe dev` / `pavilion-mfe build`) | |
| `create-pavilion-mfe` | Project scaffolding (`npm create pavilion-mfe`) | |

## Core Concepts

### Lifecycle

Each sub-app exports a unified `SubAppLifecycle` contract:

```typescript
export default {
  bootstrap?: async (ctx) => {},          // one-time init (optional)
  mount:      async (ctx, el) => { /* mount into el */ },   // required
  unmount:    async (ctx, el) => { /* cleanup */ },         // optional
  update?:    async (ctx, props) => {},  // prop updates (optional)
}
```

State machine: `NOT_LOADED → LOADING → NOT_MOUNTED → MOUNTING → MOUNTED → UNMOUNTING → NOT_MOUNTED`

### Dual Isolation

#### JS Sandbox (Stack-based Side-Effect Tracking)

`Sandbox` uses a module-level `activeStack` to support concurrent instances. `patchGlobals()` runs once, intercepting `setTimeout` / `setInterval` / `addEventListener` — each side effect is attributed to the sandbox at the top of the stack. On unmount, all timers / listeners / globals are automatically cleaned up.

```typescript
import { Sandbox } from '@pavilion-mfe/sandbox'

const sandbox = new Sandbox('my-sub-app')
sandbox.activate()    // start tracking side effects
// ... all setTimeout/addEventListener calls are tracked
sandbox.deactivate()  // auto-cleanup all side effects
```

#### CSS Scoping (`:where()` Zero Specificity)

A PostCSS plugin automatically wraps sub-app selectors with a `:where(.pavilion-{name})` scope prefix. The `:where()` pseudo-class provides **zero specificity**, keeping scoped styles at the same priority as the original selectors and preventing specificity pollution.

```css
/* Input */
.card { color: red; }

/* Output (prefix = pavilion-mfe-dashboard) */
:where(.pavilion-mfe-dashboard) .card { color: red; }
```

`@keyframes` names are also auto-prefixed to prevent animation conflicts.

### Route Isolation

Sub-app-level `popstate` event isolation: the sandbox's `addEventListener` patch wraps `popstate` listeners in a proxy that only fires when `routeMatcher(appCode, path)` returns `true`. Inactive sub-apps never receive navigation events, preventing routing conflicts.

```typescript
// Set matcher during router startup
import { setRouteMatcher } from '@pavilion-mfe/sandbox'

setRouteMatcher((appCode, path) => {
  return apps.some(app => app.name === appCode && app.activeWhen(path))
})
```

### Environment Detection

The main app router injects `window.__PAVILION_MFE_ENV__ = true` on `start()`. Sub-apps can check this to determine whether they're running in the micro-frontend environment:

```typescript
// sub-app main.ts / main.tsx

/** Self-start in standalone mode */
if (!window.__PAVILION_MFE_ENV__) {
  // standalone mode: mount to local #root element
  const el = document.getElementById('root')
  // ...
}
```

Type declarations via `src/globals.d.ts` (module-scoped `export {}` + `declare global`):

```typescript
// src/globals.d.ts
export {}

declare global {
  interface Window {
    __PAVILION_MFE_ENV__?: boolean
  }
}
```

Sub-apps have **zero runtime dependencies** — no `@pavilion-mfe/*` package imports are needed to detect the environment.

### Routing Event System

The router dispatches `CustomEvent` at each navigation phase for analytics, loading states, etc.:

| Event | Timing | detail |
|-------|--------|--------|
| `pavilion-mfe:before-routing` | Before route change | `{ url, trigger, path, appCode }` |
| `pavilion-mfe:after-routing` | After route change | `{ url, trigger, path, appCode }` |
| `pavilion-mfe:sub-app-switch` | Active sub-app changes | `{ from: string[], to: string[] }` |
| `pavilion-mfe:before-cache` | Before sub-app enters keep-alive cache | `{ appCode }` |
| `pavilion-mfe:after-restore` | Sub-app restored from cache | `{ appCode }` |
| `pavilion-mfe:sub-app-error` | Sub-app load/mount failure | `{ appCode, phase, error }` |

```typescript
window.addEventListener('pavilion-mfe:sub-app-switch', (e) => {
  const { from, to } = (e as CustomEvent).detail
  console.log('Sub-app switch:', from, '→', to)
})
```

`trigger` values: `init` / `pushState` / `replaceState` / `popstate`

### Sub-App Keep-Alive Cache

Register a sub-app with `keepAlive: true` to preserve its framework instance when switching away — only the DOM is hidden (`display: none`). On return, the sub-app is restored instantly without re-mounting, preserving all internal state:

```typescript
const pavilionMfeRouter = createPavilionMfeRouter({
  apps: mfeApps.map((seg) => ({
    name: seg.appCode,
    load: async () => { /* ... */ },
    activeWhen: (path) => seg.routes.some(/* ... */),
    keepAlive: true,  // ← enable cache
  })),
})
```

State machine with `CACHED`: `MOUNTED → (unmount) → CACHED → (restore) → MOUNTED`

The sandbox does **not** `deactivate()` when cached — the popstate proxy is retained, but inactive sub-apps won't receive navigation events. On restore, only `display: block` is needed (no re-mount). Full `deactivate()` + `unmount()` only occurs on global LRU eviction.

### Runtime Preloading

`preloadPlugin`, as a Module Federation runtime plugin, dynamically registers all sub-apps as MF remotes during the `beforeInit` phase with a preloading strategy:

- **Current sub-app**: immediately loaded via `loadRemote` (user is waiting)
- **Other sub-apps**: idle-prefetched via `preloadRemote` after 1 second

```typescript
// vite.config.ts (main app)
PavilionMfe({
  role: 'main-app',
  name: 'segment-main',
  runtimePlugins: ['./src/preloadPlugin'],  // replaces static pavilionMfeRemotes
})
```

### Logging System

Per-module configurable console logging to help debug micro-frontend runtime behavior. All log output is CSS-styled.

```typescript
import { configureLog } from '@pavilion-mfe/router'

configureLog({
  enabled: true,
  modules: {
    router:  true,   // routing events + sub-app lifecycle
    sandbox: true,   // sandbox activate/deactivate + popstate interception
    preload: true,   // MF remote registration + preload status
    bridge:  true,   // EventBus emit/subscribe + StorageSync
  },
})
```

Sample log output:

```
[PavilionMfe] router    router-start       subApps=2
[PavilionMfe] router    sub-app-register   appCode=demo-app
[PavilionMfe] router    before-routing     trigger=pushState  url=/demo/list
[PavilionMfe] sandbox   sandbox-activate   appCode=demo-app
[PavilionMfe] router    sub-app-load       appCode=demo-app  ms=320
[PavilionMfe] router    sub-app-mount      appCode=demo-app  ms=45
[PavilionMfe] sandbox   popstate-blocked   appCode=demo-app  path=/react/dashboard
[PavilionMfe] router    sub-app-switch     demo-app → react-app
[PavilionMfe] sandbox   sandbox-deactivate appCode=demo-app  timers=3  intervals=1  listeners=2
[PavilionMfe] preload   register           remotes=2  apps=demo-app, react-app
[PavilionMfe] bridge    event-emit         name=user-login  listeners=3
```

Colors: `[PavilionMfe]` green / module name cyan / event name orange / key-value pairs gray

### Multi-Tab Management

`@pavilion-mfe/tabs` provides a framework-agnostic state management core with Vue and React plugins for multi-tab navigation in the main app:

**Vue**

```typescript
// main.ts
import { tabsPlugin } from '@pavilion-mfe/tabs/vue'
app.use(tabsPlugin)

// any component
import { useTabs } from '@pavilion-mfe/tabs/vue'

const { tabs, activeTabId, openTab, closeTab, closeOthers, closeAll } = useTabs()

openTab({ path: '/demo/list', title: 'List' })
closeOthers(tabId)
closeAll()
```

**React**

```tsx
// App.tsx
import { TabsProvider } from '@pavilion-mfe/tabs/react'

<TabsProvider>
  <App />
</TabsProvider>

// any component
import { useTabs } from '@pavilion-mfe/tabs/react'

const { tabs, openTab, closeAll } = useTabs()
```

Tab state is persisted via `sessionStorage` and automatically restored on page refresh. Vue and React plugins share the same storage key.

### Communication

`EventBus` provides a pub/sub event bus with `appCode`-targeted delivery. `StorageSync` provides LocalStorage reactive subscriptions. `@pavilion-mfe/runtime` is exported as an MF Shared Remote, ensuring all apps share the same EventBus and StorageSync singleton.

### Registry

The main app declares all sub-apps via `mfe.json`:

```json
{
  "apps": [
    {
      "appCode": "demo-app",
      "name": "Demo (Vue)",
      "cdn": "",
      "routes": ["/demo", "/vue-sub"],
      "devPort": 6020,
      "keepAlive": true
    },
    {
      "appCode": "react-app",
      "name": "Demo (React)",
      "cdn": "",
      "routes": ["/react"],
      "devPort": 6030
    }
  ]
}
```

Single source of truth for route registration and build configuration. Menu data is provided by a backend API, decoupled from sub-app configuration.

## Build Optimizations

`@pavilion-mfe/vite` automatically applies these optimizations in build mode:

| Optimization | Description |
|-------------|-------------|
| `esbuild.drop: ['debugger']` | Remove debugger statements in production |
| `sourcemap: false` | Disable sourcemaps for smaller bundles |
| `cssCodeSplit: true` | Split CSS by route |
| chunk naming | `static/js/[name]-[hash].js` / `static/[ext]/[name]-[hash].[ext]` |
| `publicDir: false` (main app) | No static assets directory for the main app |
| Top-Level Await | Auto-injected `vite-plugin-top-level-await` (required for MF shared) |

### Dev Server Proxy

Configure dev-mode proxy rules via `PavilionMfePluginOptions.proxy`:

```typescript
PavilionMfe({
  role: 'main-app',
  proxy: { '/api': 'http://localhost:3000' },
})
```

## Multi-Repository Architecture

In production, the main app and each sub-app reside in separate Git repositories and are released independently:

| Role | `@pavilion-mfe/*` Dependencies | Notes |
|------|-------------------------------|-------|
| Main App | `@pavilion-mfe/router` `@pavilion-mfe/sandbox` (runtime) + `@pavilion-mfe/vite` (devDep) | Runtime needs router and sandbox |
| Sub-App | `@pavilion-mfe/vite` (devDep only) | Build-time only, no `@pavilion-mfe/*` code at runtime |

Sub-apps can independently release after updating `@pavilion-mfe/vite` — **no impact on main app runtime**, no main app rebuild required.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build core packages
pnpm -r build

# Start all dev servers (main app + sub-apps)
pnpm dev
```

Main app runs at `http://localhost:6010`, Vue sub-app at `6020`, React sub-app at `6030`.

### Using the CLI

```bash
# One-click start (auto-build deps + parallel dev)
pnpm pavilion-mfe dev

# Production build
pnpm pavilion-mfe build

# Create a new project
npm create pavilion-mfe
```

## Development

```bash
# Start main app only (sub-apps need separate startup)
cd apps/segment-main && pnpm dev

# Start Vue 3 sub-app (standalone or alongside main app)
cd apps/segment-demo && pnpm dev

# Start Vue 2 sub-app
cd apps/segment-vue2 && pnpm dev

# Start React sub-app
cd apps/segment-react && pnpm dev

# Rebuild core packages after changes (in dependency order)
pnpm --filter @pavilion-mfe/sandbox build
pnpm --filter @pavilion-mfe/bridge build
pnpm --filter @pavilion-mfe/router build    # depends on sandbox
pnpm --filter @pavilion-mfe/vite build
```

## License

MIT
