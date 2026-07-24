<script setup lang="ts">
import type { ProSelectRequest } from '@naive-ui-pro/pro-select'
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NButton, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'

interface Article {
  articleId: number
  title: string
  category: string
  status: string
}

const articles: Article[] = Array.from({ length: 60 }, (_, index) => ({
  articleId: index + 1,
  title: `文章标题 ${index + 1}`,
  category: ['技术', '产品', '设计'][index % 3],
  status: index % 5 === 0 ? 'draft' : 'published',
}))

const value = ref<number | null>(null)
const category = ref('技术')
const status = ref('published')

const request: ProSelectRequest<Article> = async (params, selectedKeys) => {
  await new Promise(resolve => setTimeout(resolve, 150))
  const keys = selectedKeys === null
    ? []
    : Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]
  if (!('page' in params)) {
    return {
      data: articles.filter(a => keys.includes(a.articleId)),
      total: keys.length,
    }
  }
  // 使用自定义 searchField（title）和自定义 pageFields（page / pageSize）
  const keyword = String(params.title ?? '')
  const cat = String(params.category ?? '')
  const st = String(params.status ?? '')
  const filtered = articles.filter(a =>
    a.title.includes(keyword)
    && (!cat || a.category === cat)
    && (!st || a.status === st),
  )
  const page = Number(params.page)
  const size = Number(params.pageSize)
  return {
    data: filtered.slice((page - 1) * size, page * size),
    total: filtered.length,
  }
}
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NText>分类：</NText>
      <NButton
        v-for="cat in ['技术', '产品', '设计']"
        :key="cat"
        :type="category === cat ? 'primary' : 'default'"
        size="small"
        @click="category = cat"
      >
        {{ cat }}
      </NButton>
      <NText style="margin-left: 16px;">状态：</NText>
      <NButton
        :type="status === 'published' ? 'primary' : 'default'"
        size="small"
        @click="status = 'published'"
      >
        已发布
      </NButton>
      <NButton
        :type="status === 'draft' ? 'primary' : 'default'"
        size="small"
        @click="status = 'draft'"
      >
        草稿
      </NButton>
    </NSpace>

    <ProSelect
      v-model="value"
      clearable
      filterable
      label-field="title"
      placeholder="输入标题搜索（searchDebounce=500ms）"
      :page-fields="{ page: 'page', pageSize: 'pageSize' }"
      :page-size="10"
      :request="request"
      :request-params="{ category, status }"
      :search-debounce="500"
      search-field="title"
      value-field="articleId"
    />

    <NText depth="3">
      当前值：{{ value ?? '未选择' }}；requestParams：category={{ category }}, status={{ status }}
    </NText>
  </NSpace>
</template>
