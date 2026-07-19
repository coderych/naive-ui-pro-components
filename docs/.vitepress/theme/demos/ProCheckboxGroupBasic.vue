<script setup lang="ts">
import { ProCheckboxGroup } from '@naive-ui-pro/pro-checkbox-group'
import { ref } from 'vue'

const value1 = ref(['reading'])
const value2 = ref(['vue', 'react'])
const value3 = ref(['a'])

const options1 = [
  { label: '阅读', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' },
  { label: '旅行', value: 'travel' },
]

const options2 = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
]

const options3 = [
  { label: '选项A', value: 'a' },
  { label: '选项B（禁用）', value: 'b', disabled: true },
  { label: '选项C', value: 'c' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        基础用法
      </div>
      <ProCheckboxGroup v-model:value="value1" :options="options1" />
      <div style="margin-top: 4px; font-size: 13px; color: var(--vp-c-text-2);">
        选中: {{ value1 }}
      </div>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        多选（技术栈）
      </div>
      <ProCheckboxGroup v-model:value="value2" :options="options2" />
      <div style="margin-top: 4px; font-size: 13px; color: var(--vp-c-text-2);">
        选中: {{ value2 }}
      </div>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        含禁用项
      </div>
      <ProCheckboxGroup v-model:value="value3" :options="options3" />
    </div>
  </div>
</template>
