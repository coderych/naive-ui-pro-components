<script setup lang="ts">
import type { ProSelectRequest } from '@naive-ui-pro/pro-select'
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NText } from 'naive-ui'
import { ref } from 'vue'

interface Customer {
  id: number
  name: string
  city: string
}

const customers: Customer[] = Array.from({ length: 32 }, (_, index) => ({
  id: index + 1,
  name: `客户 ${index + 1}`,
  city: index % 2 === 0 ? '上海' : '杭州',
}))
const value = ref<number | null>(18)
const selected = ref<Customer | null>(null)
const columns: ProTableColumn<Customer>[] = [
  { key: 'name', title: '客户名称', search: true },
  { key: 'city', title: '城市', search: true },
]

const request: ProSelectRequest<Customer> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 180))
  if (!('current' in params)) {
    const key = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys
    return { data: customers.filter(customer => customer.id === key), total: key ? 1 : 0 }
  }
  const name = String(params.name ?? '')
  const city = String(params.city ?? '')
  const filtered = customers.filter(customer =>
    customer.name.includes(name) && customer.city.includes(city),
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
  <ProSelect
    v-model="value"
    label-field="name"
    mode="popup"
    :popup-props="{ preset: 'modal', title: '选择客户', width: 760 }"
    :request="request"
    :table-props="{ columns, showIndex: false }"
    value-field="id"
    :page-size="10"
    @change="(_keys, rows) => selected = rows as Customer | null"
  />
  <NText depth="3">
    已确认：{{ selected?.name ?? `ID ${value ?? '-'}` }}
  </NText>
</template>
