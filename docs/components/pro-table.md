# ProTable 高级表格

基于 `NDataTable` 封装，支持搜索栏、分页、批量操作、列配置、远程数据、自定义渲染。

## 基础用法

<DemoBlock title="基础表格" description="静态数据 + 分页 + 自定义状态列渲染。">
  <template #default><ProTableBasic /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProTableColumn } from 'naive-ui-pro-components'
import { NTag } from 'naive-ui'
import { ProTable } from 'naive-ui-pro-components'
import { h, ref } from 'vue'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age' },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(NTag, { type: row.status === 1 ? 'success' : 'warning', size: 'small' }, { default: () => row.status === 1 ? '启用' : '禁用' })
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
])
</script>

<template>
  <ProTable :columns="columns" :data="data" :pagination="{ pageSize: 10 }" />
</template>
```

  </template>
</DemoBlock>

## 搜索 + 批量操作

<DemoBlock title="搜索栏 + 批量操作" description="columns 配置 search 启用搜索，batchActions 配置批量操作按钮。">
  <template #default><ProTableSearch /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProTableBatchAction, ProTableColumn } from 'naive-ui-pro-components'
import { ProTable } from 'naive-ui-pro-components'
import { ref } from 'vue'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name', search: { component: 'input', label: '姓名' } },
  { title: '年龄', key: 'age', search: { component: 'input-number' } },
  { title: '状态', key: 'status', search: { component: 'select', label: '状态', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }, },
  { title: '部门', key: 'department', search: { component: 'select', options: [{ label: '研发部', value: '研发部' }] } },
  { title: '邮箱', key: 'email', search: true },
  { title: '手机号', key: 'phone' },
  { title: '地址', key: 'address', search: true },
  { title: '创建时间', key: 'createdAt' },
]

const batchActions: ProTableBatchAction[] = [
  { key: 'delete', label: '批量删除', type: 'error', onClick(keys) { alert(`删除 ${keys.length} 项`) } },
]

async function request(params) {
  const res = await fetch(`/api/users?${new URLSearchParams(params)}`)
  return res.json()
}
</script>

<template>
  <ProTable :columns="columns" :request="request" :batch-actions="batchActions" />
</template>
```

  </template>
</DemoBlock>

## 全部搜索组件

<DemoBlock title="搜索组件实验台" description="一次展示 input、input-number、select、date-picker、cascader、tree-select、switch、radio-group、checkbox-group 与 render。">
  <template #default><ProTableSearchFields /></template>
  <template #code>

```ts
const columns: ProTableColumn[] = [
  { title: '关键词', key: 'keyword', search: { component: 'input' } },
  { title: '日期', key: 'date', search: { component: 'date-picker', type: 'date' } },
  { title: '地区', key: 'region', search: { component: 'cascader', options } },
  { title: '组织', key: 'org', search: { component: 'tree-select', options: treeOptions } },
  { title: '公开', key: 'visible', search: { component: 'switch' } },
  { title: '自定义', key: 'custom', search: { component: 'render', render } },
]
```

  </template>
</DemoBlock>

## 远程数据

<DemoBlock title="远程请求 + 排序" description="通过 request 函数获取远程数据，支持服务端排序和分页。">
  <template #default><ProTableRemote /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProTableColumn, ProTableRequestResult } from 'naive-ui-pro-components'
import { ProTable } from 'naive-ui-pro-components'

const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name' },
  { title: '年龄', key: 'age', sorter: true },
  { title: '状态', key: 'status' },
  { title: '部门', key: 'department' },
  { title: '邮箱', key: 'email' },
  { title: '地址', key: 'address' },
  { title: '创建时间', key: 'createdAt' },
  { title: '操作', key: 'actions' },
]

async function request(params): Promise<ProTableRequestResult> {
  const res = await fetch(`/api/users?${new URLSearchParams(params)}`)
  return res.json()
}
</script>

<template>
  <ProTable :columns="columns" :request="request" />
</template>
```

  </template>
</DemoBlock>

## 列配置

<DemoBlock title="列配置与固定列" description="更多列、横向滚动、左右固定和列设置。">
  <template #default><ProTableColumns /></template>
  <template #code>

```ts
const columns: ProTableColumn[] = [
  { title: '姓名', key: 'name', fixed: 'left', search: true },
  { title: '年龄', key: 'age', sorter: true },
  { title: '操作', key: 'action', fixed: 'right' },
]
```

  </template>
</DemoBlock>

## 工具栏配置

<DemoBlock title="工具栏配置" description="刷新、全屏、密度和列设置操作。">
  <template #default><ProTableToolbar /></template>
  <template #code>

```vue
<ProTable
  :columns="columns"
  :data="data"
  :option="{
    tableHeader: true,
    full: true,
    reload: true,
    setting: true,
    size: true,
  }"
/>
```

  </template>
</DemoBlock>

## 自定义插槽

<DemoBlock title="自定义插槽" description="自定义标题和工具栏右侧内容。">
  <template #default><ProTableSlots /></template>
  <template #code>

```vue
<ProTable :columns="columns" :data="data">
  <template #title><h3>用户列表</h3></template>
  <template #header-extra><n-button type="primary">新增</n-button></template>
  <template #batch-actions="{ keys }">
    <n-button type="error" size="small">删除 {{ keys.length }} 项</n-button>
  </template>
</ProTable>
```

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `ProTableColumn[]` | `[]` | 列配置 |
| data | `ProTableRecord[]` | `[]` | 静态数据 |
| request | `(params) => Promise<{data, total}>` | - | 远程请求函数 |
| defaultParams | `Record<string, unknown>` | `{}` | 默认查询参数 |
| manual | `boolean` | `false` | 手动触发首次请求 |
| option | `false \| ProTableOption` | - | 搜索区与 TableHeader 配置 |
| pagination | `false \| PaginationProps` | `{}` | 分页配置 |
| batchActions | `ProTableBatchAction[]` | `[]` | 批量操作配置 |
| checkedRowKeys | `(string\|number)[]` | - | 选中行 keys(v-model) |
| searchDebounce | `number` | `300` | 搜索防抖(ms) |

继承 Naive UI `NDataTable` 全部 Props。

### ProTableOption

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tableHeader | `boolean` | `true` | 是否显示 TableHeader；同时控制自定义 `header` 插槽 |
| search | `boolean` | `true` | 是否显示搜索区域 |
| reload | `boolean` | `true` | 是否显示刷新按钮 |
| full | `boolean` | `true` | 是否显示全屏按钮 |
| size | `boolean` | `true` | 是否显示密度按钮 |
| setting | `boolean` | `true` | 是否显示列设置按钮 |
| manualSearch | `boolean` | `false` | 搜索项变化时是否仅手动触发查询 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| reset | - | 重置搜索时触发 |
| search | `params` | 搜索时触发 |
| update:checkedRowKeys | `(string\|number)[]` | 选中行变化 |

### Slots

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | `props` | 自定义表格内容 |
| title | - | 工具栏标题 |
| header | - | 自定义整个工具栏 |
| header-extra | - | 工具栏右侧额外内容 |
| form | `ProTableFormSlotProps` | 自定义搜索字段 |
| batch-actions | `{ keys, rows }` | 自定义批量操作栏 |
