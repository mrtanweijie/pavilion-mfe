# Pavilion

基于 **Module Federation** 的微前端开源框架。提取自生产环境的微前端实践，核心包含自研的路由调度器、JS 沙箱隔离、事件桥接和开发者工具链。

## 架构

```
┌─────────────────────────────────────────────────┐
│                  Shell (壳应用)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Router   │  │ EventBus │  │ TabsStateMgr  │  │
│  │ 生命周期   │  │ 跨段通信  │  │ 多标签管理     │  │
│  └────┬─────┘  └────┬─────┘  └───────────────┘  │
│       │             │                             │
│  ┌────▼─────────────▼──────────────────────────┐  │
│  │           #pavilion-container                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ Segment A │  │ Segment B │  │ Segment C │  │  │
│  │  │ (Vue)     │  │ (React)   │  │ (任意框架) │   │  │
│  │  │ + Sandbox │  │ + Sandbox │  │ + Sandbox │   │  │
│  │  │ + CSS隔离 │  │ + CSS隔离 │  │ + CSS隔离 │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Shell（壳）** 负责整体布局、生命周期编排和路由分发。  
**Segment（段）** 是独立的微前端应用，遵循统一的 `mount` / `unmount` 生命周期契约，可使用任意框架。

### 包依赖关系

```
bridge (零依赖)    sandbox (零依赖)    tabs (零依赖)
    │                   │                  │
    │                   ▼                  │
    │               router ────────────────┘
    │                   │
    ▼                   ▼
  runtime (聚合层, MF Remote 共享)
    │
    ▼
  vite (Vite 插件, 封装 @module-federation/vite)
```

## 包

| 包名 | 说明 | 依赖 |
|------|------|------|
| `@pavilion/bridge` | Shell-Segment 事件通信桥（EventBus + StorageSync） | 零依赖 |
| `@pavilion/sandbox` | JS 沙箱隔离（副作用追踪 + Proxy 隔离） | 零依赖 |
| `@pavilion/tabs` | 多标签页状态管理 | 零依赖 |
| `@pavilion/router` | 微前端生命周期路由调度器 | `@pavilion/sandbox` |
| `@pavilion/runtime` | 共享运行时内核，作为 MF Remote 确保单例 | `@pavilion/router` `@pavilion/bridge` `@pavilion/sandbox` |
| `@pavilion/vite` | Vite 插件，封装 Module Federation 构建配置 | `@module-federation/vite` |
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

- **JS 层**：`Sandbox` 在 mount 时拦截 `setTimeout` / `setInterval` / `addEventListener`，追踪所有副作用，unmount 时自动清理
- **CSS 层**：PostCSS 插件自动为段的选择器添加作用域前缀 `.pavilion-{name}`，防止样式污染

### 通信

`EventBus` 提供按 `appCode` 定向投递的 pub/sub 事件总线。`@pavilion/runtime` 作为 MF Shared Remote，确保所有应用共享同一个 EventBus / StorageSync 实例。

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
# 仅启动 Shell（需要段单独启动）
cd apps/shell && pnpm dev

# 启动 Vue 段（独立开发或配合 Shell）
cd apps/segment-demo && pnpm dev

# 启动 React 段
cd apps/segment-react && pnpm dev

# 修改核心包后重新构建
pnpm --filter @pavilion/router build
```

## License

MIT
