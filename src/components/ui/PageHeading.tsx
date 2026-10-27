import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageHeadingProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  eyebrow?: string
  className?: string
}

export function PageHeading({ title, subtitle, actions, eyebrow, className }: PageHeadingProps) {
  return (
    <header className={cn('page-heading', className)}>
      <div className="page-heading-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </header>
  )
}
