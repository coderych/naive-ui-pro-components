<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { ref } from 'vue'

const model = ref({ name: '', age: undefined, status: true, hobbies: [] as string[] })

const columns: ProFormColumn[] = [
  {
    key: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    rule: { required: true, message: '请输入姓名', trigger: 'blur' },
  },
  {
    key: 'age',
    label: '年龄',
    component: 'input-number',
    componentProps: { min: 0, max: 150, placeholder: '请输入年龄' },
  },
  {
    key: 'status',
    label: '状态',
    component: 'switch',
    componentProps: { checkedText: '启用', uncheckedText: '禁用' },
  },
  {
    key: 'hobbies',
    label: '爱好',
    component: 'checkbox-group',
    componentProps: {
      options: [
        { label: '阅读', value: 'reading' },
        { label: '运动', value: 'sports' },
        { label: '音乐', value: 'music' },
      ],
    },
  },
]
</script>

<template>
  <div>
    <ProForm v-model:value="model" :columns="columns" />
    <div style="margin-top: 12px; padding: 12px; background: var(--vp-code-block-bg); border-radius: 8px;">
      <pre style="margin: 0; font-size: 13px;">{{ JSON.stringify(model, null, 2) }}</pre>
    </div>
  </div>
</template>
