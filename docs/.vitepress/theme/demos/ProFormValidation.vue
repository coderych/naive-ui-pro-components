<script setup lang="ts">
import type { ProFormColumn } from '@naive-ui-pro/pro-form'
import { ProForm } from '@naive-ui-pro/pro-form'
import { ref } from 'vue'

const model = ref({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  role: null as string | null,
  idCard: '',
})

const columns: ProFormColumn[] = [
  {
    key: 'username',
    label: '用户名',
    component: 'input',
    componentProps: { placeholder: '4-16位字母数字' },
    rule: [
      { required: true, message: '请输入用户名', trigger: 'input' },
      { min: 4, max: 16, message: '长度4-16位', trigger: 'input' },
    ],
    span: 12,
  },
  {
    key: 'password',
    label: '密码',
    component: 'input',
    componentProps: { type: 'password', placeholder: '至少6位', showPasswordOn: 'click' },
    rule: [
      { required: true, message: '请输入密码', trigger: 'input' },
      { min: 6, message: '至少6位', trigger: 'input' },
    ],
    span: 12,
  },
  {
    key: 'confirmPassword',
    label: '确认密码',
    component: 'input',
    componentProps: { type: 'password', placeholder: '再次输入密码' },
    rule: {
      required: true,
      validator: (_rule: any, value: string) => {
        if (!value)
          return new Error('请确认密码')
        if (value !== model.value.password)
          return new Error('两次密码不一致')
        return true
      },
      trigger: 'blur',
    },
    span: 12,
  },
  {
    key: 'phone',
    label: '手机号',
    component: 'input',
    componentProps: { placeholder: '11位手机号' },
    rule: { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'input' },
    span: 12,
  },
  {
    key: 'role',
    label: '用户角色',
    component: 'select',
    componentProps: {
      clearable: true,
      placeholder: '请选择用户角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' },
      ],
    },
    rule: { required: true, message: '请选择用户角色', trigger: 'change' },
    span: 12,
  },
  {
    key: 'idCard',
    label: '身份证',
    component: 'input',
    componentProps: { placeholder: '18位身份证号' },
    rule: { pattern: /^\d{17}[\dX]$/i, message: '身份证格式不正确', trigger: 'input' },
    span: 12,
  },
]
</script>

<template>
  <ProForm v-model:value="model" :columns="columns" />
</template>
