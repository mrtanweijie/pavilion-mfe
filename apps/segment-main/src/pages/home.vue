<template>
  <div class="welcome">
    <div class="page-header">
      <h1>PavilionMfe 微前端框架</h1>
      <p class="page-subtitle">基于 Module Federation 的微前端开源框架，支持 Vue / React 混合渲染</p>
      <p class="page-repo">
        <el-icon :size="14"><Link /></el-icon>
        <a href="https://github.com/mrtanweijie/pavilion-mfe" target="_blank" rel="noopener">
          github.com/mrtanweijie/pavilion-mfe
        </a>
      </p>
    </div>

    <div class="app-cards">
      <div v-for="app in menuList" :key="app.menuCode" class="app-card">
        <div class="app-card-header">
          <el-icon :size="20" v-if="app.menuIcon">
            <component :is="app.menuIcon" />
          </el-icon>
          <span>{{ app.menuName }}</span>
        </div>
        <div class="app-card-body">
          <el-tag
            v-for="child in app.childrenMenuInfoList"
            :key="child.menuUrl"
            size="small"
            class="app-tag"
            @click="navigateTo(child.menuUrl)"
          >
            {{ child.menuName }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@pavilion-mfe/router'
import { menus } from '../api/menu'
const menuList = menus
</script>

<style scoped>
.welcome {
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}
.page-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.page-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}
.page-repo {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-repo a {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.page-repo a:hover {
  color: var(--primary);
}

.app-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.app-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 140px;
}
.app-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 12px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}
.app-card-body {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.app-tag {
  cursor: pointer;
}
</style>
