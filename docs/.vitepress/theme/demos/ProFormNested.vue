<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { ref } from 'vue'

const model = ref({ user: { profile: { nickname: '' } } })
const columns: ProFormColumn[] = [
  { key: 'nickname', path: 'user.profile.nickname', label: '昵称', component: 'input' },
]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns" />
  <pre>{{ JSON.stringify(model, null, 2) }}</pre>
</template>
