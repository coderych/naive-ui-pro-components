import type { DrawerContentProps, DrawerProps, ModalProps } from 'naive-ui'
import type { ExtractPublicPropTypes, HTMLAttributes, PropType, Slots } from 'vue'
import { drawerContentProps, drawerProps, modalProps, NButton, NDrawer, NDrawerContent, NModal } from 'naive-ui'
import { computed, defineComponent, watch } from 'vue'
import { formatWidth, pickProps } from '../../shared'
import { mountProPopupStyle } from './styles'

type NativeAttrs = Pick<HTMLAttributes, 'class' | 'style'>

export type ProPopupPreset = 'drawer' | 'modal'
export type ProPopupDrawerProps = Omit<DrawerProps, 'show'> & NativeAttrs
export type ProPopupModalProps = Omit<ModalProps, 'show'> & NativeAttrs
export type ProPopupDrawerContentProps = DrawerContentProps & NativeAttrs

export const proPopupProps = {
  ...drawerProps,
  ...drawerContentProps,
  ...modalProps,
  preset: {
    type: String as PropType<ProPopupPreset>,
    default: 'drawer',
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 800,
  },
  header: {
    type: Boolean,
    default: true,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  nativeScrollbar: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  okText: {
    type: String as PropType<string>,
    default: '确定',
  },
  cancelText: {
    type: String as PropType<string>,
    default: '取消',
  },
  drawerProps: Object as PropType<ProPopupDrawerProps>,
  modalProps: Object as PropType<ProPopupModalProps>,
  drawerContentProps: Object as PropType<ProPopupDrawerContentProps>,
} as const

export type ProPopupProps = ExtractPublicPropTypes<typeof proPopupProps>

export default defineComponent({
  name: 'ProPopup',
  props: proPopupProps,
  emits: {
    'ok': () => true,
    'cancel': () => true,
    'close': () => true,
    'update:show': (_value: boolean) => true,
  },
  setup(props, { emit, slots, expose }) {
    mountProPopupStyle()
    const show = computed({
      get: () => props.show ?? false,
      set: (val: boolean) => emit('update:show', val),
    })

    watch(() => props.show, (value, oldValue) => {
      if (!value && oldValue)
        emit('close')
    })

    function onUpdateShow(value: boolean) {
      emit('update:show', value)
    }

    function handleConfirm() {
      emit('ok')
    }
    function handleCancel() {
      emit('cancel')
    }

    function compactSlots(source: Record<string, unknown>): Slots {
      return Object.fromEntries(
        Object.entries(source).filter(([, v]) => typeof v === 'function'),
      ) as Slots
    }

    expose({})

    return () => {
      const popupSlots = compactSlots({
        ...slots,
        'header': props.header ? slots.header : undefined,
        'header-extra': props.header ? slots['header-extra'] : undefined,
        'footer': props.footer
          ? (slots.footer ?? (() => [
              <div class="npro-popup__footer">
                <NButton {...props.negativeButtonProps} onClick={handleCancel}>
                  {{ default: () => props.cancelText ?? '取消' }}
                </NButton>
                <NButton
                  {...props.positiveButtonProps}
                  loading={props.loading}
                  type={props.positiveButtonProps?.type ?? 'primary'}
                  onClick={handleConfirm}
                >
                  {{ default: () => props.okText ?? '确定' }}
                </NButton>
              </div>,
            ]))
          : undefined,
      })

      if (props.preset === 'drawer') {
        return (
          <NDrawer
            {...pickProps(props as Record<string, unknown>, Object.keys(drawerProps))}
            {...props.drawerProps}
            show={show.value}
            width={props.width}
            native-scrollbar={true}
            onUpdate:show={onUpdateShow}
          >
            <NDrawerContent
              {...pickProps(props as Record<string, unknown>, Object.keys(drawerContentProps))}
              {...props.drawerContentProps}
              title={props.header ? (props.title as string) : undefined}
              closable={props.header && props.closable}
            >
              {popupSlots}
            </NDrawerContent>
          </NDrawer>
        )
      }

      return (
        <NModal
          {...pickProps(props as Record<string, unknown>, Object.keys(modalProps), ['footer', 'preset', 'show'])}
          {...props.modalProps}
          show={show.value}
          title={props.header ? props.title : undefined}
          preset={props.modalProps?.preset ?? 'card'}
          style={{ width: formatWidth(props.width) }}
          onUpdate:show={onUpdateShow}
        >
          {popupSlots}
        </NModal>
      )
    }
  },
})
