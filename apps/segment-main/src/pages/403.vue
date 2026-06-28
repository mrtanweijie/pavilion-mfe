<template>
  <div class="error-page">
    <img :src="forbiddenSvg" alt="403" class="error-img" />
    <h2 class="error-title">权限不足</h2>
    <p class="error-desc">您没有权限访问此页面</p>
    <el-button type="primary" @click="goHome"><el-icon :size="16"><Back /></el-icon>返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import forbiddenSvg from '../assets/403.svg'

const router = useRouter()
const { activeTabId, closeTab } = useTabs()

function goHome() {
  if (activeTabId.value) closeTab(activeTabId.value)
  router.push('/')
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
}
.error-img {
  width: 320px;
  max-width: 60%;
}
.error-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}
.error-desc {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  margin: 0;
}
</style>
