<template>
  <div class="test-page">
    <h2>测试页</h2>
    <p>这是基座应用自带的页面，不经过子应用加载。</p>
    <div class="test-card">
      <h3>环境信息</h3>
      <table><tbody>
        <tr><td>当前路径</td><td>{{ currentPath }}</td></tr>
        <tr><td>框架</td><td>Vue 3 + TypeScript</td></tr>
        <tr><td>微前端</td><td>Pavilion</td></tr>
      </tbody></table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentPath = ref(window.location.pathname)
const update = () => { currentPath.value = window.location.pathname }
onMounted(() => window.addEventListener('popstate', update))
onUnmounted(() => window.removeEventListener('popstate', update))
</script>

<style scoped>
.test-page { max-width: 600px; margin: 0 auto; }
.test-page h2 { margin: 0 0 16px; }
.test-card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.test-card h3 { margin: 0 0 12px; }
.test-card table { width: 100%; border-collapse: collapse; }
.test-card td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; }
.test-card td:first-child { font-weight: 600; color: #666; width: 100px; }
</style>
