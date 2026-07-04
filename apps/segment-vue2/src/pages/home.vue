<template>
  <div class="page-home">
    <div class="card welcome-card">
      <h2>Vue 2 子应用</h2>
      <p class="card-desc">基于 Element UI + Vue Router (Options API)</p>
      <el-space style="margin-top: 12px">
        <el-button type="primary" @click="$router.push('/vue2/list')">列表页</el-button>
        <el-button @click="$router.push('/vue2/form')">表单页</el-button>
      </el-space>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.page-home { }
.card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 28px;
}
.welcome-card h2 { margin: 0 0 6px; font-size: 20px; color: #1A202C; font-weight: 700; }
.card-desc { margin: 0; font-size: 13px; color: #A0AEC0; }
</style>
