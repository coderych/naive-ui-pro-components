<script setup lang="ts">
import type { ProSelectRequest } from '@naive-ui-pro/pro-select'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NText } from 'naive-ui'
import { ref } from 'vue'

interface User {
  id: number
  name: string
  department: string
}

const users: User[] = Array.from({ length: 45 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${index + 1}`,
  department: index % 2 === 0 ? '研发部' : '产品部',
}))
const value = ref<number | null>(37)
const selected = ref<User | null>(null)

const request: ProSelectRequest<User> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  if (!('current' in params)) {
    const keys = selectedKeys === null
      ? []
      : Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]
    return { data: users.filter(user => keys.includes(user.id)), total: keys.length }
  }

  const keyword = String(params.keyword ?? '').trim()
  const filtered = users.filter(user => user.name.includes(keyword))
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}
</script>

<template>
  <ProSelect
    v-model="value"
    clearable
    filterable
    label-field="name"
    placeholder="输入姓名搜索，滚动到底部加载下一页"
    :request="request"
    value-field="id"
    @change="(_keys, rows) => selected = rows as User | null"
  />
  <NText depth="3">
    当前值：{{ value }}；最近主动选择：{{ selected?.name ?? '无' }}
  </NText>
</template>
