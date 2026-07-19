import type { DataTableInst, DataTableProps } from 'naive-ui'
import type { ComponentPublicInstance, Slot, SlotsType } from 'vue'
import type { ProTableBatchAction, ProTableInst, ProTableOption, ProTableRecord, ProTableSlots, ProTableSorter } from './types'
import { dataTableProps, NButton, NCard, NDataTable, NEl, NIcon, NScrollbar, NSpace, NText } from 'naive-ui'
import { computed, defineComponent, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { invokeHandlers, pickProps, runSafely, useExposeProxy } from '../../shared'
import { useProTableColumns } from './columns-state'
import QueryForm from './components/QueryForm'
import TableHeader from './components/TableHeader'
import { useProTableRequest } from './request-state'
import { mountProTableStyle } from './styles'
import { DEFAULT_PRO_TABLE_OPTION, proTableProps } from './types'

let fullscreenTableCount = 0
let previousBodyOverflow = ''
let previousRootOverflow = ''

function lockPageScroll(): void {
  if (typeof document === 'undefined')
    return
  if (fullscreenTableCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  }
  fullscreenTableCount++
}

function unlockPageScroll(): void {
  if (typeof document === 'undefined' || fullscreenTableCount === 0)
    return
  fullscreenTableCount--
  if (fullscreenTableCount === 0) {
    document.body.style.overflow = previousBodyOverflow
    document.documentElement.style.overflow = previousRootOverflow
  }
}

export { proTableProps } from './types'
export type {
  ProTableBatchAction,
  ProTableColumn,
  ProTableFormSlotProps,
  ProTableHeaderSlotProps,
  ProTableInst,
  ProTableOption,
  ProTablePagination,
  ProTableProps,
  ProTableRecord,
  ProTableRequest,
  ProTableRequestResult,
  ProTableSearchComponent,
  ProTableSearchOption,
  ProTableSelectionSlotProps,
  ProTableSorter,
} from './types'

export default defineComponent({
  name: 'ProTable',
  props: proTableProps,
  slots: Object as SlotsType<ProTableSlots>,
  emits: {
    'reset': () => true,
    'search': (_params: Record<string, unknown>) => true,
    'update:checkedRowKeys': (_keys: (string | number)[]) => true,
  },
  setup(props, { emit, slots, expose }) {
    mountProTableStyle()
    const tableRef = shallowRef<DataTableInst | null>(null)
    const tableRenderKey = ref(0)
    const full = ref(false)
    const size = ref<NonNullable<DataTableProps['size']>>(props.size ?? 'medium')
    const suppressSorterRequest = ref(false)
    const internalCheckedKeys = ref<(string | number)[]>(props.defaultCheckedRowKeys ?? [])

    const requestState = useProTableRequest(props)

    const checkedKeys = computed({
      get: () => props.checkedRowKeys ?? internalCheckedKeys.value,
      set: (keys: (string | number)[]) => {
        internalCheckedKeys.value = keys
        emit('update:checkedRowKeys', keys)
      },
    })

    const hasBatchActions = computed(() =>
      (props.batchActions && props.batchActions.length > 0) || !!slots['batch-actions'],
    )
    const columnsState = useProTableColumns(props, {
      hasBatchActions,
      indexOffset: requestState.index,
    })

    const selectedRows = computed(() => {
      if (!props.rowKey)
        return []
      const data = requestState.data.value
      const keys = new Set(checkedKeys.value)
      return data.filter((row: ProTableRecord) => {
        const key = typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey as string]
        return keys.has(key as string | number)
      })
    })

    const option = computed(() =>
      props.option === false ? false : { ...DEFAULT_PRO_TABLE_OPTION, ...props.option },
    )

    watch(() => props.size, (nextSize) => {
      if (nextSize)
        size.value = nextSize
    })

    watch(full, (isFull) => {
      if (isFull)
        lockPageScroll()
      else
        unlockPageScroll()
    })

    let searchTimer: ReturnType<typeof setTimeout> | null = null
    function searchFromForm() {
      if (searchTimer)
        clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        runSafely(search())
      }, props.searchDebounce)
    }
    onBeforeUnmount(() => {
      if (searchTimer)
        clearTimeout(searchTimer)
      if (full.value)
        unlockPageScroll()
    })

    function handleQueryUpdate(params: Record<string, unknown>) {
      requestState.setParams(params)
    }
    function handleQueryChange() {
      if (option.value !== false && option.value.manualSearch !== true)
        searchFromForm()
    }
    function handleUpdatePage(page: number) {
      requestState.updatePage(page)
      invokeHandlers(props['onUpdate:page'] as any, page)
    }
    function handleUpdatePageSize(pageSize: number) {
      requestState.updatePageSize(pageSize)
      invokeHandlers(props['onUpdate:pageSize'] as any, pageSize)
    }
    function handleUpdateSorter(sorterVal: ProTableSorter) {
      if (!suppressSorterRequest.value)
        requestState.updateSorter(sorterVal)
      invokeHandlers(props['onUpdate:sorter'] as any, sorterVal)
    }
    function handleBatchAction(action: ProTableBatchAction) {
      action.onClick(checkedKeys.value, selectedRows.value)
    }

    function request(extra?: Record<string, unknown>) {
      return requestState.request(extra)
    }
    function search(nextParams?: Record<string, unknown>) {
      const pendingRequest = requestState.search(nextParams)
      emit('search', { ...requestState.params.value })
      return pendingRequest
    }
    async function reset(nextParams?: Record<string, unknown>) {
      suppressSorterRequest.value = true
      try {
        tableRef.value?.clearSorter()
        await nextTick()
      }
      finally {
        suppressSorterRequest.value = false
      }
      emit('reset')
      return requestState.reset(nextParams)
    }
    async function reload() {
      if (props.request)
        return requestState.reload()
      tableRenderKey.value++
      await nextTick()
      return undefined
    }
    function setParams(params: Record<string, unknown>) {
      requestState.setParams(params)
    }
    function updateParams(params: Record<string, unknown>) {
      requestState.updateParams(params)
    }

    function changeRef(exposed: Element | ComponentPublicInstance | null): void {
      tableRef.value = exposed as DataTableInst | null
    }

    const tableApi = {
      get data() { return requestState.data.value },
      get index() { return requestState.index.value },
      get params() { return requestState.params.value },
      reload,
      request,
      reset,
      search,
      setParams,
      updateParams,
    }
    expose(useExposeProxy(tableRef, tableApi) as ProTableInst)

    return () => {
      const showSearch = option.value !== false && option.value.search !== false
      const showTableHeader = option.value !== false && option.value.tableHeader !== false
      const dtProps: Record<string, unknown> = {
        ...pickProps(props as any, Object.keys(dataTableProps)),
        'key': tableRenderKey.value,
        'ref': changeRef,
        'columns': columnsState.columns.value,
        'data': requestState.data.value,
        'loading': requestState.loading.value,
        'pagination': requestState.pagination.value,
        'remote': requestState.remote.value,
        'scrollX': props.scrollX,
        'size': size.value,
        'onUpdate:page': handleUpdatePage as any,
        'onUpdate:pageSize': handleUpdatePageSize as any,
        'onUpdate:sorter': handleUpdateSorter as any,
      }
      if (hasBatchActions.value) {
        dtProps.checkedRowKeys = checkedKeys.value
        dtProps['onUpdate:checkedRowKeys'] = (keys: (string | number)[]) => {
          checkedKeys.value = keys
        }
        dtProps.rowKey = props.rowKey
      }

      const reservedSlots = new Set(['default', 'form', 'header', 'header-extra', 'title', 'batch-actions'])
      const dtSlots = Object.fromEntries(
        Object.entries(slots).filter(([k, v]) => !reservedSlots.has(k) && !!v),
      ) as Record<string, Slot>
      const selectionSlotProps = {
        keys: checkedKeys.value,
        rows: selectedRows.value,
      }

      const content = (
        <div class="npro-table__content">
          {showSearch && (
            <QueryForm
              columns={props.columns}
              defaultParams={props.defaultParams}
              formProps={props.formProps}
              loading={requestState.loading.value}
              modelValue={requestState.params.value}
              option={option.value as ProTableOption}
              onChange={handleQueryChange}
              onReset={(params: Record<string, unknown>) => runSafely(reset(params))}
              onSearch={() => runSafely(search())}
              onUpdate:modelValue={handleQueryUpdate}
              v-slots={slots.form ? { default: slots.form } : {}}
            />
          )}

          <NCard class="npro-table__card" size="small">
            {showTableHeader && (slots.header
              ? slots.header(selectionSlotProps)
              : (
                  <TableHeader
                    columnOptions={columnsState.columnOptions.value}
                    full={full.value}
                    loading={requestState.loading.value}
                    option={option.value as ProTableOption}
                    size={size.value}
                    visibleKeys={columnsState.visibleKeys.value}
                    onReload={() => runSafely(reload())}
                    onResetColumns={columnsState.resetColumns}
                    onUpdate:columnFixed={columnsState.setColumnFixed}
                    onUpdate:columnOrder={columnsState.setColumnOrder}
                    onUpdate:full={(value: boolean) => {
                      full.value = value
                    }}
                    onUpdate:size={(value: NonNullable<DataTableProps['size']>) => {
                      size.value = value
                    }}
                    onUpdate:visibleKeys={columnsState.setVisibleKeys}
                  >
                    {{
                      extra: slots['header-extra']
                        ? () => slots['header-extra']!(selectionSlotProps)
                        : undefined,
                      title: slots.title
                        ? () => slots.title!(selectionSlotProps)
                        : undefined,
                    }}
                  </TableHeader>
                ))}

            {hasBatchActions.value && checkedKeys.value.length > 0 && (
              <div class="npro-table__batch-bar">
                {slots['batch-actions']
                  ? slots['batch-actions'](selectionSlotProps)
                  : (
                      <NSpace align="center">
                        <NText strong>
                          已选择
                          {checkedKeys.value.length}
                          {' '}
                          项
                        </NText>
                        {props.batchActions?.map((action: ProTableBatchAction) => (
                          <NButton
                            key={action.key}
                            type={action.type ?? 'default'}
                            size="small"
                            loading={action.loading}
                            disabled={action.disabled}
                            onClick={() => handleBatchAction(action)}
                          >
                            {{
                              default: () => action.label,
                              icon: action.icon ? () => <NIcon component={action.icon} /> : undefined,
                            }}
                          </NButton>
                        ))}
                      </NSpace>
                    )}
              </div>
            )}

            {slots.default
              ? slots.default(props as any)
              : <NDataTable {...dtProps}>{dtSlots}</NDataTable>}
          </NCard>
        </div>
      )

      return (
        <NEl class={['npro-table', { 'npro-table--full': full.value }]}>
          {full.value
            ? <NScrollbar class="npro-table__fullscreen-scrollbar">{content}</NScrollbar>
            : content}
        </NEl>
      )
    }
  },
})
