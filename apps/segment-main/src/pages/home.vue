<template>
  <div class="welcome">
    <el-result icon="success" title="PavilionMfe 微前端框架">
      <template #sub-title>
        <p>基于 Module Federation 的微前端开源框架，支持 Vue / React 混合渲染</p>
      </template>
      <template #extra>
        <el-space>
          <el-tag v-for="seg in apps" :key="seg.appCode" type="info" size="large">
            {{ seg.name }}
          </el-tag>
        </el-space>
      </template>
    </el-result>

    <el-row :gutter="16" style="margin-top: 24px">
      <el-col v-for="seg in apps" :key="seg.appCode" :span="12">
        <el-card shadow="hover" class="seg-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18"><Grid v-if="seg.appCode === 'demo-app'" /><Connection v-else /></el-icon>
              <span>{{ seg.name }}</span>
            </div>
          </template>
          <el-tag
            v-for="child in seg.children"
            :key="child.route"
            size="small"
            style="margin-right: 8px; margin-bottom: 8px; cursor: pointer"
            @click="navigateTo(child.route)"
          >
            {{ child.name }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Grid, Connection } from '@element-plus/icons-vue'
import { navigateTo } from '@pavilion-mfe/router'
import mfeConfig from '../../mfe.json'

const apps = mfeConfig.apps
</script>

<style scoped>
.welcome {
  max-width: 960px;
  margin: 0 auto;
}

.seg-card {
  border-top: 3px solid #409eff;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}
</style>
