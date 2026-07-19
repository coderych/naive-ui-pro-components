import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { NForm } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import ProCheckboxGroup from '../pro-checkbox-group/src/ProCheckboxGroup'
import ProForm from '../pro-form/src/ProForm'
import ProPopup from '../pro-popup/src/ProPopup'
import ProRadioGroup from '../pro-radio-group/src/ProRadioGroup'
import ProSwitch from '../pro-switch/src/ProSwitch'

function mountWithRef(component: Component, props: Record<string, unknown> = {}) {
  const componentRef = ref<Record<string, unknown> | null>(null)
  const host = defineComponent({
    setup: () => () => h(component, { ...props, ref: componentRef }),
  })
  return { componentRef, wrapper: mount(host) }
}

describe('component instance forwarding', () => {
  it('forwards the native form methods', () => {
    const { componentRef, wrapper } = mountWithRef(ProForm, {
      columns: [{ key: 'name', component: 'input' }],
    })
    const nativeForm = wrapper.findComponent(NForm).vm
    const restoreValidation = vi.spyOn(nativeForm, 'restoreValidation')
    const restoreExposedValidation = componentRef.value?.restoreValidation as () => void

    restoreExposedValidation()

    expect(restoreValidation).toHaveBeenCalledOnce()
  })

  it.each([
    ['checkbox group', ProCheckboxGroup],
    ['radio group', ProRadioGroup],
    ['switch', ProSwitch],
    ['popup', ProPopup],
  ])('forwards the native %s instance', (_name, component) => {
    const props = component === ProPopup ? { preset: 'modal' } : {}
    const { componentRef } = mountWithRef(component, props)

    expect(componentRef.value?.mergedClsPrefix).toBe('n')
  })
})
