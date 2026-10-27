import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  className?: string
  tone?: 'yellow' | 'green' | 'coral'
  height?: 'sm' | 'md' | 'lg'
  label?: string
}

export function ProgressBar({
  value,
  className,
  tone = 'yellow',
  height = 'md',
  label = '学习进度',
}: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('progress', `progress-${tone}`, `progress-${height}`, className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <span className="progress-fill" style={{ width: `${safeValue}%` }} />
    </div>
  )
}
