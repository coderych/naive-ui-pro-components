# ProRadioGroup 单选框组

基于 `NRadioGroup` 封装，支持默认、按钮、实心按钮三种样式。

## 基础用法

<DemoBlock title="单选框组" description="默认样式、按钮样式、实心按钮、含禁用项。">
  <template #default><ProRadioGroupBasic /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProRadioGroupBasic.vue

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `string \| number` | - | 选中值(v-model) |
| options | `RadioProps[]` | `[]` | 选项配置 |
| optionType | `'default' \| 'button'` | `'default'` | 选项类型 |
| buttonStyle | `'solid' \| 'outline'` | `'outline'` | 按钮样式 |

继承 Naive UI `NRadioGroup` 全部 Props。
