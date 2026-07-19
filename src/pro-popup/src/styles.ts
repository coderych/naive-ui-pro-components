import { CssRender } from 'css-render'

const { c } = CssRender()

const popupStyle = c('.npro-popup__footer', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
})

export function mountProPopupStyle(): void {
  if (typeof document === 'undefined')
    return
  popupStyle.mount({ id: 'naive-ui-pro-popup' })
}
