import type { RadioProps } from 'naive-ui'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { NRadio, NRadioButton, NRadioGroup, radioGroupProps } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { pickProps } from '../../shared'
import { mountProRadioGroupStyle } from './styles'

export type ProRadioGroupOption = RadioProps
export type ProRadioGroupOptionType = 'default' | 'button'
export type ProRadioGroupButtonStyle = 'solid' | 'outline'

export const proRadioGroupProps = {
  ...radioGroupProps,
  options: {
    type: Array as PropType<ProRadioGroupOption[]>,
    default: () => [],
  },
  optionType: {
    type: String as PropType<ProRadioGroupOptionType>,
    default: 'default',
  },
  buttonStyle: {
    type: String as PropType<ProRadioGroupButtonStyle>,
    default: 'outline',
  },
} as const

export type ProRadioGroupProps = ExtractPublicPropTypes<typeof proRadioGroupProps>

export default defineComponent({
  name: 'ProRadioGroup',
  props: proRadioGroupProps,
  setup(props, { slots, expose }) {
    mountProRadioGroupStyle()
    const nativeProps = computed(() =>
      pickProps(props as Record<string, unknown>, Object.keys(radioGroupProps)),
    )

    const rootClass = computed(() => [
      'npro-radio-group',
      {
        'npro-radio-group--solid': props.optionType === 'button' && props.buttonStyle === 'solid',
      },
    ])

    expose({} as InstanceType<typeof NRadioGroup>)

    return () => {
      const Component = props.optionType === 'button' ? NRadioButton : NRadio
      return (
        <div class="npro-radio-group-wrapper">
          <NRadioGroup {...nativeProps.value} class={rootClass.value}>
            {{
              default: () => slots.default
                ? slots.default()
                : props.options.map((option, index) => (
                    <Component
                      {...option}
                      key={option.value === undefined ? index : String(option.value)}
                    />
                  )),
            }}
          </NRadioGroup>
        </div>
      )
    }
  },
})
