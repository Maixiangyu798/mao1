import { courseDuration, flattenLessons, getCourse } from '@/data/courses'
import type { Course, CourseStatus, Lesson, User } from '@/types'

export type LessonStatus = 'completed' | 'in_progress' | 'unlocked' | 'locked'

export function getCourseProgress(user: User | null, course: Course) {
  const progress = user?.courseProgress[course.id]
  const completedLessons = user?.completedCourses.includes(course.id)
    ? flattenLessons(course).map((lesson) => lesson.id)
    : (progress?.completedLessons ?? [])
  const completedCount = completedLessons.length
  const percent = course.lessonCount
    ? Math.min(100, Math.round((completedCount / course.lessonCount) * 100))
    : 0
  return {
    completedLessons,
    completedCount,
    percent,
    currentLessonId: progress?.currentLessonId ?? flattenLessons(course)[0]?.id,
  }
}

export function getCourseStatus(user: User | null, course: Course): CourseStatus {
  if (!user) return 'not_started'
  if (user.completedCourses.includes(course.id)) return 'completed'
  const progress = user.courseProgress[course.id]
  if (progress?.completedLessons.length) return 'learning'
  return 'not_started'
}

export function isLessonCompleted(user: User | null, course: Course, lesson: Lesson) {
  return getCourseProgress(user, course).completedLessons.includes(lesson.id)
}

export function getLessonStatus(
  user: User | null,
  course: Course,
  lesson: Lesson,
): LessonStatus {
  if (user?.completedCourses.includes(course.id)) return 'completed'
  const lessons = flattenLessons(course)
  const progress = user?.courseProgress[course.id]
  const completed = new Set(progress?.completedLessons ?? [])
  if (completed.has(lesson.id)) return 'completed'
  const currentId = progress?.currentLessonId ?? lessons[0]?.id
  if (currentId === lesson.id) return 'in_progress'
  const currentIndex = lessons.findIndex((item) => item.id === currentId)
  const index = lessons.findIndex((item) => item.id === lesson.id)
  if (index >= 0 && index < currentIndex) return 'unlocked'
  return 'locked'
}

export function isLessonAccessible(user: User | null, course: Course, lessonId: string) {
  const lesson = flattenLessons(course).find((item) => item.id === lessonId)
  if (!lesson) return false
  const status = getLessonStatus(user, course, lesson)
  return status !== 'locked'
}

export function getStartLesson(user: User | null, course: Course) {
  const lessons = flattenLessons(course)
  if (!user) return lessons[0]
  const progress = user.courseProgress[course.id]
  if (user.completedCourses.includes(course.id)) return lessons[0]
  if (!progress) return lessons[0]
  return lessons.find((lesson) => lesson.id === progress.currentLessonId) ?? lessons[0]
}

export function getCourseActionLabel(user: User | null, course: Course) {
  const status = getCourseStatus(user, course)
  if (status === 'completed') return '再学一遍'
  if (status === 'learning') {
    const current = getStartLesson(user, course)
    const chapter = course.chapters.find((item) => item.id === current?.chapterId)
    const lessonIndex = chapter?.lessons.findIndex((item) => item.id === current?.id) ?? 0
    return `继续学习 ${chapter ? chapter.title.match(/\d+/)?.[0] : ''}.${lessonIndex + 1}`.replace(
      ' .',
      ' ',
    )
  }
  return '开始学习'
}

export function courseMeta(course: Course) {
  return `${course.lessonCount} 课时 · ${courseDuration(course.durationMinutes)} · ${course.learnerCount.toLocaleString('zh-CN')} 人学习`
}

export function getChapterStatus(user: User | null, course: Course, chapterIndex: number) {
  const courseData = getCourse(course.id) ?? course
  const chapter = courseData.chapters[chapterIndex]
  if (!chapter) return 'locked'
  if (user?.completedCourses.includes(course.id)) return 'completed'
  const statuses = chapter.lessons.map((lesson) => getLessonStatus(user, course, lesson))
  if (statuses.every((status) => status === 'completed')) return 'completed'
  if (statuses.some((status) => status !== 'locked')) return 'active'
  return 'locked'
}
