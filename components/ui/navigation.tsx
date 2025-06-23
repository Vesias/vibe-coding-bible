'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Home, BookOpen, Users, Settings, Crown } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface NavigationProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
  className?: string
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  description: string
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="h-5 w-5" />,
    description: 'Sacred Homepage'
  },
  {
    href: '/workshops',
    label: 'Workshops',
    icon: <BookOpen className="h-5 w-5" />,
    description: '10 Holy Commandments'
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Crown className="h-5 w-5" />,
    description: 'Prophet Dashboard'
  },
  {
    href: '/collaboration',
    label: 'Collaboration',
    icon: <Users className="h-5 w-5" />,
    description: 'Divine Teamwork'
  }
]

export function Navigation({ showBackButton = true, backHref, backLabel, className }: NavigationProps) {
  const pathname = usePathname()

  // Auto-detect back navigation
  const getBackNavigation = () => {
    if (backHref && backLabel) {
      return { href: backHref, label: backLabel }
    }

    // Smart back navigation based on current path
    if (pathname.startsWith('/workshops/')) {
      return { href: '/workshops', label: 'Back to Workshops' }
    }
    if (pathname.startsWith('/dashboard/')) {
      return { href: '/dashboard', label: 'Back to Dashboard' }
    }
    if (pathname.startsWith('/collaboration/')) {
      return { href: '/collaboration', label: 'Back to Collaboration' }
    }
    if (pathname !== '/') {
      return { href: '/', label: 'Back to Home' }
    }
    
    return null
  }

  const backNav = getBackNavigation()

  return (
    <nav className={cn("bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Navigation */}
          {showBackButton && backNav && (
            <Link href={backNav.href}>
              <Button variant="ghost" className="gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                {backNav.label}
              </Button>
            </Link>
          )}

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "gap-2 transition-all duration-300",
                      isActive 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Spacer for alignment */}
          <div className="w-32"></div>
        </div>
      </div>
    </nav>
  )
}

export function Breadcrumbs({ items }: { items: Array<{ label: string, href?: string }> }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs,
  children 
}: { 
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string, href?: string }>
  children?: React.ReactNode 
}) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          
          {children && (
            <div className="flex items-center gap-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}