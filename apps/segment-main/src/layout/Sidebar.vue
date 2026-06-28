<template>
  <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
    <!-- Logo -->
    <div class="logo" @click="router.push('/')">
      <el-icon :size="24" class="logo-icon"><Files /></el-icon>
      <span v-show="!isCollapse" class="logo-text">PavilionMfe</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="currentPath"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#1a1a2e"
      text-color="rgba(255,255,255,0.7)"
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

    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="isCollapse = !isCollapse">
      <el-icon :size="18">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { navigateTo } from '@pavilion-mfe/router'
import { menus } from '../api/menu'

const router = useRouter()
const menuList = menus
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
  if (mainAppPaths.includes(index)) {
    router.push(index)
  } else {
    navigateTo(index)
  }
}

</script>

<style scoped>
.sidebar {
  background-color: #1a1a2e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  min-height: 56px;
}
.logo-icon {
  color: #409eff;
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
}

/* 折叠按钮 */
.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: color 0.2s;
}
.collapse-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
