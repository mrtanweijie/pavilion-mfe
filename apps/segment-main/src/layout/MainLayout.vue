<template>
  <el-container class="segment-main">
    <Sidebar />
    <el-main class="main">
      <router-view v-show="!isSegmentRoute" />
      <div id="pavilion-container" v-show="isSegmentRoute"></div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import mfeConfig from '../../mfe.json'

const route = useRoute()

/** Whether the current route belongs to a micro-frontend segment */
const isSegmentRoute = computed(() =>
  mfeConfig.apps.some((seg: any) =>
    seg.routes.some((r: string) =>
      route.path.replace(/\/?$/, '/').startsWith(r.replace(/\/?$/, '/'))
    )
  )
)
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
  padding: 20px;
  overflow: auto;
}

/* 微前端容器 */
#pavilion-container {
  height: 100%;
  min-height: 400px;
}
</style>
