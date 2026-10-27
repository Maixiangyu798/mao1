import { Crown, Trophy } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { PageHeading } from '@/components/ui/PageHeading'
import { useAuth } from '@/app/AuthContext'
import { currentUserRank, getLevelInfo, leaderboard } from '@/data/mockData'
import { cn } from '@/utils/cn'

function weekRange() {
  const today = new Date()
  const dayOffset = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const format = (date: Date) => `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, '0')}`
  return `${format(monday)}–${format(sunday)}`
}

export function RankingPage() {
  const { user } = useAuth()
  const userLevel = user ? getLevelInfo(user.exp).level : currentUserRank.level
  const myWeeklyHours = user
    ? Number(Math.min(user.hoursLearned, 3.5).toFixed(1))
    : currentUserRank.hours
  const podium = leaderboard.slice(0, 3)
  const second = podium[1]
  const first = podium[0]
  const third = podium[2]

  return (
    <div className="page-container ranking-page">
      <PageHeading
        title="每一点认真，都值得被看见"
        subtitle="和同路人一起坚持，也别忘了自己的节奏。"
        actions={<span className="ranking-week">本周 · {weekRange()}</span>}
      />

      <InfoBanner className="ranking-note">
        暂按周学习时长展示 · 统计口径待确认，本榜单非最终产品口径。
      </InfoBanner>

      <section className="podium" aria-label="本周排行榜前三名">
        {[second, first, third].map((entry, index) => {
          if (!entry) return null
          const isFirst = entry.rank === 1
          return (
            <article
              key={entry.rank}
              className={cn(
                'podium-card',
                isFirst && 'is-first',
                entry.rank === 2 && 'is-second',
                entry.rank === 3 && 'is-third',
                index === 1 && 'is-center',
              )}
            >
              <span className="podium-icon">
                {isFirst ? <Crown size={27} /> : <Trophy size={24} />}
              </span>
              <Avatar initial={entry.initial} size={isFirst ? 'lg' : 'md'} />
              <p>
                第 {entry.rank} 名 <strong>{entry.name}</strong>
              </p>
              <span className="podium-hours">{entry.hours.toFixed(1)} 小时</span>
              <small>本周学习 · Lv.{entry.level}</small>
            </article>
          )
        })}
      </section>

      <div className="ranking-layout">
        <section className="ranking-table-card">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>学习者</th>
                <th>等级</th>
                <th>本周学习时长</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank}>
                  <td>
                    <span className={cn('rank-number', entry.rank <= 3 && 'is-top')}>
                      {String(entry.rank).padStart(2, '0')}
                    </span>
                  </td>
                  <td>
                    <span className="ranking-learner">
                      <Avatar initial={entry.initial} size="sm" tone="cream" />
                      <strong>{entry.name}</strong>
                    </span>
                  </td>
                  <td className="ranking-level">Lv.{entry.level}</td>
                  <td className="ranking-hours">{entry.hours.toFixed(1)} 小时</td>
                </tr>
              ))}
              {user && (
                <tr className="is-me">
                  <td>
                    <span className="rank-number">{currentUserRank.rank}</span>
                  </td>
                  <td>
                    <span className="ranking-learner">
                      <strong>{user.nickname}（我）</strong>
                    </span>
                  </td>
                  <td className="ranking-level">Lv.{userLevel}</td>
                  <td className="ranking-hours">{myWeeklyHours.toFixed(1)} 小时</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="ranking-table-note">
            排名是一份陪伴，不是催促。每个人都有自己的起跑线。
          </p>
        </section>

        <aside className="ranking-aside">
          <img src="/frog/lounging.png" alt="奶蛙躺下来休息" />
          <h2>按自己的节奏就好</h2>
          <p>
            {user
              ? `你已连续学习 ${user.streakDays} 天。排名是一份陪伴，不是催促。今天再学一点，就是自己的进步。`
              : '登录后可以记录你的学习时长，和同路人一起慢慢前进。'}
          </p>
          <Button to={user ? '/profile' : '/login'} fullWidth>
            {user ? '回到我的学习' : '登录后一起学习'}
          </Button>
        </aside>
      </div>
    </div>
  )
}
