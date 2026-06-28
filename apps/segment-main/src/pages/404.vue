<template>
  <div class="error-page">
    <img :src="notFoundSvg" alt="404" class="error-img" />
    <h2 class="error-title">页面不存在</h2>
    <p class="error-desc">请检查 URL 是否正确，或返回首页</p>
    <el-button type="primary" @click="goHome"><el-icon :size="16"><Back /></el-icon>返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTabs } from '@pavilion-mfe/tabs/vue'
import notFoundSvg from '../assets/404.svg'

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
