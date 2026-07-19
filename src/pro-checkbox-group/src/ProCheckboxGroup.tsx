import type { CheckboxProps } from 'naive-ui'
import type { ExtractPublicPropTypes, PropType, SlotsType, VNodeChild } from 'vue'
import { checkboxGroupProps, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import { pickProps, useExposeProxy } from '../../shared'

export type ProCheckboxGroupOption = CheckboxProps

export const proCheckboxGroupProps = {
  ...checkboxGroupProps,
  options: {
    type: Array as PropType<ProCheckboxGroupOption[]>,
    default: () => [],
  },
} as const

export type ProCheckboxGroupProps = ExtractPublicPropTypes<typeof proCheckboxGroupProps>
export interface ProCheckboxGroupSlots {
  default?: () => VNodeChild
}

export default defineComponent({
  name: 'ProCheckboxGroup',
  props: proCheckboxGroupProps,
  slots: Object as SlotsType<ProCheckboxGroupSlots>,
  setup(props, { slots, expose }) {
    const checkboxGroupRef = ref<InstanceType<typeof NCheckboxGroup> | null>(null)
    const nativeProps = computed(() =>
      pickProps(props as Record<string, unknown>, Object.keys(checkboxGroupProps)),
    )

    expose(useExposeProxy(checkboxGroupRef))

    return () => (
      <NCheckboxGroup ref={checkboxGroupRef} {...nativeProps.value}>
        {{
          default: () => slots.default
            ? slots.default()
            : props.options.map(option => <NCheckbox {...option} key={option.value} />),
        }}
      </NCheckboxGroup>
    )
  },
})
