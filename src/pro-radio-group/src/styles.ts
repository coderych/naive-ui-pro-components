import { CssRender } from 'css-render'

const { c } = CssRender()

const radioGroupStyle = c('.npro-radio-group-wrapper', {
  display: 'contents',
}, [
  c('.npro-radio-group--solid .n-radio-button.n-radio-button--checked', {
    raw: `
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      box-shadow: none !important;
      color: var(--base-color) !important;
    `,
  }, [
    c('&:hover', {
      raw: `
        background-color: var(--primary-color-hover) !important;
        border-color: var(--primary-color-hover) !important;
      `,
    }),
    c('&:active', {
      raw: `
        background-color: var(--primary-color-pressed) !important;
        border-color: var(--primary-color-pressed) !important;
      `,
    }),
  ]),
])

export function mountProRadioGroupStyle(): void {
  if (typeof document === 'undefined')
    return
  radioGroupStyle.mount({ id: 'naive-ui-pro-radio-group' })
}
