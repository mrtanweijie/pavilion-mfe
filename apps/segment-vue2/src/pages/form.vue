<template>
  <div class="page-form">
    <div class="card">
      <div class="card-title">表单页</div>
      <el-form :model="form" label-width="100px">
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
      <el-alert
        v-if="submitted"
        title="提交成功"
        type="success"
        :closable="false"
        show-icon
        style="margin-top: 16px"
      >
        <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(submittedData, null, 2) }}</pre>
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormPage',
  data() {
    return {
      submitted: false,
      submittedData: null,
      form: { name: '', type: '', remark: '' },
    }
  },
  methods: {
    submitForm() {
      this.submitted = true
      this.submittedData = { ...this.form }
      this.$message.success('提交成功')
    },
    resetForm() {
      this.form.name = ''
      this.form.type = ''
      this.form.remark = ''
      this.submitted = false
    },
  },
}
</script>

<style scoped>
.page-form { }
.card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
</style>
