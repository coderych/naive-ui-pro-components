import type { DataTableProps } from 'naive-ui'
import type { SlotsType, VNodeChild } from 'vue'
import type { ProTableColumnFixed, ProTableColumnKey, ProTableColumnOption } from '../columns-state'
import type { ProTableOption } from '../types'
import { Icon } from '@iconify/vue'
import { NButton, NCheckbox, NDropdown, NEl, NPopover, NScrollbar, NTooltip } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useProLocale } from '../../../config-provider'

interface TableHeaderSlots {
  extra?: () => VNodeChild
  title?: () => VNodeChild
}

export default defineComponent({
  name: 'ProTableHeader',
  props: {
    columnOptions: { type: Array as unknown as () => ProTableColumnOption[], required: true },
    full: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    option: { type: [Boolean, Object] as unknown as () => false | ProTableOption, required: true },
    size: { type: String as unknown as () => NonNullable<DataTableProps['size']>, required: true },
    visibleKeys: { type: Array as unknown as () => ProTableColumnKey[], required: true },
  },
  emits: {
    'reload': () => true,
    'resetColumns': () => true,
    'update:columnFixed': (_key: ProTableColumnKey, _fixed: ProTableColumnFixed) => true,
    'update:columnOrder': (_keys: ProTableColumnKey[]) => true,
    'update:full': (_value: boolean) => true,
    'update:size': (_value: NonNullable<DataTableProps['size']>) => true,
    'update:visibleKeys': (_value: ProTableColumnKey[]) => true,
  },
  slots: Object as SlotsType<TableHeaderSlots>,
  setup(props, { emit, slots }) {
    const locale = useProLocale()

    const sizeOptions = computed(() => [
      { key: 'small', label: locale('densityCompact') },
      { key: 'medium', label: locale('densityDefault') },
      { key: 'large', label: locale('densityLoose') },
    ])

    const orderedOptions = ref<ProTableColumnOption[]>([])
    const allColumnKeys = computed(() => orderedOptions.value.map(option => option.key))
    const isAllChecked = computed(() => props.visibleKeys.length === allColumnKeys.value.length)
    const isIndeterminate = computed(() => props.visibleKeys.length > 0 && !isAllChecked.value)

    watch(() => props.columnOptions, (options) => {
      orderedOptions.value = options.map(option => ({ ...option }))
    }, { deep: true, immediate: true })

    function isEnabled(key: keyof ProTableOption): boolean {
      return props.option !== false && props.option[key] !== false
    }
    function updateColumn(key: ProTableColumnKey, checked: boolean): void {
      const nextKeys = new Set(props.visibleKeys)
      if (checked)
        nextKeys.add(key)
      else
        nextKeys.delete(key)
      emit('update:visibleKeys', [...nextKeys])
    }
    function updateAllColumns(checked: boolean): void {
      emit('update:visibleKeys', checked ? [...allColumnKeys.value] : [])
    }
    function updateSize(key: string | number): void {
      if (key === 'small' || key === 'medium' || key === 'large')
        emit('update:size', key)
    }
    function updateFixed(column: ProTableColumnOption, fixed: Exclude<ProTableColumnFixed, undefined>): void {
      emit('update:columnFixed', column.key, column.fixed === fixed ? undefined : fixed)
    }
    function handleDragEnd(): void {
      emit('update:columnOrder', orderedOptions.value.map(option => option.key))
    }
    function icon(icon: string, size = 18) {
      return <Icon icon={icon} width={size} height={size} />
    }

    return () => (
      <div class="npro-table-header">
        <div class="npro-table-header__title">
          {slots.title?.()}
        </div>
        <div class="npro-table-header__actions">
          {slots.extra?.()}

          {isEnabled('reload') && (
            <NTooltip>
              {{ trigger: () => (
                <NButton class="npro-table-header__action" secondary loading={props.loading} aria-label={locale('reload')} onClick={() => emit('reload')}>
                  {{ icon: () => icon('heroicons-arrow-path', 20) }}
                </NButton>
              ), default: () => locale('reload') }}
            </NTooltip>
          )}

          {isEnabled('full') && (
            <NTooltip>
              {{ trigger: () => (
                <NButton class="npro-table-header__action" secondary aria-label={props.full ? locale('exitFullscreen') : locale('fullscreen')} onClick={() => emit('update:full', !props.full)}>
                  {{ icon: () => icon(props.full ? 'heroicons-arrows-pointing-in' : 'heroicons-arrows-pointing-out', 20) }}
                </NButton>
              ), default: () => props.full ? locale('exitFullscreen') : locale('fullscreen') }}
            </NTooltip>
          )}

          {isEnabled('size') && (
            <NDropdown trigger="click" options={sizeOptions.value} showArrow={true} value={props.size} onSelect={updateSize}>
              {{ default: () => (
                <NButton class="npro-table-header__action" secondary aria-label={locale('density')}>
                  {{ icon: () => icon('heroicons-list-bullet', 20) }}
                </NButton>
              ) }}
            </NDropdown>
          )}

          {isEnabled('setting') && (
            <NPopover trigger="click" placement="bottom-end" style={{ padding: 0 }}>
              {{ trigger: () => (
                <NButton class="npro-table-header__action" secondary aria-label={locale('columnSetting')}>
                  {{ icon: () => icon('heroicons-cog-6-tooth', 20) }}
                </NButton>
              ), default: () => (
                <NEl class="npro-table-header__setting">
                  <div class="npro-table-header__setting-header">
                    <NCheckbox checked={isAllChecked.value} indeterminate={isIndeterminate.value} onUpdate:checked={updateAllColumns}>
                      {{ default: () => locale('selectAll') }}
                    </NCheckbox>
                    <NButton text type="primary" onClick={() => emit('resetColumns')}>
                      {{ default: () => locale('reset') }}
                    </NButton>
                  </div>
                  <NScrollbar class="npro-table-header__setting-scrollbar">
                    <VueDraggable
                      modelValue={orderedOptions.value}
                      {...{ 'onUpdate:modelValue': (val: ProTableColumnOption[]) => { orderedOptions.value = val } }}
                      class="npro-table-header__setting-list"
                      handle=".npro-table-header__drag"
                      animation={150}
                      onEnd={handleDragEnd}
                    >
                      {orderedOptions.value.map(column => (
                        <div key={column.key} class="npro-table-header__setting-item">
                          <NCheckbox checked={props.visibleKeys.includes(column.key)} onUpdate:checked={(checked: boolean) => updateColumn(column.key, checked)}>
                            {{ default: () => column.label }}
                          </NCheckbox>
                          <div class="npro-table-header__setting-actions">
                            <button type="button" title={column.fixed === 'left' ? locale('unpin') : locale('pinLeft')} aria-label={column.fixed === 'left' ? locale('unpin') : locale('pinLeft')} class={['npro-table-header__setting-action', { 'npro-table-header__setting-action--active': column.fixed === 'left' }]} onClick={() => updateFixed(column, 'left')}>
                              {icon('carbon-open-panel-right')}
                            </button>
                            <button type="button" title={column.fixed === 'right' ? locale('unpin') : locale('pinRight')} aria-label={column.fixed === 'right' ? locale('unpin') : locale('pinRight')} class={['npro-table-header__setting-action', { 'npro-table-header__setting-action--active': column.fixed === 'right' }]} onClick={() => updateFixed(column, 'right')}>
                              {icon('carbon-open-panel-right')}
                            </button>
                            <span class="npro-table-header__drag" aria-hidden="true">
                              {icon('carbon-draggable')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </VueDraggable>
                  </NScrollbar>
                </NEl>
              ) }}
            </NPopover>
          )}
        </div>
      </div>
    )
  },
})
