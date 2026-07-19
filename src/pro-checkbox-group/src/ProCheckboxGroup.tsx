import type { CheckboxProps } from 'naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { checkboxGroupProps, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { pickProps } from '../../shared'

export type ProCheckboxGroupOption = CheckboxProps

export const proCheckboxGroupProps = {
  ...checkboxGroupProps,
  options: {
    type: Array as PropType<ProCheckboxGroupOption[]>,
    default: () => [],
  },
} as const

export type ProCheckboxGroupProps = ExtractPublicPropTypes<typeof proCheckboxGroupProps>

export default defineComponent({
  name: 'ProCheckboxGroup',
  props: proCheckboxGroupProps,
  setup(props, { slots, expose }) {
    const nativeProps = computed(() =>
      pickProps(props as Record<string, unknown>, Object.keys(checkboxGroupProps)),
    )

    expose({} as InstanceType<typeof NCheckboxGroup>)

    return () => (
      <NCheckboxGroup {...nativeProps.value}>
        {{
          default: () => slots.default
            ? slots.default()
            : props.options.map(option => <NCheckbox {...option} key={option.value} />),
        }}
      </NCheckboxGroup>
    )
  },
})
