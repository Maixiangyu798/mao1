import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Copy,
  Lightbulb,
  Lock,
  Play,
  RotateCcw,
  Send,
  Star,
  TerminalSquare,
} from 'lucide-react'
import { CodeEditor } from '@/components/practice/CodeEditor'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { difficultyMeta } from '@/data/courses'
import { getProblem, getProblemIndex, problems } from '@/data/problems'
import type { CodeRunResult, Problem } from '@/types'
import { executePython, isProblemSolution } from '@/utils/pythonSimulator'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'
import { cn } from '@/utils/cn'

type DetailTab = 'description' | 'solution' | 'records'

function ProblemDetailContent({ problem }: { problem: Problem }) {
  const { user, recordProblemResult, toggleFavoriteProblem } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const problemIndex = getProblemIndex(problem.id)
  const nextProblem = problems[problemIndex + 1]
  const previousProblem = problems[problemIndex - 1]
  const previousResult = user?.problemResults[problem.id]
  const hasPassed = Boolean(previousResult?.stars)
  const attemptCount = previousResult?.attempts ?? 0
  const hintUnlocked = attemptCount >= 3
  const isFavorite = user?.favoriteProblems.includes(problem.id) ?? false

  const [tab, setTab] = useState<DetailTab>('description')
  const [code, setCode] = useState(
    () => readStorage<string>(STORAGE_KEYS.problemDraft(problem.id)) ?? problem.initialCode,
  )
  const [result, setResult] = useState<CodeRunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [visibleHints, setVisibleHints] = useState(0)
  const [usedHint, setUsedHint] = useState(false)
  const [passedNow, setPassedNow] = useState(false)

  const updateCode = (value: string) => {
    setCode(value)
    writeStorage(STORAGE_KEYS.problemDraft(problem.id), value)
  }

  const requireLogin = () => {
    if (user) return false
    showToast('登录后才能保存判题记录哦', 'info')
    navigate(`/login?returnUrl=${encodeURIComponent(`/practice/${problem.id}`)}`)
    return true
  }

  const runCode = () => {
    if (running || submitting) return
    setRunning(true)
    setResult(null)
    window.setTimeout(() => {
      setResult(executePython(code, problem.sampleOutput))
      setRunning(false)
    }, 320)
  }

  const onSubmit = () => {
    if (running || submitting || requireLogin()) return
    setSubmitting(true)
    setResult(null)
    window.setTimeout(() => {
      const runResult = executePython(code, problem.sampleOutput)
      if (runResult.status !== 'success') {
        recordProblemResult(problem.id, false, usedHint)
        setResult(runResult)
        setSubmitting(false)
        showToast('代码还没有运行成功，看看控制台的提示', 'error')
        return
      }

      if (!isProblemSolution(problem.id, code)) {
        recordProblemResult(problem.id, false, usedHint)
        setResult({
          status: 'error',
          output: `判题未通过：你的程序输出是\n${runResult.output}`,
          detail: `期望输出：${problem.sampleOutput}`,
          friendlyError:
            '大部分思路已经写对啦。对照题目要求检查边界条件，或解锁提示再试一次。',
        })
        setSubmitting(false)
        showToast('判题未通过，再试一次吧', 'error')
        return
      }

      const outcome = recordProblemResult(problem.id, true, usedHint)
      setPassedNow(true)
      setResult({
        status: 'success',
        output: `判题通过！\n${runResult.output}`,
        duration: runResult.duration,
      })
      setSubmitting(false)
      showToast(
        outcome.firstPass
          ? `判题通过，获得 +${outcome.expGained} EXP 和 ${outcome.stars} 颗星`
          : `判题通过，保持练习的手感`,
        'success',
      )
    }, 420)
  }

  const revealHint = () => {
    if (!hintUnlocked) {
      showToast(`再尝试 ${Math.max(0, 3 - attemptCount)} 次，提示就会解锁`, 'info')
      return
    }
    if (visibleHints >= problem.hints.length) {
      showToast('提示已经全部展示啦', 'info')
      return
    }
    setUsedHint(true)
    setVisibleHints((count) => count + 1)
  }

  const onFavorite = () => {
    if (requireLogin()) return
    const added = toggleFavoriteProblem(problem.id)
    showToast(added ? '已收藏题目，之后可以从「我的收藏」找到它' : '已取消收藏')
  }

  const openSolutionTab = () => {
    if (!hasPassed && !passedNow) {
      showToast('先通过这道题，题解就会解锁啦', 'info')
      return
    }
    setTab('solution')
  }

  const statusText = hasPassed || passedNow ? '已通过' : attemptCount ? '未通过' : '未做'
  const difficulty = difficultyMeta[problem.difficulty]

  return (
    <div className="page-container problem-page">
      <div className="problem-topline">
        <Link to="/practice" className="problem-back">
          <ArrowLeft size={16} /> 返回题库 <span>/</span> 基础练习
        </Link>
        <button
          type="button"
          className={cn('favorite-button', isFavorite && 'is-active')}
          onClick={onFavorite}
        >
          <Bookmark size={17} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? '已收藏' : '收藏题目'}
        </button>
      </div>

      <header className="problem-heading">
        <div className="problem-title-row">
          <span className="problem-number">{problem.number}</span>
          <h1>{problem.title}</h1>
          <Tag className={difficulty.className}>{difficulty.label}</Tag>
        </div>
        <div className="problem-meta-row">
          {problem.tags.map((tag) => (
            <Tag key={tag} tone="neutral">
              {tag}
            </Tag>
          ))}
          <span className={cn('problem-status', `is-${hasPassed || passedNow ? 'passed' : attemptCount ? 'failed' : 'todo'}`)}>
            {statusText}
          </span>
          {hasPassed && previousResult?.stars ? (
            <span className="problem-stars" aria-label={`获得 ${previousResult.stars} 颗星`}>
              {Array.from({ length: previousResult.stars }, (_, index) => (
                <Star key={index} size={13} fill="currentColor" />
              ))}
            </span>
          ) : null}
        </div>
      </header>

      <div className="problem-layout">
        <section className="problem-content">
          <nav className="problem-tabs" aria-label="题目信息">
            <button
              type="button"
              className={cn('problem-tab', tab === 'description' && 'is-active')}
              onClick={() => setTab('description')}
            >
              题目描述
            </button>
            <button
              type="button"
              className={cn(
                'problem-tab',
                tab === 'solution' && 'is-active',
                !hasPassed && !passedNow && 'is-locked',
              )}
              onClick={openSolutionTab}
            >
              题解 · {hasPassed || passedNow ? '已解锁' : '未解锁'}
            </button>
            <button
              type="button"
              className={cn('problem-tab', tab === 'records' && 'is-active')}
              onClick={() => setTab('records')}
            >
              提交记录
            </button>
          </nav>

          {tab === 'description' && (
            <div className="problem-description">
              <h2>帮奶蛙算一算</h2>
              <p>{problem.description}</p>
              <p>{problem.task}</p>

              <div className="sample-card">
                <h3>示例</h3>
                <dl>
                  <div>
                    <dt>输入：</dt>
                    <dd>
                      <code>{problem.sampleInput}</code>
                    </dd>
                  </div>
                  <div>
                    <dt>期望输出：</dt>
                    <dd>
                      <code>{problem.sampleOutput}</code>
                    </dd>
                  </div>
                </dl>
                <p className="sample-explanation">解释：{problem.explanation}</p>
              </div>

              <h3>输入范围</h3>
              <ul className="problem-constraints">
                <li>数据已在题目描述中给出，无需从标准输入读取。</li>
                <li>只需完成题目要求的功能，并保留示例中的输出格式。</li>
                <li>答案会按照示例输出进行判定，注意中英文标点。</li>
              </ul>

              <div className="hint-block">
                <div className="hint-head">
                  <div>
                    <h3>
                      卡住了吗？
                      {hintUnlocked && <span>提示已解锁</span>}
                    </h3>
                    <p>
                      {hintUnlocked
                        ? `已展示 ${visibleHints} / ${problem.hints.length} 条提示`
                        : '连续提交失败 3 次后，提示会自动解锁。'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={cn('hint-button', !hintUnlocked && 'is-locked')}
                    onClick={revealHint}
                    disabled={visibleHints >= problem.hints.length}
                  >
                    {!hintUnlocked ? <Lock size={14} /> : <Lightbulb size={14} />}
                    {!hintUnlocked
                      ? '提示未解锁'
                      : visibleHints >= problem.hints.length
                        ? '提示已看完'
                        : `查看提示 ${visibleHints + 1}`}
                  </button>
                </div>
                {visibleHints > 0 && (
                  <ol className="hint-list">
                    {problem.hints.slice(0, visibleHints).map((hint, index) => (
                      <li key={hint}>
                        <span>提示 {index + 1}</span>
                        <p>{hint}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {passedNow && (
                <div className="problem-passed-panel">
                  <CheckCircle2 size={20} />
                  <div>
                    <strong>这题已经通过啦</strong>
                    <p>题解已解锁，也可以看看别人的思路，再写一遍自己的版本。</p>
                  </div>
                  <button type="button" onClick={() => setTab('solution')}>
                    看题解 <ChevronRight size={15} />
                  </button>
                </div>
              )}

              <div className="problem-pagination">
                {previousProblem ? (
                  <Link to={`/practice/${previousProblem.id}`}>
                    <ArrowLeft size={15} /> {previousProblem.number} {previousProblem.title}
                  </Link>
                ) : (
                  <span />
                )}
                {nextProblem && (
                  <Link to={`/practice/${nextProblem.id}`}>
                    {nextProblem.number} {nextProblem.title} <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          )}

          {tab === 'solution' && (
            <div className="solution-content">
              <span className="solution-badge">
                <CheckCircle2 size={15} /> 已通过本题 · 解锁题解
              </span>
              <h2>解题思路</h2>
              <p>{problem.solutionIdea}</p>
              <div className="solution-code">
                <header>
                  <span>参考代码 · Python</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateCode(problem.solution)
                      setTab('description')
                      showToast('参考代码已放进编辑器', 'success')
                    }}
                  >
                    <Copy size={14} /> 填入编辑器
                  </button>
                </header>
                <pre>
                  <code>{problem.solution}</code>
                </pre>
              </div>
              <p className="solution-note">
                参考代码只提供一种思路。试着合上它，再独立写一次，知识才会真正留下来。
              </p>
            </div>
          )}

          {tab === 'records' && (
            <div className="records-content">
              <h2>提交记录</h2>
              {attemptCount ? (
                <>
                  <div className="record-summary">
                    <div>
                      <span>累计尝试</span>
                      <strong>{attemptCount} 次</strong>
                    </div>
                    <div>
                      <span>当前状态</span>
                      <strong>{hasPassed || passedNow ? '已通过' : '未通过'}</strong>
                    </div>
                    <div>
                      <span>最佳星数</span>
                      <strong>
                        {previousResult?.stars ? `${previousResult.stars} 颗星` : '暂无'}
                      </strong>
                    </div>
                  </div>
                  <ul className="record-list">
                    <li>
                      <span className="record-status-icon is-failed">
                        {hasPassed || passedNow ? (
                          <Check size={15} />
                        ) : (
                          <CircleHelp size={15} />
                        )}
                      </span>
                      <div>
                        <strong>
                          {hasPassed || passedNow ? '最近一次提交通过' : '最近一次提交未通过'}
                        </strong>
                        <p>
                          {hasPassed || passedNow
                            ? `使用 ${attemptCount} 次尝试完成这道题。`
                            : '答案还差一点，可以继续修改代码。'}
                        </p>
                      </div>
                      <small>共 {attemptCount} 次</small>
                    </li>
                  </ul>
                </>
              ) : (
                <div className="records-empty">
                  <TerminalSquare size={22} />
                  <h3>还没有提交记录</h3>
                  <p>先运行看看，完成后再提交判题。每一次尝试都会被好好保存。</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="problem-workspace">
          <CodeEditor
            value={code}
            onChange={updateCode}
            onRun={runCode}
            onSave={() => {
              writeStorage(STORAGE_KEYS.problemDraft(problem.id), code)
              showToast('代码草稿已保存', 'success')
            }}
            filename="solution.py"
            statusText="Python 3 · 已自动保存"
            fontSize={user?.preferences.lessonFontSize ?? 14}
            minHeight={360}
            className="problem-editor"
          />

          <div className="problem-runbar">
            <Button
              variant="secondary"
              icon={<Play size={16} fill="currentColor" />}
              loading={running}
              onClick={runCode}
            >
              运行（自测）
            </Button>
            <Button icon={<Send size={16} />} loading={submitting} onClick={onSubmit}>
              提交（判题）
            </Button>
            <span className="learn-runbar-spacer" />
            <button
              type="button"
              className="learn-plain-action"
              onClick={() => {
                updateCode(problem.initialCode)
                setResult(null)
                showToast('代码已重置', 'info')
              }}
            >
              <RotateCcw size={14} /> 重置
            </button>
          </div>

          <section className="learn-console problem-console" aria-live="polite">
            <header>
              <h2>控制台</h2>
              <span>
                {running || submitting
                  ? '正在运行…'
                  : result?.status === 'success'
                    ? `运行成功${result.duration ? ` · ${result.duration}` : ''}`
                    : result?.status === 'error'
                      ? '未通过'
                      : '等待运行'}
              </span>
            </header>
            {result ? (
              <div className={cn('console-output', `is-${result.status}`)}>
                <pre>{result.output}</pre>
                {result.friendlyError && <p>{result.friendlyError}</p>}
                {result.detail && !result.friendlyError && <small>{result.detail}</small>}
              </div>
            ) : (
              <div className="console-empty">
                <TerminalSquare size={18} />
                <div>
                  <p>先运行看看，让代码说出答案。</p>
                  <small>自测不代表判题通过，完成后记得提交。</small>
                </div>
              </div>
            )}
          </section>

          <div className="problem-hint-status">
            <Lightbulb size={15} />
            {hintUnlocked
              ? '完成 3 次尝试，提示已解锁。'
              : `失败 ${Math.max(0, 3 - attemptCount)} 次后解锁提示。`}
          </div>
        </section>
      </div>
    </div>
  )
}

export function ProblemDetailPage() {
  const { problemId } = useParams()
  const problem = getProblem(problemId)
  if (!problem) return <Navigate to="/404" replace />
  return <ProblemDetailContent key={problem.id} problem={problem} />
}
