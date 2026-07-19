import type { Component, Slots, VNode } from 'vue'
import type { ProTableFormSlotProps, ProTableSearchComponent, ProTableSearchOption } from './types'
import {
  NCascader,
  NDatePicker,
  NInput,
  NInputNumber,
  NSelect,
  NTreeSelect,
} from 'naive-ui'
import { h } from 'vue'
import { useProLocale } from '../../config-provider'
import { ProCheckboxGroup } from '../../pro-checkbox-group'
import { ProRadioGroup } from '../../pro-radio-group'
import { ProSwitch } from '../../pro-switch'
import { invokeHandlers } from '../../shared'

const componentMap: Record<ProTableSearchComponent, Component> = {
  'cascader': NCascader,
  'checkbox': ProCheckboxGroup,
  'checkbox-group': ProCheckboxGroup,
  'date': NDatePicker,
  'date-picker': NDatePicker,
  'input': NInput,
  'number': NInputNumber,
  'input-number': NInputNumber,
  'render': NInput,
  'radio': ProRadioGroup,
  'radio-group': ProRadioGroup,
  'select': NSelect,
  'switch': ProSwitch,
  'tree-select': NTreeSelect,
}

const configurationKeys = new Set([
  'component',
  'enabled',
  'key',
  'label',
  'onUpdate',
  'props',
  'render',
  'slots',
  'sort',
  'span',
])

/** 将搜索项渲染为受控的 Naive UI 字段。 */
export function renderSearchField(
  slotProps: ProTableFormSlotProps<never>,
  onUpdate: (value: unknown) => void,
): VNode {
  const { option } = slotProps
  const fieldProps = createFieldProps(slotProps, onUpdate)
  if (option.render) {
    return h({ render: () => option.render?.(fieldProps, slotProps.params) })
  }

  const component = resolveSearchComponent(option.component)
  return h(component, fieldProps, option.slots as Slots | undefined)
}

function resolveSearchComponent(component?: Component | ProTableSearchComponent) {
  if (!component) {
    return NInput
  }
  return typeof component === 'string' ? componentMap[component] : component
}

function createFieldProps(
  slotProps: ProTableFormSlotProps<never>,
  onUpdate: (value: unknown) => void,
) {
  const { option, value } = slotProps
  const customProps = resolveSearchFieldProps(option)
  const userUpdate = customProps['onUpdate:value']
  return {
    ...getFieldDefaults(option.component, option.label),
    ...customProps,
    'value': value,
    'onUpdate:value': (nextValue: unknown) => {
      onUpdate(nextValue)
      option.onUpdate?.(nextValue, {
        ...slotProps.params,
        [slotProps.key]: nextValue,
      })
      invokeHandlers(userUpdate as any, nextValue)
    },
  }
}

export function resolveSearchFieldProps(option: ProTableSearchOption): Record<string, unknown> {
  return { ...getFlatFieldProps(option), ...option.props }
}

function getFlatFieldProps(option: ProTableSearchOption): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(option).filter(([key]) => !configurationKeys.has(key)),
  )
}

function getFieldDefaults(
  component: Component | ProTableSearchComponent | undefined,
  label: string | undefined,
) {
  if (component === 'switch' || (component !== undefined && typeof component !== 'string')) {
    return {}
  }
  const locale = useProLocale()
  const placeholder = label
    ? locale('inputPlaceholder').replace('{label}', label)
    : undefined
  return { clearable: true, placeholder }
}
