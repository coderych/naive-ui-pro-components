import type { InjectionKey, Ref } from 'vue'
import type { ProConfig, ProLocale, ProLocaleKey, ProLocaleMessages } from './types'
import { inject, provide, ref, unref } from 'vue'

const PRO_CONFIG_KEY: InjectionKey<Ref<ProConfig>> = Symbol('proConfig')

const defaultLocale: ProLocaleMessages = {
  okText: '确定',
  cancelText: '取消',
  totalPrefix: '共',
  reload: '刷新',
  fullscreen: '全屏',
  exitFullscreen: '退出全屏',
  density: '密度',
  densityCompact: '紧凑',
  densityDefault: '默认',
  densityLoose: '宽松',
  columnSetting: '列设置',
  selectAll: '全选',
  reset: '重置',
  search: '搜索',
  collapse: '收起',
  expand: '展开',
  pinLeft: '固定到左侧',
  pinRight: '固定到右侧',
  unpin: '取消固定',
  inputPlaceholder: '请输入{label}',
  selectPlaceholder: '请选择{label}',
  datePlaceholder: '请选择{label}',
  numberPlaceholder: '请输入{label}',
  empty: '暂无数据',
}

function translateDefaultLocale(key: ProLocaleKey): string {
  return defaultLocale[key]
}

/**
 * Create a pro config provider.
 */
export function createProConfig(config?: ProConfig): {
  provide: () => void
  config: Ref<ProConfig>
} {
  const configRef = ref<ProConfig>(config ?? {})
  return {
    provide: () => provide(PRO_CONFIG_KEY, configRef),
    config: configRef,
  }
}

/**
 * Use the pro config, falling back to defaults.
 */
export function useProConfig(): {
  locale: ProLocale
  config: ProConfig
} {
  const configRef = inject<Ref<ProConfig>>(PRO_CONFIG_KEY, ref<ProConfig>({}))
  const config = unref(configRef)
  return {
    locale: config.locale ?? translateDefaultLocale,
    config,
  }
}

/**
 * Use the pro locale.
 */
export function useProLocale(): ProLocale {
  const { locale } = useProConfig()
  return locale
}

export { defaultLocale, PRO_CONFIG_KEY }
