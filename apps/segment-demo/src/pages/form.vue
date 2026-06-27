<template>
  <div class="page-form">
    <h3>表单页</h3>
    <el-card shadow="hover">
      <el-form :model="form" label-width="100px" style="max-width: 480px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="类型 A" value="a" />
            <el-option label="类型 B" value="b" />
            <el-option label="类型 C" value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="可选备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-alert v-if="submitted" title="提交成功" type="success" :closable="false" show-icon>
        <template #default>
          <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(submittedData, null, 2) }}</pre>
        </template>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const submitted = ref(false)
const submittedData = ref<any>(null)

const form = reactive({
  name: '',
  type: '',
  remark: '',
})

function submitForm() {
  submitted.value = true
  submittedData.value = { ...form }
}

function resetForm() {
  form.name = ''
  form.type = ''
  form.remark = ''
  submitted.value = false
}
</script>

<style scoped>
h3 { margin: 0 0 16px; color: #555; }
</style>
