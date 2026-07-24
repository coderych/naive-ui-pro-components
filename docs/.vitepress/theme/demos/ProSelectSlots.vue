<script setup lang="ts">
import type { ProSelectInst, ProSelectRequest } from '@naive-ui-pro/pro-select'
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NButton, NIcon, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'

interface Supplier {
  id: number
  name: string
  region: string
}

const suppliers: Supplier[] = Array.from({ length: 28 }, (_, index) => ({
  id: index + 1,
  name: `供应商 ${index + 1}`,
  region: index % 2 === 0 ? '华东' : '华南',
}))

const selectRef = ref<ProSelectInst<Supplier> | null>(null)
const value = ref<number[]>([5, 12])
const selectedRows = ref<Supplier[]>([])

const columns: ProTableColumn<Supplier>[] = [
  { key: 'name', title: '供应商名称', search: true },
  { key: 'region', title: '区域', search: true },
]

const request: ProSelectRequest<Supplier> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 150))
  const keys = Array.isArray(selectedKeys) ? selectedKeys : []
  if (!('current' in params)) {
    return {
      data: suppliers.filter(s => keys.includes(s.id)),
      total: keys.length,
    }
  }
  const name = String(params.name ?? '')
  const region = String(params.region ?? '')
  const filtered = suppliers.filter(s =>
    s.name.includes(name) && (!region || s.region === region),
  )
  const page = Number(params.current)
  const size = Number(params.size)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}
</script>

<template>
  <NSpace vertical :size="12">
    <ProSelect
      ref="selectRef"
      v-model="value"
      label-field="name"
      mode="popup"
      multiple
      :page-size="8"
      :popup-props="{ preset: 'modal', title: '选择供应商', width: 760 }"
      :request="request"
      :table-props="{ columns }"
      value-field="id"
      @change="(_keys, rows) => selectedRows = rows as Supplier[]"
    >
      <!-- 自定义入口按钮：图标 + 文字 -->
      <template #button="{ open, text }">
        <NButton type="primary" @click="open">
          <template #icon>
            <NIcon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
            </NIcon>
          </template>
          {{ text }}
        </NButton>
      </template>

      <!-- 自定义弹窗标题 -->
      <template #popup-header>
        <NText strong style="font-size: 16px;">
          📦 选择供应商
        </NText>
      </template>

      <!-- 自定义弹窗底部：带选中数量提示 -->
      <template #popup-footer="{ confirm, cancel }">
        <NSpace justify="space-between" align="center" style="width: 100%; padding: 8px 0;">
          <NText depth="3">
            已选 {{ value.length }} 家供应商
          </NText>
          <NSpace>
            <NButton @click="cancel">
              取消
            </NButton>
            <NButton type="primary" @click="confirm">
              确认选择
            </NButton>
          </NSpace>
        </NSpace>
      </template>

      <!-- 自定义空状态 -->
      <template #empty>
        <NText depth="3" style="padding: 24px; display: block; text-align: center;">
          没有找到匹配的供应商，请调整搜索条件
        </NText>
      </template>
    </ProSelect>

    <NText depth="3">
      已确认 {{ value.length }} 项：{{ selectedRows.map(r => r.name).join('、') || '暂无' }}
    </NText>
  </NSpace>
</template>
