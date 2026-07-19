<script setup lang="ts">
import type { ProTableColumn, ProTableRequestResult } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NButton, NSpace, NTag } from 'naive-ui'
import { h } from 'vue'

const columns: ProTableColumn[] = [
  { title: 'ID', key: 'id', width: 60 },
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', sorter: true },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(NTag, {
        type: row.status === 1 ? 'success' : 'warning',
        size: 'small',
      }, { default: () => row.status === 1 ? '启用' : '禁用' })
    },
  },
  { title: '部门', key: 'department' },
  { title: '邮箱', key: 'email', ellipsis: { tooltip: true } },
  { title: '地址', key: 'address', ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createdAt' },
  {
    title: '操作',
    key: 'actions',
    render() {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, { size: 'tiny', type: 'primary', quaternary: true }, { default: () => '编辑' }),
          h(NButton, { size: 'tiny', type: 'error', quaternary: true }, { default: () => '删除' }),
        ],
      })
    },
  },
]

const allData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: ['张三', '李四', '王五', '赵六', '钱七', '孙八'][i % 6],
  age: 20 + (i % 40),
  status: i % 3 === 0 ? 0 : 1,
  department: ['研发部', '产品部', '运营部', '设计部'][i % 4],
  email: `user${i + 1}@example.com`,
  address: ['北京市朝阳区建国路88号', '上海市浦东新区陆家嘴环路1000号', '广州市天河区天河路385号', '深圳市南山区科技园南路'][i % 4],
  createdAt: `2026-05-${String((i % 28) + 1).padStart(2, '0')}`,
}))

async function request(params: Record<string, unknown>): Promise<ProTableRequestResult> {
  await new Promise(r => setTimeout(r, 500))
  const filtered = [...allData]
  const page = (params.current as number) || 1
  const pageSize = (params.size as number) || 10
  const orderBy = params.orderBy as string
  if (orderBy) {
    const [field, order] = orderBy.split(' ')
    filtered.sort((a: any, b: any) => order === 'asc' ? a[field] - b[field] : b[field] - a[field])
  }
  return {
    data: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
  }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" :pagination="{ pageSize: 10 }" />
</template>
