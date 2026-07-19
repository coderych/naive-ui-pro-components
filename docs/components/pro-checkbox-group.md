# ProCheckboxGroup 多选框组

基于 `NCheckboxGroup` 封装，通过 `options` 声明式渲染。

## 基础用法

<DemoBlock title="多选框组" description="基础用法、多选、含禁用项。">
  <template #default><ProCheckboxGroupBasic /></template>
  <template #code>

```vue
<script setup lang="ts">
import { ProCheckboxGroup } from 'naive-ui-pro-components'
import { ref } from 'vue'

const value = ref(['reading'])
const options = [
  { label: '阅读', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' },
]
</script>

<template>
  <ProCheckboxGroup v-model:value="value" :options="options" />
</template>
```

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `(string\|number)[]` | - | 选中值(v-model) |
| options | `CheckboxProps[]` | `[]` | 选项配置 |

继承 Naive UI `NCheckboxGroup` 全部 Props。
