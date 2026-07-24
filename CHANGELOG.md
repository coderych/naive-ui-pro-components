# 变更日志

## 0.4.0

### 新增

- 新增 `ProSelect` 高级选择器组件，支持 `dropdown` 和 `popup` 两种选择模式。
  - `dropdown` 模式：基于 `NSelect`，支持远程搜索、滚动分页、默认值补全。
  - `popup` 模式：通过 `ProPopup + ProTable` 实现弹窗选择，支持 `modal` 和 `drawer` 两种预设。
  - 支持单选和多选，统一 `modelValue`、`selectedKeys`、`selectedRows` 数据协议。
  - 支持 `requestParams`、`searchField`、`pageFields` 等自定义配置。
  - 提供 `button`、`popup-*`、`table-*` 前缀插槽，避免同名冲突。
  - 通过 `ref` 暴露 `ProSelectInst`，包含 `selectedKeys`、`selectedRows`、`table`、`popup` 等增强字段。
- 国际化新增 `selectText` 消息，用于 ProSelect 入口按钮默认文案。
- 新增 ProSelect 组件文档和演示示例。
- 新增 ProSelect 单元测试。

## 0.3.1

### 修复

- 修复 `ProTable` 全屏模式在部分浏览器中定位失效的问题，将 `inset: 0` 替换为独立的 `top`、`left`、`right`、`bottom` 属性。

## 0.3.0

### 新增

- `ProTable` 新增 `title` 属性，用于设置工具栏标题，同名插槽优先级更高。

### 修复

- 修复 `ProForm` 下拉框第一次选择后仍可能使用旧值执行必填校验的问题。

### 优化

- 优化 `ProTable` 的 `title` 属性样式，增强标题的视觉层级与主题辨识度，自定义 `title` 插槽不受影响。

## 0.2.1

### 新增

- `ProTable` 新增 `showIndex` 和 `continuousIndex` 属性，支持页内序号与跨页连续序号。
- 批量选择列和序号列现在可通过列设置调整显示、顺序和固定位置。
- `ProTable` 的 `header`、`header-extra` 和 `title` 插槽新增选中行 `keys`、`rows` 参数。

### 优化

- `ProTableInst` 中继承的 `DataTableInst` 方法改为必选，通过 `ref` 调用时不再提示方法可能未定义。
- `ProTable` 列设置的列表区域改用 Naive UI `NScrollbar`，顶部全选与重置操作保持固定。

## 0.2.0

### 新增

- `ProForm` 现在通过组件 `ref` 暴露 Naive UI `FormInst` 的实例方法，并导出 `ProFormInst` 类型。
- `ProTable` 现在通过组件 `ref` 暴露 Naive UI `DataTableInst` 的实例方法，同时保留 `reload`、`request`、`reset`、`search`、`setParams` 和 `updateParams` 等增强 API。
- 为 `ProForm` 和 `ProTable` 增加实例方法示例与 API 文档。
- 为国际化配置增加中英文切换组件演示。
- 增加组件实例 API 透传及 `ProTable` 原生方法调用测试。

### 修复

- 修复 `ProCheckboxGroup`、`ProRadioGroup`、`ProSwitch` 和 `ProPopup` 无法通过组件 `ref` 访问底层 Naive UI 实例 API 的问题。
- 修复 `ProTable` 使用自定义表格内容时调用原生 `DataTableInst` 方法可能抛出异常的问题。
- 修复 `ProRadioGroup` 和 `ProTable` 部分样式未正确响应 Naive UI 主题变量的问题。

### 优化

- 精简组件文档结构，统一示例代码风格。
- 更新 ESLint 配置以兼容 ESLint 9。
- 优化 CI 配置，更新 Node.js 版本矩阵。

## 0.1.0

### 新增

- 初始版本发布。
- 包含 `ProTable`、`ProForm`、`ProPopup`、`ProCheckboxGroup`、`ProRadioGroup`、`ProSwitch` 等组件。
- 支持国际化配置。
- 支持 Naive UI 主题变量。
