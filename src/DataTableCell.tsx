import type { ReactNode } from 'react'
import type { CellRenderer, Column } from './types'
import { cx, formatValue, getValue } from './utils'

export interface DataTableCellProps<T = any> {
  /** Column definition. Omit when passing `children` (e.g. the actions cell). */
  column?: Column<T>
  row?: T
  index?: number
  /** Custom renderer, takes priority over `column.render`. */
  render?: CellRenderer<T>
  isFirst?: boolean
  className?: string
  colSpan?: number
  /** Overrides all automatic content. */
  children?: ReactNode
}

/** A single <td>. */
export function DataTableCell<T = any>({
  column,
  row,
  index = 0,
  render,
  isFirst,
  className,
  colSpan,
  children,
}: DataTableCellProps<T>) {
  let content: ReactNode = children
  if (children === undefined && column) {
    const value = getValue(row, column.key)
    const renderer = render ?? column.render
    content = renderer ? renderer({ row: row as T, value, index }) : formatValue(value)
  }

  return (
    <td colSpan={colSpan} className={cx('rsd-td', isFirst && 'rsd-td--first', className, column?.className)}>
      {content}
    </td>
  )
}
