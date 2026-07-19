<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { NButton, NSpace, useMessage } from 'naive-ui'
import { h, ref } from 'vue'

const model = ref({ actions: '' })
const message = useMessage()

const columns: ProFormColumn[] = [
  {
    key: 'name',
    label: '姓名',
    component: 'input',
    componentProps: { placeholder: '请输入姓名' },
    span: 12,
  },
  {
    key: 'email',
    label: '邮箱',
    component: 'input',
    componentProps: { placeholder: 'xxx@xxx.com' },
    span: 12,
  },
  {
    key: 'actions',
    label: '操作',
    component: 'none',
    render(ctx) {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, { type: 'primary', onClick: () => message.success(JSON.stringify(ctx.model)) }, { default: () => '提交' }),
          h(NButton, { onClick: () => message.info('已取消') }, { default: () => '取消' }),
        ],
      })
    },
  },
]
</script>

<template>
  <div>
    <ProForm v-model:value="model" :columns="columns" />
    <div style="margin-top: 12px; padding: 12px; background: var(--vp-code-block-bg); border-radius: 8px; font-size: 13px;">
      <pre style="margin: 0;">{{ JSON.stringify(model, null, 2) }}</pre>
    </div>
  </div>
</template>
