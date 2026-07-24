import type {
  ProSelectKey,
  ProSelectModelValue,
  ProSelectRecord,
  ProSelectSelectedRows,
} from './types'

export function getOptionKey(
  option: ProSelectRecord,
  valueField: string,
): ProSelectKey | undefined {
  const value = option[valueField]
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

export function mergeOptions<T extends ProSelectRecord>(
  current: T[],
  incoming: T[],
  valueField = 'value',
): T[] {
  const result: T[] = []
  const indexes = new Map<ProSelectKey, number>()
  for (const option of [...current, ...incoming]) {
    const key = getOptionKey(option, valueField)
    if (key === undefined)
      continue
    const index = indexes.get(key)
    if (index === undefined) {
      indexes.set(key, result.length)
      result.push(option)
    }
    else {
      result[index] = { ...result[index], ...option }
    }
  }
  return result
}

export function normalizeKeys(
  value: ProSelectModelValue | undefined,
  multiple: boolean,
): ProSelectKey[] {
  if (value === null || value === undefined)
    return []
  const keys = Array.isArray(value) ? value : [value]
  return multiple ? [...keys] : keys.slice(-1)
}

export function findRowsByKeys<T extends ProSelectRecord>(
  keys: ProSelectKey[],
  options: T[],
  valueField: string,
): T[] {
  const rows = new Map(options.flatMap((row) => {
    const key = getOptionKey(row, valueField)
    return key === undefined ? [] : [[key, row] as const]
  }))
  return keys.flatMap(key => rows.has(key) ? [rows.get(key)!] : [])
}

export function toModelValue(
  keys: ProSelectKey[],
  multiple: boolean,
): ProSelectModelValue {
  return multiple ? keys : (keys[0] ?? null)
}

export function toSelectedRows<T>(
  rows: T[],
  multiple: boolean,
): ProSelectSelectedRows<T> {
  return multiple ? rows : (rows[0] ?? null)
}
