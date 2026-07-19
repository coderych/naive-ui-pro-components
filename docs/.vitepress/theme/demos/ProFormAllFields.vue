<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { NButton, NTabPane, NTabs } from 'naive-ui'
import { h, ref } from 'vue'

const model = ref<Record<string, unknown>>({
  autoComplete: '',
  cascader: null,
  checkbox: false,
  checkboxGroup: ['vue'],
  color: '#18a058',
  date: null,
  dynamicInput: ['第一项'],
  dynamicTags: ['Vue', 'TypeScript'],
  input: '',
  inputNumber: 18,
  inputOtp: [],
  mention: '',
  radio: false,
  radioButton: false,
  radioGroup: 'frontend',
  rate: 4,
  select: null,
  slider: 40,
  switch: true,
  time: null,
  transfer: ['read'],
  treeSelect: null,
  upload: [],
})

const cityOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
]
const treeOptions = [
  { label: '华北', key: 'north', children: [{ label: '北京', key: 'beijing' }] },
  { label: '华东', key: 'east', children: [{ label: '上海', key: 'shanghai' }] },
]
const permissionOptions = [
  { label: '查看', value: 'read' },
  { label: '编辑', value: 'write' },
  { label: '发布', value: 'publish' },
]

const basicColumns: ProFormColumn[] = [
  { key: 'input', label: 'Input', component: 'input', span: 12, componentProps: { placeholder: '请输入项目名称' } },
  { key: 'inputNumber', label: 'InputNumber', component: 'input-number', span: 12, componentProps: { min: 0, max: 100, style: { width: '100%' } } },
  { key: 'autoComplete', label: 'AutoComplete', component: 'auto-complete', span: 12, componentProps: { options: ['Vue', 'Vite', 'Vitest'].map(value => ({ label: value, value })) } },
  { key: 'select', label: 'Select', component: 'select', span: 12, componentProps: { options: cityOptions, placeholder: '请选择城市' } },
  { key: 'date', label: 'DatePicker', component: 'date-picker', span: 12, componentProps: { type: 'date', clearable: true, style: { width: '100%' } } },
  { key: 'time', label: 'TimePicker', component: 'time-picker', span: 12, componentProps: { clearable: true, style: { width: '100%' } } },
  { key: 'color', label: 'ColorPicker', component: 'color-picker', span: 12 },
  { key: 'inputOtp', label: 'InputOtp', component: 'input-otp', span: 12, componentProps: { length: 6 } },
]

const choiceColumns: ProFormColumn[] = [
  { key: 'switch', label: 'Switch', component: 'switch', span: 12, componentProps: { checkedText: '启用', uncheckedText: '停用' } },
  { key: 'checkbox', label: 'Checkbox', component: 'checkbox', span: 12, componentProps: { label: '接受服务条款' } },
  { key: 'checkboxGroup', label: 'CheckboxGroup', component: 'checkbox-group', span: 12, componentProps: { options: [{ label: 'Vue', value: 'vue' }, { label: 'React', value: 'react' }] } },
  { key: 'radioGroup', label: 'RadioGroup', component: 'radio-group', span: 12, componentProps: { optionType: 'button', buttonStyle: 'solid', options: [{ label: '前端', value: 'frontend' }, { label: '后端', value: 'backend' }] } },
  { key: 'radio', label: 'Radio', component: 'radio', span: 12, componentProps: { label: '普通单选项' } },
  { key: 'radioButton', label: 'RadioButton', component: 'radio-button', span: 12, componentProps: { label: '按钮单选项' } },
  { key: 'rate', label: 'Rate', component: 'rate', span: 12, componentProps: { allowHalf: true } },
  { key: 'slider', label: 'Slider', component: 'slider', span: 12, componentProps: { step: 10, marks: { 0: '0', 50: '50', 100: '100' } } },
]

const advancedColumns: ProFormColumn[] = [
  { key: 'cascader', label: 'Cascader', component: 'cascader', span: 12, componentProps: { options: [{ label: '华北', value: 'north', children: cityOptions.slice(0, 1) }], clearable: true } },
  { key: 'treeSelect', label: 'TreeSelect', component: 'tree-select', span: 12, componentProps: { options: treeOptions, clearable: true } },
  { key: 'dynamicTags', label: 'DynamicTags', component: 'dynamic-tags', span: 12 },
  { key: 'mention', label: 'Mention', component: 'mention', span: 12, componentProps: { options: [{ label: '张三', value: '张三' }, { label: '李四', value: '李四' }], placeholder: '输入 @ 提及成员' } },
  { key: 'dynamicInput', label: 'DynamicInput', component: 'dynamic-input', span: 24, componentProps: { placeholder: '请输入列表项' } },
  { key: 'transfer', label: 'Transfer', component: 'transfer', span: 24, componentProps: { options: permissionOptions, sourceFilterable: true } },
  {
    key: 'upload',
    label: 'Upload',
    component: 'upload',
    span: 24,
    componentProps: { defaultUpload: false, max: 3 },
    slots: { default: () => h(NButton, null, { default: () => '选择文件' }) },
  },
]
</script>

<template>
  <div class="component-lab">
    <NTabs type="line" animated>
      <NTabPane name="basic" tab="基础输入">
        <ProForm v-model:value="model" :columns="basicColumns" :x-gap="16" />
      </NTabPane>
      <NTabPane name="choice" tab="选择与评分">
        <ProForm v-model:value="model" :columns="choiceColumns" :x-gap="16" />
      </NTabPane>
      <NTabPane name="advanced" tab="高级输入">
        <ProForm v-model:value="model" :columns="advancedColumns" :x-gap="16" />
      </NTabPane>
    </NTabs>
    <div class="component-lab__state">
      <span>实时模型</span>
      <pre><code>{{ JSON.stringify(model, null, 2) }}</code></pre>
    </div>
  </div>
</template>
