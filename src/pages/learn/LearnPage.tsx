import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Copy,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Send,
  Settings,
  TerminalSquare,
} from 'lucide-react'
import { CodeEditor } from '@/components/practice/CodeEditor'
import { Button } from '@/components/ui/Button'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuth } from '@/app/AuthContext'
import { getAdjacentLesson, getCourse, getLesson } from '@/data/courses'
import { getLessonContent } from '@/data/learningContent'
import { getLevelInfo } from '@/data/mockData'
import type { CodeRunResult, Course, Lesson } from '@/types'
import { getCourseProgress, getLessonStatus } from '@/utils/course'
import { executePython, isLearningTaskSolved } from '@/utils/pythonSimulator'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'
import { cn } from '@/utils/cn'

interface CompletionState {
  alreadyCompleted: boolean
  expGained: number
  nextLessonId?: string
  courseCompleted: boolean
}

function LearnWorkspace({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { user, completeLesson } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const content = getLessonContent(course, lesson)
  const chapterIndex = course.chapters.findIndex((chapter) => chapter.id === lesson.chapterId)
  const chapter = course.chapters[chapterIndex]
  const level = user ? getLevelInfo(user.exp) : null
  const progress = getCourseProgress(user, course)
  const lessonStatus = getLessonStatus(user, course, lesson)
  const previousLesson = getAdjacentLesson(course, lesson.id, -1)
  const nextLesson = getAdjacentLesson(course, lesson.id, 1)

  const [code, setCode] = useState(
    () => readStorage<string>(STORAGE_KEYS.draft(lesson.id)) ?? content.initialCode,
  )
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set([lesson.chapterId]),
  )
  const [result, setResult] = useState<CodeRunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completion, setCompletion] = useState<CompletionState | null>(null)

  const cleanTitle = lesson.title.replace(/^\d+(?:\.\d+)?\s*/, '')
  const displayChapter = chapter?.title.match(/^第\s*\d+\s*章\s*(.*)$/)?.[1] ?? chapter?.title ?? ''
  const nextLocked =
    nextLesson !== undefined && getLessonStatus(user, course, nextLesson) === 'locked'
  const courseCompleted = user ? user.completedCourses.includes(course.id) : false

  const persistDraft = (value: string) => {
    setCode(value)
    writeStorage(STORAGE_KEYS.draft(lesson.id), value)
  }

  const runCode = () => {
    if (running || submitting) return
    setRunning(true)
    setResult(null)
    window.setTimeout(() => {
      setResult(executePython(code))
      setRunning(false)
    }, 320)
  }

  const onSubmit = () => {
    if (running || submitting) return
    setSubmitting(true)
    setResult(null)
    window.setTimeout(() => {
      const runResult = executePython(code)
      if (runResult.status !== 'success') {
        setResult(runResult)
        setSubmitting(false)
        showToast('代码还没有运行成功，按提示改一改再提交～', 'error')
        return
      }
      if (lesson.id === 'py-basic-01-c3-l2' && !isLearningTaskSolved(code)) {
        setResult({
          status: 'error',
          output: '检查未通过：还没有完成字符串拼接任务。',
          friendlyError:
            '试着保留 name 变量，并用 print("你好，" + name) 把文字和变量连接起来。',
        })
        setSubmitting(false)
        showToast('还差一点点，看看控制台的提示吧', 'error')
        return
      }
      const outcome = completeLesson(course.id, lesson.id)
      setCompletion(outcome)
      setResult({
        status: 'success',
        output: outcome.alreadyCompleted
          ? '这一节之前已经完成过啦，再练一次也很好。'
          : `提交通过！本节完成，获得 +${outcome.expGained} EXP。`,
        duration: '0.12s',
      })
      setSubmitting(false)
      if (!outcome.alreadyCompleted) showToast(`本节完成，+${outcome.expGained} EXP`, 'success')
    }, 420)
  }

  const goToLesson = (target: Lesson) => {
    if (getLessonStatus(user, course, target) === 'locked') {
      showToast('通过当前课时后，下一节就会解锁啦', 'info')
      return
    }
    navigate(`/learn/${course.id}/${target.id}`)
  }

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((current) => {
      const next = new Set(current)
      if (next.has(chapterId)) next.delete(chapterId)
      else next.add(chapterId)
      return next
    })
  }

  const copyToEditor = (snippet: string) => {
    persistDraft(snippet)
    showToast('示例已放进编辑器，可以开始改啦', 'success')
  }

  return (
    <div className="learn-shell">
      <header className="learn-topbar">
        <Link to={`/course/${course.id}`} className="learn-back">
          <ArrowLeft size={17} />
          <span>返回课程</span>
          <span className="learn-back-divider">/</span>
          <span className="learn-back-course">{course.title}</span>
        </Link>
        <h1>{lesson.title}</h1>
        <div className="learn-topbar-actions">
          {level && (
            <span className="learn-level">
              {level.title} Lv.{level.level}
            </span>
          )}
          <Link
            to="/profile/settings"
            className="icon-button"
            aria-label="学习设置"
            title="学习设置"
          >
            <Settings size={19} />
          </Link>
        </div>
      </header>

      <div className="learn-layout">
        <aside className="learn-sidebar">
          <div className="learn-sidebar-head">
            <h2>课程目录</h2>
            <p>
              {progress.completedCount} / {course.lessonCount} 课时 · {progress.percent}%
            </p>
            <ProgressBar value={progress.percent} height="sm" />
          </div>

          <nav className="learn-tree" aria-label="课程目录">
            {course.chapters.map((item) => {
              const isOpen = openChapters.has(item.id)
              const statuses = item.lessons.map((chapterLesson) =>
                getLessonStatus(user, course, chapterLesson),
              )
              const isComplete = statuses.every((status) => status === 'completed')
              const isActiveChapter = item.id === lesson.chapterId
              return (
                <div
                  key={item.id}
                  className={cn(
                    'learn-chapter',
                    isActiveChapter && 'is-current',
                    isComplete && 'is-complete',
                  )}
                >
                  <button
                    type="button"
                    className="learn-chapter-row"
                    onClick={() => toggleChapter(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="learn-chapter-icon">
                      {isComplete ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                    </span>
                    <span className="learn-chapter-title">{item.title}</span>
                    <ChevronDown
                      size={14}
                      className={cn('learn-chapter-chevron', isOpen && 'is-open')}
                    />
                  </button>
                  {isOpen && (
                    <ul className="learn-lesson-list">
                      {item.lessons.map((itemLesson) => {
                        const itemStatus = getLessonStatus(user, course, itemLesson)
                        const isCurrent = itemLesson.id === lesson.id
                        return (
                          <li key={itemLesson.id}>
                            <button
                              type="button"
                              className={cn(
                                'learn-lesson-link',
                                isCurrent && 'is-current',
                                itemStatus === 'completed' && 'is-completed',
                                itemStatus === 'locked' && 'is-locked',
                              )}
                              onClick={() =>
                                isCurrent ? undefined : goToLesson(itemLesson)
                              }
                              aria-current={isCurrent ? 'page' : undefined}
                            >
                              <span className="learn-lesson-bullet">
                                {itemStatus === 'completed' ? (
                                  <Check size={13} strokeWidth={3} />
                                ) : itemStatus === 'locked' ? (
                                  <Lock size={12} />
                                ) : (
                                  <Play size={11} fill="currentColor" />
                                )}
                              </span>
                              <span>{itemLesson.title}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="learn-sidebar-frog">
            <img src="/frog/thinking.png" alt="" />
            <p>今天也在认真积累呢。</p>
          </div>
        </aside>

        <main className="learn-content">
          <article className="learn-article">
            <span className="lesson-chapter-badge">
              第 {chapterIndex + 1} 章 · {displayChapter} · 约 {content.estimatedMinutes} 分钟
            </span>
            <h1>{cleanTitle}</h1>
            <p className="lesson-intro">{content.intro}</p>

            {content.sections.map((section) => (
              <section key={section.title} className="lesson-section">
                <h2>{section.title}</h2>
                {section.body && <p>{section.body}</p>}
                {section.code && (
                  <div className="lesson-code-example">
                    <header>
                      <span>示例 · Python</span>
                      <button type="button" onClick={() => copyToEditor(section.code ?? '')}>
                        <Copy size={14} /> 复制到编辑器
                      </button>
                    </header>
                    <pre>
                      <code>{section.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}

            <section className="lesson-task-card">
              <span className="lesson-task-eyebrow">动手时间</span>
              <h2>现在，换你来试试</h2>
              <p>{content.task}</p>
              <p className="lesson-goal">目标：{content.goal}</p>
            </section>

            <footer className="learn-article-footer">
              <div className="learn-lesson-nav">
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={16} />}
                  disabled={!previousLesson}
                  onClick={() => previousLesson && goToLesson(previousLesson)}
                >
                  上一节
                </Button>
                <Button
                  variant="secondary"
                  iconRight={<ArrowRight size={16} />}
                  disabled={!nextLesson || nextLocked}
                  title={nextLocked ? '提交当前课时后解锁' : undefined}
                  onClick={() => nextLesson && goToLesson(nextLesson)}
                >
                  {nextLocked ? '下一节未解锁' : '下一节'}
                </Button>
              </div>
              <p className="learn-footnote">
                {lessonStatus === 'completed'
                  ? '这一节已经完成啦，再运行一次也很棒。'
                  : '运行只是自测；提交判题通过后，才会解锁下一节。'}
              </p>
            </footer>
          </article>
        </main>

        <aside className="learn-workspace">
          <CodeEditor
            value={code}
            onChange={persistDraft}
            onRun={runCode}
            onSave={() => {
              writeStorage(STORAGE_KEYS.draft(lesson.id), code)
              showToast('草稿已保存', 'success')
            }}
            fontSize={user?.preferences.lessonFontSize ?? 14}
            minHeight={320}
            className="learn-editor"
            statusText="Python 3 · 已自动保存"
          />

          <div className="learn-runbar">
            <Button
              variant="secondary"
              icon={<Play size={16} fill="currentColor" />}
              loading={running}
              onClick={runCode}
            >
              运行（自测）
            </Button>
            <Button
              icon={<Send size={16} />}
              loading={submitting}
              onClick={onSubmit}
            >
              提交（判题）
            </Button>
            <span className="learn-runbar-spacer" />
            <button
              type="button"
              className="learn-plain-action"
              onClick={() => {
                persistDraft(content.initialCode)
                setResult(null)
                showToast('代码已重置为初始状态', 'info')
              }}
            >
              <RotateCcw size={14} /> 重置
            </button>
            <button
              type="button"
              className="learn-plain-action"
              onClick={() => setShowHint((open) => !open)}
            >
              <Lightbulb size={14} /> 提示
            </button>
          </div>

          {showHint && (
            <InfoBanner tone="warning" className="learn-hint-banner">
              {content.hint}
            </InfoBanner>
          )}

          <section className="learn-console" aria-live="polite">
            <header>
              <h2>控制台</h2>
              <span>
                {running || submitting
                  ? '正在运行…'
                  : result?.status === 'success'
                    ? `运行成功${result.duration ? ` · ${result.duration}` : ''}`
                    : result?.status === 'error'
                      ? '运行遇到了一点问题'
                      : '等待运行'}
              </span>
            </header>
            {result ? (
              <div className={cn('console-output', `is-${result.status}`)}>
                <pre>{result.output}</pre>
                {result.friendlyError && <p>{result.friendlyError}</p>}
                {result.detail && !result.friendlyError && <small>{result.detail}</small>}
                {result.status === 'success' && !completion && (
                  <p className="console-next-step">
                    程序运行成功，还没有提交判题。确认完成任务后，点击「提交」获得奖励。
                  </p>
                )}
              </div>
            ) : (
              <div className="console-empty">
                <TerminalSquare size={18} />
                <div>
                  <p>先运行看看，让代码说出答案。</p>
                  <small>Ctrl / ⌘ + Enter 也可以运行。</small>
                </div>
              </div>
            )}
          </section>

          {!courseCompleted && lessonStatus === 'completed' && (
            <p className="learn-completed-note">
              <CheckCircle2 size={15} /> 本节已完成，可以继续下一节。
            </p>
          )}
        </aside>
      </div>

      <Modal
        open={Boolean(completion)}
        onClose={() => setCompletion(null)}
        title={completion?.courseCompleted ? '整门课都被你学完啦！' : '这一节完成啦！'}
        description={
          completion?.alreadyCompleted
            ? '再次练习也很有价值。让这份熟悉感继续陪着你。'
            : completion?.courseCompleted
              ? `你完成了《${course.title}》的全部课时。奶蛙已经为你点亮了新的成就。`
              : '新的课时已经解锁，带着刚才的理解继续往前走吧。'
        }
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCompletion(null)}>
              留在本页
            </Button>
            {completion?.nextLessonId && !completion.courseCompleted ? (
              <Button
                iconRight={<ArrowRight size={16} />}
                onClick={() => {
                  const nextId = completion.nextLessonId
                  setCompletion(null)
                  if (nextId) navigate(`/learn/${course.id}/${nextId}`)
                }}
              >
                下一节
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setCompletion(null)
                  navigate(`/course/${course.id}`)
                }}
              >
                回到课程
              </Button>
            )}
          </>
        }
      >
        <div className="completion-summary">
          <img src="/frog/belly-laugh.png" alt="奶蛙为你开心" />
          <div>
            <strong>
              {completion?.alreadyCompleted
                ? '完成记录已经保存'
                : `获得 +${completion?.expGained ?? 0} EXP`}
            </strong>
            <p>
              {completion?.courseCompleted
                ? '课程进度 100%，新的学习路线已经在前面等你。'
                : '每一行代码都算数，下一次见面继续写下去。'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export function LearnPage() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const course = getCourse(courseId)
  const lesson = course ? getLesson(course, lessonId) : undefined

  if (!course || !lesson) return <Navigate to="/404" replace />
  if (!user) return null
  if (getLessonStatus(user, course, lesson) === 'locked') {
    return <Navigate to={`/course/${course.id}`} replace />
  }

  return <LearnWorkspace key={lesson.id} course={course} lesson={lesson} />
}
