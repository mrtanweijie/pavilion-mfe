<template>
  <div class="page-wrapper">
    <h2>测试页</h2>
    <p class="page-desc">这是主应用自带的页面，不经过子应用加载。</p>

    <div class="card">
      <div class="card-title">环境信息</div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="label" label="项目" width="120" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </div>

    <div class="card" style="margin-top: 16px">
      <div class="card-title">导航测试</div>
      <el-space wrap>
        <el-button type="primary" @click="navigateTo('/demo/list')">Vue 列表页</el-button>
        <el-button @click="navigateTo('/demo/form')">Vue 表单页</el-button>
        <el-button type="primary" @click="navigateTo('/react/list')">React 列表页</el-button>
        <el-button @click="navigateTo('/react/dashboard')">React 仪表盘</el-button>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@pavilion-mfe/router'

const tableData = [
  { label: '当前路径', value: window.location.pathname },
  { label: '框架', value: 'Vue 3 + TypeScript + Element Plus' },
  { label: '微前端', value: 'PavilionMfe (Module Federation)' },
  { label: '构建工具', value: 'Vite 5' },
]
</script>

<style scoped>
.page-wrapper { }
.page-wrapper h2 { margin: 0 0 6px; font-size: 22px; color: var(--text-primary); font-weight: 700; }
.page-desc { margin: 0 0 24px; font-size: 13px; color: var(--text-muted); }

.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}
</style>
