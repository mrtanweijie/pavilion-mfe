<template>
  <div class="error-page">
    <h1>404</h1>
    <p>页面不存在</p>
    <button @click="$router.push('/')">返回首页</button>
  </div>
</template>
<style scoped>
.error-page { text-align: center; padding-top: 80px; }
.error-page h1 { font-size: 64px; color: #999; margin: 0; }
.error-page button { margin-top: 16px; padding: 8px 24px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: #fff; }
</style>
