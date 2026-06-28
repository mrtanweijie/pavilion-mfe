<template>
  <div class="page-wrapper">
    <h2>环境信息</h2>

    <el-row :gutter="16">
      <el-col v-for="item in infoCards" :key="item.label" :span="8">
        <div class="card info-card">
          <div class="info-card-label">{{ item.label }}</div>
          <el-tag :type="item.tagType">{{ item.value }}</el-tag>
        </div>
      </el-col>
    </el-row>

    <div class="card" style="margin-top: 16px">
      <div class="card-title">已注册菜单</div>
      <el-table :data="tableData" stripe>
        <el-table-column prop="menuCode" label="菜单编码" />
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="menuUrl" label="路由地址" />
        <el-table-column prop="menuTp" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.menuTp === '0' ? 'primary' : 'info'" size="small">
              {{ row.menuTp === '0' ? '目录' : '菜单' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'danger'" size="small">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="card" style="margin-top: 16px">
      <div class="card-title">环境配置</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="当前环境">
          <el-tag :type="envTagType">{{ pavilionMfeEnv }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="API Base">{{ apiBase || '-' }}</el-descriptions-item>
        <el-descriptions-item label="CDN">{{ cdn || '-' }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="card" style="margin-top: 16px">
      <div class="card-title">运行时信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="当前路径">{{ currentPath }}</el-descriptions-item>
        <el-descriptions-item label="User Agent">{{ ua }}</el-descriptions-item>
        <el-descriptions-item label="语言">{{ language }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">{{ online ? '在线' : '离线' }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { menus } from '../api/menu'

const currentPath = ref(window.location.pathname)
const ua = navigator.userAgent
const language = navigator.language
const online = ref(navigator.onLine)

const tableData = menus

const pavilionMfeEnv = (import.meta.env.VITE_PAVILION_MFE_ENV || 'dev') as string
const apiBase = (import.meta.env.VITE_BASE_API_URL || '') as string
const cdn = (import.meta.env.VITE_PAVILION_MFE_CDN || '') as string

const envTagType = pavilionMfeEnv === 'production' ? 'danger' : pavilionMfeEnv === 'uat' ? 'warning' : 'success'

const infoCards = [
  { label: '框架', value: 'Vue 3', tagType: 'success' as const },
  { label: '构建工具', value: 'Vite 5', tagType: 'warning' as const },
  { label: '微前端', value: 'PavilionMfe', tagType: 'primary' as const },
]
</script>

<style scoped>
.page-wrapper { }
.page-wrapper h2 { margin: 0 0 24px; font-size: 22px; color: var(--text-primary); font-weight: 700; }

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

.info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.info-card-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}
</style>
