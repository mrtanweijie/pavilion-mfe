<template>
  <div class="demo-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import 'element-plus/dist/index.css'
</script>

<style scoped>
.demo-app {
  padding: 28px 32px;
}
</style>

<style>
/* 主题色 */
:root {
  --el-color-primary: #635BFF;
  --el-color-primary-light-3: rgba(99, 91, 255, 0.7);
  --el-color-primary-light-5: rgba(99, 91, 255, 0.5);
  --el-color-primary-light-7: rgba(99, 91, 255, 0.3);
  --el-color-primary-light-8: rgba(99, 91, 255, 0.2);
  --el-color-primary-light-9: rgba(99, 91, 255, 0.1);
  --el-color-primary-dark-2: #5147E0;
  --el-border-radius-base: 8px;
}

/* 输入框 */
.el-input__wrapper {
  height: 40px;
  border-width: 1.5px !important;
  border-radius: 8px !important;
  transition: border-color 0.2s;
}
.el-input__wrapper:hover {
  border-color: #635BFF !important;
}
.el-select .el-input__wrapper {
  height: 40px;
  border-width: 1.5px !important;
}

/* 按钮 */
.el-button {
  height: 40px;
  border-radius: 8px;
}

/* 卡片 */
.el-card {
  border-radius: 8px;
}

/* 标签 */
.el-tag {
  border-radius: 6px;
}

/* 表单标签 */
.el-form-item__label {
  height: 40px;
  line-height: 40px;
}

/* 表格行高 55px */
.el-table__body .el-table__cell {
  padding: 16px 0;
}
.el-table__header .el-table__cell {
  padding: 16px 0;
}
</style>
