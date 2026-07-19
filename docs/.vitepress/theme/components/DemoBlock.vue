<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider } from 'naive-ui'
import { ref } from 'vue'

defineProps<{
  title?: string
  description?: string
}>()

const showCode = ref(false)
</script>

<template>
  <div class="demo-block">
    <div v-if="title || description" class="demo-block__header">
      <h3 v-if="title" class="demo-block__title">
        {{ title }}
      </h3>
      <p v-if="description" class="demo-block__desc">
        {{ description }}
      </p>
    </div>
    <div class="demo-block__preview">
      <ClientOnly>
        <NConfigProvider>
          <NMessageProvider>
            <NNotificationProvider>
              <NDialogProvider>
                <slot />
              </NDialogProvider>
            </NNotificationProvider>
          </NMessageProvider>
        </NConfigProvider>
      </ClientOnly>
    </div>
    <div class="demo-block__actions">
      <button class="demo-block__btn" @click="showCode = !showCode">
        {{ showCode ? '隐藏代码' : '查看代码' }}
      </button>
    </div>
    <Transition name="demo-code">
      <div v-show="showCode" class="demo-block__code">
        <div class="demo-block__code-inner">
          <slot name="code" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.demo-block {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.demo-block__header {
  padding: 16px 20px 0;
}

.demo-block__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-block__desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.demo-block__preview {
  padding: 20px;
  min-height: 60px;
}

.demo-block__actions {
  border-top: 1px solid var(--vp-c-divider);
  padding: 8px 12px;
  text-align: center;
}

.demo-block__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.demo-block__btn:hover {
  color: var(--vp-c-brand-2);
}

.demo-block__code {
  max-height: 400px;
  overflow: auto;
  border-top: 1px solid var(--vp-c-divider);
  scrollbar-gutter: stable;
}

.demo-block__code-inner {
  box-sizing: border-box;
  width: max-content;
  min-width: 100%;
  background: var(--vp-code-block-bg);
}

.demo-block__code-inner :deep(div[class*='language-']) {
  box-sizing: border-box;
  width: max-content;
  min-width: 100%;
  margin: 0;
  overflow: visible !important;
  border-radius: 0;
}

.demo-block__code-inner :deep(pre) {
  margin: 0;
  padding-block: 0 !important;
  overflow: visible;
  background: transparent;
}

.demo-block__code-inner :deep(.line-numbers-wrapper) {
  padding-top: 0 !important;
  font-size: 13px;
  line-height: 1.6;
}

.demo-block__code-inner :deep(code) {
  font-size: 13px;
  line-height: 1.6;
}

.demo-code-enter-active,
.demo-code-leave-active {
  transition: all 0.3s ease;
}

.demo-code-enter-from,
.demo-code-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
