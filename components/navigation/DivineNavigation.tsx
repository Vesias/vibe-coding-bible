'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  BookOpen, 
  Users, 
  Sparkles, 
  Menu, 
  X,
  Home,
  Layout,
  Scroll,
  Zap,
  User,
  LogOut,
  Settings
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuth } from '@/lib/auth/AuthProvider'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string
}

// Navigation items that are always visible
const publicNavigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Zurück zur Startseite'
  },
  {
    name: 'Workshops',
    href: '/workshops',
    icon: BookOpen,
    description: 'Interaktive Lern-Workshops',
    badge: '10'
  }
]

// Navigation items only for authenticated users
const authenticatedNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Layout,
    description: 'Persönliches Lern-Dashboard'
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    description: 'Verbinde dich mit anderen Lernenden'
  },
  {
    name: 'Kollaboration',
    href: '/collaboration',
    icon: Sparkles,
    description: 'Gemeinsame Programmier-Sessions'
  }
]

export const DivineNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
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

  const isActive = (href: string) => pathname === href
  
  // Combine navigation items based on authentication state
  const navigationItems = user 
    ? [...publicNavigationItems, ...authenticatedNavigationItems]
    : publicNavigationItems

  return (
    <div>
      {/* Main Navigation */}
      <nav
        role="navigation"
        aria-label="Haupt-Navigation"
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
            <Link 
              href="/" 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
              aria-label="Vibe Coding Bible - Zur Startseite"
            >
              <div 
                style={{ 
                  width: '40px',
                  height: '40px',
                  transition: 'transform 0.3s ease',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(10deg) scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
              >
                <img 
                  src="/logo.png" 
                  alt="Vibe Coding Bible Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="agentland-text" style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif'
                }}>
                  Vibe Coding Bibel
                </div>
                <div className="professional-text" style={{
                  fontSize: '0.75rem'
                }}>
                  Interaktive E-Book Workshops
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav 
              style={{ 
                display: 'none', 
                alignItems: 'center', 
                gap: '4px'
              }} 
              className="desktop-nav"
              role="menubar"
              aria-label="Desktop Navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  aria-describedby={item.description ? `nav-desc-${item.href.replace('/', '')}` : undefined}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    color: scrolled 
                      ? (isActive(item.href) ? '#2563eb' : '#4b5563') 
                      : (isActive(item.href) ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'),
                    background: isActive(item.href) 
                      ? (scrolled ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.1)') 
                      : 'transparent',
                    boxShadow: isActive(item.href) 
                      ? '0 0 20px rgba(37, 99, 235, 0.3)' 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = scrolled ? '#2563eb' : '#ffffff'
                      e.currentTarget.style.background = scrolled ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = scrolled ? '#4b5563' : 'rgba(255, 255, 255, 0.8)'
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <span style={{ fontSize: '1rem' }} aria-hidden="true"><item.icon /></span>
                  <span>{item.name}</span>
                  {item.description && (
                    <span id={`nav-desc-${item.href.replace('/', '')}`} className="sr-only">
                      {item.description}
                    </span>
                  )}
                  {item.badge && (
                    <span style={{
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.href) && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      borderRadius: '1px'
                    }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div style={{ display: 'none', alignItems: 'center', gap: '12px' }} className="auth-section">
              {loading ? (
                <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(37, 99, 235, 0.3)',
                    borderTop: '2px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : user ? (
                <div style={{ position: 'relative' }} data-user-menu>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      borderRadius: '8px',
                      color: '#2563eb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(37, 99, 235, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
                    }}
                  >
                    <User size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Prophet'}
                    </span>
                  </button>
                  
                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      minWidth: '200px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                      zIndex: 1000
                    }}>
                      <div style={{ padding: '12px' }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }}>
                          <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.875rem' }}>
                            {profile?.full_name || user.email}
                          </div>
                          <div style={{ color: '#4b5563', fontSize: '0.75rem' }}>
                            {profile?.prophet_rank || 'Novice'} • {profile?.total_xp || 0} XP
                          </div>
                        </div>
                        
                        <div style={{ padding: '8px 0' }}>
                          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                            <button
                              onClick={() => setShowUserMenu(false)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                background: 'transparent',
                                border: 'none',
                                color: '#4b5563',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
                                e.currentTarget.style.color = '#2563eb'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = '#4b5563'
                              }}
                            >
                              <Layout size={16} />
                              <span>Dashboard</span>
                            </button>
                          </Link>
                          
                          <button
                            onClick={async () => {
                              setShowUserMenu(false)
                              await signOut()
                              router.push('/')
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              background: 'transparent',
                              border: 'none',
                              color: '#4b5563',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              borderRadius: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
                              e.currentTarget.style.color = '#ef4444'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = '#cbd5e1'
                            }}
                          >
                            <LogOut size={16} />
                            <span>Abmelden</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth?mode=signin" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: '1px solid rgba(37, 99, 235, 0.5)',
                        borderRadius: '8px',
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      Anmelden
                    </button>
                  </Link>
                  
                  <Link href="/auth?mode=signup" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        textTransform: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>🚀</span>
                      <span>Kostenlos loslegen</span>
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Navigation schließen' : 'Navigation öffnen'}
              style={{
                display: 'block',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: scrolled ? '#2563eb' : '#ffffff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              className="mobile-menu-btn"
              onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.color = scrolled ? '#2563eb' : '#ffffff'}
            >
              <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          id="mobile-menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'block'
          }}
          className="mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.95) 50%, rgba(224, 231, 255, 0.95) 100%)',
              backdropFilter: 'blur(12px)'
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div
            style={{
              position: 'relative',
              marginTop: '80px',
              margin: '80px 16px 16px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} role="menu" aria-label="Mobile Navigation">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    background: isActive(item.href)
                      ? 'linear-gradient(90deg, #2563eb, #4f46e5)'
                      : 'transparent',
                    color: isActive(item.href) ? '#fff' : '#4b5563'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}><item.icon /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '1rem' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.7,
                        color: isActive(item.href) ? 'rgba(255,255,255,0.7)' : 'rgba(75, 85, 99, 0.7)'
                      }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.badge && (
                    <span style={{
                      background: isActive(item.href) ? 'rgba(255,255,255,0.2)' : 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      color: isActive(item.href) ? '#fff' : '#fff',
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div style={{ 
              marginTop: '24px', 
              paddingTop: '24px', 
              borderTop: '1px solid rgba(37, 99, 235, 0.2)' 
            }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '2px solid rgba(37, 99, 235, 0.3)',
                    borderTop: '2px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        borderRadius: '8px',
                        color: '#2563eb',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '12px'
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Layout size={20} />
                      <span>Dashboard</span>
                    </button>
                  </Link>
                  
                  <button
                    onClick={async () => {
                      setIsOpen(false)
                      await signOut()
                      router.push('/')
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Abmelden</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link href="/auth?mode=signin" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: 'transparent',
                        border: '1px solid rgba(37, 99, 235, 0.5)',
                        borderRadius: '8px',
                        color: '#2563eb',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      Anmelden
                    </button>
                  </Link>
                  
                  <Link href="/auth?mode=signup" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px',
                        background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setIsOpen(false)}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{ fontSize: '1.25rem' }}>🚀</span>
                      <span>Kostenlos loslegen</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 40
        }}
      >
        <Link 
          href="/workshops"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(239, 246, 255, 0.8))',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            borderRadius: '50%',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(37, 99, 235, 0.2)'
          }}
        >
          <img 
            src="/logo.png" 
            alt="Vibe Coding Bible Logo" 
            style={{ 
              width: '24px',
              height: '24px',
              objectFit: 'contain',
              filter: 'brightness(0) saturate(100%) invert(29%) sepia(69%) saturate(2544%) hue-rotate(214deg) brightness(97%) contrast(96%)'
            }} 
          />
        </Link>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .auth-section {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-overlay {
            display: none !important;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DivineNavigation