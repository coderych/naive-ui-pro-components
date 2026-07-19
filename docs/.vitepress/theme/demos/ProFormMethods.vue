<script setup lang="ts">
import type { ProFormColumn, ProFormInst } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { NAlert, NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref<ProFormInst | null>(null)
const model = ref({ name: '', email: '' })
const result = ref('点击按钮调用 NForm 实例方法')

const columns: ProFormColumn[] = [
  {
    key: 'name',
    label: '姓名',
    component: 'input',
    rule: { required: true, message: '请输入姓名', trigger: ['input', 'blur'] },
    span: 12,
  },
  {
    key: 'email',
    label: '邮箱',
    component: 'input',
    rule: { type: 'email', message: '请输入正确的邮箱', trigger: ['input', 'blur'] },
    span: 12,
  },
]

async function validate(): Promise<void> {
  try {
    await formRef.value?.validate()
    result.value = '校验通过'
  }
  catch {
    result.value = '校验未通过，请检查表单字段'
  }
}

function restoreValidation(): void {
  formRef.value?.restoreValidation()
  result.value = '已清除校验状态'
}

function invalidateLabelWidth(): void {
  formRef.value?.invalidateLabelWidth()
  result.value = '已重新计算标签宽度'
}
</script>

<template>
  <ProForm ref="formRef" v-model:value="model" :columns="columns" />
  <NSpace style="margin-bottom: 12px;">
    <NButton type="primary" @click="validate">
      validate
    </NButton>
    <NButton @click="restoreValidation">
      restoreValidation
    </NButton>
    <NButton @click="invalidateLabelWidth">
      invalidateLabelWidth
    </NButton>
  </NSpace>
  <NAlert type="info" :show-icon="false">
    {{ result }}
  </NAlert>
</template>
