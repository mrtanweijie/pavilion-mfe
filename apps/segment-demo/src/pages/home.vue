<template>
  <div class="page-home">
    <el-result icon="info" title="Vue 子应用" sub-title="基于 Element Plus + Vue Router">
      <template #extra>
        <el-space>
          <el-button type="primary" @click="router.push('/demo/list')">列表页</el-button>
          <el-button type="success" @click="router.push('/demo/form')">表单页</el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
