'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string
}

interface NavigationItemsProps {
  items: NavigationItem[]
  scrolled: boolean
}

export function NavigationItems({ items, scrolled }: NavigationItemsProps) {
  const pathname = usePathname()
  
  const isActive = (href: string) => pathname === href

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px' 
    }}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: isActive(item.href) ? '600' : '500',
            color: isActive(item.href) 
              ? '#2563eb'
              : scrolled 
                ? '#4b5563' 
                : 'rgba(255, 255, 255, 0.8)',
            background: isActive(item.href) 
              ? 'rgba(37, 99, 235, 0.1)' 
              : 'transparent',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            transform: isActive(item.href) ? 'translateY(-2px)' : 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!isActive(item.href)) {
              e.currentTarget.style.color = '#2563eb'
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
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
          <span style={{ fontSize: '1rem' }}><item.icon /></span>
          <span>{item.name}</span>
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
    </div>
  )
}