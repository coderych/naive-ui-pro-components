import type { FormProps } from 'naive-ui'
import type { SlotsType, VNodeChild } from 'vue'
import type { ProTableFormSlotProps, ProTableInternalColumn, ProTableOption, ProTableSearchOption } from '../types'
import { NButton, NCard, NForm, NFormItemGi, NGrid, NGridItem } from 'naive-ui'
import { computed, defineComponent, onBeforeUnmount, ref } from 'vue'
import { useProLocale } from '../../../config-provider'
import { getColumnKey, getColumnTitle } from '../../../shared'
import { renderSearchField, resolveSearchFieldProps } from '../search-field'

interface QueryFormSlots {
  default?: (props: ProTableFormSlotProps<never>) => VNodeChild
}

export default defineComponent({
  name: 'ProTableQueryForm',
  props: {
    columns: { type: Array as unknown as () => ProTableInternalColumn[], required: true },
    defaultParams: { type: Object as () => Record<string, unknown>, required: true },
    formProps: { type: Object as () => FormProps, required: true },
    loading: { type: Boolean, required: true },
    modelValue: { type: Object as () => Record<string, unknown>, required: true },
    option: { type: [Boolean, Object] as unknown as () => false | ProTableOption, required: true },
  },
  emits: {
    'change': () => true,
    'reset': (_params: Record<string, unknown>) => true,
    'search': () => true,
    'update:modelValue': (_value: Record<string, unknown>) => true,
  },
  slots: Object as SlotsType<QueryFormSlots>,
  setup(props, { emit, slots }) {
    const locale = useProLocale()

    interface SearchField { column: ProTableInternalColumn, key: string, option: ProTableSearchOption, sourceIndex: number }

    const fields = computed(() =>
      (props.columns as any[]).flatMap((col: any, idx: number) => toSearchField(col, idx)).sort((a: SearchField, b: SearchField) => compareFields(a, b)),
    )

    const collapsed = ref(false)
    const width = ref(1000)
    let resizeObserver: ResizeObserver | undefined

    function getColumnCount(w: number): number {
      if (w < 513)
        return 1
      if (w < 1062)
        return 2
      if (w < 1352)
        return 3
      return 4
    }

    const columnCount = computed(() => getColumnCount(width.value))
    const visibleFields = computed(() => collapsed.value ? fields.value.slice(0, Math.max(1, columnCount.value - 1)) : fields.value)
    const actionSpan = computed(() => {
      if (columnCount.value === 1)
        return 24
      const remainingFields = visibleFields.value.length % columnCount.value
      return remainingFields === 0 ? 24 : (24 / columnCount.value) * (columnCount.value - remainingFields)
    })
    const effectiveFormProps = computed<FormProps>(() => ({ showFeedback: false, showLabel: false, ...props.formProps }))
    const canCollapse = computed(() => fields.value.length > columnCount.value)

    function getSlotProps(field: SearchField): ProTableFormSlotProps<never> {
      return { column: field.column, key: field.key, option: field.option, params: props.modelValue, value: props.modelValue[field.key] }
    }
    function updateField(field: SearchField, value: unknown) {
      emit('update:modelValue', { ...props.modelValue, [field.key]: value })
      emit('change')
    }
    function reset() {
      const nextParams = createResetParams()
      emit('update:modelValue', nextParams)
      emit('reset', nextParams)
    }
    function createResetParams(): Record<string, unknown> {
      const nextParams = { ...props.modelValue }
      fields.value.forEach((field: SearchField) => {
        if (isResettable(field.option))
          nextParams[field.key] = props.defaultParams[field.key] ?? null
      })
      return nextParams
    }
    function toSearchField(column: any, sourceIndex: number): SearchField[] {
      if (!column.search)
        return []
      const option = column.search === true ? {} : column.search
      if (option.enabled === false)
        return []
      const columnKey = getColumnKey(column)
      const key = option.key ?? (columnKey === undefined ? undefined : String(columnKey))
      if (!key)
        return []
      return [{ column, key, option: { ...option, key, label: option.label ?? getColumnTitle(column, key) }, sourceIndex }]
    }
    function compareFields(left: SearchField, right: SearchField) {
      return (left.option.sort ?? left.sourceIndex) - (right.option.sort ?? right.sourceIndex)
    }
    function isResettable(option: ProTableSearchOption): boolean {
      const { clearable, disabled } = resolveSearchFieldProps(option)
      return disabled !== true && clearable !== false
    }

    function setFormRef(el: any) {
      resizeObserver?.disconnect()
      if (!el?.$el || typeof ResizeObserver === 'undefined')
        return
      resizeObserver = new ResizeObserver((entries) => {
        width.value = entries[0]?.contentRect.width ?? 1000
      })
      resizeObserver.observe(el.$el)
    }

    onBeforeUnmount(() => resizeObserver?.disconnect())

    return () => {
      if (fields.value.length === 0)
        return null

      const defaultSpan = 24 / columnCount.value

      return (
        <NCard ref={setFormRef} size="small" class="npro-table-query">
          <NForm {...effectiveFormProps.value} model={props.modelValue}>
            <NGrid cols={24} xGap={12} yGap={12}>
              {visibleFields.value.map((field: SearchField) => (
                <NFormItemGi key={field.key} label={field.option.label} path={field.key} span={field.option.span ?? defaultSpan}>
                  <div class="npro-table-query__control">
                    {slots.default
                      ? slots.default(getSlotProps(field))
                      : renderSearchField(getSlotProps(field), (value: unknown) => updateField(field, value))}
                  </div>
                </NFormItemGi>
              ))}

              <NGridItem span={actionSpan.value}>
                <div class="npro-table-query__actions">
                  <NButton disabled={props.loading} onClick={reset}>
                    {{ default: () => locale('reset') }}
                  </NButton>
                  {props.option !== false && props.option?.manualSearch === true && (
                    <NButton type="primary" loading={props.loading} onClick={() => emit('search')}>
                      {{ default: () => locale('search') }}
                    </NButton>
                  )}
                  {canCollapse.value && (
                    <NButton text type="primary" onClick={() => { collapsed.value = !collapsed.value }}>
                      {{ default: () => collapsed.value ? locale('expand') : locale('collapse') }}
                    </NButton>
                  )}
                </div>
              </NGridItem>
            </NGrid>
          </NForm>
        </NCard>
      )
    }
  },
})
