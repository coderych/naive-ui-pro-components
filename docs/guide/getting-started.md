# 快速开始

## 安装

::: code-group

```bash [npm]
npm install naive-ui-pro-components naive-ui vue
```

```bash [pnpm]
pnpm add naive-ui-pro-components naive-ui vue
```

```bash [yarn]
yarn add naive-ui-pro-components naive-ui vue
```

:::

## 全量引入

```ts
import NaiveUIPro from 'naive-ui-pro-components'
import { createApp } from 'vue'

const app = createApp(App)
app.use(NaiveUIPro)
```

## 按需引入

```ts
import { ProForm, ProPopup, ProTable } from 'naive-ui-pro-components'
```

## 全局配置

提供全局配置（如国际化）：

```ts
import { createProConfig } from 'naive-ui-pro-components'
import { i18n } from './i18n'

const { provide } = createProConfig({
  locale: key => i18n.global.t(`pro.${key}`),
})

// 在 setup 中调用 provide()
provide()
```

## 基础示例

```vue
<script setup lang="ts">
import type { ProTableColumn } from 'naive-ui-pro-components'
import { ProTable } from 'naive-ui-pro-components'

const columns: ProTableColumn[] = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
]

const data = [
  { id: 1, name: 'John', age: 32, address: 'New York' },
  { id: 2, name: 'Jane', age: 28, address: 'London' },
]
</script>

<template>
  <ProTable :columns="columns" :data="data" />
</template>
```

## TypeScript 支持

所有组件都提供完整的类型定义：

```ts
import type {
  ProFormColumn,
  ProFormFieldContext,
  ProPopupProps,
  ProTableColumn,
  ProTableInst,
} from 'naive-ui-pro-components'
```
