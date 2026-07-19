<script setup lang="ts">
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name', fixed: 'left', width: 120 },
  { title: '年龄', key: 'age', width: 100 },
  { title: '部门', key: 'department', width: 140 },
  { title: '角色', key: 'role', width: 160 },
  { title: '邮箱', key: 'email', width: 220 },
  { title: '手机号', key: 'phone', width: 160 },
  { title: '地址', key: 'address', width: 240 },
  { title: '操作', key: 'action', fixed: 'right', width: 120 },
]

const data = [
  { id: 1, name: '张三', age: 32, department: '研发部', role: '前端工程师', email: 'zhangsan@example.com', phone: '13800000001', address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 28, department: '产品部', role: '产品经理', email: 'lisi@example.com', phone: '13800000002', address: '上海市浦东新区' },
]
</script>

<template>
  <ProTable :columns="columns" :data="data" :scroll-x="1260" :pagination="false" />
</template>
