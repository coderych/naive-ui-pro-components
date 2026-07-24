<script setup lang="ts">
import type { ProSelectRequest } from '@naive-ui-pro/pro-select'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NButton, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'

interface Tag {
  id: number
  name: string
}

const tags: Tag[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: `标签 ${index + 1}`,
}))

const value1 = ref<number | null>(5)
const value2 = ref<number[]>([2, 8])
const disabled = ref(false)

const request: ProSelectRequest<Tag> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  const keys = selectedKeys === null
    ? []
    : Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]
  if (!('current' in params)) {
    return { data: tags.filter(t => keys.includes(t.id)), total: keys.length }
  }
  const keyword = String(params.keyword ?? '')
  const filtered = tags.filter(t => t.name.includes(keyword))
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}
</script>

<template>
  <NSpace vertical :size="16">
    <!-- disabled 状态 -->
    <NText strong>disabled 属性</NText>
    <NSpace align="center">
      <NButton size="small" @click="disabled = !disabled">
        切换 disabled：{{ disabled }}
      </NButton>
    </NSpace>
    <ProSelect
      v-model="value1"
      clearable
      filterable
      label-field="name"
      placeholder="下拉模式"
      :disabled="disabled"
      :request="request"
      value-field="id"
    />
    <ProSelect
      v-model="value2"
      label-field="name"
      mode="popup"
      multiple
      :disabled="disabled"
      :popup-props="{ preset: 'modal', title: '选择标签', width: 600 }"
      :request="request"
      :table-props="{ columns: [{ key: 'name', title: '标签名称', search: true }] }"
      value-field="id"
    />

    <!-- 自定义按钮文字和属性 -->
    <NText strong>buttonText 与 buttonProps</NText>
    <ProSelect
      v-model="value1"
      button-text="选择标签"
      clearable
      filterable
      label-field="name"
      mode="popup"
      :button-props="{ type: 'warning', size: 'small', round: true }"
      :popup-props="{ preset: 'modal', title: '选择标签', width: 600 }"
      :request="request"
      :table-props="{ columns: [{ key: 'name', title: '标签名称', search: true }] }"
      value-field="id"
    />

    <!-- 继承 NSelect 的 size / status -->
    <NText strong>继承 NSelect Props：size 与 status</NText>
    <NSpace vertical>
      <ProSelect
        v-model="value1"
        clearable
        filterable
        label-field="name"
        placeholder="small 尺寸"
        size="small"
        :request="request"
        value-field="id"
      />
      <ProSelect
        v-model="value1"
        clearable
        filterable
        label-field="name"
        placeholder="large 尺寸"
        size="large"
        :request="request"
        value-field="id"
      />
      <ProSelect
        v-model="value1"
        clearable
        filterable
        label-field="name"
        placeholder="error 状态"
        status="error"
        :request="request"
        value-field="id"
      />
      <ProSelect
        v-model="value1"
        clearable
        filterable
        label-field="name"
        placeholder="warning 状态"
        status="warning"
        :request="request"
        value-field="id"
      />
    </NSpace>
  </NSpace>
</template>
