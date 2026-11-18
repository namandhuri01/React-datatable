import { useEffect, useRef, useState } from 'react'
import type { DataTableClassNames, Filter } from './types'
import { cx, isEmptyValue } from './utils'

interface DebouncedInputProps {
  type: 'text' | 'number'
  value: any
  delay: number
  placeholder?: string
  className?: string
  onChange: (value: string) => void
}

/** Keeps typing responsive locally and notifies the parent after `delay` ms. */
function DebouncedInput({ type, value, delay, placeholder, className, onChange }: DebouncedInputProps) {
  const [local, setLocal] = useState<string>(value ?? '')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={local}
      onChange={(e) => {
        const next = e.target.value
        setLocal(next)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => onChange(next), delay)
      }}
    />
  )
}

export interface DataTableFiltersProps {
  filters: Filter[]
  values?: Record<string, any>
  onChange?: (key: string, value: any) => void
  onReset?: () => void
  debounce?: number
  resetLabel?: string
  classNames?: DataTableClassNames
}

/** The filter bar rendered above the table. */
export function DataTableFilters({
  filters,
  values = {},
  onChange,
  onReset,
  debounce = 300,
  resetLabel = 'Reset',
  classNames = {},
}: DataTableFiltersProps) {
  if (!filters.length) return null

  const hasValue = filters.some((f) => !isEmptyValue(values[f.key]))
  const inputClass = cx('rsd-filter-input', classNames.filterInput)

  return (
    <div className={cx('rsd-filters', classNames.filters)}>
      {filters.map((filter) => {
        const value = values[filter.key]
        const set = (next: any) => onChange?.(filter.key, next)
        const type = filter.type ?? 'text'
        const id = `rsd-filter-${filter.key}`

        let field
        if (filter.render) {
          field = filter.render({ value, onChange: set })
        } else if (type === 'select') {
          field = (
            <select
              id={id}
              className={inputClass}
              value={value ?? ''}
              onChange={(e) => set(e.target.value)}
            >
              <option value="">{filter.placeholder ?? 'All'}</option>
              {(filter.options ?? []).map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )
        } else if (type === 'date') {
          field = (
            <input
              id={id}
              type="date"
              className={inputClass}
              value={value ?? ''}
              onChange={(e) => set(e.target.value)}
            />
          )
        } else {
          field = (
            <DebouncedInput
              type={type}
              className={inputClass}
              placeholder={filter.placeholder ?? (filter.label ? `${filter.label}...` : undefined)}
              value={value}
              delay={debounce}
              onChange={set}
            />
          )
        }

        return (
          <div key={filter.key} className={cx('rsd-filter', classNames.filterField, filter.className)}>
            {filter.label && (
              <label className="rsd-filter-label" htmlFor={id}>
                {filter.label}
              </label>
            )}
            {field}
          </div>
        )
      })}

      {onReset && hasValue && (
        <button type="button" className={cx('rsd-filter-reset', classNames.filterReset)} onClick={onReset}>
          {resetLabel}
        </button>
      )}
    </div>
  )
}
