import { mount } from '@vue/test-utils'
import { NDataTable, NInput } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TableHeader from '../pro-table/src/components/TableHeader'
import ProTable from '../pro-table/src/ProTable'

describe('proTable', () => {
  it('adds a selection column and invokes an action with selected rows', async () => {
    const onClick = vi.fn()
    const data = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' },
    ]
    const wrapper = mount(ProTable, {
      props: {
        batchActions: [{ key: 'delete', label: '批量删除', onClick }],
        columns: [{ key: 'name', title: '姓名' }],
        data,
        option: false,
      },
    })

    const table = wrapper.findComponent(NDataTable)
    const columns = table.props('columns') as Array<{ type?: string }>
    expect(columns[0]).toMatchObject({ type: 'selection' })

    table.vm.$emit('update:checkedRowKeys', [2])
    await nextTick()

    expect(wrapper.text()).toContain('已选择1 项')
    await wrapper.get('.npro-table__batch-bar button').trigger('click')
    expect(onClick).toHaveBeenCalledWith([2], [data[1]])
  })

  it('does not add a duplicate selection column', () => {
    const wrapper = mount(ProTable, {
      props: {
        batchActions: [{ key: 'delete', label: '批量删除', onClick: vi.fn() }],
        columns: [
          { type: 'selection' },
          { key: 'name', title: '姓名' },
        ],
        data: [],
        option: false,
      },
    })

    const columns = wrapper.findComponent(NDataTable).props('columns') as Array<{ type?: string }>
    expect(columns.filter(column => column.type === 'selection')).toHaveLength(1)
  })

  it('preserves multiple columns without keys', () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [
          { type: 'selection' },
          { type: 'expand', renderExpand: () => '详情' },
          { key: 'name', title: '姓名' },
        ],
        data: [],
        option: false,
      },
    })

    const columns = wrapper.findComponent(NDataTable).props('columns') as Array<{ type?: string }>
    expect(columns.map(column => column.type)).toEqual(['selection', 'expand', undefined])
  })

  it('controls the table header through option.tableHeader', async () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [{ key: 'name', title: '姓名' }],
        data: [],
        option: { tableHeader: false },
      },
    })

    expect(wrapper.findComponent(TableHeader).exists()).toBe(false)
    await wrapper.setProps({ option: { tableHeader: true } })
    expect(wrapper.findComponent(TableHeader).exists()).toBe(true)
  })

  it('locks page scrolling while fullscreen', async () => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'scroll'
    const wrapper = mount(ProTable, {
      props: {
        columns: [{ key: 'name', title: '姓名' }],
        data: [],
        option: { full: true },
      },
    })

    wrapper.findComponent(TableHeader).vm.$emit('update:full', true)
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.documentElement.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('auto')
    expect(document.documentElement.style.overflow).toBe('scroll')
  })

  it('exposes the documented table instance API', () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [],
        data: [],
        option: false,
      },
    })
    const table = wrapper.vm as unknown as {
      params: Record<string, unknown>
      setParams: (params: Record<string, unknown>) => void
    }

    table.setParams({ keyword: '测试' })

    expect(table.params).toEqual({ keyword: '测试' })
  })

  it('forwards the native data table API', () => {
    const wrapper = mount(ProTable, {
      props: { columns: [], data: [], option: false },
    })
    const nativeTable = wrapper.findComponent(NDataTable).vm as unknown as {
      clearSorter: () => void
    }
    const clearSorter = vi.spyOn(nativeTable, 'clearSorter')
    const table = wrapper.vm as unknown as { clearSorter: () => void }

    table.clearSorter()

    expect(clearSorter).toHaveBeenCalledOnce()
  })

  it('keeps native data table methods callable with custom table content', () => {
    const wrapper = mount(ProTable, {
      props: { columns: [], data: [], option: false },
      slots: { default: () => '自定义表格' },
    })
    const table = wrapper.vm as unknown as { clearSorter: () => void }

    expect(() => table.clearSorter()).not.toThrow()
  })

  it('applies effective disabled and clearable search props consistently', async () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [{
          key: 'name',
          title: '姓名',
          search: {
            clearable: false,
            disabled: false,
            props: { clearable: true, disabled: true },
          },
        }],
        defaultParams: { name: '默认值' },
        data: [],
        option: { tableHeader: false },
      },
    })

    const input = wrapper.findComponent(NInput)
    expect(input.props('clearable')).toBe(true)
    expect(input.props('disabled')).toBe(true)

    input.vm.$emit('update:value', '修改值')
    await nextTick()
    await wrapper.get('.npro-table-query__actions button').trigger('click')

    expect(input.props('value')).toBe('修改值')
  })
})
