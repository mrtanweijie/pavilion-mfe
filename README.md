# Pavilion

基于 Module Federation 的微前端开源框架。提取自生产环境的微前端实践，核心代码包含自研的路由调度器、事件桥接和开发者工具链。

## 包

| 包名 | 说明 | 状态 |
|---|---|---|
| `@pavilion/router` | 微前端生命周期路由调度器（零依赖） | ✅ |
| `@pavilion/bridge` | Shell-Segment 事件通信桥（零依赖） | ✅ |
| `@pavilion/sandbox` | Proxy 沙箱隔离层 | ✅ |
| `@pavilion/tabs` | 多标签页状态管理 | ✅ |
| `@pavilion/vite` | Vite 插件（封装 Module Federation） | ✅ |
| `@pavilion/runtime` | 共享运行时内核（MF Remote） | ✅ |
| `@pavilion/cli` | 命令行工具 | ✅ |
| `create-pavilion` | 项目脚手架 | ✅ |

## 快速开始

```bash
# 创建新项目
npm create @pavilion/app my-project
cd my-project

# 安装依赖
pnpm install

# 启动开发服务器
pavilion dev
```

## License

MIT
