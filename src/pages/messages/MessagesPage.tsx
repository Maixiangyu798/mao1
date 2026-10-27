import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  CheckCheck,
  ChevronRight,
  GraduationCap,
  Bell,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeading } from '@/components/ui/PageHeading'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { messages } from '@/data/mockData'
import type { Message } from '@/types'
import { cn } from '@/utils/cn'

type MessageFilter = 'all' | Message['type']

const filterOptions: { value: MessageFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'system', label: '系统' },
  { value: 'reminder', label: '学习提醒' },
  { value: 'achievement', label: '成就' },
]

const typeMeta = {
  system: { label: '系统', icon: Bell },
  reminder: { label: '学习提醒', icon: BookOpen },
  achievement: { label: '成就', icon: Trophy },
} as const

function typeIcon(type: Message['type']) {
  if (type === 'reminder') return BookOpen
  if (type === 'achievement') return GraduationCap
  return Bell
}

export function MessagesPage() {
  const { user, markMessageRead, markAllMessagesRead } = useAuth()
  const { showToast } = useToast()
  const [filter, setFilter] = useState<MessageFilter>('all')

  if (!user) return null

  const unreadCount = messages.filter(
    (message) => !user.readMessageIds.includes(message.id),
  ).length
  const filtered = messages.filter(
    (message) => filter === 'all' || message.type === filter,
  )

  const unreadFor = (value: MessageFilter) =>
    messages.filter(
      (message) =>
        !user.readMessageIds.includes(message.id) &&
        (value === 'all' || message.type === value),
    ).length

  const onMarkAll = () => {
    markAllMessagesRead()
    showToast('所有消息都标为已读啦', 'success')
  }

  return (
    <div className="page-container messages-page">
      <PageHeading
        title="消息中心"
        subtitle="关于学习的小提醒，还有值得庆祝的好消息。"
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCheck size={16} />}
            disabled={unreadCount === 0}
            onClick={onMarkAll}
          >
            全部标为已读
          </Button>
        }
      />

      <section className="messages-card">
        <div className="messages-tabs" role="tablist" aria-label="消息类型">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={filter === option.value}
              className={cn('messages-tab', filter === option.value && 'is-active')}
              onClick={() => setFilter(option.value)}
            >
              {option.label} ({unreadFor(option.value)})
            </button>
          ))}
        </div>

        {filtered.length ? (
          <ul className="messages-list">
            {filtered.map((message) => {
              const Icon = typeIcon(message.type)
              const meta = typeMeta[message.type]
              const unread = !user.readMessageIds.includes(message.id)
              return (
                <li key={message.id}>
                  <Link
                    to={message.href ?? '/messages'}
                    className={cn('message-row', unread && 'is-unread')}
                    onClick={() => markMessageRead(message.id)}
                  >
                    <span className={cn('message-icon', `is-${message.type}`)}>
                      <Icon size={20} />
                    </span>
                    <div className="message-copy">
                      <div className="message-title-line">
                        <strong>{message.title}</strong>
                        {unread && <span className="message-unread-dot" aria-label="未读" />}
                      </div>
                      <p>{message.summary}</p>
                      <div className="message-meta">
                        <span>{meta.label}</span>
                        <time>{message.time}</time>
                      </div>
                    </div>
                    <ChevronRight size={18} className="message-chevron" />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            image="/frog/lounging.png"
            title="这里暂时没有消息"
            description="换个分类看看，或者去学一点新东西吧。"
            compact
          />
        )}
      </section>

      <p className="messages-end">没有更多消息啦，去学习一点新东西吧。</p>
    </div>
  )
}
