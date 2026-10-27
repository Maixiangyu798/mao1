import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type TagTone = 'yellow' | 'orange' | 'red' | 'green' | 'neutral' | 'purple'

export function Tag({
  children,
  tone = 'yellow',
  className,
}: {
  children: ReactNode
  tone?: TagTone
  className?: string
}) {
  return <span className={cn('tag', `tag-${tone}`, className)}>{children}</span>
}
