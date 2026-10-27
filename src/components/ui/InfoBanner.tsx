import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/utils/cn'

export function InfoBanner({
  children,
  tone = 'info',
  className,
}: {
  children: ReactNode
  tone?: 'info' | 'warning' | 'success' | 'error'
  className?: string
}) {
  return (
    <div className={cn('info-banner', `info-banner-${tone}`, className)} role="note">
      <Info size={16} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
