'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

type UserProfile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  error: AuthError | null
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  redirectToSignIn: (redirectTo?: string) => void
  redirectAfterAuth: (defaultPath?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const [supabaseError, setSupabaseError] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  let supabase: any = null
  try {
    supabase = createClient()
  } catch (error) {
    console.error('Supabase client creation failed:', error)
    setSupabaseError(true)
    setLoading(false)
  }

  const isAuthenticated = !!user

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setError(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [router])

  const redirectToSignIn = useCallback((redirectTo?: string) => {
    const currentPath = redirectTo || (pathname !== '/auth/signin' && pathname !== '/auth/signup' ? pathname : undefined)
    const signInUrl = currentPath ? `/auth/signin?redirectTo=${encodeURIComponent(currentPath)}` : '/auth/signin'
    router.push(signInUrl)
  }, [router, pathname])

  const redirectAfterAuth = useCallback((defaultPath = '/dashboard') => {
    // Get the redirect URL from the current URL or use default
    const urlParams = new URLSearchParams(window.location.search)
    const redirectTo = urlParams.get('redirectTo') || defaultPath
    
    // Avoid redirecting to auth pages
    if (redirectTo.startsWith('/auth/')) {
      router.push(defaultPath)
    } else {
      router.push(redirectTo)
    }
  }, [router])

  useEffect(() => {
    if (supabaseError) {
      // If Supabase is not available, just set loading to false and continue
      setLoading(false)
      return
    }
    
    if (!supabase) {
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          const profileData = await fetchProfile(session.user.id)
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      }
      
      setLoading(false)
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        try {
          setError(null) // Clear any previous errors
          
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user)
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
            setProfile(null)
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            setUser(session.user)
            // Optionally refresh profile on token refresh
            if (!profile) {
              const profileData = await fetchProfile(session.user.id)
              setProfile(profileData)
            }
          } else if (event === 'USER_UPDATED' && session?.user) {
            setUser(session.user)
            // Refresh profile when user is updated
            const profileData = await fetchProfile(session.user.id)
            setProfile(profileData)
          } else if (!session) {
            setUser(null)
            setProfile(null)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setError(error as AuthError)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, supabaseError])

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      error,
      isAuthenticated,
      signOut,
      refreshProfile,
      redirectToSignIn,
      redirectAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}