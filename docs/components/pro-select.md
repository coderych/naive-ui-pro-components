# ProSelect 高级选择器

`ProSelect` 基于 `NSelect`，提供下拉远程分页和 `ProPopup + ProTable` 两种选择方式。两种模式共用同一个 `modelValue`、默认值补全、外部值同步、options 去重和 `request` 协议。

## 适用场景

- `dropdown`：字段少、候选项可用 label 辨认，适合直接搜索和滚动选择。
- `popup`：需要展示多列、组合查询、分页或跨页多选。`popupProps.preset` 可切换 `modal`、`drawer`，不会产生第二套选择逻辑。

## 基础用法

```vue
<script setup lang="ts">
import { ProSelect } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const value = ref<number | null>(null)
async function request(params, selectedKeys, selectedRows) {
  const response = await queryUsers({ params, selectedKeys, selectedRows })
  return { data: response.list, total: response.total }
}
</script>

<template>
  <ProSelect
    v-model="value"
    label-field="name"
    :request="request"
    value-field="id"
  />
</template>
```

`valueField` 同时是 Select option key、`modelValue` 的来源和 ProTable row key，不需要再配置一套重复的 key 字段。

## 下拉单选

打开下拉时请求第一页；输入搜索词后重置分页；滚动到底部自动追加下一页。示例的默认值 `37` 不在第一页，组件会先单独补全它，打开下拉时仍照常请求列表。

<DemoBlock title="下拉单选、远程搜索与滚动分页" description="默认值补全与普通列表请求互不替代。">
  <template #default><ProSelectDropdownSingle /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectDropdownSingle.vue

  </template>
</DemoBlock>

## 下拉多选

多选时 `modelValue`、`selectedKeys` 是 key 数组，`selectedRows` 是 row 数组。搜索条件变化只清空普通列表，当前选中项仍保留在展示 options 中。

<DemoBlock title="下拉多选" description="多个缺失默认值会合并为一次补全请求。">
  <template #default><ProSelectDropdownMultiple /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectDropdownMultiple.vue

  </template>
</DemoBlock>

## ProPopup 单选（Modal）

Popup 模式禁用普通下拉选择，右侧按钮是唯一选择入口。表格内的选择是临时状态，只有点击“确定”才更新 `modelValue`。

<DemoBlock title="Modal + ProTable 单选" description="支持表格查询、分页以及默认值回显。">
  <template #default><ProSelectPopupSingle /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectPopupSingle.vue

  </template>
</DemoBlock>

## ProPopup 多选（Drawer）

跨页切换时，临时 keys 和已取得的完整 rows 都会保留。取消或直接关闭抽屉只丢弃临时状态，已确认值不变。

<DemoBlock title="Drawer + ProTable 跨页多选" description="示例也演示了通过 ref 调用 table.reload()。">
  <template #default><ProSelectPopupMultiple /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectPopupMultiple.vue

  </template>
</DemoBlock>

## 默认值和外部动态修改

外部值不在当前 options 时，组件把所有缺失 key 合并为一次补全请求。外部清空不会触发反向的 `update:modelValue`。

<DemoBlock title="默认值与外部值变化" description="连续设置不同页的值，旧补全请求不会覆盖新值。">
  <template #default><ProSelectExternalValue /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectExternalValue.vue

  </template>
</DemoBlock>

## 本地选项

当数据量较小或已有完整列表时，直接传 `options` 即可，无需 `request`。`filterable` 开启前端过滤，`labelField` 和 `valueField` 的用法与远程模式一致。

<DemoBlock title="本地选项单选与多选" description="无需 request，直接传入 options 数组。">
  <template #default><ProSelectLocalOptions /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectLocalOptions.vue

  </template>
</DemoBlock>

## 自定义请求参数

`requestParams` 会合并到每次请求的 params 中，适合联动外部筛选条件。`searchField` 可替换默认的 `keyword` 字段名，`pageFields` 可替换 `current` / `size`。`searchDebounce` 控制搜索防抖时间。

<DemoBlock title="requestParams、searchField 与 pageFields" description="动态切换分类和状态，搜索字段改为 title，分页字段改为 page / pageSize。">
  <template #default><ProSelectRequestParams /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectRequestParams.vue

  </template>
</DemoBlock>

## 自定义 Slots

ProSelect 支持全部 `NSelect` 插槽（`default`、`header`、`action`、`empty`、`arrow`），以及 `button`、`popup-*`、`table-*` 前缀插槽。`popup-footer` 提供 `confirm` 和 `cancel` 回调。

<DemoBlock title="button、popup-header、popup-footer 与 empty 插槽" description="自定义入口按钮、弹窗标题、底部操作栏和空状态。">
  <template #default><ProSelectSlots /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectSlots.vue

  </template>
</DemoBlock>

## 实例方法与 Expose

通过 `ref` 获取 `ProSelectInst`，可访问 `focus`、`blur` 等 `SelectInst` 方法，以及 `selectedKeys`、`selectedRows`、`table`、`popup` 等增强字段。

<DemoBlock title="实例方法调用与状态读取" description="演示 focus/blur、读取选中状态、调用 table.reload/search/reset。">
  <template #default><ProSelectMethods /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectMethods.vue

  </template>
</DemoBlock>

## 禁用与按钮配置

`disabled` 同时作用于下拉和 Popup 模式。`buttonText` 自定义入口按钮文案，`buttonProps` 传递按钮属性（`type`、`size`、`round` 等）。组件继承 `NSelect` 的 `size` 和 `status`。

<DemoBlock title="disabled、buttonText、buttonProps 与 size/status" description="禁用状态、自定义按钮以及继承 NSelect 的尺寸和校验状态。">
  <template #default><ProSelectDisabled /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectDisabled.vue

  </template>
</DemoBlock>

## 请求错误处理

`request-error` 事件在 `request` 抛出异常时触发，参数为 `(error, context)`。`context` 区分补全（`hydrate`）、下拉列表（`dropdown`）和 Popup 表格（`popup`）三种场景。

<DemoBlock title="request-error 事件" description="模拟请求失败并展示错误信息和上下文。">
  <template #default><ProSelectRequestError /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProSelectRequestError.vue

  </template>
</DemoBlock>

## request 协议

```ts
type ProSelectRequest<T> = (
  params: Record<string, unknown>,
  selectedKeys: string | number | (string | number)[] | null,
  selectedRows: T | T[] | null,
) => Promise<{
  total: number
  data: T[]
}>
```

调用类型如下：

| 场景 | params | selectedKeys / selectedRows |
|------|--------|-----------------------------|
| 默认值、外部值补全 | `requestParams`，不带分页字段 | 当前全部 keys，以及 options 中已经存在的 rows |
| 下拉列表 | `requestParams + keyword + current + size` | 当前已确认选择 |
| Popup 表格 | `requestParams + ProTable 查询与分页参数` | 当前临时选择 |

单选始终传 `key | null` 和 `row | null`；多选始终传 `key[]` 和 `row[]`。补全请求只有在至少一个 key 缺少完整 row 时才发出，接口可根据 `selectedKeys` 与 `selectedRows` 的差集只查询缺失数据。

如果后端分页字段不是 `current`、`size`：

```vue
<ProSelect
  :page-fields="{ page: 'pageNumber', pageSize: 'pageSize' }"
  :request="request"
/>
```

`pageFields` 同时作用于 dropdown 和 ProTable，保证两种模式使用相同协议。

## 数据流

### Dropdown

```text
打开 / 搜索
→ 重置普通列表和页码
→ request 第一页
→ 触底后按页追加
→ 用户选择
→ 更新已确认 keys、rows 和 modelValue
```

首次加载、下一页、补全分别维护 loading 和请求标识。下一页成功后才推进页码；失败时再次触底可重试。组件默认把 `resetMenuOnOptionsChange` 设为 `false`，并在追加后兜底恢复滚动位置。

### ProPopup

```text
已确认选择
→ 打开时复制为临时选择
→ ProTable 查询、分页、跨页选择
→ 确定：临时选择提交为已确认选择
→ 取消 / 关闭：丢弃临时选择
```

`modal` 和 `drawer` 只由 `popupProps.preset` 决定展示形式，使用同一个 `popupVisible`、临时选择和请求函数。

## options 管理

组件只保留两类可变数据：

- `listOptions`：下拉普通列表，搜索时允许重置；
- `selectedOptions`：默认值、外部值和已确认选择对应的完整 rows。

最终 options 由 `props.options + listOptions + selectedOptions` 按 `valueField` 合并。相同 key 更新原位置的数据，不使用对象引用或数组下标判断，顺序保持稳定。

## Props

除下表外，继承 `NSelect` 的常用 Props。`value` 改为 Vue 标准的 `modelValue`，避免两套受控值语义。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `Key \| Key[] \| null` | - | `v-model` 值 |
| defaultValue | `Key \| Key[] \| null` | `null` | 非受控初始值 |
| mode | `'dropdown' \| 'popup'` | `'dropdown'` | 选择模式 |
| request | `ProSelectRequest` | - | 统一异步请求 |
| options | `Record<string, any>[]` | `[]` | 本地或预置完整 rows |
| requestParams | `Record<string, unknown>` | `{}` | 外部业务参数 |
| pageSize | `number` | `20` | 两种模式的每页数量 |
| pageFields | `{ page: string, pageSize: string }` | `{ page: 'current', pageSize: 'size' }` | 分页字段名 |
| searchField | `string` | `'keyword'` | dropdown 搜索字段名 |
| searchDebounce | `number` | `300` | dropdown 远程搜索防抖时间 |
| popupProps | `ProPopupProps` | `{}` | ProPopup 属性；用 `preset` 设置 modal/drawer |
| tableProps | `ProTableProps` | `{}` | ProTable 属性 |
| buttonText | `string` | 国际化 `selectText` | Popup 入口按钮文案 |
| buttonProps | `ButtonProps` | `{}` | 入口按钮属性 |
| labelField | `string` | `'label'` | row 的展示字段 |
| valueField | `string` | `'value'` | row 的唯一 key 字段 |
| multiple | `boolean` | `false` | 是否多选 |
| resetMenuOnOptionsChange | `boolean` | `false` | 是否在 options 变化时重置菜单 |

`show`、`request`、`manual`、`pageFields`、`pagination.pageSize`、`checkedRowKeys`、`rowKey` 和 selection 列由 ProSelect 控制时，传入 `popupProps` 或 `tableProps` 的同名值会被内部状态覆盖。其他属性正常透传。

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `keys` | 用户在 dropdown 选择，或 Popup 确认时触发 |
| change | `(keys, rows)` | 同时取得当前 keys 与完整 rows；外部赋值不会触发 |
| request-error | `(error, context)` | 请求失败；`context` 为 `hydrate`、`dropdown` 或 `popup` |

`NSelect` 的 `search`、`scroll`、`update:show` 等回调属性仍会被调用。

## Slots

Select 插槽保持原名；ProPopup 和 ProTable 插槽增加前缀，避免同名冲突。

| 插槽 | 说明 |
|------|------|
| default / header / action / empty / arrow | 原 `NSelect` 插槽 |
| button | 自定义 Popup 入口，参数 `{ open, disabled, text }` |
| popup-header / popup-header-extra / popup-action / popup-close / popup-icon | 对应 ProPopup 插槽 |
| popup-footer | 自定义底部，参数 `{ confirm, cancel }` |
| table-default / table-form / table-header / table-header-extra / table-title | 对应 ProTable 插槽 |
| table-batch-actions / table-empty 等 | 对应 ProTable / NDataTable 插槽 |

例如：

```vue
<ProSelect mode="popup" v-model="value" :request="request">
  <template #popup-header>选择供应商</template>
  <template #table-empty>没有符合条件的供应商</template>
  <template #popup-footer="{ confirm, cancel }">
    <n-space justify="end">
      <n-button @click="cancel">返回</n-button>
      <n-button type="primary" @click="confirm">使用所选供应商</n-button>
    </n-space>
  </template>
</ProSelect>
```

## Expose

```ts
import type { ProSelectInst } from '@coderych/naive-ui-pro-components'

const selectRef = ref<ProSelectInst<User> | null>(null)

selectRef.value?.focus()
selectRef.value?.select?.blur()
await selectRef.value?.table?.reload()
selectRef.value?.popup?.mergedClsPrefix
console.log(selectRef.value?.selectedKeys)
console.log(selectRef.value?.selectedRows)
```

| 字段 | 说明 |
|------|------|
| select | `NSelect` 实例 |
| table | `ProTable` 实例，包含增强 API 与 `NDataTable` API |
| popup | `ProPopup` 转发的 `NModal` 或 `NDrawer` 实例 |
| selectedKeys | 当前已确认 keys |
| selectedRows | 当前已确认完整 rows |

组件本身也直接转发 `SelectInst` 的 `focus`、`blur`、`focusInput` 和 `blurInput`。

## 国际化

入口按钮默认读取 `selectText`，Popup 确认和取消读取 `okText`、`cancelText`。`buttonText`、`popupProps.okText` 和 `popupProps.cancelText` 的优先级更高。切换 `createProConfig` 使用的响应式语言后，默认按钮文案会同步更新。

## 注意事项

- 每条数据必须在 `valueField` 上提供稳定的 `string | number`，无有效 key 的数据不会进入 options。
- 默认值补全接口可以只返回找到的 rows；未返回的 key 不会导致组件报错。
- Popup 模式的确认是同步状态提交；业务保存应在外部监听 `change` 后处理。
- 关闭 Popup 会使当前请求结果失效，旧搜索、旧补全和旧表格请求都不能覆盖最新状态。
- `requestParams` 或 `pageSize` 在组件打开期间变化时，会自动从第一页重新查询。
