import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  isInEditor: false,
  rules: {
    'vue/one-component-per-file': 'off',
    'vue/define-macros-order': 'off',
  },
})
