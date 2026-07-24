<script setup lang="ts">
import type { ProSelectInst, ProSelectRequest } from '@naive-ui-pro/pro-select'
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NAlert, NButton, NCode, NSpace, NText } from 'naive-ui'
import { nextTick, ref } from 'vue'

interface Employee {
  id: number
  name: string
  department: string
  role: string
}

const employees: Employee[] = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `员工 ${index + 1}`,
  department: ['研发部', '产品部', '设计部'][index % 3],
  role: ['工程师', '产品经理', '设计师'][index % 3],
}))

const selectRef = ref<ProSelectInst<Employee> | null>(null)
const value = ref<number[]>([3, 15])
const result = ref('点击按钮调用 ProSelect 实例方法')
const snapshot = ref('{}')

const columns: ProTableColumn<Employee>[] = [
  { key: 'name', title: '姓名', search: true },
  { key: 'department', title: '部门' },
  { key: 'role', title: '角色' },
]

const request: ProSelectRequest<Employee> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 150))
  const keys = Array.isArray(selectedKeys) ? selectedKeys : []
  if (!('current' in params)) {
    return {
      data: employees.filter(e => keys.includes(e.id)),
      total: keys.length,
    }
  }
  const name = String(params.name ?? '')
  const filtered = employees.filter(e => e.name.includes(name))
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}

interface MethodAction {
  label: string
  description: string
  run: (inst: ProSelectInst<Employee>) => unknown
}

const actions: MethodAction[] = [
  {
    label: 'focus()',
    description: '聚焦到 Select 输入框',
    run: (inst) => { inst.focus() },
  },
  {
    label: 'blur()',
    description: '取消聚焦',
    run: (inst) => { inst.blur() },
  },
  {
    label: '读取 selectedKeys',
    description: '获取当前已确认的 keys',
    run: (inst) => {
      return JSON.stringify(inst.selectedKeys)
    },
  },
  {
    label: '读取 selectedRows',
    description: '获取当前已确认的完整 rows',
    run: (inst) => {
      const rows = inst.selectedRows
      return Array.isArray(rows) ? rows.map(r => r.name) : rows?.name ?? null
    },
  },
  {
    label: 'table.reload()',
    description: '刷新 Popup 表格数据',
    run: async (inst) => {
      await inst.table?.reload()
      return '表格已刷新'
    },
  },
  {
    label: 'table.search()',
    description: '按条件搜索 Popup 表格',
    run: async (inst) => {
      await inst.table?.search({ name: '员工 1' })
      return '已搜索 "员工 1"'
    },
  },
  {
    label: 'table.reset()',
    description: '重置 Popup 表格搜索条件',
    run: async (inst) => {
      await inst.table?.reset()
      return '表格条件已重置'
    },
  },
  {
    label: 'popup 状态',
    description: '读取 popup 实例',
    run: (inst) => {
      return inst.popup ? 'Popup 实例存在' : 'Popup 实例为空（未打开过）'
    },
  },
]

async function invoke(action: MethodAction): Promise<void> {
  const inst = selectRef.value
  if (!inst)
    return
  const returnValue = await action.run(inst)
  await nextTick()
  result.value = `${action.label}：${action.description}`
  snapshot.value = JSON.stringify({
    returnValue,
    selectedKeys: inst.selectedKeys,
    selectedRows: Array.isArray(inst.selectedRows)
      ? inst.selectedRows.map(r => r.name)
      : inst.selectedRows?.name ?? null,
    tableData: inst.table?.data?.length ?? 'N/A',
    popupExists: !!inst.popup,
  }, null, 2)
}
</script>

<template>
  <NSpace vertical :size="12">
    <NText strong>
      实例方法
    </NText>
    <NSpace>
      <NButton
        v-for="action in actions"
        :key="action.label"
        secondary
        type="primary"
        @click="invoke(action)"
      >
        {{ action.label }}
      </NButton>
    </NSpace>

    <NAlert type="info" :show-icon="false">
      {{ result }}
    </NAlert>
    <NCode :code="snapshot" language="json" word-wrap />

    <ProSelect
      ref="selectRef"
      v-model="value"
      label-field="name"
      mode="popup"
      multiple
      :page-size="8"
      :popup-props="{ preset: 'drawer', title: '选择员工', width: 800 }"
      :request="request"
      :table-props="{ columns }"
      value-field="id"
    />
  </NSpace>
</template>
