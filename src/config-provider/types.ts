/**
 * Locale configuration for pro components.
 */
export interface ProLocaleMessages {
  /** Confirm button text */
  okText: string
  /** Cancel button text */
  cancelText: string
  /** Total items prefix */
  totalPrefix: string
  /** Reload tooltip */
  reload: string
  /** Fullscreen tooltip */
  fullscreen: string
  /** Exit fullscreen tooltip */
  exitFullscreen: string
  /** Density tooltip */
  density: string
  /** Density: compact */
  densityCompact: string
  /** Density: default */
  densityDefault: string
  /** Density: loose */
  densityLoose: string
  /** Column settings tooltip */
  columnSetting: string
  /** Selection column label */
  selectionColumn: string
  /** Row index column label */
  indexColumn: string
  /** Select all checkbox label */
  selectAll: string
  /** Reset button text */
  reset: string
  /** Search button text */
  search: string
  /** Collapse text */
  collapse: string
  /** Expand text */
  expand: string
  /** Pin left text */
  pinLeft: string
  /** Pin right text */
  pinRight: string
  /** Unpin text */
  unpin: string
  /** Input placeholder template */
  inputPlaceholder: string
  /** Select placeholder template */
  selectPlaceholder: string
  /** Select action text */
  selectText: string
  /** Date placeholder template */
  datePlaceholder: string
  /** Number placeholder template */
  numberPlaceholder: string
  /** Empty text */
  empty: string
}

export type ProLocaleKey = keyof ProLocaleMessages

/** 根据 key 获取多语言文案。 */
export type ProLocale = (key: ProLocaleKey) => string

/**
 * Global configuration for pro components.
 */
export interface ProConfig {
  locale?: ProLocale
}
