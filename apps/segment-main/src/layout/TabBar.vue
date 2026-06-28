<template>
  <div
    class="tab-bar"
    @wheel.prevent="onWheel"
  >
    <div
      ref="tabListRef"
      class="tab-list"
      :style="{ transform: `translateX(${scrollLeft}px)` }"
    >
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: tab.id === activeTabId }"
        @click="handleTabClick(tab)"
        @contextmenu.prevent="onContextMenu($event, tab)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <span
          v-if="tab.id !== '/'"
          class="tab-close"
          @click.stop="handleClose(tab.id)"
        >×</span>
      </div>
    </div>

    <!-- 右键菜单 -->
    <teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="tab-context-menu"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
        @click.stop
      >
        <div class="context-item" @click="closeOthers(contextMenu.tabId); contextMenu.visible = false">关闭其他</div>
        <div class="context-item" @click="closeAll(); contextMenu.visible = false">关闭全部</div>
      </div>
      <div
        v-if="contextMenu.visible"
        class="context-overlay"
        @click="contextMenu.visible = false"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import { navigateTo, createPathMatcher } from '@pavilion-mfe/router'
import mfeConfig from '../../mfe.json'

const router = useRouter()
const {
  tabs,
  activeTabId,
  closeTab,
  closeOthers,
  closeAll,
} = useTabs()

/** 判断路径是否为子应用路由 */
function isSubAppPath(path: string): boolean {
  return mfeConfig.apps.some((app) =>
    createPathMatcher(app.routes)(path),
  )
}

// ─── 水平滚动 ───

const tabListRef = ref<HTMLElement | null>(null)
const scrollLeft = ref(0)

function clampScroll() {
  if (!tabListRef.value) return
  const containerWidth = tabListRef.value.parentElement!.clientWidth
  const scrollWidth = tabListRef.value.scrollWidth
  const maxScroll = Math.min(0, containerWidth - scrollWidth)
  scrollLeft.value = Math.max(maxScroll, Math.min(0, scrollLeft.value))
}

function onWheel(e: WheelEvent) {
  const delta = e.deltaY || e.deltaX
  scrollLeft.value -= delta
  clampScroll()
}

/** 切换 Tab 时自动滚动到可见区域 */
watch(activeTabId, () => {
  if (!tabListRef.value) return
  const activeEl = tabListRef.value.querySelector('.tab-item.active') as HTMLElement | null
  if (!activeEl) return
  const listRect = tabListRef.value.getBoundingClientRect()
  const tabRect = activeEl.getBoundingClientRect()
  if (tabRect.left < listRect.left) {
    scrollLeft.value -= tabRect.left - listRect.left
  } else if (tabRect.right > listRect.right) {
    scrollLeft.value -= tabRect.right - listRect.right
  }
  clampScroll()
})

// ─── 右键菜单 ───

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabId: '',
})

function onContextMenu(e: MouseEvent, tab: (typeof tabs.value)[number]) {
  const menuWidth = 130
  const menuHeight = 72
  contextMenu.visible = true
  contextMenu.x = Math.min(e.clientX, window.innerWidth - menuWidth)
  contextMenu.y = Math.min(e.clientY, window.innerHeight - menuHeight)
  contextMenu.tabId = tab.id
}

// ─── 事件处理 ───

function handleTabClick(tab: (typeof tabs.value)[number]) {
  contextMenu.visible = false
  if (tab.id === activeTabId.value) return
  const target = tab.fullPath || tab.path
  if (isSubAppPath(tab.path)) {
    navigateTo(target)
  } else {
    router.push(target)
  }
}

function handleClose(tabId: string) {
  closeTab(tabId)
}
</script>

<style scoped>
.tab-bar {
  flex-shrink: 0;
  height: 40px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  user-select: none;
  padding: 0 8px;
}

.tab-list {
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: 0;
  transition: transform 0.15s ease;
  white-space: nowrap;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
  min-width: 110px;
  max-width: 180px;
  padding: 0 16px;
  font-size: 13px;
  color: var(--text-muted);
  background-color: transparent;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}

.tab-item:hover {
  color: var(--text-primary);
  background-color: rgba(0, 0, 0, 0.03);
}

.tab-item.active {
  color: var(--text-primary);
  background-color: var(--background);
  border-bottom-color: var(--primary);
  font-weight: 500;
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.1s, background-color 0.15s, color 0.15s;
}

.tab-item:hover .tab-close,
.tab-item.active .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

/* 右键菜单 */
.tab-context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 120px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  border: 1px solid var(--border);
}

.context-item {
  padding: 8px 16px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.1s;
}

.context-item:hover {
  background-color: var(--background);
}

.context-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
</style>
