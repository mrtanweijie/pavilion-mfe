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
import { useRoute } from 'vue-router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import { createPathMatcher } from '@pavilion-mfe/router'
import { menus } from '../api/menu'
import mfeConfig from '../../mfe.json'
import Sidebar from './Sidebar.vue'
import TabBar from './TabBar.vue'

const route = useRoute()
const { tabs, openTab } = useTabs()

/** 当前路由是否属于微前端子应用 */
const isSubAppRoute = computed(() =>
  mfeConfig.apps.some((app) =>
    createPathMatcher(app.routes)(route.path),
  ),
)

// ─── 路由 → Tab 单向同步 ───

function findMenuTitle(path: string): string {
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
  const path = url.pathname
  const search = url.search

  if (path === '/403' || path === '/404') return

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
/* 全局重置 */
* {
  box-sizing: border-box;
}
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 布局 */
.segment-main {
  height: 100%;
}

/* el-menu 全局覆盖（必须非 scoped 才能穿透 Element Plus） */
.el-menu {
  border-right: none !important;
  flex: 1;
}
.el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
.el-sub-menu .el-menu {
  background-color: #15152a !important;
}
.el-sub-menu__title:hover,
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* 主内容区 */
.segment-main .main {
  background-color: #f0f2f5;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 内容区（TabBar 下方） */
.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.main-content.sub-app-mode {
  padding: 0;
}

/* 微前端容器 */
#pavilion-mfe-container {
  height: 100%;
  min-height: 400px;
}
</style>
