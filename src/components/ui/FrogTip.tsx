import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FrogTipProps {
  children: ReactNode
  compact?: boolean
  className?: string
  image?: string
}

export function FrogTip({
  children,
  compact = false,
  className,
  image = '/frog/sideways-glance.png',
}: FrogTipProps) {
  return (
    <div className={cn('frog-tip', compact && 'frog-tip-compact', className)}>
      <span className="frog-tip-avatar">
        <img src={image} alt="" />
      </span>
      <p>{children}</p>
    </div>
  )
}
