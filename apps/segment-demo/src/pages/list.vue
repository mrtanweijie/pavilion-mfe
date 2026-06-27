<template>
  <div class="page-list">
    <h3>列表页</h3>
    <el-table :data="listData" stripe @row-click="viewItem">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '运行中' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" @click.stop="viewItem(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const listData = [
  { id: 1, name: '服务 A', status: '运行中', createdAt: '2026-06-01 10:00' },
  { id: 2, name: '服务 B', status: '运行中', createdAt: '2026-06-02 14:30' },
  { id: 3, name: '服务 C', status: '已停止', createdAt: '2026-06-03 09:15' },
  { id: 4, name: '服务 D', status: '运行中', createdAt: '2026-06-04 16:45' },
  { id: 5, name: '服务 E', status: '已停止', createdAt: '2026-06-05 11:20' },
]

function viewItem(item: any) {
  router.push({ path: '/demo/detail', query: { id: item.id } })
}
</script>

<style scoped>
h3 { margin: 0 0 16px; color: #555; }
</style>
