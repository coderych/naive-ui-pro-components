import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'

import I18nBasic from './demos/I18nBasic.vue'
import ProCheckboxGroupBasic from './demos/ProCheckboxGroupBasic.vue'
import ProFormAllFields from './demos/ProFormAllFields.vue'
import ProFormBasic from './demos/ProFormBasic.vue'
import ProFormCustom from './demos/ProFormCustom.vue'
import ProFormMethods from './demos/ProFormMethods.vue'
import ProFormNested from './demos/ProFormNested.vue'
import ProFormSlot from './demos/ProFormSlot.vue'
import ProFormValidation from './demos/ProFormValidation.vue'
import ProPopupBasic from './demos/ProPopupBasic.vue'
import ProPopupNoChrome from './demos/ProPopupNoChrome.vue'
import ProRadioGroupBasic from './demos/ProRadioGroupBasic.vue'
import ProSelectDisabled from './demos/ProSelectDisabled.vue'
import ProSelectDropdownMultiple from './demos/ProSelectDropdownMultiple.vue'
import ProSelectDropdownSingle from './demos/ProSelectDropdownSingle.vue'
import ProSelectExternalValue from './demos/ProSelectExternalValue.vue'
import ProSelectLocalOptions from './demos/ProSelectLocalOptions.vue'
import ProSelectMethods from './demos/ProSelectMethods.vue'
import ProSelectPopupMultiple from './demos/ProSelectPopupMultiple.vue'
import ProSelectPopupSingle from './demos/ProSelectPopupSingle.vue'
import ProSelectRequestError from './demos/ProSelectRequestError.vue'
import ProSelectRequestParams from './demos/ProSelectRequestParams.vue'
import ProSelectSlots from './demos/ProSelectSlots.vue'
import ProSwitchBasic from './demos/ProSwitchBasic.vue'
import ProTableBasic from './demos/ProTableBasic.vue'
import ProTableBatch from './demos/ProTableBatch.vue'
import ProTableColumns from './demos/ProTableColumns.vue'
import ProTableHeaderSelection from './demos/ProTableHeaderSelection.vue'
import ProTableMethods from './demos/ProTableMethods.vue'
import ProTableRemote from './demos/ProTableRemote.vue'
import ProTableSearch from './demos/ProTableSearch.vue'
import ProTableSearchFields from './demos/ProTableSearchFields.vue'
import ProTableSlots from './demos/ProTableSlots.vue'
import ProTableSpecialColumns from './demos/ProTableSpecialColumns.vue'
import ProTableToolbar from './demos/ProTableToolbar.vue'

import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoBlock', DemoBlock)
    app.component('I18nBasic', I18nBasic)
    app.component('ProTableBasic', ProTableBasic)
    app.component('ProTableBatch', ProTableBatch)
    app.component('ProTableSearch', ProTableSearch)
    app.component('ProTableSearchFields', ProTableSearchFields)
    app.component('ProTableRemote', ProTableRemote)
    app.component('ProTableColumns', ProTableColumns)
    app.component('ProTableHeaderSelection', ProTableHeaderSelection)
    app.component('ProTableMethods', ProTableMethods)
    app.component('ProTableSpecialColumns', ProTableSpecialColumns)
    app.component('ProTableToolbar', ProTableToolbar)
    app.component('ProTableSlots', ProTableSlots)
    app.component('ProFormBasic', ProFormBasic)
    app.component('ProFormAllFields', ProFormAllFields)
    app.component('ProFormValidation', ProFormValidation)
    app.component('ProFormCustom', ProFormCustom)
    app.component('ProFormNested', ProFormNested)
    app.component('ProFormMethods', ProFormMethods)
    app.component('ProFormSlot', ProFormSlot)
    app.component('ProPopupBasic', ProPopupBasic)
    app.component('ProPopupNoChrome', ProPopupNoChrome)
    app.component('ProSwitchBasic', ProSwitchBasic)
    app.component('ProCheckboxGroupBasic', ProCheckboxGroupBasic)
    app.component('ProRadioGroupBasic', ProRadioGroupBasic)
    app.component('ProSelectDisabled', ProSelectDisabled)
    app.component('ProSelectDropdownMultiple', ProSelectDropdownMultiple)
    app.component('ProSelectDropdownSingle', ProSelectDropdownSingle)
    app.component('ProSelectExternalValue', ProSelectExternalValue)
    app.component('ProSelectLocalOptions', ProSelectLocalOptions)
    app.component('ProSelectMethods', ProSelectMethods)
    app.component('ProSelectPopupMultiple', ProSelectPopupMultiple)
    app.component('ProSelectPopupSingle', ProSelectPopupSingle)
    app.component('ProSelectRequestError', ProSelectRequestError)
    app.component('ProSelectRequestParams', ProSelectRequestParams)
    app.component('ProSelectSlots', ProSelectSlots)
  },
} satisfies Theme
