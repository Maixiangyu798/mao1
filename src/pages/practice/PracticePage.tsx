import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  List,
  Lock,
  Map,
  Play,
  Search,
  Swords,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeading } from '@/components/ui/PageHeading'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { difficultyMeta } from '@/data/courses'
import { problems } from '@/data/problems'
import type { Difficulty, Problem, ProblemStatus } from '@/types'
import { cn } from '@/utils/cn'

const PAGE_SIZE = 8
const knowledgeOptions = ['全部', '变量', '字符串', '条件', '循环', '列表', '字典', '函数', '文件']
const difficultyOptions: { value: 'all' | Difficulty; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'challenge', label: '挑战' },
]
const statusOptions: { value: 'all' | ProblemStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '未做' },
  { value: 'failed', label: '未通过' },
  { value: 'passed', label: '已通过' },
]

function problemStatus(
  problem: Problem,
  user: ReturnType<typeof useAuth>['user'],
): ProblemStatus {
  const result = user?.problemResults[problem.id]
  if (result?.stars) return 'passed'
  if (result && result.attempts > 0) return 'failed'
  return 'todo'
}

function problemRecord(problem: Problem, user: ReturnType<typeof useAuth>['user']) {
  const result = user?.problemResults[problem.id]
  if (!result) return '—'
  if (result.stars) {
    return result.attempts === 1 ? '一次通过 ★' : `${result.attempts} 次 · ★${result.stars}`
  }
  return `已尝试 ${result.attempts} 次`
}

function statusLabel(status: ProblemStatus) {
  if (status === 'passed') return '已通过'
  if (status === 'failed') return '未通过'
  return '未做'
}

export function PracticePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [knowledge, setKnowledge] = useState('全部')
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all')
  const [status, setStatus] = useState<'all' | ProblemStatus>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const view = searchParams.get('view') === 'map' ? 'map' : 'list'

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return problems.filter((problem) => {
      if (knowledge !== '全部' && !problem.tags.includes(knowledge)) return false
      if (difficulty !== 'all' && problem.difficulty !== difficulty) return false
      if (status !== 'all' && problemStatus(problem, user) !== status) return false
      if (query && !`${problem.number} ${problem.title}`.toLowerCase().includes(query)) {
        return false
      }
      return true
    })
  }, [difficulty, knowledge, search, status, user])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const currentProblem =
    problems.find((problem) => problemStatus(problem, user) === 'failed') ??
    problems.find((problem) => problemStatus(problem, user) !== 'passed') ??
    problems[problems.length - 1]
  const currentIndex = problems.findIndex((problem) => problem.id === currentProblem?.id)

  const resetFilters = () => {
    setKnowledge('全部')
    setDifficulty('all')
    setStatus('all')
    setSearch('')
    setPage(1)
  }

  const changeView = (nextView: 'list' | 'map') => {
    const next = new URLSearchParams(searchParams)
    if (nextView === 'map') next.set('view', 'map')
    else next.delete('view')
    setSearchParams(next, { replace: true })
  }

  const updateFilter = <T,>(setter: (value: T) => void, value: T) => {
    setter(value)
    setPage(1)
  }

  const openProblem = (problem: Problem) => {
    navigate(`/practice/${problem.id}`)
  }

  return (
    <div className="page-container practice-page">
      <PageHeading
        title="练一练，让知识长出小脚丫"
        subtitle="把刚学会的知识，用在一个小问题里。"
        actions={
          <div className="practice-stats">
            {user ? (
              <>
                <span>已通过 {user.passedProblemCount} 题</span>
                <span>连续学习 {user.streakDays} 天</span>
              </>
            ) : (
              <span>登录后同步练习记录</span>
            )}
          </div>
        }
      />

      <section className="filter-panel practice-filter-panel" aria-label="题目筛选">
        <div className="filter-row">
          <span className="filter-label">知识点</span>
          <div className="filter-options">
            {knowledgeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={cn('filter-chip', knowledge === option && 'is-active')}
                onClick={() => updateFilter(setKnowledge, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row practice-filter-row">
          <span className="filter-label">难度</span>
          <div className="filter-options">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn('filter-chip', difficulty === option.value && 'is-active')}
                onClick={() => updateFilter(setDifficulty, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="filter-label filter-label-status">状态</span>
          <div className="filter-options">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn('filter-chip', status === option.value && 'is-active')}
                onClick={() => updateFilter(setStatus, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="search-box practice-search">
            <Search size={17} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="搜索题号或题目"
              aria-label="搜索题号或题目"
            />
          </label>
        </div>
      </section>

      <div className="practice-tabs" role="tablist" aria-label="题库展示方式">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          className={cn('practice-tab', view === 'list' && 'is-active')}
          onClick={() => changeView('list')}
        >
          <List size={16} /> 题目列表
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'map'}
          className={cn('practice-tab', view === 'map' && 'is-active')}
          onClick={() => changeView('map')}
        >
          <Map size={16} /> 闯关地图
        </button>
      </div>

      {view === 'list' ? (
        filtered.length ? (
          <>
            <div className="problem-table-wrap">
              <table className="problem-table">
                <thead>
                  <tr>
                    <th>题目</th>
                    <th>知识点</th>
                    <th>难度</th>
                    <th>状态</th>
                    <th>练习记录</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((problem) => {
                    const state = problemStatus(problem, user)
                    return (
                      <tr
                        key={problem.id}
                        onClick={() => openProblem(problem)}
                        className="problem-row"
                      >
                        <td>
                          <Link to={`/practice/${problem.id}`} className="problem-title-link">
                            <span className="problem-number">{problem.number}</span>
                            <strong>{problem.title}</strong>
                          </Link>
                        </td>
                        <td className="muted-cell">{problem.tags.join(' · ')}</td>
                        <td>
                          <Tag className={difficultyMeta[problem.difficulty].className}>
                            {difficultyMeta[problem.difficulty].label}
                          </Tag>
                        </td>
                        <td>
                          <span className={cn('problem-status', `is-${state}`)}>
                            {statusLabel(state)}
                          </span>
                        </td>
                        <td className="muted-cell">{problemRecord(problem, user)}</td>
                        <td>
                          <Link to={`/practice/${problem.id}`} className="table-action">
                            {state === 'passed' ? '再练一次' : '去练习'} <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <nav className="pagination" aria-label="题目分页">
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft size={15} /> 上一页
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={cn('pagination-number', currentPage === pageNumber && 'is-active')}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                下一页 <ChevronRight size={15} />
              </button>
            </nav>
          </>
        ) : (
          <EmptyState
            image="/frog/surprised.png"
            title="没有找到符合条件的题目"
            description="换个知识点，或者把筛选条件放宽一点。"
            action={<Button onClick={resetFilters}>重置筛选</Button>}
          />
        )
      ) : filtered.length ? (
        <div className="challenge-layout">
          <section className="challenge-island">
            <header className="challenge-island-head">
              <div>
                <h2>基础练习岛</h2>
                <p>一关一脚印，按自己的节奏来。</p>
              </div>
              <span>当前挑战 {currentProblem?.number}</span>
            </header>

            <div className="challenge-map">
              {filtered.map((problem) => {
                const index = problems.findIndex((item) => item.id === problem.id)
                const state = problemStatus(problem, user)
                const isCurrent = problem.id === currentProblem?.id
                const isLocked = !isCurrent && index > currentIndex
                const isPassed = state === 'passed'
                const attemptCount = user?.problemResults[problem.id]?.attempts ?? 0
                return (
                  <button
                    key={problem.id}
                    type="button"
                    className={cn(
                      'challenge-node',
                      isPassed && 'is-passed',
                      isCurrent && 'is-current',
                      !isPassed && !isCurrent && !isLocked && 'is-open',
                      isLocked && 'is-locked',
                    )}
                    onClick={() => {
                      if (isLocked) {
                        showToast('先通过前面的关卡，这一关就会亮起来', 'info')
                        return
                      }
                      openProblem(problem)
                    }}
                    aria-disabled={isLocked}
                  >
                    <span className="challenge-node-icon">
                      {isPassed ? (
                        <Target size={21} />
                      ) : isCurrent ? (
                        <Swords size={21} />
                      ) : isLocked ? (
                        <Lock size={18} />
                      ) : (
                        <Play size={18} fill="currentColor" />
                      )}
                    </span>
                    <span className="challenge-node-meta">
                      {problem.number} · {difficultyMeta[problem.difficulty].label}
                    </span>
                    <strong>{problem.title}</strong>
                    <small>
                      {isPassed
                        ? '★ 已通过'
                        : isCurrent
                          ? attemptCount
                            ? `当前挑战 · 已尝试 ${attemptCount} 次`
                            : '当前挑战 · 从这里开始'
                          : isLocked
                            ? '完成前置关卡后解锁'
                            : '已解锁 · 待挑战'}
                    </small>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="challenge-aside">
            <img src="/frog/kungfu-block.png" alt="奶蛙摆出准备挑战的姿势" />
            <h2>下一关，一起试试看</h2>
            {currentProblem && (
              <>
                <p className="challenge-aside-problem">
                  {currentProblem.number} {currentProblem.title} ·{' '}
                  {difficultyMeta[currentProblem.difficulty].label}
                </p>
                <p>试着组合学过的知识，失败只是一次新的线索。</p>
                <Button to={`/practice/${currentProblem.id}`} fullWidth>
                  继续当前挑战
                </Button>
              </>
            )}
            <div className="challenge-legend">
              <span>★ 已通过</span>
              <span>
                <Play size={11} fill="currentColor" /> 当前
              </span>
              <span>
                <Lock size={11} /> 锁定
              </span>
            </div>
          </aside>
        </div>
      ) : (
        <EmptyState
          image="/frog/surprised.png"
          title="地图上暂时没有关卡"
          description="调整一下筛选条件，就能看到更多练习。"
          action={<Button onClick={resetFilters}>重置筛选</Button>}
        />
      )}
    </div>
  )
}
