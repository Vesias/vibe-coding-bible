'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout, LogOut, User, Settings } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  prophet_rank?: string
  total_xp?: number
  avatar_url?: string
  username?: string
}

interface UserMenuProps {
  user: any
  profile: UserProfile | null
  loading: boolean
  showUserMenu: boolean
  setShowUserMenu: (show: boolean) => void
  signOut: () => Promise<void>
  scrolled: boolean
}

export function UserMenu({ 
  user, 
  profile, 
  loading, 
  showUserMenu, 
  setShowUserMenu, 
  signOut,
  scrolled 
}: UserMenuProps) {
  const router = useRouter()

  if (loading) {
    return (
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
    )
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/auth" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '8px 16px',
            background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)'
          }}>
            Sacred Login
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }} data-user-menu>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.3)',
          borderRadius: '25px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)'
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {profile?.username?.charAt(0)?.toUpperCase() || 
           profile?.email?.charAt(0)?.toUpperCase() || 
           user?.email?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: scrolled ? '#2563eb' : '#fff'
          }}>
            {profile?.username || user?.email?.split('@')[0] || 'Prophet'}
          </div>
          <div style={{
            fontSize: '0.625rem',
            color: scrolled ? '#6b7280' : 'rgba(255, 255, 255, 0.7)'
          }}>
            {profile?.prophet_rank || 'Novice'} • {profile?.total_xp || 0} XP
          </div>
        </div>
      </button>

      {showUserMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          width: '220px',
          background: '#fff',
          border: '1px solid rgba(37, 99, 235, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {profile?.username?.charAt(0)?.toUpperCase() || 
                 profile?.email?.charAt(0)?.toUpperCase() || 
                 user?.email?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                  {profile?.username || user?.email?.split('@')[0] || 'Prophet'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {profile?.prophet_rank || 'Novice'} • {profile?.total_xp || 0} XP
                </div>
              </div>
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
                color: '#dc2626',
                fontSize: '0.875rem',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}