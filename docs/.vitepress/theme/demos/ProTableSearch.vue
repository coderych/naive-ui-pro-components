<script setup lang="ts">
import type { ProTableBatchAction, ProTableColumn, ProTableRequestResult } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

const columns: ProTableColumn[] = [
  {
    title: '姓名',
    key: 'name',
    search: {
      component: 'input',
      label: '姓名',
    },
  },
  {
    title: '年龄',
    key: 'age',
    search: {
      component: 'input-number',
      label: '年龄',
      props: { min: 0, max: 150 },
    },
  },
  {
    title: '状态',
    key: 'status',
    search: {
      component: 'select',
      label: '状态',
      options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }],
    },
  },
  {
    title: '部门',
    key: 'department',
    search: {
      component: 'select',
      options: [{ label: '研发部', value: '研发部' }, { label: '产品部', value: '产品部' }, { label: '运营部', value: '运营部' }],
    },
  },
  {
    title: '邮箱',
    key: 'email',
    search: true,
  },
  {
    title: '手机号',
    key: 'phone',
  },
  {
    title: '地址',
    key: 'address',
    search: {
      component: 'input',
      label: '地址',
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
  },
]

const allData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: ['张三', '李四', '王五', '赵六', '钱七', '孙八'][i % 6],
  age: 20 + (i % 40),
  status: i % 3 === 0 ? 0 : 1,
  department: ['研发部', '产品部', '运营部'][i % 3],
  email: `user${i + 1}@example.com`,
  phone: `1380000${String(i).padStart(4, '0')}`,
  address: ['北京', '上海', '广州', '深圳', '杭州', '成都'][i % 6],
  createdAt: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
}))

async function request(params: Record<string, unknown>): Promise<ProTableRequestResult> {
  await new Promise(r => setTimeout(r, 300))
  let filtered = [...allData]
  if (params.name)
    filtered = filtered.filter(r => (r.name as string).includes(params.name as string))
  if (params.status !== undefined && params.status !== null)
    filtered = filtered.filter(r => r.status === params.status)
  if (params.department)
    filtered = filtered.filter(r => r.department === params.department)
  if (params.email)
    filtered = filtered.filter(r => r.email.includes(params.email as string))
  if (params.address)
    filtered = filtered.filter(r => (r.address as string).includes(params.address as string))
  const page = (params.current as number) || 1
  const pageSize = (params.size as number) || 10
  return { data: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length }
}

const checkedKeys = ref<(string | number)[]>([])
const batchActions: ProTableBatchAction[] = [
  {
    key: 'delete',
    label: '批量删除',
    type: 'error',
    onClick(keys) {
      message.success(`删除 ${keys.length} 项`)
      checkedKeys.value = []
    },
  },
  {
    key: 'export',
    label: '导出',
    type: 'info',
    onClick(keys) {
      message.success(`导出 ${keys.length} 项`)
    },
  },
]
</script>

<template>
  <ProTable
    v-model:checked-row-keys="checkedKeys"
    :columns="columns"
    :request="request"
    :batch-actions="batchActions"
  />
</template>
