import {
  Blocks,
  ChartNoAxesColumnIncreasing,
  FileText,
  Folder,
  FunctionSquare,
  Gamepad2,
  ListChecks,
  PenLine,
  PieChart,
  Table2,
  Terminal,
  Type,
} from 'lucide-react'
import type { Course } from '@/types'
import { cn } from '@/utils/cn'

const iconMap = {
  terminal: Terminal,
  folder: Folder,
  chart: ChartNoAxesColumnIncreasing,
  gamepad: Gamepad2,
  pen: PenLine,
  list: ListChecks,
  file: FileText,
  function: FunctionSquare,
  excel: Table2,
  pie: PieChart,
  text: Type,
  blocks: Blocks,
}

export function CourseCover({
  course,
  size = 'card',
  className,
}: {
  course: Course
  size?: 'card' | 'hero' | 'thumb'
  className?: string
}) {
  const Icon = iconMap[course.icon]
  return (
    <div
      className={cn('course-cover', `course-cover-${size}`, `course-cover-${course.category}`, className)}
      aria-hidden="true"
    >
      <span className="course-cover-eyebrow">{course.eyebrow}</span>
      <Icon className="course-cover-icon" strokeWidth={1.8} />
      <span className="course-cover-braces">{'{ }'}</span>
      <span className="course-cover-glow" />
    </div>
  )
}
