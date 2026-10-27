import { Link } from 'react-router-dom'
import { BookOpen, Code2, Trophy } from 'lucide-react'
import { AchievementBadge } from '@/components/profile/AchievementBadge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/app/AuthContext'
import { achievements, getLevelInfo, learningRecords } from '@/data/mockData'
import type { Achievement } from '@/types'
import { cn } from '@/utils/cn'

const milestoneIds = ['first-code', 'streak-7', 'practice-master']

export function ProfileOverviewPage() {
  const { user } = useAuth()
  if (!user) return null

  const level = getLevelInfo(user.exp)
  const recentRecords = learningRecords.slice(0, 2)
  const milestones = milestoneIds
    .map((id) => achievements.find((achievement) => achievement.id === id))
    .filter((achievement): achievement is Achievement => Boolean(achievement))

  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <h1>我的学习小天地</h1>
        <p>每一点努力，都在这里留下了足迹。</p>
      </header>

      <section className="profile-hero-card">
        <div className="profile-hero-frog">
          <img src="/frog/arms-crossed.png" alt="奶蛙在安静地陪你学习" />
        </div>
        <div className="profile-hero-info">
          <div className="profile-hero-title">
            <h2>{user.nickname}</h2>
            <span className="profile-joined">加入第 {user.joinedDays} 天</span>
          </div>
          <p className="profile-bio">{user.bio}</p>
          <div className="profile-level-row">
            <span>
              {level.title} Lv.{level.level}
            </span>
            <span>累计 {user.exp} EXP</span>
          </div>
          <ProgressBar value={level.progress} className="profile-exp-bar" />
          <p className="profile-exp-note">
            {level.level < 5 && level.remaining > 0
              ? `距离 Lv.${level.level + 1}（${level.max + 1} EXP）还差 ${level.remaining} EXP`
              : '已经抵达当前最高等级，继续把每一步走好。'}
          </p>
        </div>
      </section>

      <section className="profile-stats-strip" aria-label="学习数据">
        <div>
          <span>累计学习</span>
          <strong>
            {user.hoursLearned} <small>小时</small>
          </strong>
        </div>
        <div>
          <span>完成课时</span>
          <strong>
            {user.completedLessonCount} <small>课时</small>
          </strong>
        </div>
        <div>
          <span>通过练习</span>
          <strong>
            {user.passedProblemCount} <small>题</small>
          </strong>
        </div>
        <div>
          <span>连续学习</span>
          <strong>
            {user.streakDays} <small>天</small>
          </strong>
        </div>
      </section>

      <section className="content-card profile-recent-card">
        <div className="profile-section-head">
          <h2>最近学习</h2>
          <Link to="/profile/records">
            全部记录 <span>→</span>
          </Link>
        </div>
        <ul className="profile-recent-list">
          {recentRecords.map((record) => {
            const Icon = record.type === 'lesson' ? BookOpen : Code2
            return (
              <li key={record.id}>
                <span className={cn('profile-record-icon', `is-${record.type}`)}>
                  <Icon size={19} />
                </span>
                <div className="profile-recent-copy">
                  <strong>{record.title}</strong>
                  <p>
                    {record.subtitle} · {record.time}
                  </p>
                </div>
                {record.href && (
                  <Button to={record.href} variant="secondary" size="sm">
                    {record.action}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="content-card profile-milestone-card">
        <div className="profile-section-head">
          <h2>成长里程碑</h2>
          <Link to="/profile/achievements">
            我的成就 <span>→</span>
          </Link>
        </div>
        <div className="profile-milestone-grid">
          {milestones.map((achievement) => {
            const earnedAt = user.achievements[achievement.id]
            const unlocked = Boolean(earnedAt)
            return (
              <article
                key={achievement.id}
                className={cn('profile-milestone', !unlocked && 'is-locked')}
              >
                <AchievementBadge icon={achievement.icon} unlocked={unlocked} size="sm" />
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                <span>
                  {achievement.id === 'practice-master' && !unlocked
                    ? `当前 ${user.passedProblemCount}/50 题`
                    : unlocked
                      ? '已获得'
                      : '未获得'}
                </span>
              </article>
            )
          })}
        </div>
        {user.achievements['frog-doctor'] && (
          <p className="profile-milestone-extra">
            <Trophy size={15} /> 你已经抵达蛙博士，继续做喜欢的事吧。
          </p>
        )}
      </section>
    </div>
  )
}
