import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { CourseCover } from '@/components/course/CourseCover'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tag } from '@/components/ui/Tag'
import { difficultyMeta } from '@/data/courses'
import { useAuth } from '@/app/AuthContext'
import { courseDuration } from '@/data/courses'
import { getCourseProgress, getCourseStatus } from '@/utils/course'
import type { Course } from '@/types'
import { cn } from '@/utils/cn'

export function CourseCard({ course, className }: { course: Course; className?: string }) {
  const { user } = useAuth()
  const status = getCourseStatus(user, course)
  const progress = getCourseProgress(user, course)
  const difficulty = difficultyMeta[course.difficulty]
  const statusLabel =
    status === 'learning' ? '学习中' : status === 'completed' ? '已完成' : '未开始'

  return (
    <Link
      to={`/course/${course.id}`}
      className={cn('course-card', `is-${status}`, className)}
      aria-label={`查看课程：${course.title}`}
    >
      <CourseCover course={course} />
      <div className="course-card-body">
        <div className="course-card-topline">
          <Tag className={difficulty.className}>{difficulty.label}</Tag>
          <span className="course-status">{statusLabel}</span>
        </div>
        <h3>{course.title}</h3>
        <p className="course-meta">
          {course.lessonCount} 课时 · {courseDuration(course.durationMinutes)} ·{' '}
          {course.learnerCount.toLocaleString('zh-CN')} 人学习
        </p>
        {status === 'learning' ? (
          <>
            <div className="course-rating-line">
              <Star size={13} fill="currentColor" aria-hidden="true" />
              <span>{course.rating}</span>
              <span className="dot-separator">·</span>
              <span>
                已完成 {progress.completedCount}/{course.lessonCount} 课时
              </span>
            </div>
            <ProgressBar value={progress.percent} height="sm" className="course-progress" />
            <span className="course-card-action">继续学习 · {progress.percent}% →</span>
          </>
        ) : status === 'completed' ? (
          <>
            <p className="course-description">{course.description}</p>
            <span className="course-card-action">再学一遍 →</span>
          </>
        ) : (
          <>
            <p className="course-description">{course.description}</p>
            <span className="course-card-action">查看课程 →</span>
          </>
        )}
      </div>
    </Link>
  )
}
