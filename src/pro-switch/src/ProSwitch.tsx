import type { SwitchSlots } from 'naive-ui'
import type { Component, ExtractPublicPropTypes, PropType, SlotsType } from 'vue'
import { NSwitch, switchProps } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import { createIconSlot, createTextSlot, pickProps, useExposeProxy } from '../../shared'

export const proSwitchProps = {
  ...switchProps,
  checkedText: [String, Number] as PropType<string | number>,
  uncheckedText: [String, Number] as PropType<string | number>,
  icon: [Object, Function] as PropType<Component>,
  checkedIcon: [Object, Function] as PropType<Component>,
  uncheckedIcon: [Object, Function] as PropType<Component>,
} as const

export type ProSwitchProps = ExtractPublicPropTypes<typeof proSwitchProps>
export type ProSwitchSlots = SwitchSlots

export default defineComponent({
  name: 'ProSwitch',
  props: proSwitchProps,
  slots: Object as SlotsType<ProSwitchSlots>,
  setup(props, { slots, expose }) {
    const switchRef = ref<InstanceType<typeof NSwitch> | null>(null)
    const nativeProps = computed(() =>
      pickProps(props as Record<string, unknown>, Object.keys(switchProps)),
    )

    expose(useExposeProxy(switchRef))

    return () => (
      <NSwitch ref={switchRef} {...nativeProps.value}>
        {{
          'checked': slots.checked ?? createTextSlot(props.checkedText),
          'unchecked': slots.unchecked ?? createTextSlot(props.uncheckedText),
          'icon': slots.icon ?? createIconSlot(props.icon),
          'checked-icon': slots['checked-icon'] ?? createIconSlot(props.checkedIcon),
          'unchecked-icon': slots['unchecked-icon'] ?? createIconSlot(props.uncheckedIcon),
          ...slots,
        }}
      </NSwitch>
    )
  },
})
