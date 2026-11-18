# react-slot-datatable

A tiny, dependency-free React DataTable. Pass `columns` + `data`, override any cell, add a row-actions column. The React take on the Vue "slot" DataTable pattern.

## Install

```bash
npm install react-slot-datatable
```

```tsx
import { DataTable } from 'react-slot-datatable'
import 'react-slot-datatable/styles.css' // optional default theme
```

Peer deps: `react >= 17`, `react-dom >= 17`.

## Quick start

```tsx
import { useState } from 'react'
import { DataTable, type Column } from 'react-slot-datatable'

type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  deleted_at: string | null
}

const columns: Column<User>[] = [
  { key: 'first_name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
]

export function Users({ users }: { users: User[] }) {
  const [sortBy, setSortBy] = useState('first_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (key === sortBy) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else {
      setSortBy(key)
      setSortDir('asc')
    }
    // ...refetch from your API with the new sort here
  }

  return (
    <DataTable<User>
      columns={columns}
      data={users}
      sortBy={sortBy}
      sortDir={sortDir}
      onSort={handleSort}
      emptyMessage="No Users Found!"
      rowClass={(row) => (row.deleted_at ? 'bg-red-100 hover:bg-red-200' : undefined)}
      cells={{
        first_name: ({ row }) => `${row.first_name} ${row.last_name}`,
      }}
      actions={(row) => (
        <>
          <button onClick={() => console.log('show', row.id)}>Show</button>
          <button onClick={() => console.log('edit', row.id)}>Edit</button>
          <button onClick={() => console.log('delete', row.id)}>Delete</button>
        </>
      )}
      footer={<span>{users.length} users</span>}
    />
  )
}
```

## Vue → React cheat sheet

| Vue                                     | React                                      |
| --------------------------------------- | ------------------------------------------ |
| `@sort="handleSort"`                    | `onSort={handleSort}`                      |
| `:sort-by` / `:sort-dir`                | `sortBy` / `sortDir`                       |
| `empty-message="..."`                   | `emptyMessage="..."`                       |
| `:row-class="(row) => ..."`             | `rowClass={(row) => ...}`                  |
| `<template #cell-first_name="{ row }">` | `cells={{ first_name: ({ row }) => ... }}` |
| `<template #actions="{ row }">`         | `actions={(row) => ...}`                   |
| `<template #footer>`                    | `footer={...}`                             |

## Props

| Prop           | Type                                                | Description                                                         |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `columns`      | `Column[]`                                          | Column definitions (see below).                                     |
| `data`         | `T[]`                                               | Row objects.                                                        |
| `sortBy`       | `string`                                            | Currently sorted column key.                                        |
| `sortDir`      | `'asc' \| 'desc'`                                   | Current direction. Default `'asc'`.                                 |
| `onSort`       | `(key: string) => void`                             | Fired when a sortable header is clicked or Enter/Space is pressed.  |
| `filters`      | `Filter[]`                                          | Shows a filter bar above the table (see **Filters**).               |
| `filterValues` | `Record<string, any>`                               | Current filter values (controlled).                                 |
| `onFilterChange` | `(key, value) => void`                            | Fired when a filter changes.                                        |
| `onFilterReset` | `() => void`                                       | Adds a Reset button once any filter has a value.                    |
| `filterDebounce` | `number`                                          | Debounce (ms) for text/number filters. Default `300`.               |
| `emptyMessage` | `ReactNode`                                         | Shown when `data` is empty. Default `'No data found.'`.             |
| `loading`      | `boolean`                                           | Show `loadingMessage` instead of rows.                              |
| `rowClass`     | `(row, index) => string \| undefined`               | Dynamic class per row.                                              |
| `rowKey`       | `(row, index) => string \| number`                  | Row key. Defaults to `row.id`, then the index.                      |
| `onRowClick`   | `(row, index) => void`                              | Row click handler.                                                  |
| `cells`        | `Record<key, ({ row, value, index }) => ReactNode>` | Per-column cell override.                                           |
| `actions`      | `(row, index) => ReactNode`                         | Adds an extra **Actions** column (edit / show / delete / anything). |
| `actionsLabel` | `ReactNode`                                         | Header of the actions column. Default `'Actions'`.                  |
| `footer`       | `ReactNode`                                         | Area below the table, for pagination or counts.                     |
| `classNames`   | `DataTableClassNames`                               | Override classes of inner elements (works great with Tailwind).     |

## Filters

Pass `filters` to show a filter bar. It is controlled, like sorting: you own the values and decide what to do on change (refetch from your API, filter locally, etc.). Without `filters`, no bar is rendered.

```tsx
const filters: Filter[] = [
  { key: 'search', label: 'Search', type: 'text', placeholder: 'Name or email' },
  { key: 'role', label: 'Role', type: 'select', options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
  ]},
  { key: 'created_from', label: 'From', type: 'date' },
  // fully custom field
  { key: 'active', label: 'Active', render: ({ value, onChange }) => (
      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
  )},
]

const [values, setValues] = useState<Record<string, any>>({})

<DataTable
  columns={columns}
  data={users}
  filters={filters}
  filterValues={values}
  onFilterChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
  onFilterReset={() => setValues({})}
/>
```

`type` is `'text' | 'number' | 'date' | 'select'` (default `'text'`). Text and number inputs are debounced (`filterDebounce`, default 300 ms); select and date fire immediately.

## Individual components

`DataTable` is composed of smaller components, all exported, so you can build a custom layout:

| Component           | Renders                                   |
| ------------------- | ----------------------------------------- |
| `DataTableFilters`  | the filter bar                            |
| `DataTableHeader`   | `<thead>` with sortable `<th>` cells      |
| `DataTableRow`      | one `<tr>` with its cells and actions     |
| `DataTableCell`     | one `<td>` (pass `children` to override)  |
| `DataTableFooter`   | the area below the table                  |

```tsx
import { DataTableHeader, DataTableRow, DataTableFooter } from 'react-slot-datatable'

<table className="rsd-table">
  <DataTableHeader columns={columns} sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
  <tbody>
    {users.map((u, i) => (
      <DataTableRow key={u.id} row={u} index={i} columns={columns} />
    ))}
  </tbody>
</table>
<DataTableFooter>{users.length} users</DataTableFooter>
```

### `Column`

```ts
{
  key: string            // property on the row; dot paths like "user.name" work
  label: ReactNode
  sortable?: boolean
  render?: ({ row, value, index }) => ReactNode  // alternative to `cells`
  className?: string
  headerClassName?: string
}
```

Cell render priority: `cells[key]` → `column.render` → raw value.

## Theming

The default stylesheet uses CSS variables on `.rsd-wrapper`:

```css
.rsd-wrapper {
  --rsd-border: #e5e7eb;
  --rsd-muted: #f3f4f6;
  --rsd-primary: #2563eb;
  --rsd-radius: 6px;
}
```

Skip the stylesheet entirely and style the `rsd-*` classes yourself, or pass Tailwind classes through `classNames`:

```tsx
<DataTable classNames={{ wrapper: 'rounded-md border', th: 'text-sm', row: 'hover:bg-muted/50' }} ... />
```

## Publishing

```bash
npm login
npm publish --access public   # runs typecheck + build first (prepublishOnly)
```

Change the `name` in `package.json` if `react-slot-datatable` is taken.

## License

MIT
