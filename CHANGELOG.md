# 变更日志

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

- `ProForm` 现在通过组件 `ref` 暴露 Naive UI `FormInst` 的实例方法，并导出 `ProFormInst` 类型。
- `ProTable` 现在通过组件 `ref` 暴露 Naive UI `DataTableInst` 的实例方法，同时保留 `reload`、`request`、`reset`、`search`、`setParams` 和 `updateParams` 等增强 API。
- 为 `ProForm` 和 `ProTable` 增加实例方法示例与 API 文档。
- 为国际化配置增加中英文切换组件演示。
- 增加组件实例 API 透传及 `ProTable` 原生方法调用测试。

### 修复

- 修复 `ProCheckboxGroup`、`ProRadioGroup`、`ProSwitch` 和 `ProPopup` 无法通过组件 `ref` 访问底层 Naive UI 实例 API 的问题。
- 修复 `ProTable` 使用自定义表格内容时调用原生 `DataTableInst` 方法可能抛出异常的问题。
- 修复 `ProRadioGroup` 和 `ProTable` 部分样式未正确响应 Naive UI 主题变量的问题。
