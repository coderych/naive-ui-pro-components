import type { SelectInst } from 'naive-ui'
import type { ComponentPublicInstance, Slot, SlotsType } from 'vue'
import type { ProTableInst } from '../../pro-table'
import type {
  ProSelectKey,
  ProSelectModelValue,
  ProSelectRecord,
  ProSelectRequestContext,
  ProSelectRequestResult,
  ProSelectSlots,
} from './types'
import { NButton, NInputGroup, NSelect, selectProps } from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { useProLocale } from '../../config-provider'
import { ProPopup } from '../../pro-popup'
import { ProTable } from '../../pro-table'
import { invokeHandlers, pickProps, runSafely, useExposeProxy } from '../../shared'
import {
  findRowsByKeys,
  getOptionKey,
  mergeOptions,
  normalizeKeys,
  toModelValue,
  toSelectedRows,
} from './options'
import { proSelectProps } from './types'

const SELECT_SLOT_NAMES = ['default', 'header', 'action', 'empty', 'arrow']

function normalizeResult(
  result: ProSelectRequestResult | undefined,
): ProSelectRequestResult {
  const data = Array.isArray(result?.data) ? result.data : []
  const parsedTotal = Number(result?.total)
  return {
    data,
    total: Number.isFinite(parsedTotal) ? Math.max(0, Math.trunc(parsedTotal)) : data.length,
  }
}

function prefixedSlots(
  slots: Record<string, Slot | undefined>,
  prefix: string,
): Record<string, Slot> {
  return Object.fromEntries(
    Object.entries(slots)
      .filter(([name, slot]) => name.startsWith(prefix) && !!slot)
      .map(([name, slot]) => [name.slice(prefix.length), slot as Slot]),
  )
}

export { proSelectProps } from './types'
export type {
  ProSelectInst,
  ProSelectMode,
  ProSelectProps,
  ProSelectRequest,
  ProSelectSlots,
} from './types'

export default defineComponent({
  name: 'ProSelect',
  inheritAttrs: false,
  props: proSelectProps,
  slots: Object as SlotsType<ProSelectSlots>,
  emits: {
    'change': (_keys: ProSelectModelValue, _rows: ProSelectRecord | ProSelectRecord[] | null) => true,
    'request-error': (_error: unknown, _context: ProSelectRequestContext) => true,
    'update:modelValue': (_value: ProSelectModelValue) => true,
  },
  setup(props, { attrs, emit, expose, slots }) {
    const locale = useProLocale()
    const forwardedSlots = slots as unknown as Record<string, Slot | undefined>
    const selectRef = shallowRef<SelectInst | null>(null)
    const tableRef = shallowRef<ProTableInst | null>(null)
    const popupRef = shallowRef<ComponentPublicInstance | null>(null)

    const internalValue = shallowRef<ProSelectModelValue>(
      (props.defaultValue as ProSelectModelValue | null) ?? (props.multiple ? [] : null),
    )
    const confirmedKeys = shallowRef<ProSelectKey[]>([])
    const confirmedRows = shallowRef<ProSelectRecord[]>([])
    const selectedOptions = shallowRef<ProSelectRecord[]>([])
    const listOptions = shallowRef<ProSelectRecord[]>([])
    const temporaryKeys = shallowRef<ProSelectKey[]>([])
    const temporaryRows = shallowRef<ProSelectRecord[]>([])

    const dropdownOpen = ref(false)
    const dropdownPage = ref(0)
    const dropdownTotal = ref(0)
    const dropdownKeyword = ref('')
    const dropdownInitialLoading = ref(false)
    const dropdownMoreLoading = ref(false)
    const hydrationLoading = ref(false)
    const popupVisible = ref(false)
    const popupSelectionDirty = ref(false)

    let dropdownRequestId = 0
    let hydrationRequestId = 0
    let popupRequestGeneration = 0
    let searchTimer: ReturnType<typeof setTimeout> | null = null

    const modelValue = computed(() =>
      props.modelValue === undefined ? internalValue.value : props.modelValue,
    )
    const displayOptions = computed(() => {
      const listed = mergeOptions(props.options, listOptions.value, props.valueField)
      return mergeOptions(listed, selectedOptions.value, props.valueField)
    })
    const selectLoading = computed(() =>
      props.loading
      || hydrationLoading.value
      || (props.mode === 'dropdown'
        && (dropdownInitialLoading.value || dropdownMoreLoading.value)),
    )
    const buttonText = computed(() => props.buttonText ?? locale('selectText'))
    const mergedDropdownOpen = computed(() => props.show ?? dropdownOpen.value)

    function requestSelection(keys = confirmedKeys.value, rows = confirmedRows.value) {
      return [
        toModelValue(keys, props.multiple),
        toSelectedRows(rows, props.multiple),
      ] as const
    }

    function reportRequestError(error: unknown, context: ProSelectRequestContext) {
      emit('request-error', error, context)
    }

    function syncTemporarySelection(): void {
      temporaryKeys.value = [...confirmedKeys.value]
      temporaryRows.value = [...confirmedRows.value]
    }

    function updateConfirmedRows(rows: ProSelectRecord[]): void {
      confirmedRows.value = findRowsByKeys(
        confirmedKeys.value,
        rows,
        props.valueField,
      )
      selectedOptions.value = [...confirmedRows.value]
      if (popupVisible.value && !popupSelectionDirty.value)
        syncTemporarySelection()
    }

    async function syncModelSelection(): Promise<void> {
      const requestId = ++hydrationRequestId
      const keys = normalizeKeys(modelValue.value, props.multiple)
      confirmedKeys.value = keys
      updateConfirmedRows(displayOptions.value)
      if (confirmedRows.value.length === keys.length || !props.request)
        return

      hydrationLoading.value = true
      try {
        const [selectedKeys, selectedRows] = requestSelection(keys, confirmedRows.value)
        const result = normalizeResult(
          await props.request({ ...props.requestParams }, selectedKeys, selectedRows),
        )
        if (requestId !== hydrationRequestId)
          return
        const selectedKeySet = new Set(keys)
        const hydratedRows = result.data.filter((row) => {
          const key = getOptionKey(row, props.valueField)
          return key !== undefined && selectedKeySet.has(key)
        })
        updateConfirmedRows(mergeOptions(confirmedRows.value, hydratedRows, props.valueField))
      }
      catch (error) {
        if (requestId === hydrationRequestId)
          reportRequestError(error, 'hydrate')
      }
      finally {
        if (requestId === hydrationRequestId)
          hydrationLoading.value = false
      }
    }

    watch(
      () => [modelValue.value, props.multiple, props.options, props.valueField],
      () => runSafely(syncModelSelection()),
      { deep: true, immediate: true },
    )

    function buildDropdownParams(page: number): Record<string, unknown> {
      return {
        ...props.requestParams,
        [props.searchField]: dropdownKeyword.value,
        [props.pageFields.page]: page,
        [props.pageFields.pageSize]: props.pageSize,
      }
    }

    async function requestDropdownPage(page: number, reset: boolean): Promise<void> {
      if (!props.request)
        return
      if (!reset && (dropdownInitialLoading.value || dropdownMoreLoading.value))
        return

      const requestId = reset ? ++dropdownRequestId : dropdownRequestId
      reset ? dropdownInitialLoading.value = true : dropdownMoreLoading.value = true
      try {
        const [selectedKeys, selectedRows] = requestSelection()
        const result = normalizeResult(
          await props.request(buildDropdownParams(page), selectedKeys, selectedRows),
        )
        if (requestId !== dropdownRequestId)
          return
        listOptions.value = reset
          ? result.data
          : mergeOptions(listOptions.value, result.data, props.valueField)
        dropdownTotal.value = result.total
        dropdownPage.value = page
      }
      catch (error) {
        if (requestId === dropdownRequestId)
          reportRequestError(error, 'dropdown')
      }
      finally {
        if (requestId === dropdownRequestId) {
          reset ? dropdownInitialLoading.value = false : dropdownMoreLoading.value = false
        }
      }
    }

    function requestDropdownFirstPage(): void {
      if (!props.request)
        return
      dropdownPage.value = 0
      dropdownTotal.value = 0
      listOptions.value = []
      runSafely(requestDropdownPage(1, true))
    }

    async function requestDropdownNextPage(): Promise<void> {
      if (
        !props.request
        || dropdownPage.value === 0
        || listOptions.value.length >= dropdownTotal.value
      ) {
        return
      }
      await requestDropdownPage(dropdownPage.value + 1, false)
    }

    function handleDropdownShow(value: boolean): void {
      dropdownOpen.value = value
      invokeHandlers(props.onUpdateShow as any, value)
      invokeHandlers(props['onUpdate:show'] as any, value)
      if (value && props.show === undefined)
        requestDropdownFirstPage()
    }

    watch(() => props.show, (value, oldValue) => {
      if (value && !oldValue)
        requestDropdownFirstPage()
    })

    function handleSearch(value: string): void {
      invokeHandlers(props.onSearch as any, value)
      if (!props.request)
        return
      dropdownRequestId++
      dropdownInitialLoading.value = false
      dropdownMoreLoading.value = false
      if (searchTimer)
        clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        dropdownKeyword.value = value
        if (mergedDropdownOpen.value)
          requestDropdownFirstPage()
      }, props.searchDebounce)
    }

    async function handleDropdownScroll(event: Event): Promise<void> {
      invokeHandlers(props.onScroll as any, event)
      const target = event.target as HTMLElement | null
      if (!target || target.scrollHeight - target.scrollTop - target.clientHeight > 24)
        return
      const previousScrollTop = target.scrollTop
      await requestDropdownNextPage()
      await nextTick()
      if (target.isConnected && target.scrollTop < previousScrollTop)
        target.scrollTop = previousScrollTop
    }

    function onDropdownScroll(event: Event): void {
      runSafely(handleDropdownScroll(event))
    }

    function toRows(value: unknown): ProSelectRecord[] {
      const options = Array.isArray(value) ? value : [value]
      return options.filter(
        (option): option is ProSelectRecord => typeof option === 'object' && option !== null,
      )
    }

    function commitSelection(keys: ProSelectKey[], rows: ProSelectRecord[]): void {
      const orderedRows = findRowsByKeys(keys, rows, props.valueField)
      const nextValue = toModelValue(keys, props.multiple)
      confirmedKeys.value = keys
      confirmedRows.value = orderedRows
      selectedOptions.value = [...orderedRows]
      if (props.modelValue === undefined)
        internalValue.value = nextValue
      emit('update:modelValue', nextValue)
      emit('change', nextValue, toSelectedRows(orderedRows, props.multiple))
    }

    function handleSelectUpdate(value: ProSelectModelValue, options: unknown): void {
      const keys = normalizeKeys(value, props.multiple)
      const knownRows = mergeOptions(displayOptions.value, toRows(options), props.valueField)
      commitSelection(keys, knownRows)
    }

    const popupColumns = computed(() => {
      const columns = [...(props.tableProps.columns ?? [])] as any[]
      const selectionIndex = columns.findIndex(column => column.type === 'selection')
      const selectionColumn = { type: 'selection', multiple: props.multiple }
      if (selectionIndex === -1)
        return [selectionColumn, ...columns]
      columns[selectionIndex] = { ...columns[selectionIndex], ...selectionColumn }
      return columns
    })
    const popupPagination = computed(() => {
      if (props.tableProps.pagination === false)
        return false
      return { ...props.tableProps.pagination, pageSize: props.pageSize }
    })

    function mergePopupSelectedRows(rows: ProSelectRecord[]): void {
      const selected = new Set(temporaryKeys.value)
      const pageRows = rows.filter((row) => {
        const key = getOptionKey(row, props.valueField)
        return key !== undefined && selected.has(key)
      })
      temporaryRows.value = findRowsByKeys(
        temporaryKeys.value,
        mergeOptions(temporaryRows.value, pageRows, props.valueField),
        props.valueField,
      )
    }

    async function requestPopupTable(
      params: Record<string, unknown>,
    ): Promise<ProSelectRequestResult> {
      if (!props.request)
        return { data: displayOptions.value, total: displayOptions.value.length }
      const generation = popupRequestGeneration
      try {
        const [selectedKeys, selectedRows] = requestSelection(
          temporaryKeys.value,
          temporaryRows.value,
        )
        const result = normalizeResult(await props.request(
          { ...props.requestParams, ...params },
          selectedKeys,
          selectedRows,
        ))
        if (generation !== popupRequestGeneration || !popupVisible.value)
          return { data: [], total: 0 }
        mergePopupSelectedRows(result.data)
        return result
      }
      catch (error) {
        if (generation === popupRequestGeneration) {
          reportRequestError(error, 'popup')
          props.tableProps.onRequestError?.(error)
        }
        throw error
      }
    }

    function openPopup(): void {
      if (props.disabled)
        return
      popupRequestGeneration++
      popupSelectionDirty.value = false
      syncTemporarySelection()
      popupVisible.value = true
    }

    function closePopup(): void {
      popupRequestGeneration++
      popupVisible.value = false
      popupSelectionDirty.value = false
    }

    function cancelPopup(): void {
      closePopup()
      syncTemporarySelection()
    }

    function confirmPopup(): void {
      const rows = mergeOptions(temporaryRows.value, displayOptions.value, props.valueField)
      commitSelection(
        temporaryKeys.value,
        findRowsByKeys(temporaryKeys.value, rows, props.valueField),
      )
      closePopup()
    }

    function handlePopupShow(value: boolean): void {
      if (value)
        openPopup()
      else
        cancelPopup()
    }

    function handlePopupAfterEnter(): void {
      invokeHandlers((props.popupProps as any).onAfterEnter)
      if (props.request && tableRef.value)
        runSafely(tableRef.value.request())
    }

    function handleTemporaryKeys(keys: ProSelectKey[]): void {
      const normalizedKeys = props.multiple ? [...keys] : keys.slice(-1)
      const currentPage = tableRef.value?.data ?? []
      temporaryKeys.value = normalizedKeys
      temporaryRows.value = findRowsByKeys(
        normalizedKeys,
        mergeOptions(temporaryRows.value, currentPage, props.valueField),
        props.valueField,
      )
      popupSelectionDirty.value = true
      const tableProps = props.tableProps as Record<string, unknown>
      invokeHandlers(tableProps['onUpdate:checkedRowKeys'] as any, normalizedKeys)
    }

    function handleButtonClick(event: MouseEvent): void {
      invokeHandlers(props.buttonProps.onClick as any, event)
      openPopup()
    }

    watch(
      () => [props.requestParams, props.pageSize],
      () => {
        if (props.mode === 'dropdown' && mergedDropdownOpen.value)
          requestDropdownFirstPage()
        if (props.mode === 'popup' && popupVisible.value && tableRef.value)
          runSafely(tableRef.value.search())
      },
      { deep: true },
    )

    onBeforeUnmount(() => {
      dropdownRequestId++
      hydrationRequestId++
      popupRequestGeneration++
      if (searchTimer)
        clearTimeout(searchTimer)
    })

    const instanceApi = {
      get popup() { return popupRef.value },
      get select() { return selectRef.value },
      get selectedKeys() {
        return toModelValue(confirmedKeys.value, props.multiple)
      },
      get selectedRows() {
        return toSelectedRows(confirmedRows.value, props.multiple)
      },
      get table() { return tableRef.value },
    }
    expose(useExposeProxy(selectRef, instanceApi))

    function renderSelect(
      popupMode: boolean,
      forwardedAttrs: Record<string, unknown> = {},
    ) {
      const nativeProps = pickProps(
        props as Record<string, unknown>,
        Object.keys(selectProps),
        ['value', 'options', 'onUpdate:value', 'onUpdateValue', 'onChange'],
      )
      const selectSlots = Object.fromEntries(
        SELECT_SLOT_NAMES.flatMap(name =>
          forwardedSlots[name] ? [[name, forwardedSlots[name]]] : [],
        ),
      )
      return (
        <NSelect
          ref={selectRef}
          {...nativeProps}
          {...forwardedAttrs}
          filterable={popupMode ? false : props.filterable}
          loading={selectLoading.value}
          options={displayOptions.value as any}
          remote={!!props.request || props.remote}
          resetMenuOnOptionsChange={props.resetMenuOnOptionsChange}
          show={popupMode ? false : mergedDropdownOpen.value}
          showOnFocus={popupMode ? false : props.showOnFocus}
          style={popupMode ? { flex: '1 1 auto' } : undefined}
          value={modelValue.value as any}
          onScroll={onDropdownScroll}
          onSearch={handleSearch}
          onUpdate:show={handleDropdownShow}
          onUpdate:value={handleSelectUpdate as any}
          v-slots={selectSlots}
        />
      )
    }

    function renderPopupTable() {
      const tableSlots = prefixedSlots(forwardedSlots, 'table-')
      return (
        <ProTable
          ref={tableRef}
          {...props.tableProps}
          checkedRowKeys={temporaryKeys.value}
          columns={popupColumns.value}
          data={props.request ? [] : displayOptions.value}
          manual={true}
          pageFields={props.pageFields}
          pagination={popupPagination.value}
          request={props.request ? requestPopupTable : undefined}
          rowKey={(row: ProSelectRecord) => getOptionKey(row, props.valueField) as ProSelectKey}
          onRequestError={() => undefined}
          onUpdate:checkedRowKeys={handleTemporaryKeys}
          v-slots={tableSlots}
        />
      )
    }

    function renderPopup() {
      const { footer: _, ...popupSlots } = prefixedSlots(forwardedSlots, 'popup-')
      return (
        <ProPopup
          ref={popupRef}
          {...props.popupProps}
          cancelText={props.popupProps.cancelText ?? locale('cancelText')}
          okText={props.popupProps.okText ?? locale('okText')}
          show={popupVisible.value}
          onAfterEnter={handlePopupAfterEnter}
          onCancel={cancelPopup}
          onOk={confirmPopup}
          onUpdate:show={handlePopupShow}
        >
          {{
            ...popupSlots,
            default: renderPopupTable,
            footer: slots['popup-footer']
              ? () => slots['popup-footer']!({
                  cancel: cancelPopup,
                  confirm: confirmPopup,
                })
              : undefined,
          }}
        </ProPopup>
      )
    }

    return () => {
      if (props.mode === 'dropdown')
        return renderSelect(false, attrs)

      const disabled = !!props.disabled || !!props.buttonProps.disabled
      return (
        <>
          <NInputGroup
            {...attrs}
            style={[attrs.style as any, { width: '100%' }]}
          >
            {renderSelect(true)}
            {slots.button
              ? slots.button({ disabled, open: openPopup, text: buttonText.value })
              : (
                  <NButton
                    {...props.buttonProps}
                    disabled={disabled}
                    onClick={handleButtonClick}
                  >
                    {{ default: () => buttonText.value }}
                  </NButton>
                )}
          </NInputGroup>
          {renderPopup()}
        </>
      )
    }
  },
})
