import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    const returnUrl = `${location.pathname}${location.search}`
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
        state={{ reason: '请先登录，再继续学习吧～' }}
      />
    )
  }
  return children
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return children
  const returnUrl = new URLSearchParams(location.search).get('returnUrl')
  const target = returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/'
  return <Navigate to={target} replace />
}
