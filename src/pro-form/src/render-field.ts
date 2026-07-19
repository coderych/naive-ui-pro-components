import type { Component, VNode } from 'vue'
import type { ProFormColumn, ProFormComponentName, ProFormFieldContext, ProFormFieldSlot } from './types'
import * as NaiveUi from 'naive-ui'
import { Fragment, h } from 'vue'
import { ProCheckboxGroup } from '../../pro-checkbox-group'
import { ProRadioGroup } from '../../pro-radio-group'
import { ProSwitch } from '../../pro-switch'

const FORM_COMPONENTS: Record<ProFormComponentName, Component> = {
  'auto-complete': NaiveUi.NAutoComplete,
  'cascader': NaiveUi.NCascader,
  'checkbox': NaiveUi.NCheckbox,
  'checkbox-group': ProCheckboxGroup,
  'color-picker': NaiveUi.NColorPicker,
  'date-picker': NaiveUi.NDatePicker,
  'dynamic-input': NaiveUi.NDynamicInput,
  'dynamic-tags': NaiveUi.NDynamicTags,
  'input': NaiveUi.NInput,
  'input-number': NaiveUi.NInputNumber,
  'input-otp': NaiveUi.NInputOtp,
  'mention': NaiveUi.NMention,
  'radio': NaiveUi.NRadio,
  'radio-button': NaiveUi.NRadioButton,
  'radio-group': ProRadioGroup,
  'rate': NaiveUi.NRate,
  'select': NaiveUi.NSelect,
  'slider': NaiveUi.NSlider,
  'switch': ProSwitch,
  'time-picker': NaiveUi.NTimePicker,
  'transfer': NaiveUi.NTransfer,
  'tree-select': NaiveUi.NTreeSelect,
  'upload': NaiveUi.NUpload,
}

const CHECKED_COMPONENTS = new Set<ProFormComponentName>([
  'checkbox',
  'radio',
  'radio-button',
])

interface ModelBinding {
  event: string
  prop: string
}

interface PreparedField {
  component: Component
  props: Record<string, unknown>
  slots: Record<string, ProFormFieldSlot | undefined>
}

/** Render a form field, preserving native props, events and slots. */
export function renderFormField(column: ProFormColumn, context: ProFormFieldContext): VNode {
  const col = column as any
  if (col.render) {
    return h(Fragment, null, [col.render(context)])
  }

  const preparedField = prepareField(column, context)
  return h(preparedField.component, preparedField.props, preparedField.slots)
}

function prepareField(column: ProFormColumn, context: ProFormFieldContext): PreparedField {
  const col = column as any
  const component = resolveComponent(col.component)
  const componentProps = { ...col.componentProps }
  const slots = prepareSlots(col, componentProps)
  const props = bindModel(col, context, componentProps)
  return { component, props, slots }
}

function resolveComponent(component: any): Component {
  if (!component || component === 'none') {
    return NaiveUi.NInput
  }
  if (typeof component !== 'string') {
    return component
  }
  return FORM_COMPONENTS[component as ProFormComponentName] ?? NaiveUi.NInput
}

function bindModel(
  column: any,
  context: ProFormFieldContext,
  componentProps: Record<string, unknown>,
): Record<string, unknown> {
  const binding = resolveModelBinding(column)
  if (!binding) {
    return componentProps
  }

  const externalHandler = componentProps[binding.event] as any
  return {
    ...componentProps,
    [binding.prop]: context.value,
    [binding.event]: (...args: unknown[]) => {
      context.updateValue(args[0])
      if (typeof externalHandler === 'function') {
        externalHandler(...args)
      }
      else if (Array.isArray(externalHandler)) {
        externalHandler.forEach((fn: any) => fn?.(...args))
      }
    },
  }
}

function resolveModelBinding(column: any): ModelBinding | null {
  if (column.modelProp === false) {
    return null
  }
  if (column.modelProp) {
    return { prop: column.modelProp, event: column.modelEvent ?? `onUpdate:${column.modelProp}` }
  }
  if (column.component === 'upload') {
    return { prop: 'fileList', event: column.modelEvent ?? 'onUpdate:fileList' }
  }
  if (typeof column.component === 'string'
    && column.component !== 'none'
    && CHECKED_COMPONENTS.has(column.component)) {
    return { prop: 'checked', event: column.modelEvent ?? 'onUpdate:checked' }
  }
  return { prop: 'value', event: column.modelEvent ?? 'onUpdate:value' }
}

function prepareSlots(
  column: any,
  componentProps: Record<string, unknown>,
): Record<string, ProFormFieldSlot | undefined> {
  const slots = { ...column.slots }
  if (!slots.default && isChoiceGroup(column.component)) {
    componentProps.options = normalizeOptions(componentProps.options)
  }
  return slots
}

function isChoiceGroup(component: any): boolean {
  return component === 'checkbox-group' || component === 'radio-group'
}

function normalizeOptions(options: unknown): Record<string, unknown>[] {
  if (!Array.isArray(options)) {
    return []
  }
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      return { ...option }
    }
    return { label: String(option), value: option }
  })
}
