<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ProSwitch } from '@naive-ui-pro/pro-switch'
import { h, ref } from 'vue'

const val1 = ref(false)
const val2 = ref(true)
const val3 = ref(false)
const val4 = ref(true)

const CheckIcon = h(Icon, { icon: 'heroicons:check-20-solid' })
const XMarkIcon = h(Icon, { icon: 'heroicons:x-mark-20-solid' })
const SunIcon = h(Icon, { icon: 'heroicons:sun-20-solid' })
const MoonIcon = h(Icon, { icon: 'heroicons:moon-20-solid' })
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch v-model:value="val1" checked-text="开" unchecked-text="关" />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">带文本描述 (值: {{ val1 }})</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch v-model:value="val2" />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">基础开关 (值: {{ val2 }})</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch v-model:value="val3" :checked-icon="CheckIcon" :unchecked-icon="XMarkIcon" />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">带图标</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch v-model:value="val4" :checked-icon="SunIcon" :unchecked-icon="MoonIcon" checked-text="日间" unchecked-text="夜间" />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">图标 + 文本</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch :value="true" disabled />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">禁用状态</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <ProSwitch v-model:value="val1" size="small" checked-text="S" unchecked-text="S" />
      <ProSwitch v-model:value="val1" size="medium" checked-text="M" unchecked-text="M" />
      <ProSwitch v-model:value="val1" size="large" checked-text="L" unchecked-text="L" />
      <span style="font-size: 13px; color: var(--vp-c-text-2);">不同尺寸</span>
    </div>
  </div>
</template>
