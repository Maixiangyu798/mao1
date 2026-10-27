import { NavLink, Outlet } from 'react-router-dom'
import {
  Award,
  Bookmark,
  History,
  LayoutGrid,
  Settings,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/app/AuthContext'
import { getLevelInfo } from '@/data/mockData'
import { cn } from '@/utils/cn'

const profileNav = [
  { to: '/profile', label: '概览', icon: LayoutGrid, end: true },
  { to: '/profile/records', label: '学习记录', icon: History },
  { to: '/profile/achievements', label: '我的成就', icon: Award },
  { to: '/profile/favorites', label: '我的收藏', icon: Bookmark },
  { to: '/profile/settings', label: '设置', icon: Settings },
]

export function ProfileLayout() {
  const { user } = useAuth()
  if (!user) return null
  const level = getLevelInfo(user.exp)

  return (
    <div className="page-container profile-container">
      <aside className="profile-sidebar">
        <div className="profile-sidebar-user">
          <Avatar initial={user.initials} size="lg" />
          <div>
            <strong>{user.nickname}</strong>
            <span>
              {level.title} Lv.{level.level}
            </span>
          </div>
        </div>

        <nav className="profile-nav" aria-label="个人中心导航">
          {profileNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn('profile-nav-link', isActive && 'is-active')}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="profile-side-tip">
          <img src="/frog/thinking.png" alt="" />
          <p>每一小步，都在让你成为更好的自己。</p>
        </div>
      </aside>

      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  )
}
