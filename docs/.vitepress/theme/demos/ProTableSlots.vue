<script setup lang="ts">
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NButton } from 'naive-ui'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '部门', key: 'department' },
  { title: '角色', key: 'role' },
]
const data = [{ id: 1, name: '张三', department: '研发部', role: '前端工程师' }]
</script>

<template>
  <ProTable :columns="columns" :data="data" :pagination="false">
    <template #title>
      <strong>自定义标题</strong>
    </template>
    <template #header-extra>
      <NButton type="primary" size="small">
        新增用户
      </NButton>
    </template>
  </ProTable>
</template>
