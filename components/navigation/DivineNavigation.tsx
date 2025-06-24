'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Sacred Home',
    href: '/',
    icon: Home,
    description: 'Return to the divine realm'
  },
  {
    name: 'Sacred Workshops',
    href: '/workshops',
    icon: BookOpen,
    description: 'Master the 10 commandments',
    badge: '10'
  },
  {
    name: 'Prophet Dashboard',
    href: '/dashboard',
    icon: Layout,
    description: 'Track your divine progress'
  },
  {
    name: 'Prophets Community',
    href: '/community',
    icon: Users,
    description: 'Connect with fellow seekers'
  },
  {
    name: 'Collaboration',
    href: '/collaboration',
    icon: Sparkles,
    description: 'Mystical pair programming'
  }
]

export const DivineNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

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
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(30, 27, 75, 0.95) 100%)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(251, 191, 36, 0.2)' : 'none',
          boxShadow: scrolled ? '0 0 30px rgba(251, 191, 36, 0.1)' : 'none'
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
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div 
                style={{ 
                  fontSize: '2rem',
                  transition: 'transform 0.3s ease',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(360deg) scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
              >
                📜
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #fbbf24 0%, #c084fc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif'
                }}>
                  Vibe Coding Bibel
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  background: 'linear-gradient(90deg, #c084fc 0%, #06b6d4 50%, #fbbf24 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}>
                  Interaktive E-Book Workshops
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div style={{ 
              display: 'none', 
              alignItems: 'center', 
              gap: '4px'
            }} className="desktop-nav">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
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
                    color: isActive(item.href) 
                      ? '#fbbf24' 
                      : 'rgba(255, 255, 255, 0.8)',
                    background: isActive(item.href) 
                      ? 'rgba(251, 191, 36, 0.1)' 
                      : 'transparent',
                    boxShadow: isActive(item.href) 
                      ? '0 0 20px rgba(251, 191, 36, 0.3)' 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span style={{
                      background: 'linear-gradient(90deg, #fbbf24, #c084fc)',
                      color: '#000',
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
                      background: 'linear-gradient(90deg, #fbbf24, #c084fc)',
                      borderRadius: '1px'
                    }} />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="cta-section">
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(90deg, #f59e0b 0%, #9333ea 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}
              >
                <span style={{ fontSize: '1rem' }}>👑</span>
                <span>Jetzt starten</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'block',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}
              className="mobile-menu-btn"
              onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'block'
          }}
          className="mobile-overlay"
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(30, 27, 75, 0.95) 100%)',
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
              background: 'rgba(30, 41, 59, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    background: isActive(item.href)
                      ? 'linear-gradient(90deg, #fbbf24, #c084fc)'
                      : 'transparent',
                    color: isActive(item.href) ? '#000' : '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '1rem' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.7,
                        color: isActive(item.href) ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'
                      }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.badge && (
                    <span style={{
                      background: isActive(item.href) ? 'rgba(0,0,0,0.2)' : 'linear-gradient(90deg, #fbbf24, #c084fc)',
                      color: isActive(item.href) ? '#000' : '#fff',
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
            </div>

            {/* Mobile CTA */}
            <div style={{ 
              marginTop: '24px', 
              paddingTop: '24px', 
              borderTop: '1px solid rgba(251, 191, 36, 0.2)' 
            }}>
              <button
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  background: 'linear-gradient(90deg, #fbbf24, #c084fc)',
                  color: '#000',
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
                <span style={{ fontSize: '1.25rem' }}>👑</span>
                <span>Deine heilige Reise beginnen</span>
              </button>
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
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(18, 18, 18, 0.8))',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '50%',
            boxShadow: '0 8px 32px rgba(251, 191, 36, 0.2)',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(251, 191, 36, 0.2)'
          }}
        >
          <span style={{ 
            fontSize: '1.5rem',
            background: 'linear-gradient(90deg, #fbbf24, #c084fc)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📜
          </span>
        </Link>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .cta-section {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default DivineNavigation