<script setup lang="ts">
import type { ProSelectRequest, ProSelectRequestContext } from '@naive-ui-pro/pro-select'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NAlert, NButton, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'

interface Item {
  id: number
  name: string
}

const items: Item[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `项目 ${index + 1}`,
}))

const value = ref<number | null>(5)
const errorMessage = ref('')
const errorContext = ref<ProSelectRequestContext | ''>('')
const failCount = ref(0)

const request: ProSelectRequest<Item> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const keys = selectedKeys === null
    ? []
    : Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]
  if (!('current' in params)) {
    return { data: items.filter(i => keys.includes(i.id)), total: keys.length }
  }

  // 前两次请求模拟失败
  if (failCount.value < 2) {
    failCount.value++
    throw new Error(`模拟网络错误（第 ${failCount.value} 次）`)
  }

  const keyword = String(params.keyword ?? '')
  const filtered = items.filter(i => i.name.includes(keyword))
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}

function handleError(error: unknown, context: ProSelectRequestContext) {
  errorMessage.value = error instanceof Error ? error.message : String(error)
  errorContext.value = context
}

function resetDemo() {
  failCount.value = 0
  errorMessage.value = ''
  errorContext.value = ''
}
</script>

<template>
  <NSpace vertical :size="12">
    <NAlert v-if="errorMessage" type="error" closable @close="errorMessage = ''">
      <NText strong>请求失败</NText>（场景：{{ errorContext }}）：{{ errorMessage }}
    </NAlert>
    <NAlert v-else type="info" :show-icon="false">
      已失败 {{ failCount }} 次，再打开下拉将开始正常请求（模拟 2 次失败后恢复）
    </NAlert>

    <NSpace>
      <NButton size="small" @click="resetDemo">
        重置失败计数
      </NButton>
    </NSpace>

    <ProSelect
      v-model="value"
      clearable
      filterable
      label-field="name"
      placeholder="打开下拉触发请求（前两次会失败）"
      :request="request"
      value-field="id"
      @request-error="handleError"
    />

    <NText depth="3">
      当前值：{{ value ?? '未选择' }}；request-error 事件捕获请求异常并展示上下文
    </NText>
  </NSpace>
</template>
