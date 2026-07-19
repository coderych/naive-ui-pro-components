# ProCheckboxGroup 多选框组

基于 `NCheckboxGroup` 封装，通过 `options` 声明式渲染。

## 基础用法

<DemoBlock title="多选框组" description="基础用法、多选、含禁用项。">
  <template #default><ProCheckboxGroupBasic /></template>
  <template #code>

<<< @/.vitepress/theme/demos/ProCheckboxGroupBasic.vue

  </template>
</DemoBlock>

## API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | `(string\|number)[]` | - | 选中值(v-model) |
| options | `CheckboxProps[]` | `[]` | 选项配置 |

继承 Naive UI `NCheckboxGroup` 全部 Props。
