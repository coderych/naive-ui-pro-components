import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createProConfig, useProLocale } from '../config-provider'

const LocaleConsumer = defineComponent({
  setup() {
    const locale = useProLocale()
    return () => h('span', locale('reload'))
  },
})

describe('configProvider', () => {
  it('uses the internal default locale', () => {
    const wrapper = mount(LocaleConsumer)

    expect(wrapper.text()).toBe('刷新')
  })

  it('accepts a locale resolver function', () => {
    const Provider = defineComponent({
      setup() {
        const { provide } = createProConfig({
          locale: key => `translated:${key}`,
        })
        provide()
        return () => h(LocaleConsumer)
      },
    })

    const wrapper = mount(Provider)

    expect(wrapper.text()).toBe('translated:reload')
  })
})
