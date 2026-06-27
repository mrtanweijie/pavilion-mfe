<template>
  <div class="demo-app">
    <h2>Vue 子应用</h2>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import 'element-plus/dist/index.css'
</script>

<style scoped>
.demo-app {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.demo-app h2 {
  margin: 0 0 16px;
  color: #333;
}
</style>
