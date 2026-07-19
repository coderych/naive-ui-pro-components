<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { NInput } from 'naive-ui'
import { ref } from 'vue'

const model = ref({ name: '' })
const columns: ProFormColumn[] = [{ key: 'name', label: '姓名', component: 'input' }]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns">
    <template #name="{ value, updateValue }">
      <NInput :value="value" placeholder="插槽渲染的输入框" @update:value="updateValue" />
    </template>
  </ProForm>
</template>
