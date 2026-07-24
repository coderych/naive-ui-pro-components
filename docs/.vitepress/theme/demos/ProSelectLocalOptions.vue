<script setup lang="ts">
import { ProSelect } from '@naive-ui-pro/pro-select'
import { NText } from 'naive-ui'
import { ref } from 'vue'

interface City {
  code: string
  name: string
  province: string
}

const cities: City[] = [
  { code: 'SH', name: '上海', province: '上海市' },
  { code: 'BJ', name: '北京', province: '北京市' },
  { code: 'GZ', name: '广州', province: '广东省' },
  { code: 'SZ', name: '深圳', province: '广东省' },
  { code: 'HZ', name: '杭州', province: '浙江省' },
  { code: 'NJ', name: '南京', province: '江苏省' },
  { code: 'CD', name: '成都', province: '四川省' },
  { code: 'WH', name: '武汉', province: '湖北省' },
]

const singleValue = ref<string | null>('GZ')
const multiValue = ref<string[]>(['SH', 'SZ'])
</script>

<template>
  <NText strong>单选</NText>
  <ProSelect
    v-model="singleValue"
    clearable
    filterable
    label-field="name"
    placeholder="选择城市"
    :options="cities"
    value-field="code"
  />
  <NText depth="3">
    当前值：{{ singleValue ?? '未选择' }}
  </NText>

  <NText strong style="margin-top: 16px;">多选</NText>
  <ProSelect
    v-model="multiValue"
    clearable
    filterable
    label-field="name"
    multiple
    placeholder="选择多个城市"
    :options="cities"
    value-field="code"
  />
  <NText depth="3">
    当前值：{{ multiValue.length ? multiValue.join('、') : '未选择' }}
  </NText>
</template>
