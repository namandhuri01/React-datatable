import { DataTableCell } from './DataTableCell'
import { DataTableFilters } from './DataTableFilters'
import { DataTableFooter } from './DataTableFooter'
import { DataTableHeader } from './DataTableHeader'
import { DataTableRow } from './DataTableRow'
import type { DataTableProps } from './types'
import { cx } from './utils'

export function DataTable<T = any>({
  columns,
  data,
  sortBy = '',
  sortDir = 'asc',
  onSort,
  filters,
  filterValues,
  onFilterChange,
  onFilterReset,
  filterDebounce = 300,
  emptyMessage = 'No data found.',
  loading = false,
  loadingMessage = 'Loading...',
  rowClass,
  rowKey,
  onRowClick,
  cells,
  actions,
  actionsLabel = 'Actions',
  footer,
  classNames = {},
}: DataTableProps<T>) {
  const rows = data ?? []
  const colSpan = columns.length + (actions ? 1 : 0)

  return (
    <>
      {filters && filters.length > 0 && (
        <DataTableFilters
          filters={filters}
          values={filterValues}
          onChange={onFilterChange}
          onReset={onFilterReset}
          debounce={filterDebounce}
          classNames={classNames}
        />
      )}

      <div className={cx('rsd-wrapper', classNames.wrapper)}>
        <table className={cx('rsd-table', classNames.table)}>
          <DataTableHeader
            columns={columns}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={onSort}
            hasActions={!!actions}
            actionsLabel={actionsLabel}
            classNames={classNames}
          />

          <tbody className={classNames.tbody}>
            {loading || rows.length === 0 ? (
              <tr>
                <DataTableCell colSpan={colSpan} className={cx('rsd-empty', classNames.empty)}>
                  {loading ? loadingMessage : emptyMessage}
                </DataTableCell>
              </tr>
            ) : (
              rows.map((row, index) => (
                <DataTableRow
                  key={rowKey ? rowKey(row, index) : (row as any)?.id ?? index}
                  row={row}
                  index={index}
                  columns={columns}
                  cells={cells}
                  actions={actions}
                  rowClass={rowClass}
                  onRowClick={onRowClick}
                  classNames={classNames}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <DataTableFooter className={classNames.footer}>{footer}</DataTableFooter>
    </>
  )
}
