import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  Sun,
} from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { Button } from '@/components/ui/Button'
import { CourseCard } from '@/components/course/CourseCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { courses, getCourse, getLesson } from '@/data/courses'
import { getLevelInfo, levelTable } from '@/data/mockData'
import { getCourseProgress, getStartLesson } from '@/utils/course'

const learningRoute = [
  { index: '01', label: 'Python 入门' },
  { index: '02', label: '数据结构' },
  { index: '03', label: '数据处理' },
  { index: '04', label: '数据可视化' },
  { index: '05', label: '项目实战' },
]

function ContinueCard() {
  const { user } = useAuth()
  const course = getCourse('py-basic-01')
  if (!course) return null
  const progress = getCourseProgress(user, course)
  const lesson = user
    ? getLesson(course, user.courseProgress[course.id]?.currentLessonId) ??
      getStartLesson(user, course)
    : getStartLesson(user, course)
  const chapter = course.chapters.find((item) => item.id === lesson?.chapterId)
  const chapterIndex = course.chapters.findIndex((item) => item.id === lesson?.chapterId) + 1
  const hasProgress = progress.completedCount > 0
  const targetLesson = lesson?.id ?? 'py-basic-01-c1-l1'

  return (
    <article className="continue-card">
      <div className="continue-copy">
        <span className="soft-badge">
          {hasProgress ? '继续上次的好奇心' : '从这里写下第一行代码'}
        </span>
        <h2>{course.title}</h2>
        <p className="continue-location">
          {chapter ? `第 ${chapterIndex} 章 · ${lesson?.title}` : '从第一行代码开始'}
        </p>
        <div className="continue-progress-line">
          <span>
            {hasProgress
              ? `已完成 ${progress.completedCount} / ${course.lessonCount} 课时`
              : `共 ${course.lessonCount} 课时 · 约 8 小时`}
          </span>
          {hasProgress && <strong>{progress.percent}%</strong>}
        </div>
        {hasProgress && <ProgressBar value={progress.percent} className="continue-progress" />}
        <Button
          to={`/learn/${course.id}/${targetLesson}`}
          icon={<span className="play-dot">▶</span>}
          className="continue-button"
        >
          {hasProgress ? '继续学习' : '开始第一课'}
        </Button>
      </div>
      <div className="continue-frog">
        <img src="/frog/arms-crossed.png" alt="奶蛙抱着手臂，耐心等你继续学习" />
      </div>
    </article>
  )
}

function DailyCard() {
  const { user } = useAuth()
  return (
    <article className="daily-card">
      <div className="daily-card-head">
        <h2>每日一题</h2>
        <span className="daily-sun">
          <Sun size={21} />
        </span>
      </div>
      <h3>#002 计算平均分</h3>
      <p>用列表和函数，把一组分数变成一个答案。</p>
      <div className="daily-card-meta">
        <Tag tone="yellow">入门</Tag>
        <span>约 5 分钟</span>
      </div>
      <Button to="/practice/p002" variant="secondary" fullWidth className="daily-button">
        {user?.checkedInToday ? '回顾今日一题' : '去挑战'}
      </Button>
    </article>
  )
}

function LoggedInHome() {
  const { user } = useAuth()
  const level = user ? getLevelInfo(user.exp) : null
  if (!user || !level) return null
  const nextLevel = levelTable.find((item) => item.level === level.level + 1)
  const featuredCourses = courses.slice(0, 4)
  const weeklyHours = user.hoursLearned > 10 ? '3.5' : user.hoursLearned.toFixed(1)
  const weeklyCompleted = Math.min(12, user.completedLessonCount)

  return (
    <div className="home-page page-container">
      <section className="home-welcome">
        <div>
          <h1>{user.nickname.replace('同学', '')}，今天也一起进步一点吧。</h1>
          <p>慢慢来，每个小白都能学会 Python。</p>
        </div>
        <span className="level-badge">
          {level.title} Lv.{level.level}
        </span>
      </section>

      <section className="home-hero-grid">
        <ContinueCard />
        <DailyCard />
      </section>

      <section className="home-stats" aria-label="学习数据速览">
        <div className="home-stat-strip">
          <div className="home-stat">
            <span>连续学习</span>
            <strong>
              {user.streakDays} <small>天</small>
            </strong>
          </div>
          <div className="home-stat">
            <span>本周学习</span>
            <strong>
              {weeklyHours} <small>小时</small>
            </strong>
          </div>
          <div className="home-stat">
            <span>本周完成</span>
            <strong>
              {weeklyCompleted} <small>课时</small>
            </strong>
          </div>
        </div>
        <aside className="home-checkin">
          <img src="/frog/lounging.png" alt="" />
          <div>
            <h3>{user.checkedInToday ? '今天已打卡 ✓' : '今天还没打卡'}</h3>
            <p>{user.checkedInToday ? '认真学习，也要记得休息。' : '做一道小题，让今天也留下一点痕迹。'}</p>
          </div>
        </aside>
      </section>

      <section className="home-section">
        <SectionHeading
          title="接下来，探索更多可能"
          link={{ label: '全部课程', to: '/courses' }}
        />
        <div className="course-grid">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="learning-route-card">
        <div className="learning-route-head">
          <div>
            <h2>数据分析学习路线</h2>
            <p>
              {nextLevel
                ? `从第一行代码，到读懂数据里的故事。距离 ${nextLevel.title} 还差 ${level.remaining} EXP。`
                : '从第一行代码，到读懂数据里的故事。'}
            </p>
          </div>
          <Button to="/courses" variant="secondary" size="sm" icon={<Compass size={16} />}>
            查看完整路线
          </Button>
        </div>
        <ol className="learning-route">
          {learningRoute.map((item, index) => (
            <li key={item.index} className={index < 2 ? 'is-complete' : ''}>
              <span className="route-index">{item.index}</span>
              <span>{item.label}</span>
              {index < learningRoute.length - 1 && <ChevronRight size={15} />}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function GuestHome() {
  const featuredCourses = courses.slice(0, 4)
  return (
    <div className="home-page home-page-guest page-container">
      <section className="guest-hero">
        <div className="guest-hero-copy">
          <span className="soft-badge">免费学习 · 浏览器里就能写 Python</span>
          <h1>
            和奶蛙一起，
            <br />
            写下人生第一行代码。
          </h1>
          <p className="guest-slogan">慢慢来，每个小白都能学会 Python。</p>
          <p className="guest-description">
            不用安装，不怕报错。从一个 print 开始，读一点、写一点，和奶蛙一起把「我不会」变成「我做到了」。
          </p>
          <div className="guest-hero-actions">
            <Button to="/register" iconRight={<ArrowRight size={17} />}>
              免费注册，开始学习
            </Button>
            <Button to="/courses" variant="secondary">
              先看看课程
            </Button>
          </div>
        </div>
        <div className="guest-hero-visual">
          <img src="/frog/belly-laugh.png" alt="奶蛙开心地捧腹大笑" />
          <div className="guest-code-chip">
            <code>&gt;_</code>
            <span>print(&quot;你好，世界&quot;)</span>
          </div>
        </div>
      </section>

      <section className="guest-features">
        <h2>每一次动手，都离学会更近一点</h2>
        <div className="guest-feature-grid">
          <article className="guest-feature">
            <span className="feature-icon">
              <BookOpen size={22} />
            </span>
            <h3>读懂教程</h3>
            <p>用生活里的例子，理解一个新知识。</p>
          </article>
          <article className="guest-feature">
            <span className="feature-icon">
              <Code2 size={22} />
            </span>
            <h3>动手编程</h3>
            <p>在浏览器里写代码，立刻看到结果。</p>
          </article>
          <article className="guest-feature">
            <span className="feature-icon">
              <CheckCircle2 size={22} />
            </span>
            <h3>提交与成长</h3>
            <p>提交判题、获得经验，解锁下一课。</p>
          </article>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading
          title="找到你的第一门课"
          link={{ label: '全部课程', to: '/courses' }}
        />
        <div className="course-grid">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="learning-route-card">
        <div className="learning-route-head">
          <div>
            <h2>数据分析学习路线</h2>
            <p>从第一行代码，到读懂数据里的故事。</p>
          </div>
          <Button to="/courses" variant="secondary" size="sm" icon={<Compass size={16} />}>
            查看完整路线
          </Button>
        </div>
        <ol className="learning-route">
          {learningRoute.map((item, index) => (
            <li key={item.index}>
              <span className="route-index">{item.index}</span>
              <span>{item.label}</span>
              {index < learningRoute.length - 1 && <ChevronRight size={15} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="guest-final-cta">
        <div>
          <h2>今天，从一个小小的开始。</h2>
          <p>所有课程免费开放，奶蛙会一直陪着你。</p>
        </div>
        <Button to="/register" iconRight={<ArrowRight size={17} />}>
          开启我的 Python 之旅
        </Button>
      </section>
    </div>
  )
}

export function HomePage() {
  const { user } = useAuth()
  return user ? <LoggedInHome /> : <GuestHome />
}
