import { CssRender } from 'css-render'

const { c } = CssRender()

const proTableStyle = c('.npro-table', {
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: 0,
  width: '100%',
}, [
  c('&.npro-table--full', {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    minHeight: '100vh',
    background: 'color-mix(in srgb, var(--base-color, #fff) 62%, transparent)',
    backdropFilter: 'blur(18px) saturate(140%)',
  }),
  c('.npro-table__card, .n-card__content, .n-data-table, .n-data-table-wrapper, .n-data-table-base-table, .n-data-table-base-table-body', {
    boxSizing: 'border-box',
    minWidth: 0,
    width: '100%',
  }),
  c('.n-data-table table', {
    display: 'table',
    width: '100%',
  }),
  c('.npro-table-query', {
    minWidth: 0,
    width: '100%',
  }),
  c('.npro-table__content', {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0,
    width: '100%',
  }),
  c('&.npro-table--full .npro-table__content', {
    padding: '12px',
  }),
  c('.npro-table__fullscreen-scrollbar', {
    flex: 1,
    minHeight: 0,
  }),
  c('.npro-table-query__control', {
    minWidth: 0,
    width: '100%',
  }),
  c('.npro-table-query__actions', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    height: '100%',
    minHeight: '34px',
    width: '100%',
  }),
  c('.npro-table-header', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
    width: '100%',
  }),
  c('.npro-table-header__title, .npro-table-header__actions', {
    display: 'flex',
    alignItems: 'center',
  }),
  c('.npro-table-header__title', { minWidth: 0 }),
  c('.npro-table-header__actions', {
    flexShrink: 0,
    gap: '8px',
  }),
  c('.npro-table-header__action', {
    width: '36px',
    height: '36px',
    padding: '0 !important',
    borderRadius: '10px',
  }, [
    c('.n-button__content, .n-button__icon', {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
    }),
  ]),
  c('.npro-table__batch-bar', {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    marginBottom: '12px',
    background: 'var(--n-color, #fafafa)',
    border: '1px solid var(--n-border-color, #eee)',
    borderRadius: '4px',
  }),
])

const columnSettingStyle = c('.npro-table-header__setting', {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: 'min(420px, calc(100vw - 48px))',
  minWidth: '280px',
  maxHeight: '400px',
  overflowY: 'auto',
}, [
  c('.npro-table-header__setting-header', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '0 6px 8px',
    borderBottom: '1px solid var(--n-border-color, #eee)',
  }),
  c('.npro-table-header__setting-list', {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  }),
  c('.npro-table-header__setting-item', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    minHeight: '36px',
    padding: '4px 6px',
    borderRadius: '6px',
    transition: 'background-color .2s',
  }, [
    c('&:hover', { backgroundColor: 'var(--action-color, #f5f5f5)' }),
    c('> .n-checkbox', {
      flex: 1,
      minWidth: 0,
    }),
  ]),
  c('.npro-table-header__setting-actions', {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 26px)',
    alignItems: 'center',
    flexShrink: 0,
    gap: '4px',
    width: '86px',
  }),
  c('.npro-table-header__setting-action, .npro-table-header__drag', {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: '26px',
    height: '26px',
    padding: 0,
    color: 'var(--text-color-2, #666)',
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: '5px',
    lineHeight: 0,
  }),
  c('.npro-table-header__setting-action', { cursor: 'pointer' }, [
    c('&:hover', {
      color: 'var(--primary-color, #18a058)',
      backgroundColor: 'var(--action-color, #f5f5f5)',
    }),
    c('&.npro-table-header__setting-action--active', {
      color: 'var(--primary-color, #18a058)',
    }),
  ]),
  c('.npro-table-header__drag', {
    color: 'var(--text-color-3, #999)',
    cursor: 'grab',
  }, [
    c('&:active', { cursor: 'grabbing' }),
  ]),
])

export function mountProTableStyle(): void {
  if (typeof document === 'undefined')
    return
  proTableStyle.mount({ id: 'naive-ui-pro-table' })
  columnSettingStyle.mount({ id: 'naive-ui-pro-table-setting' })
}
