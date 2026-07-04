<template>
  <div class="vue2-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Vue2App',
}
</script>

<style scoped>
.vue2-app {
  padding: 28px 32px;
}
</style>

<style>
/* 主题色 — 与主应用保持一致 */
:root {
  --el-color-primary: #635BFF;
}
</style>
