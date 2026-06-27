# Pavilion

基于 **Module Federation** 的微前端开源框架。提取自生产环境的微前端实践，核心包含自研的路由调度器、JS 沙箱隔离、CSS 作用域隔离、路由事件系统、事件桥接和开发者工具链。

## 架构

```
┌──────────────────────────────────────────────────────┐
│                    Shell (壳应用)                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐       │
│  │  Router   │  │ EventBus │  │  Log System   │       │
│  │ 生命周期   │  │ 跨段通信  │  │ 分模块开关     │       │
│  │ +路由事件  │  │ +Storage │  │ configureLog() │       │
│  └────┬─────┘  └────┬─────┘  └───────────────┘       │
│       │             │                                  │
│  ┌────▼─────────────▼───────────────────────────────┐  │
│  │              #pavilion-container                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│  │  │ Segment A │  │ Segment B │  │ Segment C │       │  │
│  │  │ (Vue)     │  │ (React)   │  │ (任意框架) │       │  │
│  │  │ + Sandbox │  │ + Sandbox │  │ + Sandbox │       │  │
│  │  │ +CSS:where│  │ +CSS:where│  │ +CSS:where│       │  │
│  │  │ +路由隔离  │  │ +路由隔离  │  │ +路由隔离  │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│         preloadPlugin (MF 运行时远程注册 + 预加载)        │
└──────────────────────────────────────────────────────┘
```

**Shell（壳）** 负责整体布局、生命周期编排、路由分发和段预加载。  
**Segment（段）** 是独立的微前端应用，遵循统一的 `mount` / `unmount` 生命周期契约，可使用任意框架。段在运行时不含任何 `@pavilion/*` 代码，仅构建时依赖 `@pavilion/vite`。

### 包依赖关系

```
bridge (零依赖)    sandbox (零依赖, 含 logger)    tabs (零依赖)
    │                   │                            │
    │                   ▼                            │
    │               router ─────────────────────────┘
    │                   │
    ▼                   ▼
  runtime (聚合层, MF Remote 共享)
    │
    ▼
  vite (Vite 插件, 封装 @module-federation/vite, 仅构建时)
```

## 包

| 包名 | 说明 | 依赖 |
|------|------|------|
| `@pavilion/bridge` | Shell-Segment 事件通信桥（EventBus + StorageSync） | 零依赖 |
| `@pavilion/sandbox` | JS 沙箱隔离（栈式副作用追踪 + 路由隔离 + 日志模块） | 零依赖 |
| `@pavilion/tabs` | 多标签页状态管理 | 零依赖 |
| `@pavilion/router` | 微前端生命周期路由调度器（路由事件 + popstate 隔离） | `@pavilion/sandbox` |
| `@pavilion/runtime` | 共享运行时内核，作为 MF Remote 确保单例 | `@pavilion/router` `@pavilion/bridge` `@pavilion/sandbox` |
| `@pavilion/vite` | Vite 插件，封装 Module Federation + CSS 作用域 | `@module-federation/vite` |
| `@pavilion/cli` | 命令行工具（dev / build） | |
| `create-pavilion` | 项目脚手架 | |

## 核心概念

### 生命周期

每个 Segment 导出统一的 `SegmentLifecycle` 契约：

```typescript
export default {
  bootstrap?: async (ctx) => {},   // 一次性初始化（可选）
  mount:      async (ctx, el) => { /* 挂载到 el */ },   // 必需
  unmount:    async (ctx, el) => { /* 清理 */ },        // 可选
  update?:    async (ctx, props) => {}, // 属性更新（可选）
}
```

状态机流转：`NOT_LOADED → LOADING → NOT_MOUNTED → MOUNTING → MOUNTED → UNMOUNTING → NOT_MOUNTED`

### 双层隔离

#### JS 沙箱（栈式副作用追踪）

`Sandbox` 使用模块级 `activeStack` 支持多实例并发。`patchGlobals()` 仅执行一次，拦截 `setTimeout` / `setInterval` / `addEventListener`，每个副作用归属于栈顶沙箱。unmount 时自动清理所有 timers / listeners / globals。

```typescript
import { Sandbox } from '@pavilion/sandbox'

const sandbox = new Sandbox('my-segment')
sandbox.activate()    // 开始追踪副作用
// ... 段运行期间的所有 setTimeout/addEventListener 被追踪
sandbox.deactivate()  // 自动清理所有副作用
```

#### CSS 作用域（`:where()` 零特异性）

PostCSS 插件自动为段的选择器包裹 `:where(.pavilion-{name})` 作用域前缀。`:where()` 伪类提供**零特异性**，使作用域后的样式保持与原始选择器相同的优先级，避免特异性污染。

```css
/* 输入 */
.card { color: red; }

/* 输出 (prefix = pavilion-dashboard) */
:where(.pavilion-dashboard) .card { color: red; }
```

同时自动前缀化 `@keyframes` 名称，防止动画冲突。

### 路由隔离

段级 `popstate` 事件隔离：沙箱的 `addEventListener` 补丁将 `popstate` 监听器包裹为代理，仅当 `routeMatcher(appCode, path)` 返回 `true` 时触发。非活跃段不会收到导航事件，避免路由冲突。

```typescript
// 路由启动时设置匹配器
import { setRouteMatcher } from '@pavilion/sandbox'

setRouteMatcher((appCode, path) => {
  return apps.some(app => app.name === appCode && app.activeWhen(path))
})
```

### 路由事件系统

路由器在导航各阶段分发 `CustomEvent`，开发者可监听用于埋点、加载状态等：

| 事件 | 触发时机 | detail |
|------|---------|--------|
| `pavilion:before-routing` | 路由开始切换前 | `{ url, trigger }` |
| `pavilion:after-routing` | 路由切换完成 | `{ url, trigger }` |
| `pavilion:segment-switch` | 活跃段发生变化 | `{ from: string[], to: string[] }` |

```typescript
window.addEventListener('pavilion:segment-switch', (e) => {
  const { from, to } = (e as CustomEvent).detail
  console.log('段切换:', from, '→', to)
})
```

`trigger` 值：`init` / `pushState` / `replaceState` / `popstate`

### 运行时预加载

`preloadPlugin` 作为 Module Federation 运行时插件，在 `beforeInit` 阶段动态注册所有段为 MF 远程模块，并实现预加载策略：

- **当前段**：立即 `loadRemote` 加载（用户正在等待）
- **其他段**：1 秒后 `preloadRemote` 空闲预取

```typescript
// vite.config.ts (Shell)
pavilion({
  role: 'shell',
  name: 'segment-main',
  runtimePlugins: ['./src/preloadPlugin'],  // 替代静态 pavilionRemotes
})
```

### 日志系统

分模块可配置的控制台日志，帮助开发者调试微前端运行时行为。所有日志使用 CSS 样式美化输出。

```typescript
import { configureLog } from '@pavilion/router'

configureLog({
  enabled: true,
  modules: {
    router:  true,   // 路由事件 + 段生命周期
    sandbox: true,   // 沙箱激活/停用 + popstate 拦截
    preload: true,   // MF 远程注册 + 预加载状态
    bridge:  true,   // EventBus emit/subscribe + StorageSync
  },
})
```

日志输出示例：

```
[Pavilion] router    router-start       segments=2
[Pavilion] router    segment-register   appCode=demo-app
[Pavilion] router    before-routing     trigger=pushState  url=/demo/list
[Pavilion] sandbox   sandbox-activate   appCode=demo-app
[Pavilion] router    segment-load       appCode=demo-app  ms=320
[Pavilion] router    segment-mount      appCode=demo-app  ms=45
[Pavilion] sandbox   popstate-blocked   appCode=demo-app  path=/react/dashboard
[Pavilion] router    segment-switch     demo-app → react-app
[Pavilion] sandbox   sandbox-deactivate  appCode=demo-app  timers=3  intervals=1  listeners=2
[Pavilion] preload   register           remotes=2  apps=demo-app, react-app
[Pavilion] bridge    event-emit         name=user-login  listeners=3
```

颜色：`[Pavilion]` 绿色 / 模块名 青色 / 事件名 橙色 / 键值对 灰色

也可以通过全局变量配置（在脚本加载前设置）：

```html
<script>window.__PAVILION_LOG__ = { modules: { sandbox: false } }</script>
```

### 通信

`EventBus` 提供按 `appCode` 定向投递的 pub/sub 事件总线。`StorageSync` 提供 LocalStorage 响应式订阅。`@pavilion/runtime` 作为 MF Shared Remote，确保所有应用共享同一个 EventBus / StorageSync 实例。

### 注册中心

Shell 通过 `mfe.json` 声明所有段：

```json
{
  "cdn": "https://cdn.example.com",
  "apps": [
    {
      "appCode": "demo-app",
      "name": "Demo (Vue)",
      "routes": ["/demo"],
      "devPort": 6020,
      "children": [
        { "name": "列表页", "route": "/demo/list" },
        { "name": "详情页", "route": "/demo/detail" }
      ]
    }
  ]
}
```

既是构建配置源，也是运行时路由注册源——单一事实来源。

## 多仓库架构

实际项目中，Shell 和各 Segment 分属不同 Git 仓库独立发布：

| 角色 | `@pavilion/*` 依赖 | 说明 |
|------|-------------------|------|
| Shell | `@pavilion/router` `@pavilion/sandbox` (runtime dep) + `@pavilion/vite` (devDep) | 运行时需要路由和沙箱 |
| Segment | `@pavilion/vite` (devDep only) | 仅构建时需要，运行时不含 `@pavilion/*` 代码 |

段应用更新 `@pavilion/vite` 版本后独立发布即可，**不影响 Shell 运行时**，无需 Shell 重新构建。

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建核心包
pnpm -r build

# 启动所有开发服务器（Shell + Segments）
pnpm dev
```

Shell 运行在 `http://localhost:6010`，Vue 段在 `6020`，React 段在 `6030`。

## 开发

```bash
# 仅启动主应用（需要段单独启动）
cd apps/segment-main && pnpm dev

# 启动 Vue 段（独立开发或配合 Shell）
cd apps/segment-demo && pnpm dev

# 启动 React 段
cd apps/segment-react && pnpm dev

# 修改核心包后重新构建（按依赖顺序）
pnpm --filter @pavilion/sandbox build   # 先构建 sandbox（含 logger）
pnpm --filter @pavilion/bridge build    # bridge 独立
pnpm --filter @pavilion/router build    # router 依赖 sandbox
pnpm --filter @pavilion/vite build      # vite 独立
```

## License

MIT
