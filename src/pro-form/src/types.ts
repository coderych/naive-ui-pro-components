import type {
  AutoCompleteProps,
  CascaderProps,
  CheckboxProps,
  ColorPickerProps,
  DatePickerProps,
  DynamicInputProps,
  DynamicTagsProps,
  FormItemProps,
  FormItemRule,
  GridItemProps,
  InputNumberProps,
  InputOtpProps,
  InputProps,
  MentionProps,
  RadioProps,
  RateProps,
  SelectProps,
  SliderProps,
  TimePickerProps,
  TransferProps,
  TreeSelectProps,
  UploadProps,
} from 'naive-ui'
import type { Component, ExtractPublicPropTypes, HTMLAttributes, PropType, VNodeChild } from 'vue'
import type { ProCheckboxGroupProps } from '../../pro-checkbox-group'
import type { ProRadioGroupProps } from '../../pro-radio-group'
import type { ProSwitchProps } from '../../pro-switch'
import { formProps, gridProps } from 'naive-ui'

type WithHtmlAttributes<Props> = Props & Pick<HTMLAttributes, 'class' | 'style'>

export interface ProFormComponentPropsMap {
  'auto-complete': WithHtmlAttributes<AutoCompleteProps>
  'cascader': WithHtmlAttributes<CascaderProps>
  'checkbox': WithHtmlAttributes<CheckboxProps>
  'checkbox-group': WithHtmlAttributes<ProCheckboxGroupProps>
  'color-picker': WithHtmlAttributes<ColorPickerProps>
  'date-picker': WithHtmlAttributes<DatePickerProps>
  'dynamic-input': WithHtmlAttributes<DynamicInputProps>
  'dynamic-tags': WithHtmlAttributes<DynamicTagsProps>
  'input': WithHtmlAttributes<InputProps>
  'input-number': WithHtmlAttributes<InputNumberProps>
  'input-otp': WithHtmlAttributes<InputOtpProps>
  'mention': WithHtmlAttributes<MentionProps>
  'radio': WithHtmlAttributes<RadioProps>
  'radio-button': WithHtmlAttributes<RadioProps>
  'radio-group': WithHtmlAttributes<ProRadioGroupProps>
  'rate': WithHtmlAttributes<RateProps>
  'select': WithHtmlAttributes<SelectProps>
  'slider': WithHtmlAttributes<SliderProps>
  'switch': WithHtmlAttributes<ProSwitchProps>
  'time-picker': WithHtmlAttributes<TimePickerProps>
  'transfer': WithHtmlAttributes<TransferProps>
  'tree-select': WithHtmlAttributes<TreeSelectProps>
  'upload': WithHtmlAttributes<UploadProps>
}

export type ProFormComponentName = keyof ProFormComponentPropsMap

export type ProFormFieldComponent = ProFormComponentName | 'none' | Component

export type ProFormFieldSlot = (props?: Record<string, unknown>) => VNodeChild

export interface ProFormFieldContext {
  column: ProFormColumn
  index: number
  model: object
  path: string
  updateValue: (value: unknown) => void
  value: unknown
  gridItemProps?: GridItemProps
  formItemProps?: FormItemProps
}

export type ProFormSlots = Record<string, (context: ProFormFieldContext) => VNodeChild>

export interface ProFormColumnBase {
  /** Field unique key; also used as model path when path is not set. */
  key: string
  /** Supports `profile.name` and `items[0].name`. */
  path?: string
  label?: string
  slots?: Record<string, ProFormFieldSlot | undefined>
  formItemProps?: FormItemProps
  formItemSlots?: Partial<Record<'feedback' | 'label', ProFormFieldSlot>>
  gridItemProps?: GridItemProps
  rule?: FormItemRule | FormItemRule[]
  enabled?: boolean
  sort?: number
  span?: GridItemProps['span']
  /** Custom model prop; set to false to disable auto model binding. */
  modelProp?: string | false
  /** Custom model update event, e.g. `onUpdate:modelValue`. */
  modelEvent?: string
  onUpdate?: (value: unknown, model: object) => void
  render?: (context: ProFormFieldContext) => VNodeChild
}

type ProFormComponentColumn = {
  [Key in ProFormComponentName]: ProFormColumnBase & {
    component: Key
    componentProps?: ProFormComponentPropsMap[Key]
  }
}[ProFormComponentName]

type ProFormDefaultColumn = ProFormColumnBase & {
  component?: 'input'
  componentProps?: InputProps
}

type ProFormNoneColumn = ProFormColumnBase & {
  component: 'none'
  componentProps?: never
}

export type ProFormCustomColumn<T extends Component = Component> = ProFormColumnBase & {
  component?: T
  componentProps?: Record<string, any> & Pick<HTMLAttributes, 'class' | 'style'>
}

export type ProFormColumn<T extends Component = Component<unknown>>
  = | ProFormComponentColumn
    | ProFormDefaultColumn
    | ProFormNoneColumn
    | ProFormCustomColumn<T>

/** Helper for type-safe custom component column definitions. */
export function defineProFormColumn<T extends Component>(column: ProFormCustomColumn<T>): ProFormCustomColumn<T> {
  return column
}

export const proFormProps = {
  ...formProps,
  ...gridProps,
  value: {
    type: Object as PropType<object>,
    default: () => ({}),
  },
  columns: {
    type: Array as PropType<ProFormColumn[]>,
    default: () => [],
  },
  itemResponsive: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  xGap: {
    type: Number as PropType<number>,
    default: 12,
  },
} as const

export type ProFormProps = ExtractPublicPropTypes<typeof proFormProps>
