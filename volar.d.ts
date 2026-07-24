declare module 'vue' {
  export interface GlobalComponents {
    ProCheckboxGroup: typeof import('naive-ui-pro-components')['ProCheckboxGroup']
    ProForm: typeof import('naive-ui-pro-components')['ProForm']
    ProPopup: typeof import('naive-ui-pro-components')['ProPopup']
    ProRadioGroup: typeof import('naive-ui-pro-components')['ProRadioGroup']
    ProSelect: typeof import('naive-ui-pro-components')['ProSelect']
    ProSwitch: typeof import('naive-ui-pro-components')['ProSwitch']
    ProTable: typeof import('naive-ui-pro-components')['ProTable']
  }
}

export {}
