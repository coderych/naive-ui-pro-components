import type { ButtonProps, SelectInst, SelectSlots } from 'naive-ui'
import type {
  ComponentPublicInstance,
  ExtractPublicPropTypes,
  PropType,
  VNodeChild,
} from 'vue'
import type { ProPopupProps, ProPopupSlots } from '../../pro-popup'
import type {
  ProTableInst,
  ProTablePageFields,
  ProTableProps,
  ProTableSlots,
} from '../../pro-table'
import { omit } from 'lodash-es'
import { selectProps } from 'naive-ui'

export type ProSelectKey = string | number
export type ProSelectRecord = Record<string, any>
export type ProSelectMode = 'dropdown' | 'popup'
export type ProSelectModelValue = ProSelectKey | ProSelectKey[] | null
export type ProSelectSelectedKeys = ProSelectModelValue
export type ProSelectSelectedRows<T = ProSelectRecord> = T | T[] | null
export type ProSelectRequestContext = 'dropdown' | 'hydrate' | 'popup'

export interface ProSelectRequestResult<T = ProSelectRecord> {
  data: T[]
  total: number
}

export type ProSelectRequest<T = ProSelectRecord> = (
  params: Record<string, unknown>,
  selectedKeys?: ProSelectSelectedKeys,
  selectedRows?: ProSelectSelectedRows<T>,
) => Promise<ProSelectRequestResult<T>>

const inheritedSelectProps = omit(selectProps, [
  'value',
  'options',
  'onUpdate:value',
  'onUpdateValue',
  'onChange',
])

export const proSelectProps = {
  ...inheritedSelectProps,
  modelValue: {
    type: [String, Number, Array] as PropType<ProSelectModelValue>,
    default: undefined,
  },
  options: {
    type: Array as PropType<ProSelectRecord[]>,
    default: () => [],
  },
  request: {
    type: Function as PropType<ProSelectRequest>,
    default: undefined,
  },
  mode: {
    type: String as PropType<ProSelectMode>,
    default: 'dropdown',
  },
  requestParams: {
    type: Object as PropType<Record<string, unknown>>,
    default: () => ({}),
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  pageFields: {
    type: Object as PropType<ProTablePageFields>,
    default: () => ({ page: 'current', pageSize: 'size' }),
  },
  searchField: {
    type: String,
    default: 'keyword',
  },
  searchDebounce: {
    type: Number,
    default: 300,
  },
  popupProps: {
    type: Object as PropType<ProPopupProps>,
    default: () => ({}),
  },
  tableProps: {
    type: Object as PropType<ProTableProps>,
    default: () => ({}),
  },
  buttonText: {
    type: String,
    default: undefined,
  },
  buttonProps: {
    type: Object as PropType<ButtonProps>,
    default: () => ({}),
  },
  resetMenuOnOptionsChange: {
    type: Boolean,
    default: false,
  },
} as const

export type ProSelectProps = ExtractPublicPropTypes<typeof proSelectProps>

type PrefixedSlots<Slots, Prefix extends string> = {
  [Key in keyof Slots as Key extends string ? `${Prefix}${Key}` : never]?: Slots[Key]
}

export interface ProSelectButtonSlotProps {
  disabled: boolean
  open: () => void
  text: string
}

export interface ProSelectPopupFooterSlotProps {
  cancel: () => void
  confirm: () => void
}

export type ProSelectSlots
  = & SelectSlots
    & PrefixedSlots<Omit<ProPopupSlots, 'default' | 'footer'>, 'popup-'>
    & PrefixedSlots<ProTableSlots, 'table-'>
    & {
      'button'?: (props: ProSelectButtonSlotProps) => VNodeChild
      'popup-footer'?: (props: ProSelectPopupFooterSlotProps) => VNodeChild
    }

export interface ProSelectInst<T = ProSelectRecord> extends SelectInst {
  readonly popup: ComponentPublicInstance | null
  readonly select: SelectInst | null
  readonly selectedKeys: ProSelectSelectedKeys
  readonly selectedRows: ProSelectSelectedRows<T>
  readonly table: ProTableInst<T> | null
}
