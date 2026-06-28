<template>
  <div class="vue-sub-test">
    <div class="card">
      <div class="card-title">Vue Sub 测试页</div>
      <p style="color: var(--text-regular); font-size: 13px;">这是 demo-app 子应用下 /vue-sub/test 页面。</p>
      <p style="color: var(--text-muted); font-size: 12px;">同一个 appCode（demo-app）支持多条路由前缀：/demo 和 /vue-sub。</p>
      <el-space wrap style="margin-top: 8px">
        <el-button type="primary" @click="navigateTo('/demo/list')">跳转到 /demo/list</el-button>
        <el-button @click="navigateTo('/react/list')">React 列表页</el-button>
        <el-button @click="navigateTo('/react/dashboard')">React 仪表盘</el-button>
      </el-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@pavilion-mfe/bridge'
</script>

<style scoped>
.vue-sub-test { }
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
</style>
