import { mount } from '@vue/test-utils'
import { NDataTable, NInput } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TableHeader from '../pro-table/src/components/TableHeader'
import ProTable from '../pro-table/src/ProTable'

describe('proTable', () => {
  it('uses the Naive UI scrollbar for column settings', async () => {
    const header = mount(TableHeader, {
      attachTo: document.body,
      props: {
        columnOptions: [{ key: 'name', label: '姓名', fixed: undefined }],
        full: false,
        loading: false,
        option: { setting: true },
        size: 'medium',
        visibleKeys: ['name'],
      },
    })

    await header.get('[aria-label="列设置"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.npro-table-header__setting-scrollbar')).not.toBeNull()
    header.unmount()
  })

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

  it('exposes selected keys and rows to table header slots', async () => {
    const data = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' },
    ]
    const header = vi.fn(() => '自定义表头')
    const title = vi.fn(() => '标题')
    const headerExtra = vi.fn(() => '额外操作')
    const wrapper = mount(ProTable, {
      props: {
        batchActions: [{ key: 'delete', label: '批量删除', onClick: vi.fn() }],
        columns: [{ key: 'name', title: '姓名' }],
        data,
      },
      slots: { title, 'header-extra': headerExtra },
    })

    wrapper.findComponent(NDataTable).vm.$emit('update:checkedRowKeys', [2])
    await nextTick()

    expect(title).toHaveBeenLastCalledWith({ keys: [2], rows: [data[1]] })
    expect(headerExtra).toHaveBeenLastCalledWith({ keys: [2], rows: [data[1]] })

    const customHeaderWrapper = mount(ProTable, {
      props: {
        batchActions: [{ key: 'delete', label: '批量删除', onClick: vi.fn() }],
        columns: [{ key: 'name', title: '姓名' }],
        data,
      },
      slots: { header },
    })
    customHeaderWrapper.findComponent(NDataTable).vm.$emit('update:checkedRowKeys', [1])
    await nextTick()

    expect(header).toHaveBeenLastCalledWith({ keys: [1], rows: [data[0]] })
  })

  it('renders the title prop and lets the title slot override it', () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [{ key: 'name', title: '姓名' }],
        title: '用户列表',
      },
    })

    expect(wrapper.find('.npro-table-header__title-content').text()).toBe('用户列表')

    const slotWrapper = mount(ProTable, {
      props: {
        columns: [{ key: 'name', title: '姓名' }],
        title: '用户列表',
      },
      slots: {
        title: () => '自定义标题',
      },
    })

    expect(slotWrapper.find('.npro-table-header__title').text()).toBe('自定义标题')
    expect(slotWrapper.find('.npro-table-header__title-content').exists()).toBe(false)
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

  it('includes the generated selection column in column settings', async () => {
    const wrapper = mount(ProTable, {
      props: {
        batchActions: [{ key: 'delete', label: '批量删除', onClick: vi.fn() }],
        columns: [{ key: 'name', title: '姓名' }],
        data: [],
      },
    })

    const header = wrapper.findComponent(TableHeader)
    const options = header.props('columnOptions') as Array<{ key: string, label: string }>
    expect(options).toContainEqual({ key: '__npro_selection__', label: '选择', fixed: undefined })

    header.vm.$emit('update:visibleKeys', ['name'])
    await nextTick()
    expect((wrapper.findComponent(NDataTable).props('columns') as Array<{ type?: string }>)
      .some(column => column.type === 'selection')).toBe(false)
  })

  it('renders page-local and continuous row indexes and exposes the index column setting', async () => {
    const wrapper = mount(ProTable, {
      props: {
        columns: [{ key: 'name', title: '姓名' }],
        data: Array.from({ length: 20 }, (_, index) => ({ id: index + 1, name: `用户${index + 1}` })),
        pagination: { page: 2, pageSize: 10 },
        showIndex: true,
      },
    })

    const header = wrapper.findComponent(TableHeader)
    expect(header.props('columnOptions')).toContainEqual({
      key: '__npro_index__',
      label: '序号',
      fixed: undefined,
    })

    const getIndexRender = () => {
      const columns = wrapper.findComponent(NDataTable).props('columns') as Array<{
        key?: string
        render?: (row: unknown, index: number) => number
      }>
      return columns.find(column => column.key === '__npro_index__')!.render!
    }
    expect(getIndexRender()({}, 0)).toBe(11)

    await wrapper.setProps({ continuousIndex: false })
    expect(getIndexRender()({}, 0)).toBe(1)

    header.vm.$emit('update:visibleKeys', ['name'])
    await nextTick()
    expect((wrapper.findComponent(NDataTable).props('columns') as Array<{ key?: string }>)
      .some(column => column.key === '__npro_index__')).toBe(false)
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
        showIndex: false,
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
