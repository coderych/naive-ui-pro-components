# ProForm 高级表单

基于 `NForm` + `NGrid` 封装，通过 `columns` 驱动表单渲染，支持多种字段类型、表单验证、嵌套路径。

## 基础用法

<DemoBlock title="基础字段" description="从 input、input-number、switch、checkbox-group 开始配置声明式表单。">
  <template #default><ProFormBasic /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormBasic.vue

  </template>
</DemoBlock>

## 全部字段组件

<DemoBlock title="字段组件实验台" description="按类别展示 ProForm 支持的全部 23 种字段组件，并实时显示模型变化。">
  <template #default><ProFormAllFields /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormAllFields.vue

  </template>
</DemoBlock>

## 表单验证

<DemoBlock title="表单验证" description="通过 rule 配置验证规则，支持正则、自定义校验器和下拉框 change 校验。">
  <template #default><ProFormValidation /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormValidation.vue

  </template>
</DemoBlock>

## 自定义渲染

<DemoBlock title="自定义渲染" description="使用 render 函数完全自定义字段渲染。">
  <template #default><ProFormCustom /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormCustom.vue

  </template>
</DemoBlock>

## 嵌套路径

<DemoBlock title="嵌套路径" description="通过 path 读写深层表单字段。">
  <template #default><ProFormNested /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormNested.vue

  </template>
</DemoBlock>

## 插槽覆盖

<DemoBlock title="插槽覆盖" description="按字段 key 覆盖默认控件。">
  <template #default><ProFormSlot /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormSlot.vue

  </template>
</DemoBlock>

## 实例方法

<DemoBlock title="调用 NForm 方法" description="通过 ProFormInst 调用 validate、restoreValidation 和 invalidateLabelWidth。">
  <template #default><ProFormMethods /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProFormMethods.vue

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

### Methods

通过组件 `ref` 调用，完整继承 Naive UI `FormInst`：

| 方法 | 说明 |
|------|------|
| `validate(callback?, shouldRuleBeApplied?)` | 校验表单 |
| `restoreValidation()` | 恢复表单校验状态 |
| `invalidateLabelWidth()` | 重新计算标签宽度 |

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
