<script setup lang="ts">
import type { ProLocaleKey } from '@naive-ui-pro/config-provider'
import type { ProTableColumn } from '@naive-ui-pro/pro-table'
import { createProConfig } from '@naive-ui-pro/config-provider'
import { ProTable } from '@naive-ui-pro/pro-table'
import { NButton } from 'naive-ui'
import { computed, ref } from 'vue'

type Language = 'zh-CN' | 'en-US'

const language = ref<Language>('zh-CN')
const messages: Record<Language, Record<ProLocaleKey, string>> = {
  'zh-CN': {
    okText: '确定',
    cancelText: '取消',
    totalPrefix: '共',
    reload: '刷新',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    density: '密度',
    densityCompact: '紧凑',
    densityDefault: '默认',
    densityLoose: '宽松',
    columnSetting: '列设置',
    selectionColumn: '选择',
    indexColumn: '序号',
    selectAll: '全选',
    reset: '重置',
    search: '搜索',
    collapse: '收起',
    expand: '展开',
    pinLeft: '固定到左侧',
    pinRight: '固定到右侧',
    unpin: '取消固定',
    inputPlaceholder: '请输入{label}',
    selectPlaceholder: '请选择{label}',
    selectText: '选择',
    datePlaceholder: '请选择{label}',
    numberPlaceholder: '请输入{label}',
    empty: '暂无数据',
  },
  'en-US': {
    okText: 'OK',
    cancelText: 'Cancel',
    totalPrefix: 'Total',
    reload: 'Reload',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    density: 'Density',
    densityCompact: 'Compact',
    densityDefault: 'Default',
    densityLoose: 'Loose',
    columnSetting: 'Column settings',
    selectionColumn: 'Selection',
    indexColumn: 'No.',
    selectAll: 'Select all',
    reset: 'Reset',
    search: 'Search',
    collapse: 'Collapse',
    expand: 'Expand',
    pinLeft: 'Pin left',
    pinRight: 'Pin right',
    unpin: 'Unpin',
    inputPlaceholder: 'Enter {label}',
    selectPlaceholder: 'Select {label}',
    selectText: 'Select',
    datePlaceholder: 'Select {label}',
    numberPlaceholder: 'Enter {label}',
    empty: 'No data',
  },
}

const { provide } = createProConfig({ locale: key => messages[language.value][key] })
provide()

const columns = computed<ProTableColumn[]>(() => {
  const isEnglish = language.value === 'en-US'
  return [
    { title: isEnglish ? 'Name' : '姓名', key: 'name', search: true },
    {
      title: isEnglish ? 'Department' : '部门',
      key: 'department',
      search: {
        component: 'select',
        options: [
          { label: isEnglish ? 'Engineering' : '研发部', value: 'engineering' },
          { label: isEnglish ? 'Product' : '产品部', value: 'product' },
        ],
      },
    },
  ]
})

const data = [
  { id: 1, name: 'Alex', department: 'engineering' },
  { id: 2, name: 'Taylor', department: 'product' },
]

function toggleLanguage(): void {
  language.value = language.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}
</script>

<template>
  <NButton style="margin-bottom: 16px;" @click="toggleLanguage">
    {{ language === 'zh-CN' ? 'Switch to English' : '切换为中文' }}
  </NButton>
  <ProTable
    :columns="columns"
    :data="data"
    :pagination="{ pageSize: 10 }"
    :row-key="row => row.id"
  />
</template>
