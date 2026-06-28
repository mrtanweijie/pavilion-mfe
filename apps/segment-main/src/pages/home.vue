<template>
  <div class="welcome">
    <el-result icon="success" title="PavilionMfe 微前端框架">
      <template #sub-title>
        <p>基于 Module Federation 的微前端开源框架，支持 Vue / React 混合渲染</p>
      </template>
      <template #extra>
        <el-space>
          <el-tag v-for="app in menuList" :key="app.menuCode" type="info" size="large">
            {{ app.menuName }}
          </el-tag>
        </el-space>
      </template>
    </el-result>

    <el-row :gutter="16" style="margin-top: 24px">
      <el-col v-for="app in menuList" :key="app.menuCode" :span="12" class="card-col">
        <el-card shadow="hover" class="seg-card">
          <template #header>
            <div class="card-header">
              <el-icon :size="18"><component :is="app.menuIcon" v-if="app.menuIcon" /></el-icon>
              <span>{{ app.menuName }}</span>
            </div>
          </template>
          <el-tag
            v-for="child in app.childrenMenuInfoList"
            :key="child.menuUrl"
            size="small"
            style="margin-right: 8px; margin-bottom: 8px; cursor: pointer"
            @click="navigateTo(child.menuUrl)"
          >
            {{ child.menuName }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '@pavilion-mfe/router'
import { menus } from '../api/menu'

const menuList = menus
</script>

<style scoped>
.welcome {
  max-width: 960px;
  margin: 0 auto;
}

.card-col {
  margin-bottom: 16px;
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
