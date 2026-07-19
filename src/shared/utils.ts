import type { Component, Slots, VNode } from 'vue'
import { h } from 'vue'

/**
 * Pick specific props from a source object, excluding specified keys.
 */
export function pickProps(
  source: Record<string, unknown>,
  keys: string[],
  excludedKeys: string[] = [],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of keys) {
    if (!excludedKeys.includes(key) && source[key] !== undefined) {
      result[key] = source[key]
    }
  }
  return result
}

/**
 * Create a text render function for slot content.
 */
export function createTextSlot(
  value?: string | number,
): (() => VNode) | undefined {
  if (value === undefined || value === null)
    return undefined
  return () => h('span', String(value))
}

/**
 * Create an icon render function for slot content.
 */
export function createIconSlot(
  icon?: Component,
): (() => VNode) | undefined {
  if (!icon)
    return undefined
  return () => h(icon)
}

/**
 * Format width value to CSS string.
 */
export function formatWidth(width?: string | number): string | undefined {
  if (width === undefined || width === null)
    return undefined
  if (typeof width === 'number')
    return `${width}px`
  return width
}

/**
 * Invoke a single handler or an array of handlers.
 */
export function invokeHandlers(
  handlers: ((...args: any[]) => void) | ((...args: any[]) => void)[] | undefined,
  ...args: any[]
): void {
  if (!handlers)
    return
  if (Array.isArray(handlers)) {
    for (const handler of handlers) {
      handler(...args)
    }
  }
  else {
    handlers(...args)
  }
}

/**
 * Safely extract a key from a table column.
 */
export function getColumnKey(column: Record<string, unknown>): string | number {
  return (column.key ?? column.dataIndex ?? '') as string | number
}

/**
 * Safely extract a title from a table column.
 */
export function getColumnTitle(
  column: Record<string, unknown>,
  fallback = '',
): string {
  const title = column.title
  if (typeof title === 'function')
    return title() as string
  return (title ?? fallback) as string
}

/**
 * Parse a width value to a finite number.
 */
export function parseWidth(
  width?: string | number,
  fallback = 100,
): number {
  if (width === undefined || width === null)
    return fallback
  if (typeof width === 'number')
    return Number.isFinite(width) ? width : fallback
  const parsed = Number.parseInt(width, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * Run a promise safely, swallowing errors.
 */
export function runSafely(promise: Promise<any>): void {
  void promise.catch(() => undefined)
}

/**
 * Deep get value by path (supports dot and bracket notation).
 */
export function get(obj: any, path: string): any {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = obj
  for (const key of keys) {
    if (result === undefined || result === null)
      return undefined
    result = result[key]
  }
  return result
}

/**
 * Deep set value by path (supports dot and bracket notation).
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined || current[key] === null) {
      current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {}
    }
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
}

/**
 * Merge slots from props and slots object, with props taking priority.
 */
export function mergeSlots(
  slotRenders: Record<string, (() => VNode | VNode[] | undefined) | undefined>,
  slots: Slots,
): Record<string, (() => VNode | VNode[] | undefined) | undefined> {
  const merged: Record<string, (() => VNode | VNode[] | undefined) | undefined> = {}
  for (const [key, fn] of Object.entries(slotRenders)) {
    if (slots[key]) {
      merged[key] = (...args: any[]) => slots[key]!(...args)
    }
    else if (fn) {
      merged[key] = fn
    }
  }
  return merged
}

/**
 * Check if a slot has content.
 */
export function hasSlot(slots: Slots, name = 'default'): boolean {
  return !!slots[name]
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounced = ((...args: any[]) => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T & { cancel: () => void }
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  return debounced
}

/**
 * Generate a unique ID.
 */
let idCounter = 0
export function uniqueId(prefix = 'npro'): string {
  return `${prefix}_${++idCounter}`
}

/**
 * Check if a value is a Vue component.
 */
export function isComponent(value: unknown): value is Component {
  if (!value)
    return false
  if (typeof value === 'function')
    return true
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    return 'setup' in obj || 'render' in obj || '__vccOpts' in obj
  }
  return false
}

/**
 * Render a slot or fallback to a render function.
 */
export function renderSlotOr(
  slots: Slots,
  name: string,
  fallback?: () => VNode | VNode[] | undefined,
  props?: Record<string, unknown>,
): VNode | VNode[] | undefined {
  if (slots[name])
    return slots[name]!(props)
  return fallback?.()
}
