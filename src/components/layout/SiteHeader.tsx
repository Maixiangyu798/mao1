import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Award,
  Bell,
  BookOpen,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from 'lucide-react'
import { Brand } from '@/components/ui/Brand'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/app/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import { messages, getLevelInfo } from '@/data/mockData'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: '首页', match: (path: string) => path === '/' },
  { to: '/courses', label: '课程', match: (path: string) => path.startsWith('/course') },
  { to: '/practice', label: '训练', match: (path: string) => path.startsWith('/practice') },
  { to: '/ranking', label: '排行榜', match: (path: string) => path.startsWith('/ranking') },
]

export function SiteHeader() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setProfileOpen(false)
    setMobileOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unreadCount = user
    ? messages.filter((message) => !user.readMessageIds.includes(message.id)).length
    : 0
  const level = user ? getLevelInfo(user.exp) : null

  const goToProtected = (path: string) => {
    if (user) {
      navigate(path)
    } else {
      navigate(`/login?returnUrl=${encodeURIComponent(path)}`)
    }
  }

  const onLogout = () => {
    const leavingProtectedRoute =
      location.pathname.startsWith('/profile') ||
      location.pathname.startsWith('/learn') ||
      location.pathname === '/messages' ||
      location.pathname === '/onboarding'
    setLogoutOpen(false)
    setProfileOpen(false)
    logout()
    if (leavingProtectedRoute) {
      window.location.replace('/')
      return
    }
    showToast('已安全退出，奶蛙在这里等你回来～', 'info')
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="header-left">
            <Brand />
            <button
              type="button"
              className="mobile-nav-toggle"
              aria-label={mobileOpen ? '关闭导航菜单' : '打开导航菜单'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          <nav className="site-nav" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn('nav-link', item.match(location.pathname) && 'is-active')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <button
                  type="button"
                  className="icon-button notification-button"
                  aria-label={unreadCount ? `消息中心，有 ${unreadCount} 条未读消息` : '消息中心'}
                  onClick={() => goToProtected('/messages')}
                >
                  <Bell size={20} strokeWidth={1.8} />
                  {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
                </button>

                <div className="profile-menu-wrap" ref={profileRef}>
                  <button
                    type="button"
                    className="profile-trigger"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((open) => !open)}
                  >
                    <Avatar initial={user.initials} size="sm" />
                    <ChevronDown
                      size={14}
                      className={cn('profile-chevron', profileOpen && 'is-open')}
                    />
                  </button>
                  {profileOpen && (
                    <div className="profile-menu" role="menu">
                      <div className="profile-menu-head">
                        <Avatar initial={user.initials} size="md" />
                        <div>
                          <strong>{user.nickname}</strong>
                          <span>
                            {level?.title} Lv.{level?.level}
                          </span>
                        </div>
                      </div>
                      <div className="profile-menu-links">
                        <Link to="/profile" role="menuitem">
                          <UserRound size={17} /> 个人中心
                        </Link>
                        <Link to="/profile/records" role="menuitem">
                          <BookOpen size={17} /> 学习记录
                        </Link>
                        <Link to="/profile/achievements" role="menuitem">
                          <Award size={17} /> 我的成就
                        </Link>
                        <Link to="/profile/settings" role="menuitem">
                          <Settings size={17} /> 设置
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="profile-menu-logout"
                        role="menuitem"
                        onClick={() => {
                          setLogoutOpen(true)
                          setProfileOpen(false)
                        }}
                      >
                        <LogOut size={17} /> 退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="header-login">
                  登录
                </Link>
                <Button to="/register" size="sm" className="header-register">
                  免费注册
                </Button>
              </>
            )}
          </div>
        </div>

        {mobileOpen && (
          <nav className="mobile-nav" aria-label="移动端导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn('mobile-nav-link', item.match(location.pathname) && 'is-active')}
              >
                {item.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mobile-auth-actions">
                <Button to="/login" variant="secondary" size="sm">
                  登录
                </Button>
                <Button to="/register" size="sm">
                  免费注册
                </Button>
              </div>
            )}
          </nav>
        )}
      </header>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="今天先学到这里？"
        description="退出登录不会清除已保存的学习进度。下次登录，奶蛙还会在这里等你。"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              继续学习
            </Button>
            <Button onClick={onLogout}>确认退出</Button>
          </>
        }
      />
    </>
  )
}
