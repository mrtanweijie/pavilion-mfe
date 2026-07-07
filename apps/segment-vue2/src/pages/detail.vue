<template>
  <div class="page-detail">
    <div class="card">
      <div class="card-title">详情页</div>
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
        <el-button @click="$router.push('/vue2/list')">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailPage',
  data() {
    return {
      listData: [
        { id: 1, name: '服务 A', status: '运行中', createdAt: '2026-06-01 10:00' },
        { id: 2, name: '服务 B', status: '运行中', createdAt: '2026-06-02 14:30' },
        { id: 3, name: '服务 C', status: '已停止', createdAt: '2026-06-03 09:15' },
        { id: 4, name: '服务 D', status: '运行中', createdAt: '2026-06-04 16:45' },
        { id: 5, name: '服务 E', status: '已停止', createdAt: '2026-06-05 11:20' },
      ],
    }
  },
  computed: {
    item() {
      const id = Number(this.$route.query.id)
      return this.listData.find((i) => i.id === id) ?? null
    },
  },
}
</script>

<style scoped>
.page-detail { }
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
</style>
