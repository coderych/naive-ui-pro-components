<script setup lang="ts">
import type { ProSelectRequest } from '@naive-ui-pro/pro-select'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

interface Project {
  id: number
  name: string
}

const projects: Project[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${index + 1}`,
}))
const value = ref<number | null>(42)

const request: ProSelectRequest<Project> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 120))
  if (!('current' in params)) {
    const key = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys
    return { data: projects.filter(project => project.id === key), total: key ? 1 : 0 }
  }
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: projects.slice((page - 1) * size, page * size),
    total: projects.length,
  }
}
</script>

<template>
  <NSpace vertical>
    <ProSelect
      v-model="value"
      clearable
      label-field="name"
      :request="request"
      value-field="id"
    />
    <NSpace>
      <NButton @click="value = 7">
        外部设为 7
      </NButton>
      <NButton @click="value = 48">
        外部设为 48
      </NButton>
      <NButton @click="value = null">
        外部清空
      </NButton>
    </NSpace>
  </NSpace>
</template>
