<template>
  <div class="env-page">
    <h2>环境信息</h2>
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>框架</span></template>
          <el-tag type="success">Vue 3</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>构建工具</span></template>
          <el-tag type="warning">Vite 5</el-tag>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>微前端</span></template>
          <el-tag>PavilionMfe</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px">
      <template #header><span>已注册应用</span></template>
      <el-table :data="tableData" stripe>
        <el-table-column prop="appCode" label="应用标识" />
        <el-table-column prop="name" label="应用名称" />
        <el-table-column prop="routes" label="路由前缀">
          <template #default="{ row }">
            <el-tag v-for="r in row.routes" :key="r" size="small" style="margin-right: 4px">{{ r }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="devPort" label="端口" width="80" />
      </el-table>
    </el-card>

    <el-card shadow="hover" style="margin-top: 16px">
      <template #header><span>环境配置</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="当前环境">
          <el-tag :type="pavilionMfeEnv === 'production' ? 'danger' : pavilionMfeEnv === 'uat' ? 'warning' : 'success'">{{ pavilionMfeEnv }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="API Base">{{ apiBase || '-' }}</el-descriptions-item>
        <el-descriptions-item label="CDN">{{ cdn || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card shadow="hover" style="margin-top: 16px">
      <template #header><span>运行时信息</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="当前路径">{{ currentPath }}</el-descriptions-item>
        <el-descriptions-item label="User Agent">{{ ua }}</el-descriptions-item>
        <el-descriptions-item label="语言">{{ language }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">{{ online ? '在线' : '离线' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import mfeConfig from '../../mfe.json'

const currentPath = ref(window.location.pathname)
const ua = navigator.userAgent
const language = navigator.language
const online = ref(navigator.onLine)

const tableData = mfeConfig.apps

const pavilionMfeEnv = (import.meta.env.VITE_PAVILION_MFE_ENV || 'dev') as string
const apiBase = (import.meta.env.VITE_BASE_API_URL || '') as string
const cdn = (import.meta.env.VITE_PAVILION_MFE_CDN || '') as string
</script>

<style scoped>
.env-page {
  max-width: 960px;
  margin: 0 auto;
}
.env-page h2 {
  margin: 0 0 16px;
  font-size: 20px;
  color: #333;
}
</style>
