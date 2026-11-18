import type { ReactNode } from 'react'
import { DataTableCell } from './DataTableCell'
import type { CellRenderer, Column, DataTableClassNames } from './types'
import { cx } from './utils'

export interface DataTableRowProps<T = any> {
  row: T
  index: number
  columns: Column<T>[]
  /** Per-column cell overrides keyed by column key. */
  cells?: Record<string, CellRenderer<T>>
  /** Renders the trailing actions cell. */
  actions?: (row: T, index: number) => ReactNode
  rowClass?: (row: T, index: number) => string | undefined
  onRowClick?: (row: T, index: number) => void
  classNames?: DataTableClassNames
}

/** A single <tr> with its <td> cells. */
export function DataTableRow<T = any>({
  row,
  index,
  columns,
  cells,
  actions,
  rowClass,
  onRowClick,
  classNames = {},
}: DataTableRowProps<T>) {
  return (
    <tr
      className={cx(
        'rsd-row',
        onRowClick && 'rsd-row--clickable',
        classNames.row,
        rowClass?.(row, index),
      )}
      onClick={onRowClick ? () => onRowClick(row, index) : undefined}
    >
      {columns.map((column, colIndex) => (
        <DataTableCell
          key={column.key}
          column={column}
          row={row}
          index={index}
          render={cells?.[column.key]}
          isFirst={colIndex === 0}
          className={classNames.td}
        />
      ))}
      {actions && (
        <DataTableCell className={cx('rsd-td--actions', classNames.actionsTd)}>
          {actions(row, index)}
        </DataTableCell>
      )}
    </tr>
  )
}
