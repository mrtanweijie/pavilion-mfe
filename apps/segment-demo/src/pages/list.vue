<template>
  <div class="page-list">
    <!-- 搜索表单 -->
    <div class="card search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="服务名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <div class="card-title">列表页</div>
      <el-table :data="filteredData" stripe @row-click="viewItem">
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
            <el-button size="small" type="primary" link @click.stop="viewItem(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const searchForm = reactive({ keyword: '', status: '' })

const listData = [
  { id: 1, name: '服务 A', status: '运行中', createdAt: '2026-06-01 10:00' },
  { id: 2, name: '服务 B', status: '运行中', createdAt: '2026-06-02 14:30' },
  { id: 3, name: '服务 C', status: '已停止', createdAt: '2026-06-03 09:15' },
  { id: 4, name: '服务 D', status: '运行中', createdAt: '2026-06-04 16:45' },
  { id: 5, name: '服务 E', status: '已停止', createdAt: '2026-06-05 11:20' },
]

const filteredData = computed(() =>
  listData.filter((item) => {
    const matchKeyword = !searchForm.keyword || item.name.includes(searchForm.keyword)
    const matchStatus = !searchForm.status || item.status === searchForm.status
    return matchKeyword && matchStatus
  }),
)

function handleSearch() { /* search triggered by computed */ }
function handleReset() { searchForm.keyword = ''; searchForm.status = '' }
function viewItem(item: any) { router.push({ path: '/demo/detail', query: { id: item.id } }) }
</script>

<style scoped>
.page-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);
}
.card:hover {
  box-shadow: var(--shadow-md);
}
.card-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; }
.search-form { margin-bottom: 0; }
.search-card .el-form-item { margin-bottom: 0; }
</style>
