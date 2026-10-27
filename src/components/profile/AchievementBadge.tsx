import {
  Award,
  CalendarCheck2,
  Flag,
  Flame,
  GraduationCap,
  Lock,
  Sprout,
  Star,
  Target,
  TerminalSquare,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

const iconMap: Record<string, LucideIcon> = {
  terminal: TerminalSquare,
  sprout: Sprout,
  flag: Flag,
  target: Target,
  star: Star,
  flame: Flame,
  calendar: CalendarCheck2,
  graduation: GraduationCap,
  trophy: Trophy,
}

interface AchievementBadgeProps {
  icon: string
  unlocked: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AchievementBadge({
  icon,
  unlocked,
  size = 'md',
  className,
}: AchievementBadgeProps) {
  const Icon = unlocked ? (iconMap[icon] ?? Award) : Lock
  return (
    <span
      className={cn(
        'achievement-badge',
        `achievement-badge-${size}`,
        unlocked ? 'is-unlocked' : 'is-locked',
        className,
      )}
      aria-hidden="true"
    >
      <Icon size={size === 'lg' ? 30 : size === 'sm' ? 16 : 24} strokeWidth={1.8} />
    </span>
  )
}
