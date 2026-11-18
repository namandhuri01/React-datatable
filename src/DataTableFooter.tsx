import type { ReactNode } from 'react'
import { cx } from './utils'

export interface DataTableFooterProps {
  children?: ReactNode
  className?: string
}

/** Area under the table for pagination, counts, etc. Renders nothing when empty. */
export function DataTableFooter({ children, className }: DataTableFooterProps) {
  if (!children) return null
  return <div className={cx('rsd-footer', className)}>{children}</div>
}
