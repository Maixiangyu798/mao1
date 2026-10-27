import { useMemo, useState } from 'react'
import { BookOpen, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/app/AuthContext'
import { learningRecords } from '@/data/mockData'
import { cn } from '@/utils/cn'

type TypeFilter = 'all' | 'lesson' | 'problem'
type RangeFilter = '7' | '30' | 'all'

const groupMeta = {
  today: { title: '今天', date: '10 月 22 日' },
  yesterday: { title: '昨天', date: '10 月 21 日' },
  earlier: { title: '更早', date: '10 月 20 日' },
} as const

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'lesson', label: '课程' },
  { value: 'problem', label: '练习' },
]

const rangeOptions: { value: RangeFilter; label: string }[] = [
  { value: '7', label: '近 7 天' },
  { value: '30', label: '近 30 天' },
  { value: 'all', label: '全部' },
]

export function RecordsPage() {
  const { user } = useAuth()
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>('7')

  const filtered = useMemo(() => {
    const rangeDays = rangeFilter === 'all' ? Number.POSITIVE_INFINITY : Number(rangeFilter)
    return learningRecords.filter((record) => {
      if (typeFilter !== 'all' && record.type !== typeFilter) return false
      // The seeded records all belong to the current week. Keeping the range
      // check here means the control keeps working when real history is added.
      return rangeDays >= 7
    })
  }, [rangeFilter, typeFilter])

  if (!user) return null

  const groups = (Object.keys(groupMeta) as (keyof typeof groupMeta)[])
    .map((key) => ({
      key,
      ...groupMeta[key],
      records: filtered.filter((record) => record.group === key),
    }))
    .filter((group) => group.records.length > 0)

  return (
    <div className="profile-page">
      <header className="profile-page-heading">
        <h1>学习记录</h1>
        <p>把点滴努力连起来，就是你的成长轨迹。</p>
      </header>

      <div className="records-filter-bar">
        <div className="records-type-tabs" role="tablist" aria-label="记录类型">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={typeFilter === option.value}
              className={cn('records-type-tab', typeFilter === option.value && 'is-active')}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="records-range-tabs" aria-label="时间范围">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn('filter-chip', rangeFilter === option.value && 'is-active')}
              onClick={() => setRangeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length ? (
        <div className="records-groups">
          {groups.map((group) => (
            <section key={group.key} className="record-group">
              <header className="record-group-head">
                <span className="record-group-dot" aria-hidden="true" />
                <h2>{group.title}</h2>
                <span>{group.date}</span>
              </header>
              <div className="record-group-card">
                {group.records.map((record) => {
                  const Icon = record.type === 'lesson' ? BookOpen : Code2
                  return (
                    <article key={record.id} className="record-row">
                      <time>{record.time}</time>
                      <span className={cn('profile-record-icon', `is-${record.type}`)}>
                        <Icon size={19} />
                      </span>
                      <div className="record-copy">
                        <div className="record-title-line">
                          <span className="record-kind">
                            {record.type === 'lesson' ? '课程' : '练习'}
                          </span>
                          <strong>{record.title}</strong>
                        </div>
                        <p>{record.subtitle}</p>
                        <span className={cn('record-detail', `is-${record.status}`)}>
                          {record.detail}
                        </span>
                      </div>
                      {record.href && (
                        <Button to={record.href} variant="secondary" size="sm">
                          {record.action}
                        </Button>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
          <p className="records-end">已经看到这段时间的全部记录啦。</p>
        </div>
      ) : (
        <EmptyState
          image="/frog/lying-looking-up.png"
          title="这段时间还没有学习记录"
          description="换一个筛选条件，或者去写下一行代码吧。"
          action={
            <Button
              onClick={() => {
                setTypeFilter('all')
                setRangeFilter('all')
              }}
            >
              查看全部记录
            </Button>
          }
        />
      )}
    </div>
  )
}
