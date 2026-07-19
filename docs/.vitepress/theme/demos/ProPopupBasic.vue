<script setup lang="ts">
import { ProPopup } from '@naive-ui-pro/pro-popup'
import { NAlert, NButton, NForm, NFormItem, NInput, NSpace, useMessage } from 'naive-ui'
import { ref } from 'vue'

const showDrawer = ref(false)
const showModal = ref(false)
const showCustom = ref(false)
const showNoHeader = ref(false)
const loading = ref(false)
const message = useMessage()

function handleOk(type: string) {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showDrawer.value = false
    showModal.value = false
    showCustom.value = false
    message.success(`${type} 提交成功`)
  }, 1000)
}

const formModel = ref({ name: '', desc: '' })
</script>

<template>
  <NSpace>
    <NButton type="primary" @click="showDrawer = true">
      Drawer 弹窗
    </NButton>
    <NButton @click="showModal = true">
      Modal 弹窗
    </NButton>
    <NButton @click="showCustom = true">
      自定义 Footer
    </NButton>
    <NButton @click="showNoHeader = true">
      无 Header
    </NButton>
  </NSpace>

  <ProPopup
    v-model:show="showDrawer"
    title="Drawer 抽屉"
    preset="drawer"
    :width="600"
    :loading="loading"
    @ok="handleOk('Drawer')"
    @cancel="showDrawer = false"
  >
    <NAlert type="info" title="提示" style="margin-bottom: 16px;">
      这是一个 Drawer 弹窗，支持 Header、Footer、Loading 状态。
    </NAlert>
    <NForm :model="formModel">
      <NFormItem label="名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入名称" />
      </NFormItem>
      <NFormItem label="描述" path="desc">
        <NInput v-model:value="formModel.desc" type="textarea" placeholder="请输入描述" />
      </NFormItem>
    </NForm>
  </ProPopup>

  <ProPopup
    v-model:show="showModal"
    title="Modal 模态框"
    preset="modal"
    :width="500"
    :loading="loading"
    @ok="handleOk('Modal')"
    @cancel="showModal = false"
  >
    <NAlert type="warning" title="确认操作">
      确认要执行此操作吗？此操作不可撤销。
    </NAlert>
  </ProPopup>

  <ProPopup
    v-model:show="showCustom"
    title="自定义底部按钮"
    preset="modal"
    :width="500"
  >
    <p>这个弹窗有自定义的 Footer 按钮。</p>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="showCustom = false">
          关闭
        </NButton>
        <NButton type="info" @click="message.info('已保存草稿')">
          保存草稿
        </NButton>
        <NButton type="primary" :loading="loading" @click="handleOk('自定义')">
          提交
        </NButton>
      </NSpace>
    </template>
  </ProPopup>

  <ProPopup
    v-model:show="showNoHeader"
    :header="false"
    :footer="false"
    preset="modal"
    :width="400"
  >
    <div style="text-align: center; padding: 20px 0;">
      <NAlert type="success" title="操作成功">
        没有 Header 和 Footer 的纯内容弹窗。
      </NAlert>
    </div>
  </ProPopup>
</template>
