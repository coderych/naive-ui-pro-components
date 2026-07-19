<script setup lang="ts">
import { ProRadioGroup } from '@naive-ui-pro/pro-radio-group'
import { ref } from 'vue'

const val1 = ref('apple')
const val2 = ref('apple')
const val3 = ref('apple')
const val4 = ref('vue')

const fruits = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
]

const frameworks = [
  { label: 'Vue.js', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular（禁用）', value: 'angular', disabled: true },
  { label: 'Svelte', value: 'svelte' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        默认样式
      </div>
      <ProRadioGroup v-model:value="val1" :options="fruits" />
      <div style="margin-top: 4px; font-size: 13px; color: var(--vp-c-text-2);">
        选中: {{ val1 }}
      </div>
    </div>
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        按钮样式
      </div>
      <ProRadioGroup v-model:value="val2" :options="fruits" option-type="button" />
    </div>
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        实心按钮
      </div>
      <ProRadioGroup v-model:value="val3" :options="fruits" option-type="button" button-style="solid" />
    </div>
    <div>
      <div style="margin-bottom: 8px; font-weight: 500;">
        含禁用项
      </div>
      <ProRadioGroup v-model:value="val4" :options="frameworks" />
    </div>
  </div>
</template>
