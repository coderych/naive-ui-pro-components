# ProPopup 弹窗

统一的 Drawer/Modal 弹窗组件，支持两种模式切换，提供一致的 Header/Footer API。

## 基础用法

<DemoBlock title="Drawer / Modal / 自定义" description="展示 Drawer、Modal、自定义 Footer、无 Header 等多种模式。">
  <template #default><ProPopupBasic /></template>
  <template #code>

```vue
<script setup lang="ts">
import { ProPopup } from 'naive-ui-pro-components'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <n-button type="primary" @click="show = true">
    打开弹窗
  </n-button>
  <ProPopup v-model:show="show" title="编辑资料" preset="drawer" :width="600">
    弹窗内容
  </ProPopup>
</template>
```

  </template>
</DemoBlock>

## 不显示 Header/Footer

<DemoBlock title="纯内容弹窗" description="关闭 Header 和 Footer，仅保留内容区域。">
  <template #default><ProPopupNoChrome /></template>
  <template #code>

```vue
<ProPopup v-model:show="show" :header="false" :footer="false" preset="modal">
  <p>纯内容弹窗</p>
</ProPopup>
```

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| show | `boolean` | `false` | 是否显示(v-model) |
| preset | `'drawer' \| 'modal'` | `'drawer'` | 弹窗类型 |
| title | `string` | - | 标题 |
| width | `string \| number` | `800` | 宽度 |
| header | `boolean` | `true` | 是否显示头部 |
| footer | `boolean` | `true` | 是否显示底部 |
| loading | `boolean` | `false` | 确认按钮加载状态 |
| okText | `string` | `'确定'` | 确认按钮文本 |
| cancelText | `string` | `'取消'` | 取消按钮文本 |

继承 Naive UI `NDrawer`、`NDrawerContent`、`NModal` 全部 Props。

### Events

| 事件名 | 说明 |
|--------|------|
| ok | 点击确认 |
| cancel | 点击取消 |
| close | 弹窗关闭后 |
| update:show | 显示状态变化 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 弹窗内容 |
| header | 自定义头部 |
| header-extra | 头部额外内容 |
| footer | 自定义底部 |
