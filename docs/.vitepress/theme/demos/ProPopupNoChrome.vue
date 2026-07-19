<script setup lang="ts">
import { ProPopup } from '@naive-ui-pro/pro-popup'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <NButton @click="show = true">
    打开纯内容弹窗
  </NButton>
  <ProPopup v-model:show="show" :header="false" :footer="false" preset="modal" :width="420">
    <div style="padding: 24px; text-align: center;">
      无 Header / Footer 的内容区域
    </div>
  </ProPopup>
</template>
