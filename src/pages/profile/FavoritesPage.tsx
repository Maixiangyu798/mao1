import { Link, useSearchParams } from 'react-router-dom'
import { Bookmark, BookmarkX, List, ShieldQuestion, Star } from 'lucide-react'
import { CourseCover } from '@/components/course/CourseCover'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { courseDuration, difficultyMeta, getCourse } from '@/data/courses'
import { getProblem } from '@/data/problems'
import type { Course, Problem } from '@/types'
import { getCourseProgress, getCourseStatus } from '@/utils/course'
import { cn } from '@/utils/cn'

type FavoriteTab = 'courses' | 'problems'

const favoriteDates = ['今天', '昨天', '10.20', '10.19', '10.18']

function courseStatusLabel(status: ReturnType<typeof getCourseStatus>) {
  if (status === 'learning') return '学习中'
  if (status === 'completed') return '已完成'
  return '未开始'
}

function problemState(problem: Problem, user: ReturnType<typeof useAuth>['user']) {
  const result = user?.problemResults[problem.id]
  if (result?.stars) return 'passed'
  if (result?.attempts) return 'failed'
  return 'todo'
}

export function FavoritesPage() {
  const { user, toggleFavoriteCourse, toggleFavoriteProblem } = useAuth()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: FavoriteTab = searchParams.get('tab') === 'problems' ? 'problems' : 'courses'

  if (!user) return null

  const favoriteCourses = user.favoriteCourses
    .map((courseId) => getCourse(courseId))
    .filter((course): course is Course => Boolean(course))
  const favoriteProblems = user.favoriteProblems
    .map((problemId) => getProblem(problemId))
    .filter((problem): problem is Problem => Boolean(problem))

  const setTab = (nextTab: FavoriteTab) => {
    const next = new URLSearchParams(searchParams)
    if (nextTab === 'problems') next.set('tab', 'problems')
    else next.delete('tab')
    setSearchParams(next, { replace: true })
  }

  const removeCourse = (course: Course) => {
    toggleFavoriteCourse(course.id)
    showToast(`已取消收藏「${course.title}」`, 'info')
  }

  const removeProblem = (problem: Problem) => {
    toggleFavoriteProblem(problem.id)
    showToast(`已取消收藏「${problem.title}」`, 'info')
  }

  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <h1>我的收藏</h1>
        <p>把想学的、想再练一次的，好好收在这里。</p>
      </header>

      <nav className="favorites-tabs" role="tablist" aria-label="收藏类型">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'courses'}
          className={cn(tab === 'courses' && 'is-active')}
          onClick={() => setTab('courses')}
        >
          课程 <span>{favoriteCourses.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'problems'}
          className={cn(tab === 'problems' && 'is-active')}
          onClick={() => setTab('problems')}
        >
          题目 <span>{favoriteProblems.length}</span>
        </button>
      </nav>

      {tab === 'courses' ? (
        favoriteCourses.length ? (
          <>
            <div className="favorites-toolbar">
              <p>共 {favoriteCourses.length} 门收藏课程</p>
              <span>
                <List size={15} /> 按收藏时间排序
              </span>
            </div>
            <div className="favorite-course-grid">
              {favoriteCourses.map((course, index) => {
                const progress = getCourseProgress(user, course)
                const status = getCourseStatus(user, course)
                const difficulty = difficultyMeta[course.difficulty]
                return (
                  <article key={course.id} className="favorite-course-item">
                    <Link to={`/course/${course.id}`} className="favorite-course-card">
                      <CourseCover course={course} />
                      <div className="favorite-course-body">
                        <div className="favorite-course-topline">
                          <Tag className={difficulty.className}>{difficulty.label}</Tag>
                          <span>{courseStatusLabel(status)}</span>
                        </div>
                        <h2>{course.title}</h2>
                        <p>
                          {course.lessonCount} 课时 · {courseDuration(course.durationMinutes)} ·{' '}
                          {course.learnerCount.toLocaleString('zh-CN')} 人学习
                        </p>
                        {status === 'learning' ? (
                          <>
                            <div className="favorite-course-progress-label">
                              <span>
                                <Star size={12} fill="currentColor" /> {course.rating}
                              </span>
                              <span>
                                已完成 {progress.completedCount}/{course.lessonCount} 课时
                              </span>
                            </div>
                            <ProgressBar value={progress.percent} height="sm" />
                            <span className="favorite-course-action">
                              继续学习 · {progress.percent}% →
                            </span>
                          </>
                        ) : (
                          <>
                            <p className="favorite-course-desc">{course.description}</p>
                            <span className="favorite-course-action">
                              {status === 'completed' ? '再学一遍' : '查看课程'} →
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                    <div className="favorite-item-footer">
                      <span>收藏于 {favoriteDates[index] ?? '10.18'}</span>
                      <button type="button" onClick={() => removeCourse(course)}>
                        取消收藏
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        ) : (
          <EmptyState
            image="/frog/surprised.png"
            title="还没有收藏课程"
            description="遇到想学的课，点一下课程详情里的「收藏课程」吧。"
            action={<Button to="/courses">去看看课程</Button>}
          />
        )
      ) : favoriteProblems.length ? (
        <>
          <div className="favorites-toolbar">
            <p>共 {favoriteProblems.length} 道收藏题目</p>
            <span>
              <List size={15} /> 按收藏时间排序
            </span>
          </div>
          <div className="favorite-problem-list">
            {favoriteProblems.map((problem, index) => {
              const state = problemState(problem, user)
              const difficulty = difficultyMeta[problem.difficulty]
              const record = user.problemResults[problem.id]
              return (
                <article key={problem.id} className="favorite-problem-row">
                  <span className="favorite-problem-icon">
                    <Bookmark size={18} fill="currentColor" />
                  </span>
                  <div className="favorite-problem-copy">
                    <div>
                      <span>{problem.number}</span>
                      <h2>{problem.title}</h2>
                      <Tag className={difficulty.className}>{difficulty.label}</Tag>
                    </div>
                    <p>
                      {state === 'passed'
                        ? `已通过 · ${record?.attempts === 1 ? '一次通过 ★' : `${record?.attempts} 次尝试`}`
                        : state === 'failed'
                          ? `未通过 · ${record?.attempts} 次尝试`
                          : '未做'}
                      <span> · 收藏于 {favoriteDates[index] ?? '10.18'}</span>
                    </p>
                  </div>
                  <div className="favorite-problem-actions">
                    <Button to={`/practice/${problem.id}`} variant="secondary" size="sm">
                      去练习
                    </Button>
                    <button type="button" onClick={() => removeProblem(problem)}>
                      <BookmarkX size={14} /> 取消收藏
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <EmptyState
          image="/frog/surprised.png"
          title="还没有收藏题目"
          description="在练习里遇到值得回看的题，就把它收进来吧。"
          action={
            <Button to="/practice">
              <ShieldQuestion size={16} /> 去题库看看
            </Button>
          }
        />
      )}
    </div>
  )
}
