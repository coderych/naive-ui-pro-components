# ProSwitch 开关

基于 `NSwitch` 封装，支持声明式文本、图标、尺寸配置。

## 基础用法

<DemoBlock title="开关" description="文本描述、图标、禁用状态、不同尺寸。">
  <template #default><ProSwitchBasic /></template>
  <template #code>

```vue
<script setup lang="ts">
import { ProSwitch } from 'naive-ui-pro-components'
import { ref } from 'vue'

const enabled = ref(true)
</script>

<template>
  <ProSwitch v-model:value="enabled" checked-text="开" unchecked-text="关" />
  <ProSwitch :value="true" disabled />
</template>
```

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `boolean` | - | 开关值(v-model) |
| checkedText | `string \| number` | - | 选中时文本 |
| uncheckedText | `string \| number` | - | 未选中时文本 |
| icon | `Component` | - | 图标 |
| checkedIcon | `Component` | - | 选中时图标 |
| uncheckedIcon | `Component` | - | 未选中时图标 |

继承 Naive UI `NSwitch` 全部 Props（size、disabled 等）。
