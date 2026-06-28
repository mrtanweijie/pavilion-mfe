<template>
  <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
    <!-- Logo -->
    <div class="logo" @click="router.push('/')">
      <el-icon :size="24" class="logo-icon"><Files /></el-icon>
      <span v-show="!isCollapse" class="logo-text">PavilionMfe</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="route.path"
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

      <!-- 微前端段（从 mfe.json 动态生成） -->
      <el-sub-menu v-for="seg in apps" :key="seg.appCode" :index="seg.appCode">
        <template #title>
          <el-icon><component :is="segIcon(seg.appCode)" /></el-icon>
          <span>{{ seg.name }}</span>
        </template>
        <el-menu-item
          v-for="child in seg.children"
          :key="child.route"
          :index="child.route"
        >
          <el-icon><component :is="childIcon(child.route)" /></el-icon>
          <span>{{ child.name }}</span>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navigateTo } from '@pavilion-mfe/router'
import {
  HomeFilled,
  Grid,
  Connection,
  Setting,
  Monitor,
  InfoFilled,
  Fold,
  Expand,
  List,
  Document,
  EditPen,
  DataAnalysis,
  Files,
} from '@element-plus/icons-vue'
import mfeConfig from '../../mfe.json'

const route = useRoute()
const router = useRouter()
const apps = mfeConfig.apps
const isCollapse = ref(false)

/** 壳自有路由列表 */
const shellPaths = ['/', '/test', '/env', '/403', '/404']

/** el-menu 选中回调 */
function handleSelect(index: string) {
  if (shellPaths.includes(index)) {
    router.push(index)
  } else {
    navigateTo(index)
  }
}

/** 段图标映射 */
function segIcon(appCode: string) {
  const map: Record<string, any> = {
    'demo-app': Grid,
    'react-app': Connection,
  }
  return map[appCode] ?? Grid
}

/** 子菜单图标映射 */
function childIcon(routePath: string) {
  if (routePath.includes('/list')) return List
  if (routePath.includes('/detail')) return Document
  if (routePath.includes('/form')) return EditPen
  if (routePath.includes('/dashboard')) return DataAnalysis
  return List
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
