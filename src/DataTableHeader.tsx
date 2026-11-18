import type { ReactNode } from 'react'
import type { Column, DataTableClassNames } from './types'
import { cx } from './utils'

function SortIcon({ active, desc }: { active: boolean; desc: boolean }) {
  return (
    <svg
      className={cx('rsd-sort-icon', active && 'rsd-sort-icon--active', active && desc && 'rsd-sort-icon--desc')}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}

export interface DataTableHeaderProps<T = any> {
  columns: Column<T>[]
  sortBy?: string
  sortDir?: string
  onSort?: (key: string) => void
  /** Adds the trailing actions <th>. */
  hasActions?: boolean
  actionsLabel?: ReactNode
  classNames?: DataTableClassNames
}

/** The <thead> with sortable column headers. */
export function DataTableHeader<T = any>({
  columns,
  sortBy = '',
  sortDir = 'asc',
  onSort,
  hasActions,
  actionsLabel = 'Actions',
  classNames = {},
}: DataTableHeaderProps<T>) {
  return (
    <thead className={classNames.thead}>
      <tr className={classNames.headerRow}>
        {columns.map((col) => {
          const isActive = sortBy === col.key
          const sortable = !!col.sortable
          return (
            <th
              key={col.key}
              scope="col"
              className={cx('rsd-th', sortable && 'rsd-th--sortable', classNames.th, col.headerClassName)}
              aria-sort={sortable && isActive ? (sortDir === 'desc' ? 'descending' : 'ascending') : undefined}
              tabIndex={sortable ? 0 : undefined}
              onClick={sortable ? () => onSort?.(col.key) : undefined}
              onKeyDown={
                sortable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSort?.(col.key)
                      }
                    }
                  : undefined
              }
            >
              <div className="rsd-th-inner">
                {col.label}
                {sortable && <SortIcon active={isActive} desc={sortDir === 'desc'} />}
              </div>
            </th>
          )
        })}
        {hasActions && (
          <th scope="col" className={cx('rsd-th', 'rsd-th--actions', classNames.actionsTh)}>
            {actionsLabel}
          </th>
        )}
      </tr>
    </thead>
  )
}
