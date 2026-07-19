# ProForm 高级表单

基于 `NForm` + `NGrid` 封装，通过 `columns` 驱动表单渲染，支持多种字段类型、表单验证、嵌套路径。

## 基础用法

<DemoBlock title="基础字段" description="从 input、input-number、switch、checkbox-group 开始配置声明式表单。">
  <template #default><ProFormBasic /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProFormColumn } from 'naive-ui-pro-components'
import { ProForm } from 'naive-ui-pro-components'
import { ref } from 'vue'

const model = ref({ name: '', city: undefined, score: 0, status: true })

const columns: ProFormColumn[] = [
  { key: 'name', label: '姓名', component: 'input', span: 12 },
  { key: 'city', label: '城市', component: 'select', componentProps: { options: [{ label: '北京', value: 'beijing' }] }, span: 12 },
  { key: 'score', label: '评分', component: 'rate', span: 12 },
  { key: 'status', label: '状态', component: 'switch', componentProps: { checkedText: '启用', uncheckedText: '禁用' }, span: 12 },
]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns" />
</template>
```

  </template>
</DemoBlock>

## 全部字段组件

<DemoBlock title="字段组件实验台" description="按类别展示 ProForm 支持的全部 23 种字段组件，并实时显示模型变化。">
  <template #default><ProFormAllFields /></template>
  <template #code>

```ts
const columns: ProFormColumn[] = [
  { key: 'name', label: 'Input', component: 'input' },
  { key: 'city', label: 'Select', component: 'select', componentProps: { options } },
  { key: 'date', label: 'DatePicker', component: 'date-picker' },
  { key: 'tree', label: 'TreeSelect', component: 'tree-select', componentProps: { options: treeOptions } },
  { key: 'files', label: 'Upload', component: 'upload', componentProps: { defaultUpload: false } },
]
```

完整示例按“基础输入、选择与评分、高级输入”分组，覆盖下方 API 列出的全部字段类型。

  </template>
</DemoBlock>

## 表单验证

<DemoBlock title="表单验证" description="通过 rule 配置验证规则，支持正则、自定义校验器。">
  <template #default><ProFormValidation /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProFormColumn } from 'naive-ui-pro-components'
import { ProForm } from 'naive-ui-pro-components'
import { ref } from 'vue'

const model = ref({ username: '', password: '', phone: '' })

const columns: ProFormColumn[] = [
  { key: 'username', label: '用户名', component: 'input', rule: { required: true, message: '必填', trigger: 'blur' }, span: 12 },
  { key: 'password', label: '密码', component: 'input', rule: { min: 6, message: '至少6位', trigger: 'blur' }, span: 12 },
  { key: 'phone', label: '手机号', component: 'input', rule: { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }, span: 12 },
]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns" />
</template>
```

  </template>
</DemoBlock>

## 自定义渲染

<DemoBlock title="自定义渲染" description="使用 render 函数完全自定义字段渲染。">
  <template #default><ProFormCustom /></template>
  <template #code>

```vue
<script setup lang="ts">
import type { ProFormColumn } from 'naive-ui-pro-components'
import { NButton, NSpace } from 'naive-ui'
import { ProForm } from 'naive-ui-pro-components'
import { h } from 'vue'

const columns: ProFormColumn[] = [
  { key: 'name', label: '姓名', component: 'input', span: 12 },
  {
    key: 'actions',
    label: '操作',
    component: 'none',
    render(ctx) {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, { type: 'primary', onClick: () => console.log(ctx.model) }, { default: () => '提交' }),
          h(NButton, { onClick: () => console.log('取消') }, { default: () => '取消' }),
        ],
      })
    },
  },
]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns" />
</template>
```

  </template>
</DemoBlock>

## 嵌套路径

<DemoBlock title="嵌套路径" description="通过 path 读写深层表单字段。">
  <template #default><ProFormNested /></template>
  <template #code>

```ts
const columns: ProFormColumn[] = [
  { key: 'name', path: 'profile.name', label: '姓名', component: 'input' },
  { key: 'email', path: 'profile.email', label: '邮箱', component: 'input' },
]
```

  </template>
</DemoBlock>

## 插槽覆盖

<DemoBlock title="插槽覆盖" description="按字段 key 覆盖默认控件。">
  <template #default><ProFormSlot /></template>
  <template #code>

```vue
<ProForm v-model:value="model" :columns="columns">
  <template #name="{ value, updateValue }">
    <n-input :value="value" @update:value="updateValue" placeholder="自定义" />
  </template>
</ProForm>
```

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | `ProFormColumn[]` | `[]` | 表单字段配置 |
| value | `object` | `{}` | 表单数据(v-model) |
| itemResponsive | `boolean` | `true` | 响应式布局 |
| xGap | `number` | `12` | 水平间距 |

继承 Naive UI `NForm` 和 `NGrid` 全部 Props。

### ProFormColumn

| 属性 | 类型 | 说明 |
|------|------|------|
| key | `string` | 字段唯一标识 |
| path | `string` | 模型路径，支持嵌套 |
| label | `string` | 标签文本 |
| component | `ProFormFieldComponent` | 组件类型或自定义组件 |
| componentProps | `object` | 组件属性 |
| rule | `FormItemRule \| FormItemRule[]` | 验证规则 |
| enabled | `boolean` | 是否启用 |
| sort | `number` | 排序权重 |
| span | `number` | 栅格占位(默认24) |
| render | `(ctx) => VNodeChild` | 自定义渲染 |

支持的组件类型：`input`、`input-number`、`select`、`date-picker`、`time-picker`、`switch`、`checkbox`、`checkbox-group`、`radio`、`radio-button`、`radio-group`、`cascader`、`tree-select`、`upload`、`rate`、`slider`、`color-picker`、`dynamic-input`、`dynamic-tags`、`mention`、`transfer`、`auto-complete`、`input-otp`
