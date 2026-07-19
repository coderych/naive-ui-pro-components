<script setup lang="ts">
import type { ProTableBatchAction, ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  { title: '地址', key: 'address' },
]

const data = ref([
  { id: 1, name: '张三', age: 32, address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 28, address: '上海市浦东新区' },
  { id: 3, name: '王五', age: 45, address: '广州市天河区' },
  { id: 4, name: '赵六', age: 36, address: '深圳市南山区' },
])

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
    label: '导出选中',
    type: 'primary',
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
    :data="data"
    :batch-actions="batchActions"
  />
</template>
