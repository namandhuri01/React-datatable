import type { ReactNode } from 'react'

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ')


export function getValue(row: any, path: string): any {
  if (row == null) return undefined
  if (Object.prototype.hasOwnProperty.call(row, path)) return row[path]
  return path.split('.').reduce<any>((acc, k) => (acc == null ? acc : acc[k]), row)
}

export function formatValue(value: any): ReactNode {
  if (value == null) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function isEmptyValue(value: any): boolean {
  return value === undefined || value === null || value === ''
}
