<template>
  <el-container class="segment-main">
    <Sidebar />
    <el-main class="main">
      <TabBar />
      <div class="main-content" :class="{ 'sub-app-mode': isSubAppRoute }">
        <router-view v-show="!isSubAppRoute" />
        <div id="pavilion-mfe-container" v-show="isSubAppRoute"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import { createPathMatcher } from '@pavilion-mfe/router'
import { menus } from '../api/menu'
import mfeConfig from '../../mfe.json'
import Sidebar from './Sidebar.vue'
import TabBar from './TabBar.vue'

const route = useRoute()
const router = useRouter()
const { tabs, openTab } = useTabs()

// 部署前缀（GitHub Pages 场景如 /pavilion-mfe，本地开发为 ''）
const deployBasePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

/** 去掉部署前缀，统一为应用内路径（如 /demo/list） */
function normalizePath(rawPath: string): string {
  if (deployBasePath && rawPath.startsWith(deployBasePath)) {
    return rawPath.slice(deployBasePath.length) || '/'
  }
  return rawPath
}

/** 当前路由是否属于微前端子应用 */
const isSubAppRoute = computed(() =>
  mfeConfig.apps.some((app) =>
    createPathMatcher(app.routes)(route.path),
  ),
)

// ─── 路由 → Tab 单向同步 ───

function findMenuTitle(path: string): string {
  // 先从路由 meta 获取标题
  const resolved = router.resolve(path)
  const metaTitle = resolved.meta?.title as string | undefined
  if (metaTitle) return metaTitle

  // 再从后端菜单接口查找
  for (const menu of menus.value) {
    for (const child of menu.childrenMenuInfoList ?? []) {
      if (child.menuUrl === path) return child.menuName
    }
    if (menu.menuUrl === path) return menu.menuName
  }
  return path
}

function syncRouteToTabs(fullUrl: string) {
  // 分离路径和查询参数，用路径去重
  const url = new URL(fullUrl, window.location.origin)
  // 去掉部署前缀，统一为应用内路径（如 /demo/list），确保与菜单 URL 匹配
  const path = normalizePath(url.pathname)
  const search = url.search

  if (path === '/403' || path === '/404' || path === '/500') return

  const exists = tabs.value.find((t) => t.path === path)
  if (exists) {
    openTab({ path, fullPath: path + search, title: exists.title })
  } else {
    const title = findMenuTitle(path)
    openTab({ path, fullPath: path + search, title })
  }
}

watch(
  () => route.fullPath,
  (fullPath) => {
    syncRouteToTabs(fullPath)
  },
  { immediate: true },
)

// 菜单加载完成后，刷新已有 Tab 的标题
watch(
  () => menus.value,
  (list) => {
    if (list.length === 0) return
    for (const tab of tabs.value) {
      const title = findMenuTitle(tab.path)
      if (title !== tab.title) {
        openTab({ ...tab, title })
      }
    }
  },
  { immediate: true },
)

// 监听子应用内部导航（pushState / popstate），同步 Tab
function onUrlChange() {
  syncRouteToTabs(window.location.pathname + window.location.search)
}

onMounted(() => {
  window.addEventListener('popstate', onUrlChange)
  window.addEventListener('pavilion-mfe:after-routing', onUrlChange)
})

onUnmounted(() => {
  window.removeEventListener('popstate', onUrlChange)
  window.removeEventListener('pavilion-mfe:after-routing', onUrlChange)
})
</script>

<style>
/* ─── Design Tokens ─── */
:root {
  --primary: #635BFF;
  --primary-hover: #5147E0;
  --primary-light: rgba(99, 91, 255, 0.08);
  --primary-active: rgba(99, 91, 255, 0.18);
  --success: #38A169;
  --danger: #E53E3E;
  --warning: #ED8936;
  --text-primary: #1A202C;
  --text-regular: #4A5568;
  --text-muted: #A0AEC0;
  --background: #F6F9FC;
  --card-bg: #FFFFFF;
  --border: #E2E8F0;
  --sidebar-bg: #1A202C;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Override Element Plus primary */
:root {
  --el-color-primary: #635BFF;
  --el-color-primary-light-3: rgba(99, 91, 255, 0.7);
  --el-color-primary-light-5: rgba(99, 91, 255, 0.5);
  --el-color-primary-light-7: rgba(99, 91, 255, 0.3);
  --el-color-primary-light-8: rgba(99, 91, 255, 0.2);
  --el-color-primary-light-9: rgba(99, 91, 255, 0.1);
  --el-color-primary-dark-2: #5147E0;
  --el-border-radius-base: 8px;
}

/* 按钮 */
.el-button {
  height: 40px;
}

/* 全局重置 */
* { box-sizing: border-box; }
html, body, #app { margin: 0; padding: 0; height: 100%; }

/* 布局 */
.segment-main { height: 100%; }

/* el-menu 全局覆盖（穿透 Element Plus） */
.el-menu {
  border-right: none !important;
  flex: 1;
}
.el-menu-item {
  position: relative;
}
.el-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: transparent;
  transition: background-color 0.2s;
}
.el-menu-item.is-active {
  background-color: rgba(99, 91, 255, 0.15) !important;
  color: #fff !important;
}
.el-menu-item.is-active::before {
  background-color: #635BFF;
}
.el-sub-menu .el-menu {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
/* 折叠后弹出的子菜单（el-popper），保持深色背景 */
.el-menu--popup {
  background-color: var(--sidebar-bg) !important;
  border-radius: var(--radius-md) !important;
}
.el-menu--popup .el-menu-item {
  color: rgba(255, 255, 255, 0.6) !important;
}
.el-menu--popup .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.07) !important;
}
.el-menu--popup .el-menu-item.is-active {
  background-color: var(--primary-active) !important;
  color: #fff !important;
}
.el-sub-menu__title:hover,
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.07) !important;
}

/* 主内容区 */
.segment-main .main {
  background-color: var(--background);
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 28px 32px;
  overflow: auto;
}

.main-content.sub-app-mode {
  padding: 0;
}

#pavilion-mfe-container {
  height: 100%;
  min-height: 400px;
}
</style>
