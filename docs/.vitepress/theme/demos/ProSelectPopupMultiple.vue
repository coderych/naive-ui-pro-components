<script setup lang="ts">
import type { ProSelectInst, ProSelectRequest } from '@naive-ui-pro/pro-select'
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NButton, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'

interface Employee {
  id: number
  name: string
  department: string
}

const employees: Employee[] = Array.from({ length: 52 }, (_, index) => ({
  id: index + 1,
  name: `员工 ${index + 1}`,
  department: index % 2 === 0 ? '研发部' : '产品部',
}))
const selectRef = ref<ProSelectInst<Employee> | null>(null)
const value = ref<number[]>([3, 29])
const selectedRows = ref<Employee[]>([])
const columns: ProTableColumn<Employee>[] = [
  { key: 'name', title: '姓名', search: true },
  {
    key: 'department',
    title: '部门',
    search: {
      component: 'select',
      options: [
        { label: '研发部', value: '研发部' },
        { label: '产品部', value: '产品部' },
      ],
    },
  },
]

const request: ProSelectRequest<Employee> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 160))
  const keys = Array.isArray(selectedKeys) ? selectedKeys : []
  if (!('current' in params)) {
    return {
      data: employees.filter(employee => keys.includes(employee.id)),
      total: keys.length,
    }
  }
  const name = String(params.name ?? '')
  const department = String(params.department ?? '')
  const filtered = employees.filter(employee =>
    employee.name.includes(name)
    && (!department || employee.department === department),
  )
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}
</script>

<template>
  <NSpace vertical>
    <ProSelect
      ref="selectRef"
      v-model="value"
      label-field="name"
      mode="popup"
      multiple
      :page-size="8"
      :popup-props="{ preset: 'drawer', title: '跨页选择员工', width: 860 }"
      :request="request"
      :table-props="{ columns }"
      value-field="id"
      @change="(_keys, rows) => selectedRows = rows as Employee[]"
    />
    <NSpace>
      <NButton @click="selectRef?.table?.reload()">
        调用 table.reload()
      </NButton>
      <NText depth="3">
        已确认 {{ value.length }} 项：{{ selectedRows.map(row => row.name).join('、') || '打开抽屉查看默认值' }}
      </NText>
    </NSpace>
  </NSpace>
</template>
