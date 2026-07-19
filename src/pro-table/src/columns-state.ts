import type { ProTableSetupProps } from './types'
import { computed, ref, watch } from 'vue'
import { getColumnTitle } from '../../shared'

export type ProTableColumnKey = string | number
export type ProTableColumnFixed = 'left' | 'right' | undefined

export interface ProTableColumnOption {
  fixed: ProTableColumnFixed
  key: ProTableColumnKey
  label: string
}

export function useProTableColumns(props: ProTableSetupProps) {
  const columnOrder = ref<ProTableColumnKey[]>([])
  const fixedColumns = ref(new Map<ProTableColumnKey, ProTableColumnFixed>())
  const visibleKeys = ref<ProTableColumnKey[]>([])

  const enabledColumns = computed(() =>
    props.columns
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

  watch(() => props.columns, resetColumns, { deep: true, immediate: true })

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
