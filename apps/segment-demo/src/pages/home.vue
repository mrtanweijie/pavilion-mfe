<template>
  <div class="page-home">
    <div class="card welcome-card">
      <h2>Vue 子应用</h2>
      <p class="card-desc">基于 Element Plus + Vue Router</p>
      <el-space style="margin-top: 12px">
        <el-button type="primary" @click="router.push('/demo/list')">列表页</el-button>
        <el-button @click="router.push('/demo/form')">表单页</el-button>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.page-home { }
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
}
.welcome-card h2 { margin: 0 0 6px; font-size: 20px; color: var(--text-primary); font-weight: 700; }
.card-desc { margin: 0; font-size: 13px; color: var(--text-muted); }
</style>
