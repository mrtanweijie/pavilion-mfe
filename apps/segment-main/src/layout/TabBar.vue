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
        <div class="context-item" @click="closeOthers(contextMenu.tabId)">关闭其他</div>
        <div class="context-item" @click="closeAll()">关闭全部</div>
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

const router = useRouter()
const {
  tabs,
  activeTabId,
  closeTab,
  closeOthers,
  closeAll,
} = useTabs()

// ─── 水平滚动 ───

const tabListRef = ref<HTMLElement | null>(null)
const scrollLeft = ref(0)

function onWheel(e: WheelEvent) {
  const delta = e.deltaY || e.deltaX
  scrollLeft.value -= delta
  // 限制滚动范围
  scrollLeft.value = Math.min(0, scrollLeft.value)
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
  scrollLeft.value = Math.min(0, scrollLeft.value)
})

// ─── 右键菜单 ───

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  tabId: '',
})

function onContextMenu(e: MouseEvent, tab: (typeof tabs.value)[number]) {
  contextMenu.visible = true
  contextMenu.x = e.clientX
  contextMenu.y = e.clientY
  contextMenu.tabId = tab.id
}

// ─── 事件处理 ───

function handleTabClick(tab: (typeof tabs.value)[number]) {
  if (tab.id === activeTabId.value) return
  router.push(tab.path)
}

function handleClose(tabId: string) {
  closeTab(tabId)
  contextMenu.visible = false
}
</script>

<style scoped>
.tab-bar {
  flex-shrink: 0;
  height: 36px;
  background-color: #e8eaed;
  border-bottom: 1px solid #d4d7db;
  overflow: hidden;
  user-select: none;
}

.tab-list {
  display: flex;
  align-items: flex-end;
  height: 100%;
  transition: transform 0.15s ease;
  white-space: nowrap;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  min-width: 100px;
  max-width: 180px;
  padding: 0 10px;
  font-size: 12px;
  color: #666;
  background-color: #d4d7db;
  border-radius: 6px 6px 0 0;
  margin-right: 2px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tab-item:hover {
  background-color: #c8cbd0;
}

.tab-item.active {
  background-color: #fff;
  color: #333;
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
  width: 16px;
  height: 16px;
  line-height: 14px;
  text-align: center;
  font-size: 14px;
  color: #999;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.1s, background-color 0.15s;
}

.tab-item:hover .tab-close,
.tab-item.active .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background-color: #ddd;
  color: #333;
}

/* 右键菜单 */
.tab-context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 120px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
}

.context-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}

.context-item:hover {
  background-color: #f0f2f5;
}

.context-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}
</style>
