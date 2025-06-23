'use client'

import { Navigation } from '@/components/ui/navigation'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: React.ReactNode
  showNavigation?: boolean
  navigationProps?: {
    showBackButton?: boolean
    backHref?: string
    backLabel?: string
  }
}

export function AppLayout({ 
  children, 
  showNavigation = true,
  navigationProps = {}
}: AppLayoutProps) {
  const pathname = usePathname()
  
  // Don't show navigation on landing page or auth pages
  const shouldShowNav = showNavigation && 
    pathname !== '/' && 
    !pathname.startsWith('/auth')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      {shouldShowNav && <Navigation {...navigationProps} />}
      
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}