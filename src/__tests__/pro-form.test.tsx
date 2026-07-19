import { mount } from '@vue/test-utils'
import { NFormItem, NSelect } from 'naive-ui'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import ProForm from '../pro-form/src/ProForm'

describe('proForm', () => {
  it('validates the latest value on the first select update', async () => {
    const host = defineComponent({
      setup() {
        const model = ref({ role: null as string | null })
        return () => h(ProForm, {
          value: model.value,
          columns: [{
            key: 'role',
            component: 'select',
            componentProps: {
              options: [{ label: '管理员', value: 'admin' }],
            },
            rule: {
              required: true,
              message: '请选择用户角色',
              trigger: 'change',
            },
          }],
          ...{
            'onUpdate:value': (value: object) => model.value = value as typeof model.value,
          },
        })
      },
    })
    const wrapper = mount(host)
    const formItem = wrapper.findComponent(NFormItem)
    const select = wrapper.findComponent(NSelect)

    await expect(formItem.vm.validate()).rejects.toBeTruthy()
    expect(wrapper.text()).toContain('请选择用户角色')

    const updateValue = select.props('onUpdate:value') as (value: string) => void
    updateValue('admin')
    await expect(formItem.vm.validate('change')).resolves.toBeTruthy()
    await nextTick()

    expect(wrapper.text()).not.toContain('请选择用户角色')
  })
})
