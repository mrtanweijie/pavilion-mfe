import type { App, Ref, ComputedRef, InjectionKey } from 'vue'
import { ref, computed, inject } from 'vue'
import { TabsStateManager, type TabInfo } from './state-manager.js'

// ─── Public API ───

export interface TabsAPI {
  tabs: Ref<TabInfo[]>
  activeTabId: Ref<string | null>
  activeTab: ComputedRef<TabInfo | null>
  /** 打开 Tab（已存在则切换）；id 默认取 path */
  openTab(tab: Omit<TabInfo, 'id'> & { id?: string }): void
  closeTab(tabId: string): void
  closeOthers(tabId: string): void
  closeAll(): void
}

// ─── Injection key ───

const TABS_KEY: InjectionKey<TabsAPI> = Symbol('pavilion-mfe-tabs')

// ─── Plugin ───

export const tabsPlugin = {
  install(app: App) {
    const manager = new TabsStateManager()

    const tabs = ref<TabInfo[]>([])
    const activeTabId = ref<string | null>(null)

    const activeTab = computed(() =>
      tabs.value.find((t) => t.id === activeTabId.value) ?? null,
    )

    function sync() {
      const state = manager.getState()
      tabs.value = state.tabs
      activeTabId.value = state.activeTabId
    }

    function openTab(tab: Omit<TabInfo, 'id'> & { id?: string }) {
      const id = tab.id ?? tab.path
      manager.addTab({ ...tab, id })
      sync()
    }

    function closeTab(tabId: string) {
      manager.removeTab(tabId)
      sync()
    }

    function closeOthers(tabId: string) {
      const state = manager.getState()
      for (const t of state.tabs) {
        if (t.id !== tabId) manager.removeTab(t.id)
      }
      sync()
    }

    function closeAll() {
      manager.clearState()
      sync()
    }

    const api: TabsAPI = {
      tabs,
      activeTabId,
      activeTab,
      openTab,
      closeTab,
      closeOthers,
      closeAll,
    }

    // 初始化同步
    sync()

    app.provide(TABS_KEY, api)
  },
}

// ─── Composable ───

export function useTabs(): TabsAPI {
  const api = inject(TABS_KEY)
  if (!api) {
    throw new Error('[pavilion-mfe/tabs] useTabs() must be called after app.use(tabsPlugin)')
  }
  return api
}
