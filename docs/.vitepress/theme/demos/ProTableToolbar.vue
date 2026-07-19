<script setup lang="ts">
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NCheckbox, NSpace } from 'naive-ui'
import { reactive } from 'vue'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '部门', key: 'department' },
  { title: '角色', key: 'role' },
]
const data = [{ id: 1, name: '张三', department: '研发部', role: '前端工程师' }]
const option = reactive({
  tableHeader: true,
  full: true,
  reload: true,
  setting: true,
  size: true,
})
</script>

<template>
  <NSpace style="margin-bottom: 16px;" wrap>
    <NCheckbox v-model:checked="option.tableHeader">
      TableHeader
    </NCheckbox>
    <NCheckbox v-model:checked="option.reload">
      刷新
    </NCheckbox>
    <NCheckbox v-model:checked="option.full">
      全屏
    </NCheckbox>
    <NCheckbox v-model:checked="option.size">
      密度
    </NCheckbox>
    <NCheckbox v-model:checked="option.setting">
      列设置
    </NCheckbox>
  </NSpace>
  <ProTable :columns="columns" :data="data" :pagination="false" :option="option">
    <template #title>
      <strong>用户列表</strong>
    </template>
  </ProTable>
</template>
