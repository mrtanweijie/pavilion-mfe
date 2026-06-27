<template>
  <div class="test-page">
    <h2>测试页</h2>
    <p style="color: #999; margin-bottom: 24px">这是基座应用自带的页面，不经过子应用加载。</p>

    <el-card shadow="hover">
      <template #header><span>环境信息</span></template>
      <el-table :data="tableData" stripe>
        <el-table-column prop="label" label="项目" width="120" />
        <el-table-column prop="value" label="值" />
      </el-table>
    </el-card>

    <el-card shadow="hover" style="margin-top: 16px">
      <template #header><span>导航测试</span></template>
      <el-space wrap>
        <el-button type="primary" @click="navigateTo('/demo/list')">Vue 列表页</el-button>
        <el-button type="primary" @click="navigateTo('/demo/form')">Vue 表单页</el-button>
        <el-button type="success" @click="navigateTo('/react/list')">React 列表页</el-button>
        <el-button type="success" @click="navigateTo('/react/dashboard')">React 仪表盘</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { navigateTo } from '@pavilion/router'

const currentPath = ref(window.location.pathname)
const update = () => {
  currentPath.value = window.location.pathname
}
onMounted(() => window.addEventListener('popstate', update))
onUnmounted(() => window.removeEventListener('popstate', update))

const tableData = [
  { label: '当前路径', value: currentPath.value },
  { label: '框架', value: 'Vue 3 + TypeScript + Element Plus' },
  { label: '微前端', value: 'Pavilion (Module Federation)' },
  { label: '构建工具', value: 'Vite 5' },
]
</script>

<style scoped>
.test-page {
  max-width: 960px;
  margin: 0 auto;
}
.test-page h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #333;
}
</style>
