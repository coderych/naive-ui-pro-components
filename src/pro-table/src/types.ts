import type {
  CascaderProps,
  DataTableColumn,
  DataTableInst,
  DataTableProps,
  DataTableSlots,
  DataTableSortState,
  DatePickerProps,
  FormProps,
  InputNumberProps,
  InputProps,
  PaginationProps,
  SelectProps,
  TreeSelectProps,
} from 'naive-ui'
import type { Component, ExtractPropTypes, ExtractPublicPropTypes, PropType, VNodeChild } from 'vue'
import type { ProCheckboxGroupProps } from '../../pro-checkbox-group'
import type { ProRadioGroupProps } from '../../pro-radio-group'
import type { ProSwitchProps } from '../../pro-switch'
import { dataTableProps } from 'naive-ui'

export type ProTableRecord = Record<string, unknown>

export interface ProTableSearchComponentPropsMap {
  'cascader': CascaderProps
  'checkbox': ProCheckboxGroupProps
  'checkbox-group': ProCheckboxGroupProps
  'date': DatePickerProps
  'date-picker': DatePickerProps
  'input': InputProps
  'number': InputNumberProps
  'input-number': InputNumberProps
  'render': InputProps
  'radio': ProRadioGroupProps
  'radio-group': ProRadioGroupProps
  'select': SelectProps
  'switch': ProSwitchProps
  'tree-select': TreeSelectProps
}

export type ProTableSearchComponent = keyof ProTableSearchComponentPropsMap

export interface ProTableSearchOptionBase {
  enabled?: boolean
  key?: string
  label?: string
  onUpdate?: (value: unknown, params: Record<string, unknown>) => boolean | void
  render?: (props: Record<string, unknown>, params: Record<string, unknown>) => VNodeChild
  slots?: Record<string, (...args: unknown[]) => VNodeChild>
  sort?: number
  span?: number
  disabled?: boolean
  clearable?: boolean
}

type ProTableComponentSearchOption = {
  [Key in ProTableSearchComponent]: ProTableSearchOptionBase
    & Omit<ProTableSearchComponentPropsMap[Key], keyof ProTableSearchOptionBase>
    & {
      component: Key
      props?: ProTableSearchComponentPropsMap[Key]
    }
}[ProTableSearchComponent]

type ProTableDefaultSearchOption = ProTableSearchOptionBase
  & Omit<InputProps, keyof ProTableSearchOptionBase>
  & {
    component?: 'input'
    props?: InputProps
  }

type ProTableCustomSearchOption = ProTableSearchOptionBase
  & Record<string, unknown>
  & {
    component: Component
    props?: Record<string, unknown>
  }

export type ProTableSearchOption
  = | ProTableComponentSearchOption
    | ProTableDefaultSearchOption
    | ProTableCustomSearchOption

export type ProTableColumn<T = ProTableRecord> = DataTableColumn<T> & {
  enabled?: boolean
  key?: string | number
  search?: boolean | ProTableSearchOption
  show?: boolean
  sort?: number
  title?: string
}

export type ProTableInternalColumn = ProTableColumn<never>

export interface ProTablePageFields {
  page: string
  pageSize: string
}

export interface ProTableOption {
  full?: boolean
  reload?: boolean
  search?: boolean
  setting?: boolean
  size?: boolean
  tableHeader?: boolean
  manualSearch?: boolean
}

export const DEFAULT_PRO_TABLE_OPTION: Readonly<Required<ProTableOption>> = {
  full: true,
  reload: true,
  search: true,
  setting: true,
  size: true,
  tableHeader: true,
  manualSearch: false,
}

export interface ProTableBatchAction {
  /** 唯一标识 */
  key: string
  /** 按钮文本 */
  label: string
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  /** 图标组件 */
  icon?: Component
  /** 点击回调，接收已选行的 key 和数据 */
  onClick: (keys: (string | number)[], rows: ProTableRecord[]) => void
}

export interface ProTableRequestResult<T = ProTableRecord> {
  data: T[]
  total: number
}

export type ProTableRequest<T = ProTableRecord> = (params: Record<string, unknown>) => Promise<ProTableRequestResult<T>>

export interface ProTableFormSlotProps<T = ProTableRecord> {
  column: ProTableColumn<T>
  key: string
  option: ProTableSearchOption
  params: Record<string, unknown>
  value: unknown
}

export const proTableProps = {
  ...dataTableProps,
  columns: {
    type: Array as PropType<ProTableColumn<never>[]>,
    default: () => [],
  },
  data: {
    type: Array as PropType<ProTableRecord[]>,
    default: () => [],
  },
  batchActions: {
    type: Array as PropType<ProTableBatchAction[]>,
    default: () => [],
  },
  checkedRowKeys: {
    type: Array as PropType<(string | number)[]>,
    default: undefined,
  },
  defaultParams: {
    type: Object as PropType<Record<string, unknown>>,
    default: () => ({}),
  },
  formProps: {
    type: Object as PropType<FormProps>,
    default: () => ({}),
  },
  manual: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  onRequestError: {
    type: Function as PropType<(error: unknown) => void>,
    default: undefined,
  },
  rowKey: {
    type: Function as PropType<DataTableProps['rowKey']>,
    default: (row: ProTableRecord) => row.id,
  },
  option: {
    type: [Boolean, Object] as PropType<false | ProTableOption>,
    default: () => ({ ...DEFAULT_PRO_TABLE_OPTION }),
  },
  pageFields: {
    type: Object as PropType<ProTablePageFields>,
    default: () => ({ page: 'current', pageSize: 'size' }),
  },
  pagination: {
    type: [Boolean, Object] as PropType<false | PaginationProps>,
    default: () => ({}),
  },
  renderCell: {
    type: Function as PropType<DataTableProps['renderCell']>,
    default: (value: unknown) => value ?? '-',
  },
  request: {
    type: Function as PropType<ProTableRequest>,
    default: undefined,
  },
  searchDebounce: {
    type: Number,
    default: 300,
  },
  title: {
    type: String,
    default: undefined,
  },
  showIndex: {
    type: Boolean,
    default: true,
  },
  continuousIndex: {
    type: Boolean,
    default: true,
  },
} as const

export type ProTableSetupProps = ExtractPropTypes<typeof proTableProps>
export type ProTableProps = ExtractPublicPropTypes<typeof proTableProps>

export interface ProTableSelectionSlotProps<T = ProTableRecord> {
  keys: (string | number)[]
  rows: T[]
}

export type ProTableHeaderSlotProps<T = ProTableRecord> = ProTableSelectionSlotProps<T>
export type ProTableBatchActionsSlotProps<T = ProTableRecord> = ProTableSelectionSlotProps<T>

export type ProTableSlots = Omit<DataTableSlots, 'default'> & {
  'default'?: (props: Readonly<ProTableSetupProps>) => VNodeChild
  'form'?: (props: ProTableFormSlotProps) => VNodeChild
  'header'?: (props: ProTableHeaderSlotProps) => VNodeChild
  'header-extra'?: (props: ProTableHeaderSlotProps) => VNodeChild
  'title'?: (props: ProTableHeaderSlotProps) => VNodeChild
  'batch-actions'?: (props: ProTableBatchActionsSlotProps) => VNodeChild
}

export interface ProTableApi<T = ProTableRecord> {
  readonly data: T[]
  readonly index: number
  readonly params: Record<string, unknown>
  reload: () => Promise<ProTableRequestResult<T> | undefined>
  request: (params?: Record<string, unknown>) => Promise<ProTableRequestResult<T> | undefined>
  reset: () => Promise<ProTableRequestResult<T> | undefined>
  search: (params?: Record<string, unknown>) => Promise<ProTableRequestResult<T> | undefined>
  setParams: (params: Record<string, unknown>) => void
  updateParams: (params: Record<string, unknown>) => void
}

export type ProTableInst<T = ProTableRecord> = ProTableApi<T> & DataTableInst

export type ProTableSorter = DataTableSortState | DataTableSortState[] | null
export type ProTablePagination = DataTableProps['pagination']
