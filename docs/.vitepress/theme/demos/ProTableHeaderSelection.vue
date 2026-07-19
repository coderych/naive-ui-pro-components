<script setup lang="ts">
import type { ProTableColumn, ProTableRecord } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NButton, NButtonGroup, NSpace, NTag, NText, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const checkedKeys = ref<(string | number)[]>([])
const data = ref([
  { id: 1, name: '张三', department: '研发部', status: '启用' },
  { id: 2, name: '李四', department: '产品部', status: '停用' },
  { id: 3, name: '王五', department: '设计部', status: '启用' },
  { id: 4, name: '赵六', department: '运营部', status: '停用' },
])

const columns: ProTableColumn[] = [
  { type: 'selection' },
  { title: '姓名', key: 'name' },
  { title: '部门', key: 'department' },
  { title: '状态', key: 'status' },
]

function updateStatus(rows: ProTableRecord[], status: string): void {
  const selectedIds = new Set(rows.map(row => row.id))
  data.value = data.value.map(row =>
    selectedIds.has(row.id) ? { ...row, status } : row,
  )
  message.success(`已将 ${rows.length} 位成员设为${status}`)
  checkedKeys.value = []
}
</script>

<template>
  <ProTable
    v-model:checked-row-keys="checkedKeys"
    :columns="columns"
    :data="data"
    :pagination="false"
    :show-index="false"
    :option="{ search: false }"
  >
    <template #title="{ keys }">
      <NSpace align="center">
        <NText strong>
          团队成员
        </NText>
        <NTag v-if="keys.length" size="small" type="info" round>
          已选 {{ keys.length }} 人
        </NTag>
      </NSpace>
    </template>

    <template #header-extra="{ keys, rows }">
      <NButtonGroup size="small">
        <NButton :disabled="!keys.length" @click="updateStatus(rows, '启用')">
          启用
        </NButton>
        <NButton :disabled="!keys.length" @click="updateStatus(rows, '停用')">
          停用
        </NButton>
      </NButtonGroup>
    </template>
  </ProTable>
</template>
