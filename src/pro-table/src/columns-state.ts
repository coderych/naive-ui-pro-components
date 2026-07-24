import type { ComputedRef, Ref } from 'vue'
import type { ProTableSetupProps } from './types'
import { computed, ref, watch } from 'vue'
import { useProLocale } from '../../config-provider'
import { getColumnTitle } from '../../shared'

export type ProTableColumnKey = string | number
export type ProTableColumnFixed = 'left' | 'right' | undefined

export interface ProTableColumnOption {
  fixed: ProTableColumnFixed
  key: ProTableColumnKey
  label: string
}

export interface ProTableColumnsOptions {
  hasSelection: ComputedRef<boolean>
  indexOffset: Ref<number>
}

const SELECTION_COLUMN_KEY = '__npro_selection__'
const INDEX_COLUMN_KEY = '__npro_index__'

export function useProTableColumns(
  props: ProTableSetupProps,
  options: ProTableColumnsOptions,
) {
  const locale = useProLocale()
  const columnOrder = ref<ProTableColumnKey[]>([])
  const fixedColumns = ref(new Map<ProTableColumnKey, ProTableColumnFixed>())
  const visibleKeys = ref<ProTableColumnKey[]>([])

  const sourceColumns = computed(() => {
    const columns = props.columns.map((column: any) =>
      column.type === 'selection'
        ? normalizeSelectionColumn(column, locale('selectionColumn'))
        : column,
    )
    if (options.hasSelection.value && !columns.some((column: any) => column.type === 'selection')) {
      columns.unshift(createSelectionColumn(locale('selectionColumn')))
    }
    if (props.showIndex && !columns.some((column: any) => column.key === INDEX_COLUMN_KEY)) {
      columns.splice(findIndexColumnPosition(columns), 0, createIndexColumn(
        locale('indexColumn'),
        options.indexOffset,
        props,
      ))
    }
    return columns
  })

  const enabledColumns = computed(() =>
    sourceColumns.value
      .filter((col: any) => col.enabled !== false)
      .slice()
      .sort((a: any, b: any) => (a.sort ?? 10) - (b.sort ?? 10)),
  )

  const orderedColumns = computed(() =>
    orderColumns(enabledColumns.value, columnOrder.value),
  )

  const columnOptions = computed(() =>
    orderedColumns.value.flatMap((column: any) =>
      toColumnOption(column, fixedColumns.value),
    ),
  )

  const columns = computed(() =>
    orderedColumns.value
      .filter((column: any) => {
        const key = getStateColumnKey(column)
        return key === undefined || visibleKeys.value.includes(key)
      })
      .map((column: any) => {
        const key = getStateColumnKey(column)
        if (key === undefined)
          return column
        return { ...column, fixed: fixedColumns.value.get(key) }
      }),
  )

  function resetColumns(): void {
    const keyedColumns = enabledColumns.value.flatMap((col: any) => toKeyedColumn(col))
    columnOrder.value = keyedColumns.map((item: any) => item.key)
    visibleKeys.value = keyedColumns
      .filter((item: any) => item.column.show !== false)
      .map((item: any) => item.key)
    fixedColumns.value = new Map(
      keyedColumns.map((item: any) => [item.key, getInitialFixed(item.column)]),
    )
  }

  function setVisibleKeys(keys: ProTableColumnKey[]): void {
    const allowedKeys = new Set(columnOptions.value.map((item: any) => item.key))
    visibleKeys.value = keys.filter(key => allowedKeys.has(key))
  }

  function setColumnOrder(keys: ProTableColumnKey[]): void {
    const allowedKeys = columnOptions.value.map((item: any) => item.key)
    const requestedKeys = keys.filter(key => allowedKeys.includes(key))
    columnOrder.value = [
      ...requestedKeys,
      ...allowedKeys.filter((key: any) => !requestedKeys.includes(key)),
    ]
  }

  function setColumnFixed(
    key: ProTableColumnKey,
    fixed: ProTableColumnFixed,
  ): void {
    if (!columnOptions.value.some((item: any) => item.key === key)) {
      return
    }
    fixedColumns.value = new Map(fixedColumns.value).set(key, fixed)
  }

  watch(sourceColumns, resetColumns, { deep: true, immediate: true })

  return {
    columnOptions,
    columns,
    resetColumns,
    setColumnFixed,
    setColumnOrder,
    setVisibleKeys,
    visibleKeys,
  }
}

function createSelectionColumn(label: string) {
  return normalizeSelectionColumn({ type: 'selection' }, label)
}

function normalizeSelectionColumn(column: any, label: string) {
  return {
    key: SELECTION_COLUMN_KEY,
    title: label,
    ...column,
  }
}

function findIndexColumnPosition(columns: any[]): number {
  return columns[0]?.type === 'selection' ? 1 : 0
}

function createIndexColumn(
  title: string,
  indexOffset: Ref<number>,
  props: ProTableSetupProps,
) {
  return {
    key: INDEX_COLUMN_KEY,
    title,
    width: 64,
    align: 'center' as const,
    render: (_row: unknown, rowIndex: number) =>
      rowIndex + 1 + (props.continuousIndex ? indexOffset.value : 0),
  }
}

function toKeyedColumn(column: any): Array<{ column: any, key: ProTableColumnKey }> {
  const key = getStateColumnKey(column)
  return key === undefined ? [] : [{ column, key }]
}

function orderColumns(columns: any[], order: ProTableColumnKey[]): any[] {
  const keyedColumns = new Map(
    columns.flatMap(toKeyedColumn).map((item: any) => [item.key, item.column]),
  )
  const orderedResult = order.flatMap(key =>
    keyedColumns.has(key) ? [keyedColumns.get(key)!] : [],
  )
  const remainingColumns = columns.filter((column: any) => {
    const key = getStateColumnKey(column)
    return key !== undefined && !order.includes(key)
  })
  const sortedColumns = [...orderedResult, ...remainingColumns]
  let sortedIndex = 0
  return columns.map((column: any) => {
    if (getStateColumnKey(column) === undefined) {
      return column
    }
    return sortedColumns[sortedIndex++] ?? column
  })
}

function toColumnOption(
  column: any,
  fixedCols: Map<ProTableColumnKey, ProTableColumnFixed>,
): ProTableColumnOption[] {
  const key = getStateColumnKey(column)
  if (key === undefined) {
    return []
  }
  return [{
    fixed: fixedCols.get(key),
    key,
    label: getColumnTitle(column as any, String(key)),
  }]
}

function getStateColumnKey(column: any): ProTableColumnKey | undefined {
  const key = column.key ?? column.dataIndex
  return typeof key === 'string' || typeof key === 'number' ? key : undefined
}

function getInitialFixed(column: any): ProTableColumnFixed {
  if (!('fixed' in column)) {
    return undefined
  }
  if (column.fixed === 'left' || column.fixed === 'right') {
    return column.fixed
  }
  return undefined
}
