import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@naive-ui-pro': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: false as any,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.ts'),
      preserveEntrySignatures: 'strict',
      external: [
        'vue',
        'naive-ui',
        '@iconify/vue',
        'lodash-es',
        'vue-draggable-plus',
      ],
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].mjs',
          chunkFileNames: 'chunks/[name]-[hash].mjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
        },
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
        },
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
  },
})
