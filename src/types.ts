import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

/** Passed to custom cell renderers. */
export interface CellContext<T = any> {
  row: T
  value: any
  index: number
}

export type CellRenderer<T = any> = (ctx: CellContext<T>) => ReactNode

export interface Column<T = any> {
  /** Property key on the row. Supports dot paths, e.g. "user.name". */
  key: string
  /** Header label. */
  label: ReactNode
  /** Enable click-to-sort on this column. */
  sortable?: boolean
  /** Custom cell renderer for this column (alternative to the `cells` prop). */
  render?: CellRenderer<T>
  /** Extra class for every <td> in this column. */
  className?: string
  /** Extra class for the <th> of this column. */
  headerClassName?: string
}

export type FilterType = 'text' | 'number' | 'date' | 'select'

export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterRenderContext {
  value: any
  onChange: (value: any) => void
}

export interface Filter {
  /** Key used in `filterValues` / `onFilterChange`. */
  key: string
  /** Label shown above the field. */
  label?: string
  /** Defaults to 'text'. */
  type?: FilterType
  placeholder?: string
  /** Options for type 'select'. */
  options?: FilterOption[]
  /** Extra class for this filter's wrapper. */
  className?: string
  /** Fully custom field; overrides `type`. */
  render?: (ctx: FilterRenderContext) => ReactNode
}

/** Override class names of internal elements (handy with Tailwind). */
export interface DataTableClassNames {
  wrapper?: string
  table?: string
  thead?: string
  headerRow?: string
  th?: string
  tbody?: string
  row?: string
  td?: string
  empty?: string
  actionsTh?: string
  actionsTd?: string
  footer?: string
  filters?: string
  filterField?: string
  filterInput?: string
  filterReset?: string
}

export interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]

  /** Currently sorted column key (controlled by the parent). */
  sortBy?: string
  /** 'asc' | 'desc' */
  sortDir?: SortDirection | string
  /** Called with the column key when a sortable header is clicked. */
  onSort?: (key: string) => void

  /**
   * Filter definitions. Pass this to show a filter bar above the table.
   * Controlled: keep values in your state via `filterValues` + `onFilterChange`.
   */
  filters?: Filter[]
  filterValues?: Record<string, any>
  onFilterChange?: (key: string, value: any) => void
  /** If provided, a Reset button appears once any filter has a value. */
  onFilterReset?: () => void
  /** Debounce (ms) for text / number inputs. Default 300. */
  filterDebounce?: number

  /** Text shown when `data` is empty. */
  emptyMessage?: ReactNode
  /** Show a loading row instead of data. */
  loading?: boolean
  loadingMessage?: ReactNode

  /** Dynamic class for each row, e.g. highlight soft-deleted rows. */
  rowClass?: (row: T, index: number) => string | undefined
  /** Unique key for a row. Defaults to `row.id`, then the index. */
  rowKey?: (row: T, index: number) => string | number
  /** Called when a row is clicked. */
  onRowClick?: (row: T, index: number) => void

  /**
   * Per-column cell overrides — the React equivalent of Vue's `#cell-{key}` slots.
   * cells={{ first_name: ({ row }) => <b>{row.first_name}</b> }}
   */
  cells?: Record<string, CellRenderer<T>>

  /**
   * Renders the extra "Actions" column: buttons like edit / show / delete.
   * The column is only added when this prop is provided.
   */
  actions?: (row: T, index: number) => ReactNode
  actionsLabel?: ReactNode

  /** Pagination / counts area under the table. */
  footer?: ReactNode

  classNames?: DataTableClassNames
}
