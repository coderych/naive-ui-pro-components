<script setup lang="ts">
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NInput } from 'naive-ui'
import { h } from 'vue'

const columns: ProTableColumn[] = [
  { title: '关键词', key: 'keyword', search: { component: 'input', placeholder: 'Input' } },
  { title: '数量', key: 'count', search: { component: 'input-number', min: 0 } },
  { title: '状态', key: 'status', search: { component: 'select', options: [{ label: '启用', value: 1 }, { label: '停用', value: 0 }] } },
  { title: '日期', key: 'date', search: { component: 'date-picker', type: 'date', clearable: true } },
  { title: '地区', key: 'region', search: { component: 'cascader', options: [{ label: '华北', value: 'north', children: [{ label: '北京', value: 'beijing' }] }] } },
  { title: '组织', key: 'org', search: { component: 'tree-select', options: [{ label: '研发中心', key: 'rd', children: [{ label: '前端组', key: 'frontend' }] }] } },
  { title: '公开', key: 'visible', search: { component: 'switch', checkedText: '是', uncheckedText: '否' } },
  { title: '类型', key: 'type', search: { component: 'radio-group', options: [{ label: '内部', value: 'internal' }, { label: '外部', value: 'external' }] } },
  { title: '标签', key: 'tags', search: { component: 'checkbox-group', options: [{ label: '重点', value: 'important' }, { label: '待办', value: 'todo' }] } },
  { title: '自定义', key: 'custom', search: { component: 'render', render: props => h(NInput, { ...props, placeholder: 'Render 自定义控件' }) } },
]

const data = [{ id: 1, keyword: '示例数据', count: 12, status: 1, date: '2026-07-19', region: '北京', org: '前端组', visible: true, type: 'internal', tags: '重点', custom: '-' }]
</script>

<template>
  <ProTable
    :columns="columns"
    :data="data"
    :pagination="false"
    :option="{ manualSearch: true, tableHeader: false }"
  />
</template>
