import { cn } from '@/utils/cn'

interface AvatarProps {
  initial?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  tone?: 'yellow' | 'cream'
}

export function Avatar({ initial = '蛙', size = 'md', className, tone = 'yellow' }: AvatarProps) {
  return (
    <span className={cn('avatar', `avatar-${size}`, `avatar-${tone}`, className)} aria-hidden="true">
      {initial.slice(0, 1)}
    </span>
  )
}
