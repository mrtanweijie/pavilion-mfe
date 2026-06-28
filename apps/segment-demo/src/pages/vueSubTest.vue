<template>
  <div class="vue-sub-test">
    <el-card shadow="hover">
      <template #header>
        <span>Vue Sub 测试页</span>
      </template>
      <p>这是 demo-app 子应用下 /vue-sub/test 页面。</p>
      <p>同一个 appCode（demo-app）支持多条路由前缀：/demo 和 /vue-sub。</p>
      <el-space wrap>
        <el-button type="primary" @click="navigateTo('/demo/list')">跳转到 /demo/list</el-button>
        <el-button type="success" @click="navigateTo('/react/list')">跳转到 React 列表页</el-button>
        <el-button type="success" @click="navigateTo('/react/dashboard')">跳转到 React 仪表盘</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@pavilion-mfe/bridge'
</script>

<style scoped>
.vue-sub-test {
  max-width: 720px;
  margin: 0 auto;
}
</style>
