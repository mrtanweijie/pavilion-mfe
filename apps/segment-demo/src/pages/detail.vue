<template>
  <div class="page-detail">
    <h3>详情页</h3>
    <el-card shadow="hover">
      <el-descriptions v-if="item" :column="2" border>
        <el-descriptions-item label="ID">{{ item.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ item.name }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="item.status === '运行中' ? 'success' : 'warning'" size="small">{{ item.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ item.createdAt }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="未找到该记录" />
      <div style="margin-top: 16px">
        <el-button @click="router.push('/demo/list')">返回列表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const listData = [
  { id: 1, name: '服务 A', status: '运行中', createdAt: '2026-06-01 10:00' },
  { id: 2, name: '服务 B', status: '运行中', createdAt: '2026-06-02 14:30' },
  { id: 3, name: '服务 C', status: '已停止', createdAt: '2026-06-03 09:15' },
  { id: 4, name: '服务 D', status: '运行中', createdAt: '2026-06-04 16:45' },
  { id: 5, name: '服务 E', status: '已停止', createdAt: '2026-06-05 11:20' },
]

const item = computed(() => {
  const id = Number(route.query.id)
  return listData.find((i) => i.id === id) ?? null
})
</script>

<style scoped>
h3 { margin: 0 0 16px; color: #555; }
</style>
