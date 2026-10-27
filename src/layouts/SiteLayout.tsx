import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export function SiteLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader />
      <main id="main-content" className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
