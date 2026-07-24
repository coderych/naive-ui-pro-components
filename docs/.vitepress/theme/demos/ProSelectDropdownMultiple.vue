<script setup lang="ts">
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NText } from 'naive-ui'
import { ref } from 'vue'

interface Product {
  code: string
  name: string
  category: string
}

const products: Product[] = Array.from({ length: 36 }, (_, index) => ({
  code: `P${String(index + 1).padStart(3, '0')}`,
  name: `商品 ${index + 1}`,
  category: index % 3 === 0 ? '硬件' : '软件',
}))
const value = ref<string[]>(['P002', 'P025'])
const selectedRows = ref<Product[]>([])

async function request(params, selectedKeys) {
  await new Promise(resolve => setTimeout(resolve, 150))
  const keys = Array.isArray(selectedKeys) ? selectedKeys : []
  if (!('current' in params)) {
    return {
      data: products.filter(product => keys.includes(product.code)),
      total: keys.length,
    }
  }
  const keyword = String(params.keyword ?? '')
  const filtered = products.filter(product => product.name.includes(keyword))
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
    multiple
    :page-size="8"
    :request="request"
    value-field="code"
    @change="(_keys, rows) => selectedRows = rows as Product[]"
  />
  <NText depth="3">
    已选 {{ value.length }} 项；完整 rows：{{ selectedRows.map(row => row.name).join('、') || '等待主动选择' }}
  </NText>
</template>
