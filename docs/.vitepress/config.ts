import { resolve } from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'NaiveUI Pro Components',
  description: 'Advanced pro components built on top of Naive UI for Vue 3',
  base: '/naive-ui-pro-components/',
  vite: {
    plugins: [
      vueJsx(),
    ],
    resolve: {
      alias: {
        '@naive-ui-pro': resolve(__dirname, '../../src'),
      },
    },
    optimizeDeps: {
      include: ['naive-ui', '@iconify/vue'],
    },
    ssr: {
      noExternal: ['naive-ui'],
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/pro-table' },
      { text: '变更日志', link: '/guide/changelog' },
      {
        text: '相关链接',
        items: [
          { text: 'Naive UI', link: 'https://www.naiveui.com/' },
          { text: 'Vue 3', link: 'https://vuejs.org/' },
          { text: 'GitHub', link: 'https://github.com/user/naive-ui-pro-components' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '国际化', link: '/guide/i18n' },
            { text: '变更日志', link: '/guide/changelog' },
          ],
        },
      ],
      '/components/': [
        {
          text: '表格',
          items: [
            { text: 'ProTable 高级表格', link: '/components/pro-table' },
          ],
        },
        {
          text: '表单',
          items: [
            { text: 'ProForm 高级表单', link: '/components/pro-form' },
            { text: 'ProSelect 高级选择器', link: '/components/pro-select' },
            { text: 'ProSwitch 开关', link: '/components/pro-switch' },
            { text: 'ProCheckboxGroup 多选框组', link: '/components/pro-checkbox-group' },
            { text: 'ProRadioGroup 单选框组', link: '/components/pro-radio-group' },
          ],
        },
        {
          text: '业务组件',
          items: [
            { text: 'ProPopup 弹窗', link: '/components/pro-popup' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/user/naive-ui-pro-components' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024',
    },
  },
  markdown: {
    lineNumbers: true,
  },
})
