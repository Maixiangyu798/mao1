import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Check,
  Code2,
  GraduationCap,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/Button'
import { goalOptions } from '@/data/mockData'
import { getStartLesson } from '@/utils/course'
import { getCourse } from '@/data/courses'
import type { GoalKey } from '@/types'
import { cn } from '@/utils/cn'

const goalIcons = {
  office: BriefcaseBusiness,
  data: ChartNoAxesColumnIncreasing,
  interest: Sparkles,
  course: GraduationCap,
}

export function OnboardingPage() {
  const { user, updateProfile, startCourse } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [foundation, setFoundation] = useState<'zero' | 'some'>('zero')
  const [goals, setGoals] = useState<GoalKey[]>(user?.goals ?? [])

  if (!user) return null

  const toggleGoal = (goal: GoalKey) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((item) => item !== goal))
      return
    }
    if (goal === 'interest') {
      setGoals(['interest'])
      return
    }
    const withoutInterest = goals.filter((item) => item !== 'interest')
    if (withoutInterest.length >= 2) {
      showToast('最多选择 2 项，让奶蛙更了解你', 'info')
      return
    }
    setGoals([...withoutInterest, goal])
  }

  const finish = () => {
    updateProfile({
      nickname: user.nickname,
      bio: user.bio,
      goals,
    })
    setStep(3)
  }

  const beginFirstLesson = () => {
    const course = getCourse('py-basic-01')
    if (!course) return
    const lessonId = startCourse(course.id) ?? getStartLesson(user, course)?.id
    if (lessonId) {
      navigate(`/learn/${course.id}/${lessonId}`)
    } else {
      navigate(`/course/${course.id}`)
    }
  }

  const illustration =
    step === 1 ? '/frog/sideways-glance.png' : step === 2 ? '/frog/thinking.png' : '/frog/arms-crossed.png'

  return (
    <div className="onboarding-page page-container">
      <div className="onboarding-progress-row">
        <div className="onboarding-progress">
          <span className="onboarding-step-badge">
            {step === 3 ? '已完成' : `${step}/2`}
          </span>
          <span>{step === 3 ? '为你准备好了学习路线' : '先认识一下你'}</span>
          <span className="onboarding-progress-track" aria-hidden="true">
            <span style={{ width: `${step === 1 ? 34 : step === 2 ? 100 : 100}%` }} />
          </span>
        </div>
        <button type="button" className="onboarding-skip" onClick={() => navigate('/')}>
          先逛逛 →
        </button>
      </div>

      <div className="onboarding-layout">
        <aside className="onboarding-aside">
          <div className="onboarding-frog-frame" key={illustration}>
            <img src={illustration} alt="" />
          </div>
          <h2>
            {step === 1 && '每个人都有自己的起点。'}
            {step === 2 && '每个人都有自己的节奏。'}
            {step === 3 && '很高兴和你一起出发。'}
          </h2>
          <p>
            {step === 3 ? '不用急着跑很远，先写好今天这一行。' : '没有标准答案，我们只想找到适合你的节奏。'}
          </p>
        </aside>

        <section className="onboarding-panel">
          {step === 1 && (
            <>
              <header className="onboarding-question">
                <h1>你接触过编程吗？</h1>
                <p>选一个最接近你的情况就好。</p>
              </header>
              <div className="option-list" role="radiogroup" aria-label="编程基础">
                <button
                  type="button"
                  role="radio"
                  aria-checked={foundation === 'zero'}
                  className={cn('choice-card', foundation === 'zero' && 'is-selected')}
                  onClick={() => setFoundation('zero')}
                >
                  <span className="choice-icon">
                    <Wrench size={21} />
                  </span>
                  <span className="choice-copy">
                    <strong>完全零基础</strong>
                    <small>从未写过代码，也没关系</small>
                  </span>
                  <span className={cn('choice-radio', foundation === 'zero' && 'is-selected')}>
                    {foundation === 'zero' && <Check size={13} strokeWidth={3} />}
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={foundation === 'some'}
                  className={cn('choice-card', foundation === 'some' && 'is-selected')}
                  onClick={() => setFoundation('some')}
                >
                  <span className="choice-icon">
                    <Code2 size={21} />
                  </span>
                  <span className="choice-copy">
                    <strong>学过一点</strong>
                    <small>了解一些概念，希望系统地学</small>
                  </span>
                  <span className={cn('choice-radio', foundation === 'some' && 'is-selected')}>
                    {foundation === 'some' && <Check size={13} strokeWidth={3} />}
                  </span>
                </button>
              </div>
              <Button
                fullWidth
                className="onboarding-next"
                icon={<ArrowRight size={17} />}
                onClick={() => setStep(2)}
              >
                下一步
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <header className="onboarding-question">
                <h1>你想用 Python 做些什么？</h1>
                <p>最多选择 2 项，让奶蛙更了解你。</p>
              </header>
              <div className="option-list" role="group" aria-label="学习目标">
                {goalOptions.map((option) => {
                  const Icon = goalIcons[option.value]
                  const selected = goals.includes(option.value)
                  const disabled = goals.length >= 2 && !selected && option.value !== 'interest'
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      aria-disabled={disabled}
                      className={cn(
                        'choice-card',
                        selected && 'is-selected',
                        disabled && 'is-muted',
                      )}
                      onClick={() => toggleGoal(option.value)}
                    >
                      <span className="choice-icon">
                        <Icon size={21} />
                      </span>
                      <span className="choice-copy">
                        <strong>{option.label}</strong>
                        <small>{option.description}</small>
                      </span>
                      <span className={cn('choice-radio', selected && 'is-selected')}>
                        {selected && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="onboarding-select-hint">
                已选 {goals.length}/2 ·「兴趣入门」不能与其他目标同时选择。
              </p>
              <div className="onboarding-actions">
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={17} />}
                  onClick={() => setStep(1)}
                  className="onboarding-back"
                >
                  上一步
                </Button>
                <Button
                  fullWidth
                  icon={<ArrowRight size={17} />}
                  disabled={goals.length === 0}
                  onClick={finish}
                >
                  生成我的学习路线
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <header className="onboarding-question">
                <h1>你的 Python 起步路线</h1>
                <p>
                  完全零基础 · 目标：
                  {goals.map((goal) => goalOptions.find((item) => item.value === goal)?.label).join('、')}
                </p>
              </header>

              <div className="route-card">
                <span className="route-badge">为你推荐 · 从这里开始</span>
                <h2>Python 零基础入门</h2>
                <p>32 课时 · 约 8 小时 · 学会变量、条件循环与函数，为后续实践打好基础。</p>
                <ol className="route-steps">
                  <li className="is-active">
                    <span>1</span>
                    <div>
                      <strong>Python 零基础入门</strong>
                      <small>从写出第一行代码开始</small>
                    </div>
                  </li>
                  <li>
                    <span>2</span>
                    <div>
                      <strong>{goals.includes('office') ? '办公自动化' : '数据分析基础'}</strong>
                      <small>把学到的语法用在真实小任务里</small>
                    </div>
                  </li>
                  <li>
                    <span>3</span>
                    <div>
                      <strong>完成你的第一个小项目</strong>
                      <small>让一段完整的程序为你工作</small>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="onboarding-actions">
                <Button
                  variant="secondary"
                  icon={<ArrowLeft size={17} />}
                  onClick={() => setStep(2)}
                  className="onboarding-back"
                >
                  上一步
                </Button>
                <Button
                  fullWidth
                  icon={<ArrowRight size={17} />}
                  onClick={beginFirstLesson}
                >
                  开始第一课
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
