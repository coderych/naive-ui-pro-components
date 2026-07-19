import { CssRender } from 'css-render'

const { c } = CssRender()

const radioGroupStyle = c('.npro-radio-group-wrapper', {
  display: 'contents',
}, [
  c('.npro-radio-group--solid .n-radio-button.n-radio-button--checked', {
    raw: `
      background-color: var(--n-primary-color, #18a058) !important;
      border-color: var(--n-primary-color, #18a058) !important;
      box-shadow: none !important;
      color: #fff !important;
    `,
  }, [
    c('&:hover', {
      raw: `
        background-color: var(--n-primary-color-hover, #36ad6a) !important;
        border-color: var(--n-primary-color-hover, #36ad6a) !important;
      `,
    }),
    c('&:active', {
      raw: `
        background-color: var(--n-primary-color-pressed, #2c8a4e) !important;
        border-color: var(--n-primary-color-pressed, #2c8a4e) !important;
      `,
    }),
  ]),
])

export function mountProRadioGroupStyle(): void {
  if (typeof document === 'undefined')
    return
  radioGroupStyle.mount({ id: 'naive-ui-pro-radio-group' })
}
