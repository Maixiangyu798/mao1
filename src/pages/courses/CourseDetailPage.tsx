import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Lock,
  Play,
  Star,
  Users,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { CourseCover } from '@/components/course/CourseCover'
import { FrogTip } from '@/components/ui/FrogTip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { courseDuration, difficultyMeta, flattenLessons, getCourse } from '@/data/courses'
import {
  getCourseActionLabel,
  getCourseProgress,
  getCourseStatus,
  getLessonStatus,
  getStartLesson,
} from '@/utils/course'
import { cn } from '@/utils/cn'
import type { Lesson } from '@/types'

export function CourseDetailPage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)
  const { user, toggleFavoriteCourse, startCourse } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'outline' | 'intro'>('outline')

  const initialLesson = course ? getStartLesson(user, course) : undefined
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(initialLesson ? [initialLesson.chapterId] : []),
  )

  if (!course) return <Navigate to="/404" replace />

  const difficulty = difficultyMeta[course.difficulty]
  const status = getCourseStatus(user, course)
  const progress = getCourseProgress(user, course)
  const isFavorite = user?.favoriteCourses.includes(course.id) ?? false
  const currentLesson = getStartLesson(user, course)
  const currentChapter = course.chapters.find((chapter) => chapter.id === currentLesson?.chapterId)
  const currentLessonNumber = currentChapter
    ? currentChapter.lessons.findIndex((lesson) => lesson.id === currentLesson?.id) + 1
    : 1

  const openChapter = (chapterId: string) => {
    setOpenChapters((current) => {
      const next = new Set(current)
      if (next.has(chapterId)) next.delete(chapterId)
      else next.add(chapterId)
      return next
    })
  }

  const onStartLearning = () => {
    if (!user) {
      navigate(`/login?returnUrl=${encodeURIComponent(`/course/${course.id}`)}`)
      return
    }
    const lesson = getStartLesson(user, course)
    const targetLessonId = startCourse(course.id) ?? lesson?.id
    if (targetLessonId) navigate(`/learn/${course.id}/${targetLessonId}`)
  }

  const onLessonClick = (lesson: Lesson) => {
    const lessonStatus = getLessonStatus(user, course, lesson)
    if (lessonStatus === 'locked') {
      showToast('先完成上一节吧，奶蛙在这里等你～', 'info')
      return
    }
    if (!user) {
      navigate(
        `/login?returnUrl=${encodeURIComponent(`/learn/${course.id}/${lesson.id}`)}`,
      )
      return
    }
    navigate(`/learn/${course.id}/${lesson.id}`)
  }

  const onFavorite = () => {
    if (!user) {
      navigate(`/login?returnUrl=${encodeURIComponent(`/course/${course.id}`)}`)
      return
    }
    const added = toggleFavoriteCourse(course.id)
    showToast(added ? '已收藏课程，下次从这里继续找它～' : '已取消收藏')
  }

  const primaryLabel =
    status === 'not_started' || !user ? '开始学习' : getCourseActionLabel(user, course)

  return (
    <div className="page-container course-detail-page">
      <Breadcrumbs
        items={[
          { label: '课程', to: '/courses' },
          { label: course.title },
        ]}
      />

      <section className="course-hero">
        <CourseCover course={course} size="hero" />
        <div className="course-hero-copy">
          <div className="course-hero-tags">
            <Tag className={difficulty.className}>{difficulty.label}</Tag>
            <Tag tone="neutral">免费课程</Tag>
          </div>
          <h1>{course.title}</h1>
          <p className="course-hero-description">{course.description}</p>
          <div className="course-hero-meta">
            <span>
              <Star size={15} fill="currentColor" /> {course.rating}
            </span>
            <span>
              <Users size={15} /> {course.learnerCount.toLocaleString('zh-CN')} 人学习
            </span>
            <span>
              <Bookmark size={15} /> {course.lessonCount} 课时
            </span>
            <span>
              <Clock3 size={15} /> {courseDuration(course.durationMinutes)}
            </span>
          </div>
          <div className="course-hero-actions">
            <Button
              size="lg"
              icon={<Play size={17} fill="currentColor" />}
              onClick={onStartLearning}
            >
              {primaryLabel}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={
                <Bookmark
                  size={17}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  className={isFavorite ? 'is-filled-icon' : ''}
                />
              }
              onClick={onFavorite}
            >
              {isFavorite ? '已收藏' : '收藏课程'}
            </Button>
          </div>
        </div>
      </section>

      <div className="course-detail-layout">
        <div className="course-detail-main">
          <section className="content-card outcomes-card">
            <h2>你将学会</h2>
            <div className="outcomes-grid">
              {course.outcomes.map((outcome) => (
                <div key={outcome} className="outcome-item">
                  <CheckCircle2 size={17} />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="content-card outline-card">
            <div className="card-tabs">
              <button
                type="button"
                className={cn('card-tab', tab === 'outline' && 'is-active')}
                onClick={() => setTab('outline')}
              >
                课程大纲
              </button>
              <button
                type="button"
                className={cn('card-tab', tab === 'intro' && 'is-active')}
                onClick={() => setTab('intro')}
              >
                课程介绍
              </button>
            </div>

            {tab === 'outline' ? (
              <>
                <p className="outline-hint">按顺序学习，提交通过当前课时后解锁下一节。</p>
                <div className="chapter-list">
                  {course.chapters.map((chapter, chapterIndex) => {
                    const chapterLessons = chapter.lessons
                    const completeCount = chapterLessons.filter(
                      (lesson) => getLessonStatus(user, course, lesson) === 'completed',
                    ).length
                    const isOpen = openChapters.has(chapter.id)
                    const isComplete =
                      chapterLessons.length > 0 && completeCount === chapterLessons.length
                    const isLocked = chapterLessons.every(
                      (lesson) => getLessonStatus(user, course, lesson) === 'locked',
                    )
                    const containsCurrent = currentLesson?.chapterId === chapter.id
                    return (
                      <div
                        key={chapter.id}
                        className={cn(
                          'chapter-group',
                          isOpen && 'is-open',
                          isComplete && 'is-complete',
                          isLocked && 'is-locked',
                          containsCurrent && 'is-current',
                        )}
                      >
                        <button
                          type="button"
                          className="chapter-header"
                          onClick={() => openChapter(chapter.id)}
                          aria-expanded={isOpen}
                        >
                          <span className="chapter-heading">
                            <span>{chapter.title}</span>
                            {isComplete && <span className="chapter-status">已完成</span>}
                            {isLocked && <Lock size={14} className="chapter-lock" />}
                          </span>
                          <span className="chapter-meta">
                            {chapterIndex === 0 && isComplete ? null : isComplete ? null : containsCurrent ? (
                              <span>
                                {completeCount}/{chapterLessons.length}
                              </span>
                            ) : null}
                            <ChevronDown
                              size={16}
                              className={cn('chapter-chevron', isOpen && 'is-open')}
                            />
                          </span>
                        </button>

                        {isOpen && (
                          <div className="lesson-list">
                            {chapterLessons.map((lesson) => {
                              const lessonStatus = getLessonStatus(user, course, lesson)
                              const Icon =
                                lessonStatus === 'completed'
                                  ? Check
                                  : lessonStatus === 'in_progress'
                                    ? Play
                                    : lessonStatus === 'locked'
                                      ? Lock
                                      : Play
                              return (
                                <button
                                  key={lesson.id}
                                  type="button"
                                  className={cn(
                                    'lesson-row',
                                    `is-${lessonStatus}`,
                                    currentLesson?.id === lesson.id && 'is-current-lesson',
                                  )}
                                  onClick={() => onLessonClick(lesson)}
                                >
                                  <span className="lesson-state-icon">
                                    <Icon
                                      size={15}
                                      fill={
                                        lessonStatus === 'completed' ? 'none' : 'currentColor'
                                      }
                                    />
                                  </span>
                                  <span className="lesson-title">{lesson.title}</span>
                                  {lesson.type === 'practice' && (
                                    <span className="lesson-type">练习</span>
                                  )}
                                  <span className="lesson-status-label">
                                    {lessonStatus === 'completed'
                                      ? '已完成'
                                      : lessonStatus === 'in_progress'
                                        ? '进行中'
                                        : lessonStatus === 'locked'
                                          ? '未解锁'
                                          : '可学习'}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="course-intro-content">
                <h3>关于这门课</h3>
                <p>
                  {course.description}。这门课会把你第一次接触 Python
                  时最容易卡住的地方拆成小步骤，每一节都配一个可以亲手运行的小任务。
                </p>
                <h3>课程节奏</h3>
                <p>
                  全课共 {course.lessonCount} 个课时，预计 {courseDuration(course.durationMinutes)}。
                  建议每次学 1–2 节，边看教程边在浏览器里运行代码，不用安装任何环境。
                </p>
                <h3>学完之后</h3>
                <p>
                  你会拥有继续学习办公自动化、数据分析或趣味项目的语法基础，也会知道遇到报错时如何
                  一步步找到问题。
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="course-detail-aside">
          <section className="content-card progress-card">
            <div className="progress-card-head">
              <h2>我的学习进度</h2>
              <span>
                {progress.completedCount} / {course.lessonCount} 课时
              </span>
            </div>
            <strong className="course-percent">{progress.percent}%</strong>
            <ProgressBar value={progress.percent} />
            <p className="progress-location">
              {progress.completedCount
                ? `上次学到：${currentChapter?.title.match(/\d+/)?.[0] ?? ''}.${currentLessonNumber} ${currentLesson?.title.replace(/^\d+\.\d+\s*/, '') ?? ''}`
                : '还没开始也没关系，第一行代码随时可以写。'}
            </p>
            <Button fullWidth onClick={onStartLearning}>
              {status === 'not_started' || !user ? '开始学习' : '接着学'}
            </Button>
            <FrogTip compact className="course-tip">
              {status === 'not_started'
                ? '先写一行 print 试试，奶蛙陪你开始。'
                : '再前进一点，新的知识就会解锁。'}
            </FrogTip>
          </section>

          <section className="content-card audience-card">
            <h2>适合这样的你</h2>
            <ul>
              {course.audience.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="course-outline-meta">
            <span>共 {flattenLessons(course).length} 个可学习节点</span>
            <span>·</span>
            <span>支持随时续学</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
