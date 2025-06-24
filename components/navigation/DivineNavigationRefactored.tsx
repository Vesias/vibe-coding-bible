'use client'

import React, { useState, useEffect } from 'react'
import { 
  Crown, 
  BookOpen, 
  Users, 
  Sparkles, 
  Home,
  Layout,
  Euro,
  MessageSquare,
  FileText,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { NavigationLogo, NavigationItems, UserMenu, MobileMenu, NavigationItem } from './parts'

// Navigation items that are always visible
const publicNavigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'AgentLand Startseite'
  },
  {
    name: 'Workshops',
    href: '/workshops',
    icon: BookOpen,
    description: 'Interaktive Coding Workshops',
    badge: '10'
  },
  {
    name: 'Preise',
    href: '/pricing',
    icon: Euro,
    description: 'Pricing und Pläne'
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    description: 'Entwickler Community'
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: FileText,
    description: 'News und Tutorials'
  },
  {
    name: 'Hilfe',
    href: '/help',
    icon: HelpCircle,
    description: 'Support und Dokumentation'
  }
]

// Navigation items only for authenticated users
const authenticatedNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Layout,
    description: 'Persönliches Dashboard'
  },
  {
    name: 'Kollaboration',
    href: '/collaboration',
    icon: Sparkles,
    description: 'Pair Programming Tools'
  }
]

export const DivineNavigationRefactored: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, profile, loading, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('[data-user-menu]')) {
        setShowUserMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  // Combine navigation items based on authentication state
  const navigationItems = user 
    ? [...publicNavigationItems.filter(item => !['Community'].includes(item.name)), ...authenticatedNavigationItems]
    : publicNavigationItems

  return (
    <>
      {/* Main Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.5s ease',
          background: scrolled 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.95) 50%, rgba(224, 231, 255, 0.95) 100%)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(37, 99, 235, 0.2)' : 'none',
          boxShadow: scrolled ? '0 0 30px rgba(37, 99, 235, 0.1)' : 'none'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            height: '80px' 
          }}>
            {/* Logo */}
            <NavigationLogo scrolled={scrolled} />

            {/* Desktop Navigation Items */}
            <div className="hidden lg:flex">
              <NavigationItems items={navigationItems} scrolled={scrolled} />
            </div>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex">
              <UserMenu
                user={user}
                profile={profile}
                loading={loading}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
                signOut={signOut}
                scrolled={scrolled}
              />
            </div>

            {/* Mobile Menu */}
            <MobileMenu
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              items={navigationItems}
              user={user}
              scrolled={scrolled}
            />
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: '80px' }} />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}