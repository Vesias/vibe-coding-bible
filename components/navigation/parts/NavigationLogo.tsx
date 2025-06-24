'use client'

import Link from 'next/link'

interface NavigationLogoProps {
  scrolled: boolean
}

export function NavigationLogo({ scrolled }: NavigationLogoProps) {
  return (
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
        <div className="agentland-text" style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: scrolled ? '#2563eb' : '#fff',
          transition: 'color 0.3s ease',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          Vibe Coding Bibel
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: scrolled ? '#6b7280' : 'rgba(255, 255, 255, 0.7)',
          transition: 'color 0.3s ease'
        }}>
          Sacred AI Development
        </div>
      </div>
    </Link>
  )
}