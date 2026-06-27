<template>
  <div class="demo-app">
    <h2>Vue 子应用</h2>
    <div v-if="page === 'list'" class="page list">
      <h3>列表页</h3>
      <ul>
        <li v-for="i in 5" :key="i">条目 {{ i }}</li>
      </ul>
    </div>
    <div v-else-if="page === 'detail'" class="page detail">
      <h3>详情页</h3>
      <p>这是详情页的内容区域。</p>
    </div>
    <div v-else class="page home">
      <p>选择左侧菜单进入子应用页面</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const page = ref('')

function updatePage() {
  const path = window.location.pathname
  if (path.startsWith('/demo/list')) page.value = 'list'
  else if (path.startsWith('/demo/detail')) page.value = 'detail'
  else page.value = ''
}

onMounted(() => {
  updatePage()
  window.addEventListener('popstate', updatePage)
})
onUnmounted(() => window.removeEventListener('popstate', updatePage))
</script>

<style scoped>
.demo-app { padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.demo-app h2 { margin: 0 0 16px; color: #333; }
.page h3 { margin: 0 0 12px; }
ul { padding-left: 20px; }
li { padding: 4px 0; color: #666; }
p { color: #999; }
</style>
