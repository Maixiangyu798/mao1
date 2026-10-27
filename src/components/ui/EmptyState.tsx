import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  image?: string
  title: string
  description?: string
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function EmptyState({
  image = '/frog/lying-looking-up.png',
  title,
  description,
  action,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('empty-state', compact && 'empty-state-compact', className)}>
      <div className="empty-state-image">
        <img src={image} alt="" />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}
