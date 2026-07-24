import type { ProSelectInst, ProSelectRequestResult } from '../pro-select'
import { flushPromises, mount } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createProConfig } from '../config-provider'
import { ProPopup } from '../pro-popup'
import { mergeOptions, ProSelect } from '../pro-select'
import { ProTable } from '../pro-table'

interface User {
  id: number
  name: string
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

const users: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
]

describe('proSelect', () => {
  it('merges options by field while keeping a stable order', () => {
    expect(mergeOptions(
      [{ id: 1, name: '旧名称' }, { id: 2, name: '李四' }],
      [{ id: 1, name: '张三' }, { id: 3, name: '王五' }],
      'id',
    )).toEqual(users)
  })

  it('hydrates a default value and still requests page one when opened', async () => {
    const request = vi.fn(async (
      params: Record<string, unknown>,
      _selectedKeys: unknown,
    ): Promise<ProSelectRequestResult<User>> => {
      if (!('current' in params))
        return { data: [users[1]], total: 1 }
      return { data: users, total: users.length }
    })
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        modelValue: 2,
        request,
        valueField: 'id',
        virtualScroll: false,
      },
    })

    await flushPromises()
    expect(request).toHaveBeenNthCalledWith(1, {}, 2, null)
    expect((wrapper.vm as unknown as ProSelectInst<User>).selectedRows).toEqual(users[1])

    wrapper.findComponent(NSelect).vm.$emit('update:show', true)
    await flushPromises()

    expect(request).toHaveBeenNthCalledWith(
      2,
      { current: 1, keyword: '', size: 20 },
      2,
      users[1],
    )
    expect(wrapper.findComponent(NSelect).props('options')).toEqual(users)
    expect(wrapper.findComponent(NSelect).props('loading')).toBe(false)
  })

  it('appends the next dropdown page once and preserves selected options', async () => {
    const request = vi.fn(async (params: Record<string, unknown>) => {
      const page = params.current as number
      return { data: [users[page - 1]], total: 2 }
    })
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        pageSize: 1,
        request,
        valueField: 'id',
        virtualScroll: false,
      },
    })
    const select = wrapper.findComponent(NSelect)
    select.vm.$emit('update:show', true)
    await flushPromises()

    const target = {
      clientHeight: 100,
      isConnected: true,
      scrollHeight: 200,
      scrollTop: 100,
    }
    const onScroll = select.props('onScroll') as (event: Event) => Promise<void>
    const event = { target } as unknown as Event
    await Promise.all([onScroll(event), onScroll(event)])
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[1][0]).toMatchObject({ current: 2, size: 1 })
    expect(select.props('options')).toEqual(users.slice(0, 2))
    expect(target.scrollTop).toBe(100)
  })

  it('ignores an obsolete hydration response after an external value change', async () => {
    const first = deferred<ProSelectRequestResult<User>>()
    const second = deferred<ProSelectRequestResult<User>>()
    const request = vi.fn((_params: unknown, selectedKeys: unknown) =>
      selectedKeys === 1 ? first.promise : second.promise,
    )
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        modelValue: 1,
        request,
        valueField: 'id',
      },
    })

    await wrapper.setProps({ modelValue: 2 })
    second.resolve({ data: [users[1]], total: 1 })
    await flushPromises()
    first.resolve({ data: [users[0]], total: 1 })
    await flushPromises()

    expect((wrapper.vm as unknown as ProSelectInst<User>).selectedKeys).toBe(2)
    expect((wrapper.vm as unknown as ProSelectInst<User>).selectedRows).toEqual(users[1])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('allows a failed dropdown page to be retried', async () => {
    const request = vi.fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ data: users, total: users.length })
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        request,
        valueField: 'id',
        virtualScroll: false,
      },
    })
    const select = wrapper.findComponent(NSelect)

    select.vm.$emit('update:show', true)
    await flushPromises()
    select.vm.$emit('update:show', false)
    select.vm.$emit('update:show', true)
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('request-error')?.[0]?.[1]).toBe('dropdown')
    expect(select.props('options')).toEqual(users)
  })

  it('resets dropdown pagination after remote search changes', async () => {
    const request = vi.fn(async (params: Record<string, unknown>) => ({
      data: params.keyword ? [users[1]] : users,
      total: params.keyword ? 1 : users.length,
    }))
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        request,
        searchDebounce: 1,
        valueField: 'id',
        virtualScroll: false,
      },
    })
    const select = wrapper.findComponent(NSelect)
    select.vm.$emit('update:show', true)
    await flushPromises()

    const onSearch = select.props('onSearch') as (value: string) => void
    onSearch('李')
    await new Promise(resolve => setTimeout(resolve, 5))
    await flushPromises()

    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({
      current: 1,
      keyword: '李',
    })
    expect(select.props('options')).toEqual([users[1]])
  })

  it('commits popup selection only on confirmation', async () => {
    const wrapper = mount(ProSelect, {
      attachTo: document.body,
      props: {
        labelField: 'name',
        mode: 'popup',
        multiple: true,
        options: users,
        tableProps: { columns: [{ key: 'name', title: '姓名' }] },
        valueField: 'id',
      },
    })

    await wrapper.get('button').trigger('click')
    await nextTick()
    wrapper.findComponent(ProTable).vm.$emit('update:checkedRowKeys', [1, 2])
    await nextTick()

    wrapper.findComponent(ProPopup).vm.$emit('cancel')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('button').trigger('click')
    wrapper.findComponent(ProTable).vm.$emit('update:checkedRowKeys', [1, 2])
    wrapper.findComponent(ProPopup).vm.$emit('ok')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[1, 2]])
    expect(wrapper.emitted('change')?.[0]).toEqual([[1, 2], users.slice(0, 2)])
    wrapper.unmount()
  })

  it('uses the last temporary key for popup single selection', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        mode: 'popup',
        options: users,
        tableProps: { columns: [{ key: 'name', title: '姓名' }] },
        valueField: 'id',
      },
    })

    await wrapper.get('button').trigger('click')
    wrapper.findComponent(ProTable).vm.$emit('update:checkedRowKeys', [1, 2])
    wrapper.findComponent(ProPopup).vm.$emit('ok')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, users[1]])
  })

  it('preserves complete rows while selecting across popup pages', async () => {
    const request = vi.fn(async (
      params: Record<string, unknown>,
    ): Promise<ProSelectRequestResult<User>> => {
      if (!('current' in params))
        return { data: [users[0]], total: 1 }
      const page = params.current as number
      return { data: [users[page - 1]], total: users.length }
    })
    const wrapper = mount(ProSelect, {
      props: {
        labelField: 'name',
        mode: 'popup',
        modelValue: [1],
        multiple: true,
        pageSize: 1,
        request,
        tableProps: {
          columns: [{ key: 'name', title: '姓名' }],
          option: false,
        },
        valueField: 'id',
      },
    })

    await flushPromises()
    await wrapper.get('button').trigger('click')
    const popup = wrapper.findComponent(ProPopup)
    const afterEnter = popup.props('onAfterEnter') as () => void
    afterEnter()
    await flushPromises()

    const table = wrapper.findComponent(ProTable)
    const nativeTable = table.findComponent({ name: 'DataTable' })
    nativeTable.vm.$emit('update:page', 2)
    await flushPromises()
    table.vm.$emit('update:checkedRowKeys', [1, 2])
    popup.vm.$emit('ok')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual([[1, 2], users.slice(0, 2)])
  })

  it('exposes select, popup and table instances', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        mode: 'popup',
        options: users,
        tableProps: { columns: [{ key: 'name', title: '姓名' }] },
        valueField: 'id',
      },
    })

    await wrapper.get('button').trigger('click')
    await nextTick()
    const instance = wrapper.vm as unknown as ProSelectInst<User>

    expect(instance.select).not.toBeNull()
    expect(instance.popup).not.toBeNull()
    expect(instance.table).not.toBeNull()
    expect(typeof instance.table?.reload).toBe('function')
  })

  it('uses internationalized or custom popup button text', () => {
    const Provider = defineComponent({
      setup() {
        const { provide } = createProConfig({
          locale: key => `translated:${key}`,
        })
        provide()
        return () => h(ProSelect, { mode: 'popup' })
      },
    })
    const translated = mount(Provider)
    expect(translated.get('button').text()).toBe('translated:selectText')

    const custom = mount(ProSelect, {
      props: { buttonText: '选择客户', mode: 'popup' },
    })
    expect(custom.get('button').text()).toBe('选择客户')
  })
})
