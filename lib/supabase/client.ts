import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using fallback for public access')
    // Return a mock client for public access when Supabase is not configured
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
        signUp: () => Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } 
        }),
        signInWithPassword: () => Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } 
        }),
        signInWithOAuth: () => Promise.resolve({ 
          data: { url: null, provider: null }, 
          error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } 
        })
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } }) }) }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Database not configured', code: 'DB_NOT_SETUP' } }) })
      })
    } as any
  }
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}