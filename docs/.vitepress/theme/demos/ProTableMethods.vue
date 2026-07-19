<script setup lang="ts">
import type {
  ProTableColumn,
  ProTableInst,
  ProTableRequestResult,
} from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NAlert, NButton, NCode, NSpace, NText } from 'naive-ui'
import { nextTick, ref } from 'vue'

interface MethodAction {
  label: string
  run: (table: ProTableInst) => unknown
}

const tableRef = ref<ProTableInst | null>(null)
const result = ref('点击按钮调用 ProTable 或 NDataTable 实例方法')
const snapshot = ref('{}')

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', sorter: true },
  {
    title: '部门',
    key: 'department',
    filterOptions: [
      { label: '研发部', value: '研发部' },
      { label: '产品部', value: '产品部' },
    ],
  },
]

const sourceData = [
  { id: 1, name: '张三', age: 32, department: '研发部' },
  { id: 2, name: '李四', age: 24, department: '产品部' },
  { id: 3, name: '王五', age: 29, department: '研发部' },
  { id: 4, name: '赵六', age: 35, department: '产品部' },
]

async function request(params: Record<string, unknown>): Promise<ProTableRequestResult> {
  const keyword = String(params.name ?? '')
  const filteredData = sourceData.filter(row => row.name.includes(keyword))
  const page = Number(params.current ?? 1)
  const pageSize = Number(params.size ?? 2)
  const start = (page - 1) * pageSize
  await Promise.resolve()
  return { data: filteredData.slice(start, start + pageSize), total: filteredData.length }
}

const proTableActions: MethodAction[] = [
  { label: 'reload()', run: table => table.reload() },
  { label: 'request()', run: table => table.request({ name: '李' }) },
  { label: 'search()', run: table => table.search({ name: '张' }) },
  { label: 'reset()', run: table => table.reset() },
  { label: 'setParams()', run: table => table.setParams({ name: '王' }) },
  { label: 'updateParams()', run: table => table.updateParams({ source: 'demo' }) },
]

const dataTableActions: MethodAction[] = [
  { label: 'filter()', run: table => table.filter({ department: ['研发部'] }) },
  { label: 'filters()', run: table => table.filters({ department: ['产品部'] }) },
  { label: 'clearFilters()', run: table => table.clearFilters() },
  { label: 'clearFilter()', run: table => table.clearFilter() },
  { label: 'sort()', run: table => table.sort('age', 'ascend') },
  { label: 'clearSorter()', run: table => table.clearSorter() },
  { label: 'page()', run: table => table.page(2) },
  { label: 'scrollTo()', run: table => table.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: 'downloadCsv()', run: table => table.downloadCsv() },
]

async function invoke(action: MethodAction): Promise<void> {
  const table = tableRef.value
  if (!table)
    return
  await action.run(table)
  await nextTick()
  result.value = `已调用 ${action.label}`
  snapshot.value = JSON.stringify({
    data: table.data,
    index: table.index,
    params: table.params,
  }, null, 2)
}
</script>

<template>
  <NSpace vertical :size="12">
    <NText strong>
      ProTable 方法
    </NText>
    <NSpace>
      <NButton
        v-for="action in proTableActions"
        :key="action.label"
        type="primary"
        secondary
        @click="invoke(action)"
      >
        {{ action.label }}
      </NButton>
    </NSpace>

    <NText strong>
      NDataTable 方法
    </NText>
    <NSpace>
      <NButton
        v-for="action in dataTableActions"
        :key="action.label"
        @click="invoke(action)"
      >
        {{ action.label }}
      </NButton>
    </NSpace>

    <NAlert type="info" :show-icon="false">
      {{ result }}
    </NAlert>
    <NCode :code="snapshot" language="json" word-wrap />

    <ProTable
      ref="tableRef"
      :columns="columns"
      :request="request"
      :option="false"
      :pagination="{ pageSize: 2 }"
    />
  </NSpace>
</template>
