<template>
  <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
    <!-- Logo -->
    <div class="logo" :class="{ collapsed: isCollapse }" @click="router.push('/')">
      <Logo />
      <span class="logo-text">PavilionMfe</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="currentPath"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="transparent"
      text-color="rgba(255,255,255,0.6)"
      active-text-color="#fff"
      @select="handleSelect"
    >
      <!-- 首页 -->
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首页</template>
      </el-menu-item>

      <!-- 微前端子应用（从后端菜单接口动态获取） -->
      <el-sub-menu v-for="app in menuList" :key="app.menuCode" :index="app.menuCode">
        <template #title>
          <el-icon v-if="app.menuIcon"><component :is="app.menuIcon" /></el-icon>
          <span>{{ app.menuName }}</span>
        </template>
        <el-menu-item
          v-for="child in app.childrenMenuInfoList"
          :key="child.menuUrl"
          :index="child.menuUrl"
        >
          <el-icon v-if="child.menuIcon"><component :is="child.menuIcon" /></el-icon>
          <span>{{ child.menuName }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 系统工具 -->
      <el-sub-menu index="system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统工具</span>
        </template>
        <el-menu-item index="/test">
          <el-icon><Monitor /></el-icon>
          <span>测试页</span>
        </el-menu-item>
        <el-menu-item index="/env">
          <el-icon><InfoFilled /></el-icon>
          <span>环境信息</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 底部：用户信息 + 折叠按钮 -->
    <div class="sidebar-footer" :class="{ collapsed: isCollapse }">
      <div class="user-info-left">
        <div class="user-avatar">PA</div>
        <div class="user-detail">
          <div class="user-name">Admin</div>
          <div class="user-role">管理员</div>
        </div>
      </div>
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon :size="18" class="collapse-icon">
          <Fold class="icon-fold" />
          <Expand class="icon-expand" />
        </el-icon>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { navigateTo } from '@pavilion-mfe/router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import { menus } from '../api/menu'
import Logo from './Logo.vue'

const router = useRouter()
const menuList = menus
const { openTab } = useTabs()
const isCollapse = ref(false)

/** 当前路径（响应式，监听子应用内部导航） */
const currentPath = ref(window.location.pathname)

function syncPath() {
  currentPath.value = window.location.pathname
}

onMounted(() => {
  // pavilion 路由事件：子应用通过 pushState 导航时触发
  window.addEventListener('pavilion-mfe:after-routing', syncPath)
  // popstate：浏览器前进/后退
  window.addEventListener('popstate', syncPath)
})

onUnmounted(() => {
  window.removeEventListener('pavilion-mfe:after-routing', syncPath)
  window.removeEventListener('popstate', syncPath)
})

/** 主应用自有路由列表 */
const mainAppPaths = ['/', '/test', '/env', '/403', '/404']

/** el-menu 选中回调 */
function handleSelect(index: string) {
  // 查找菜单标题：路由 meta → 后端菜单 → 降级路径
  let title = index
  const metaTitle = router.resolve(index).meta?.title as string | undefined
  if (metaTitle) {
    title = metaTitle
  } else {
    for (const menu of menuList.value) {
      for (const child of menu.childrenMenuInfoList ?? []) {
        if (child.menuUrl === index) { title = child.menuName; break }
      }
      if (menu.menuUrl === index) { title = menu.menuName; break }
    }
  }

  openTab({ path: index, title })

  if (mainAppPaths.includes(index)) {
    router.push(index)
  } else {
    navigateTo(index)
  }
}

</script>

<style scoped>
.sidebar {
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  padding: 0 22px;
  cursor: pointer;
  user-select: none;
  min-height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: padding 0.3s ease;
}
.logo.collapsed {
  padding: 0 16px;
}
.logo-text {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
  max-width: 150px;
  margin-left: 10px;
  opacity: 1;
  transition: max-width 0.3s ease, opacity 0.2s ease, margin-left 0.3s ease;
}
.logo.collapsed .logo-text {
  max-width: 0;
  opacity: 0;
  margin-left: 0;
}

/* 底部：用户信息 + 折叠按钮 */
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 12px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: padding 0.3s ease, justify-content 0.3s ease;
}
.user-info-left {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  max-width: 160px;
  opacity: 1;
  transition: max-width 0.3s ease, opacity 0.2s ease;
}
.sidebar-footer.collapsed .user-info-left {
  max-width: 0;
  opacity: 0;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.user-detail {
  overflow: hidden;
  white-space: nowrap;
}
.user-name {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}
.user-role {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  line-height: 1.4;
}
.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s, background-color 0.2s;
  flex-shrink: 0;
  position: relative;
}
.collapse-btn:hover {
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.08);
}
.sidebar-footer.collapsed {
  justify-content: center;
  padding: 12px 0;
}

/* 折叠按钮图标切换 */
.collapse-icon {
  position: relative;
  display: flex;
}
.icon-fold,
.icon-expand {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.icon-fold {
  opacity: 1;
}
.icon-expand {
  position: absolute;
  left: 0;
  opacity: 0;
}
.sidebar-footer.collapsed .icon-fold {
  opacity: 0;
}
.sidebar-footer.collapsed .icon-expand {
  opacity: 1;
}
</style>
