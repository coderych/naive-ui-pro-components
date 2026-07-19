<script setup lang="ts">
import type { ProTableBatchAction, ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NSpace, NSwitch, NText } from 'naive-ui'
import { ref } from 'vue'

const showIndex = ref(true)
const continuousIndex = ref(true)
const actionMessage = ref('')

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '部门', key: 'department' },
  { title: '职位', key: 'role' },
]

const departments = ['研发部', '产品部', '设计部']
const roles = ['前端工程师', '产品经理', 'UI 设计师']
const data = Array.from({ length: 13 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
  department: departments[index % departments.length],
  role: roles[index % roles.length],
}))

const batchActions: ProTableBatchAction[] = [{
  key: 'archive',
  label: '批量归档',
  onClick(keys) {
    actionMessage.value = `已归档 ${keys.length} 项`
  },
}]
</script>

<template>
  <NSpace align="center" style="margin-bottom: 16px">
    <NText>显示序号</NText>
    <NSwitch v-model:value="showIndex" />
    <NText>跨页连续</NText>
    <NSwitch v-model:value="continuousIndex" :disabled="!showIndex" />
    <NText v-if="actionMessage" depth="3">
      {{ actionMessage }}
    </NText>
  </NSpace>

  <ProTable
    :batch-actions="batchActions"
    :columns="columns"
    :continuous-index="continuousIndex"
    :data="data"
    :pagination="{ pageSize: 5 }"
    :show-index="showIndex"
    :option="{ search: false }"
  />
</template>
