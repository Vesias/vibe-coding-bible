'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavigationItem } from './NavigationItems'

interface MobileMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  items: NavigationItem[]
  user: any
  scrolled: boolean
}

export function MobileMenu({ isOpen, setIsOpen, items, user, scrolled }: MobileMenuProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'block',
          padding: '8px',
          background: 'transparent',
          border: 'none',
          color: scrolled ? '#2563eb' : '#fff',
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'all 0.3s ease'
        }}
        className="lg:hidden"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(37, 99, 235, 0.2)',
          zIndex: 50,
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}
        className="lg:hidden"
      >
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  textDecoration: 'none',
                  color: '#4b5563',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
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
                <item.icon size={20} />
                <div>
                  <div>{item.name}</div>
                  {item.description && (
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '2px' }}>
                      {item.description}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <span style={{
                    background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    marginLeft: 'auto'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {!user && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(37, 99, 235, 0.2)' }}>
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '100%',
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Sacred Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}