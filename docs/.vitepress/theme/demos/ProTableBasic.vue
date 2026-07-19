<script setup lang="ts">
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NTag } from 'naive-ui'
import { h, ref } from 'vue'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
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
  { title: '角色', key: 'role' },
  { title: '邮箱', key: 'email', ellipsis: { tooltip: true } },
  { title: '地址', key: 'address' },
  { title: '创建时间', key: 'createdAt' },
]

const data = ref([
  { id: 1, name: '张三', age: 32, status: 1, department: '研发部', role: '前端工程师', email: 'zhangsan@example.com', address: '北京市朝阳区', createdAt: '2026-06-01' },
  { id: 2, name: '李四', age: 28, status: 0, department: '产品部', role: '产品经理', email: 'lisi@example.com', address: '上海市浦东新区', createdAt: '2026-05-18' },
  { id: 3, name: '王五', age: 45, status: 1, department: '运营部', role: '运营主管', email: 'wangwu@example.com', address: '广州市天河区', createdAt: '2026-04-12' },
  { id: 4, name: '赵六', age: 36, status: 1, department: '设计部', role: 'UI 设计师', email: 'zhaoliu@example.com', address: '深圳市南山区', createdAt: '2026-03-08' },
])
</script>

<template>
  <ProTable :columns="columns" :data="data" :pagination="{ pageSize: 10 }" :option="{ header: false }" />
</template>
