# Naive UI Pro Components

基于 [Naive UI](https://www.naiveui.com/) 的企业级 Vue 3 组件库，开箱即用。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docs](https://img.shields.io/badge/Docs-在线文档-blue)](https://coderych.github.io/naive-ui-pro-components/)

## 📖 文档

在线文档：https://coderych.github.io/naive-ui-pro-components/

## ✨ 特性

- 🚀 **开箱即用** - 基于 Naive UI 的高级业务组件，开箱即用
- 🔧 **丰富组件** - 包含 ProTable、ProForm、ProPopup 等高级组件
- 🎨 **完整兼容** - 完全兼容 Naive UI 的 Props、Events、Slots
- 📝 **TypeScript** - 完整的 TypeScript 类型定义
- 🌍 **国际化** - 内置国际化支持，可配置翻译函数
- 📦 **按需引入** - 支持 Tree-shaking，ESM 和 CJS 格式输出

## 📦 安装

```bash
npm install @coderych/naive-ui-pro-components
# 或
pnpm add @coderych/naive-ui-pro-components
```

## 🚀 快速开始

### 全局注册

```ts
import NaiveUIProComponents from '@coderych/naive-ui-pro-components'
import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(naive)
app.use(NaiveUIProComponents)
app.mount('#app')
```

### 按需引入

```vue
<script setup lang="ts">
import { ProTable } from '@coderych/naive-ui-pro-components'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' }
]

const data = [
  { name: '张三', age: 28 },
  { name: '李四', age: 32 }
]
</script>

<template>
  <ProTable :columns="columns" :data="data" />
</template>
```

## 🧩 组件列表

| 组件 | 描述 |
| --- | --- |
| [ProTable](#protable) | 高级表格，支持搜索、分页、批量操作 |
| [ProForm](#proform) | 高级表单，支持多种字段类型和验证 |
| [ProPopup](#propopup) | 弹窗组件，支持抽屉和对话框两种模式 |
| [ProCheckboxGroup](#procheckboxgroup) | 复选框组组件 |
| [ProRadioGroup](#proradiogroup) | 单选框组组件 |
| [ProSwitch](#proswitch) | 开关组件 |

---

## ProTable

高级数据表格组件，基于 Naive UI 的 `NDataTable` 封装，提供强大的数据管理能力。

### 基础用法

```vue
<script setup lang="ts">
import { ProTable } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'address', title: '地址' }
]

const data = ref([
  { id: 1, name: '张三', age: 28, address: '北京市' },
  { id: 2, name: '李四', age: 32, address: '上海市' },
  { id: 3, name: '王五', age: 25, address: '广州市' }
])
</script>

<template>
  <ProTable :columns="columns" :data="data" />
</template>
```

### 远程数据请求

```vue
<script setup lang="ts">
import { ProTable } from '@coderych/naive-ui-pro-components'

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名', search: true },
  { key: 'status', title: '状态', search: { type: 'select', options: [] } }
]

// 远程请求函数
async function request(params) {
  const res = await fetch('/api/users', { params })
  return {
    data: res.data.list,
    total: res.data.total
  }
}
</script>

<template>
  <ProTable
    :columns="columns"
    :request="request"
  />
</template>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `ProTableColumn[]` | `[]` |
| data | 表格数据（静态数据模式） | `any[]` | `[]` |
| request | 远程请求函数 | `(params) => Promise<{data, total}>` | - |
| rowKey | 行数据唯一标识字段 | `string` | `'id'` |
| loading | 加载状态 | `boolean` | `false` |
| search | 是否显示搜索表单 | `boolean` | `true` |
| toolbar | 是否显示工具栏 | `boolean` | `true` |
| pagination | 分页配置 | `boolean \| PaginationProps` | `true` |
| manualSearch | 是否手动触发搜索 | `boolean` | `false` |
| checkedRowKeys | 已选中的行键 | `Array<string \| number>` | - |
| batchActions | 批量操作按钮配置 | `BatchAction[]` | `[]` |
| showIndex | 是否显示序号列 | `boolean` | `true` |
| continuousIndex | 序号是否跨页连续 | `boolean` | `true` |
| pageFields | 分页字段映射 | `{current: string, size: string}` | `{current: 'current', size: 'size'}` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| form | 自定义搜索表单 |
| header | 表格标题区域，参数为 `{ keys, rows }` |
| header-extra | 标题右侧额外内容，参数为 `{ keys, rows }` |
| title | 自定义标题，参数为 `{ keys, rows }` |
| batch-actions | 自定义批量操作区域 |
| default | 自定义表格内容（替代默认 NDataTable） |

### Methods（通过 ref 调用）

| 方法 | 说明 |
| --- | --- |
| reload() | 重新加载数据 |
| search() | 触发搜索 |
| reset() | 重置搜索条件 |
| request() | 手动触发请求 |
| setParams(params) | 设置请求参数 |
| updateParams(params) | 更新请求参数 |

同时继承 `DataTableInst` 的 `filter`、`filters`、`clearFilters`、`clearSorter`、`page`、`sort`、`scrollTo`、`downloadCsv` 和 `clearFilter` 方法。

---

## ProForm

高级表单组件，通过配置式的方式生成表单，支持多种字段类型。

### 基础用法

```vue
<script setup lang="ts">
import { ProForm } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const model = ref({
  name: '',
  age: null,
  email: ''
})

const columns = [
  { key: 'name', label: '姓名', component: 'input', required: true },
  { key: 'age', label: '年龄', component: 'input-number' },
  { key: 'email', label: '邮箱', component: 'input' }
]
</script>

<template>
  <ProForm
    v-model="model"
    :columns="columns"
  />
</template>
```

### 支持的字段类型

| 类型 | 组件 | 说明 |
| --- | --- | --- |
| `input` | NInput | 输入框 |
| `input-number` | NInputNumber | 数字输入框 |
| `select` | NSelect | 下拉选择 |
| `cascader` | NCascader | 级联选择 |
| `tree-select` | NTreeSelect | 树形选择 |
| `checkbox` | NCheckbox | 复选框 |
| `checkbox-group` | NCheckboxGroup | 复选框组 |
| `radio` | NRadio | 单选框 |
| `radio-group` | NRadioGroup | 单选框组 |
| `switch` | NSwitch | 开关 |
| `rate` | NRate | 评分 |
| `slider` | NSlider | 滑块 |
| `date-picker` | NDatePicker | 日期选择器 |
| `time-picker` | NTimePicker | 时间选择器 |
| `color-picker` | NColorPicker | 颜色选择器 |
| `transfer` | NTransfer | 穿梭框 |
| `dynamic-input` | NDynamicInput | 动态输入框 |
| `dynamic-tags` | NDynamicTags | 动态标签 |
| `upload` | NUpload | 上传 |
| `render` | 自定义渲染 | 通过 render 函数自定义 |

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表单列配置 | `ProFormColumn[]` | `[]` |
| model / v-model | 表单数据 | `Record<string, any>` | `{}` |
| labelPlacement | 标签位置 | `'left' \| 'top'` | `'left'` |
| labelWidth | 标签宽度 | `string \| number` | - |
| xGap | 水平间距 | `number` | `12` |
| yGap | 垂直间距 | `number` | `0` |
| itemResponsive | 是否响应式 | `boolean` | `false` |

### Methods（通过 ref 调用）

继承 `FormInst` 的 `validate()`、`restoreValidation()` 和 `invalidateLabelWidth()` 方法。

---

## ProPopup

弹窗组件，统一抽屉（Drawer）和对话框（Modal）的使用方式。

### 基础用法

```vue
<script setup lang="ts">
import { ProPopup } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <n-button @click="show = true">
    打开弹窗
  </n-button>

  <ProPopup
    v-model:show="show"
    title="标题"
    @ok="show = false"
  >
    <p>弹窗内容</p>
  </ProPopup>
</template>
```

### 使用对话框模式

```vue
<ProPopup
  v-model:show="show"
  preset="modal"
  title="对话框标题"
  @ok="show = false"
>
  <p>对话框内容</p>
</ProPopup>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show / v-model:show | 是否显示 | `boolean` | `false` |
| preset | 预设模式 | `'drawer' \| 'modal'` | `'drawer'` |
| title | 标题 | `string` | - |
| width | 宽度 | `string \| number` | `800` |
| header | 是否显示头部 | `boolean` | `true` |
| footer | 是否显示底部 | `boolean` | `true` |
| okText | 确定按钮文本 | `string` | `'确定'` |
| cancelText | 取消按钮文本 | `string` | `'取消'` |
| loading | 确定按钮加载状态 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| ok | 点击确定按钮 | - |
| cancel | 点击取消按钮 | - |
| close | 关闭弹窗 | - |
| update:show | 更新显示状态 | `(value: boolean)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| header | 自定义头部 |
| header-extra | 头部右侧额外内容 |
| footer | 自定义底部 |
| default | 弹窗内容 |

---

## ProCheckboxGroup

复选框组组件，通过配置选项快速生成复选框组。

### 基础用法

```vue
<script setup lang="ts">
import { ProCheckboxGroup } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const value = ref(['option1'])
const options = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' }
]
</script>

<template>
  <ProCheckboxGroup
    v-model:value="value"
    :options="options"
  />
</template>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 复选框选项 | `CheckboxProps[]` | `[]` |
| value / v-model:value | 选中值 | `Array<string \| number>` | `[]` |

---

## ProRadioGroup

单选框组组件，支持默认和按钮两种样式。

### 基础用法

```vue
<script setup lang="ts">
import { ProRadioGroup } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const value = ref('option1')
const options = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' }
]
</script>

<template>
  <ProRadioGroup
    v-model:value="value"
    :options="options"
  />
</template>
```

### 按钮样式

```vue
<ProRadioGroup
  v-model:value="value"
  :options="options"
  option-type="button"
  button-style="solid"
/>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 单选框选项 | `RadioProps[]` | `[]` |
| value / v-model:value | 选中值 | `string \| number` | - |
| optionType | 选项类型 | `'default' \| 'button'` | `'default'` |
| buttonStyle | 按钮样式 | `'outline' \| 'solid'` | `'outline'` |

---

## ProSwitch

开关组件，支持文本标签和图标。

### 基础用法

```vue
<script setup lang="ts">
import { ProSwitch } from '@coderych/naive-ui-pro-components'
import { ref } from 'vue'

const value = ref(false)
</script>

<template>
  <ProSwitch
    v-model:value="value"
    checked-text="开"
    unchecked-text="关"
  />
</template>
```

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value / v-model:value | 值 | `boolean` | `false` |
| checkedText | 选中文本 | `string` | - |
| uncheckedText | 未选中文本 | `string` | - |
| checkedIcon | 选中图标 | `Component` | - |
| uncheckedIcon | 未选中图标 | `Component` | - |

---

## 🌍 国际化

通过 `createProConfig` 创建配置并提供翻译函数：

```vue
<script setup lang="ts">
import { createProConfig } from '@coderych/naive-ui-pro-components'

const { provide } = createProConfig({
  locale: (key, params) => {
    const messages = {
      'pro.table.reload': '刷新',
      'pro.table.fullscreen': '全屏',
      'pro.table.density': '密度',
      'pro.table.columnSettings': '列设置',
      'pro.popup.ok': '确定',
      'pro.popup.cancel': '取消'
      // ... 更多翻译
    }
    return messages[key] || key
  }
})

provide()
</script>
```

## 📝 TypeScript

本库提供完整的 TypeScript 类型定义，开箱即用：

```ts
import type {
  ProFormColumn,
  ProFormProps,
  ProPopupProps,
  ProTableColumn,
  ProTableInstance,
  ProTableProps
} from '@coderych/naive-ui-pro-components'
```

## 📄 License

[MIT](./LICENSE)
