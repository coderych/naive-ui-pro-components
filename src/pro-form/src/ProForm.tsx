import type { FormInst } from 'naive-ui'
import type { SlotsType } from 'vue'
import type { ProFormFieldContext, ProFormSlots } from './types'
import { formItemProps, formProps, gridItemProps, gridProps, NForm, NFormItem, NGrid, NGridItem } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { get, pickProps, set, useExposeProxy } from '../../shared'
import { renderFormField } from './render-field'
import { proFormProps } from './types'

export { defineProFormColumn } from './types'
export type { ProFormColumn, ProFormFieldContext, ProFormProps, ProFormSlots } from './types'
export type ProFormInst = FormInst

export default defineComponent({
  name: 'ProForm',
  props: proFormProps,
  slots: Object as SlotsType<ProFormSlots>,
  emits: { 'update:value': (_value: object) => true },
  setup(props, { slots, emit, expose }) {
    const formRef = ref<FormInst | null>(null)
    expose(useExposeProxy(formRef))
    const internalModel = ref<object>(props.value ?? {})
    const model = computed({
      get: () => props.value ?? internalModel.value,
      set: (val: object) => {
        internalModel.value = val
        emit('update:value', val)
      },
    })

    watch(() => props.value, (val) => {
      if (val !== undefined)
        internalModel.value = val
    })

    const columns = computed(() =>
      (props.columns as any[])
        .filter((col: any) => col.enabled !== false)
        .slice()
        .sort((a: any, b: any) => (a.sort ?? 10) - (b.sort ?? 10)),
    )

    function createFieldContext(column: any, index: number): ProFormFieldContext {
      const path = column.path ?? column.key
      return {
        column,
        index,
        model: model.value,
        path,
        value: get(model.value, path),
        updateValue: (value: unknown) => updateFieldValue(column, path, value),
        gridItemProps: {
          ...pickProps(column, Object.keys(gridItemProps)),
          ...column.gridItemProps ?? {},
        },
        formItemProps: {
          ...pickProps(column, Object.keys(formItemProps)),
          path,
          ...column.formItemProps ?? {},
        },
      }
    }

    function updateFieldValue(column: any, path: string, value: unknown): void {
      const currentModel = model.value
      set(currentModel, path, value)
      const newModel = { ...currentModel }
      model.value = newModel
      column.onUpdate?.(value, newModel)
    }

    return () => {
      if (columns.value.length === 0)
        return null

      return (
        <NForm
          ref={formRef}
          {...pickProps(props as any, Object.keys(formProps))}
          model={model.value}
        >
          <NGrid cols={24} {...pickProps(props as any, Object.keys(gridProps))}>
            {columns.value.map((column: any, index: number) => {
              const context = createFieldContext(column, index)
              const fieldSlot = slots[column.key]
              const gridItemPropVal = column.gridItemProps ?? {}

              return (
                <NGridItem
                  {...gridItemPropVal}
                  key={column.key}
                  span={column.span ?? gridItemPropVal.span ?? 24}
                >
                  {{
                    default: () => {
                      if (fieldSlot)
                        return fieldSlot(context)
                      if (column.component === 'none')
                        return null
                      return (
                        <NFormItem
                          {...context.formItemProps}
                          {...column.formItemSlots}
                        >
                          {{ default: () => renderFormField(column, context) }}
                        </NFormItem>
                      )
                    },
                  }}
                </NGridItem>
              )
            })}
          </NGrid>
        </NForm>
      )
    }
  },
})
