import { describe, expect, it } from 'vitest'
import {
  createTextSlot,
  debounce,
  formatWidth,
  get,
  getColumnKey,
  getColumnTitle,
  invokeHandlers,
  parseWidth,
  pickProps,
  set,
  uniqueId,
} from '../shared/utils'

describe('shared/utils', () => {
  describe('pickProps', () => {
    it('should pick specified keys', () => {
      const source = { a: 1, b: 2, c: 3 }
      expect(pickProps(source, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })

    it('should exclude specified keys', () => {
      const source = { a: 1, b: 2, c: 3 }
      expect(pickProps(source, ['a', 'b', 'c'], ['b'])).toEqual({ a: 1, c: 3 })
    })

    it('should skip undefined values', () => {
      const source = { a: 1, b: undefined, c: 3 }
      expect(pickProps(source, ['a', 'b', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('createTextSlot', () => {
    it('should return undefined for undefined input', () => {
      expect(createTextSlot(undefined)).toBeUndefined()
    })

    it('should return a function for string input', () => {
      const fn = createTextSlot('hello')
      expect(typeof fn).toBe('function')
    })

    it('should return a function for number input', () => {
      const fn = createTextSlot(42)
      expect(typeof fn).toBe('function')
    })
  })

  describe('formatWidth', () => {
    it('should return undefined for undefined', () => {
      expect(formatWidth(undefined)).toBeUndefined()
    })

    it('should convert number to px string', () => {
      expect(formatWidth(800)).toBe('800px')
    })

    it('should pass through string', () => {
      expect(formatWidth('50%')).toBe('50%')
    })
  })

  describe('get', () => {
    it('should get top-level value', () => {
      expect(get({ a: 1 }, 'a')).toBe(1)
    })

    it('should get nested value with dot notation', () => {
      expect(get({ a: { b: 2 } }, 'a.b')).toBe(2)
    })

    it('should get nested value with bracket notation', () => {
      expect(get({ a: [{ b: 1 }] }, 'a[0].b')).toBe(1)
    })

    it('should return undefined for missing path', () => {
      expect(get({}, 'a.b.c')).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should set top-level value', () => {
      const obj = { a: 1 }
      set(obj, 'a', 2)
      expect(obj.a).toBe(2)
    })

    it('should set nested value', () => {
      const obj = { a: { b: 1 } } as any
      set(obj, 'a.b', 2)
      expect(obj.a.b).toBe(2)
    })

    it('should create intermediate objects', () => {
      const obj = {} as any
      set(obj, 'a.b.c', 1)
      expect(obj.a.b.c).toBe(1)
    })
  })

  describe('parseWidth', () => {
    it('should return fallback for undefined', () => {
      expect(parseWidth(undefined)).toBe(100)
    })

    it('should parse number', () => {
      expect(parseWidth(200)).toBe(200)
    })

    it('should parse string number', () => {
      expect(parseWidth('300px')).toBe(300)
    })

    it('should return fallback for NaN', () => {
      expect(parseWidth('abc')).toBe(100)
    })
  })

  describe('getColumnKey', () => {
    it('should return key', () => {
      expect(getColumnKey({ key: 'name' })).toBe('name')
    })

    it('should return number key', () => {
      expect(getColumnKey({ key: 1 })).toBe(1)
    })

    it('should return empty string for missing key', () => {
      expect(getColumnKey({})).toBe('')
    })
  })

  describe('getColumnTitle', () => {
    it('should return title string', () => {
      expect(getColumnTitle({ title: 'Name' }, 'key')).toBe('Name')
    })

    it('should return fallback for missing title', () => {
      expect(getColumnTitle({}, 'fallback')).toBe('fallback')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let count = 0
      const fn = debounce(() => {
        count++
      }, 50)
      fn()
      fn()
      fn()
      expect(count).toBe(0)
      await new Promise(r => setTimeout(r, 100))
      expect(count).toBe(1)
    })

    it('should support cancel', async () => {
      let count = 0
      const fn = debounce(() => {
        count++
      }, 50)
      fn()
      fn.cancel()
      await new Promise(r => setTimeout(r, 100))
      expect(count).toBe(0)
    })
  })

  describe('uniqueId', () => {
    it('should generate unique ids', () => {
      const id1 = uniqueId()
      const id2 = uniqueId()
      expect(id1).not.toBe(id2)
    })

    it('should use custom prefix', () => {
      const id = uniqueId('test')
      expect(id).toMatch(/^test_/)
    })
  })

  describe('invokeHandlers', () => {
    it('should invoke single handler', () => {
      let called = false
      invokeHandlers(() => {
        called = true
      })
      expect(called).toBe(true)
    })

    it('should invoke array of handlers', () => {
      const calls: number[] = []
      invokeHandlers([
        () => calls.push(1),
        () => calls.push(2),
      ])
      expect(calls).toEqual([1, 2])
    })

    it('should handle undefined', () => {
      expect(() => invokeHandlers(undefined)).not.toThrow()
    })
  })
})
