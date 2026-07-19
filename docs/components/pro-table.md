# ProTable 高级表格

基于 `NDataTable` 封装，支持搜索栏、分页、批量操作、列配置、远程数据、自定义渲染。

## 基础用法

<DemoBlock title="基础表格" description="静态数据 + 分页 + 自定义状态列渲染。">
  <template #default><ProTableBasic /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableBasic.vue

  </template>
</DemoBlock>

## 搜索 + 批量操作

<DemoBlock title="搜索栏 + 批量操作" description="columns 配置 search 启用搜索，batchActions 配置批量操作按钮。">
  <template #default><ProTableSearch /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableSearch.vue

  </template>
</DemoBlock>

## 全部搜索组件

<DemoBlock title="搜索组件实验台" description="一次展示 input、input-number、select、date-picker、cascader、tree-select、switch、radio-group、checkbox-group 与 render。">
  <template #default><ProTableSearchFields /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableSearchFields.vue

  </template>
</DemoBlock>

## 远程数据

<DemoBlock title="远程请求 + 排序" description="通过 request 函数获取远程数据，支持服务端排序和分页。">
  <template #default><ProTableRemote /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableRemote.vue

  </template>
</DemoBlock>

## 列配置

<DemoBlock title="列配置与固定列" description="更多列、横向滚动、左右固定和列设置。">
  <template #default><ProTableColumns /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableColumns.vue

  </template>
</DemoBlock>

## 选择列与序号列

<DemoBlock title="特殊列配置" description="批量操作的选择列和序号列都可在列设置中显示、隐藏、排序或固定；序号可切换是否跨页连续。">
  <template #default><ProTableSpecialColumns /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableSpecialColumns.vue

  </template>
</DemoBlock>

## 工具栏配置

<DemoBlock title="工具栏配置" description="刷新、全屏、密度和列设置操作。">
  <template #default><ProTableToolbar /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableToolbar.vue

  </template>
</DemoBlock>

## 自定义插槽

<DemoBlock title="自定义插槽" description="自定义标题和工具栏右侧内容。">
  <template #default><ProTableSlots /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableSlots.vue

  </template>
</DemoBlock>

<DemoBlock title="在表头操作选中行" description="title、header 和 header-extra 插槽可通过 keys、rows 获取当前选中项，直接执行批量操作。">
  <template #default><ProTableHeaderSelection /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableHeaderSelection.vue

  </template>
</DemoBlock>

## 实例方法

<DemoBlock title="调用 ProTable / NDataTable 方法" description="覆盖 ProTableInst 的全部增强方法、DataTableInst 方法和只读状态。">
  <template #default><ProTableMethods /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProTableMethods.vue

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
| showIndex | `boolean` | `true` | 是否显示序号列，序号列可在列设置中配置 |
| continuousIndex | `boolean` | `true` | 序号是否跨页连续 |
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
| title | `{ keys, rows }` | 工具栏标题，可获取选中行 |
| header | `{ keys, rows }` | 自定义整个工具栏，可获取选中行 |
| header-extra | `{ keys, rows }` | 工具栏右侧额外内容，可获取选中行 |
| form | `ProTableFormSlotProps` | 自定义搜索字段 |
| batch-actions | `{ keys, rows }` | 自定义批量操作栏 |

### Methods

除 `reload`、`request`、`reset`、`search`、`setParams`、`updateParams` 外，完整继承 Naive UI `DataTableInst`：

`filter`、`filters`、`clearFilters`、`clearSorter`、`page`、`sort`、`scrollTo`、`downloadCsv`、`clearFilter`。
