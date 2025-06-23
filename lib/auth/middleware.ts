import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    subscription_status: Database['public']['Enums']['subscription_status']
    prophet_rank: Database['public']['Enums']['prophet_rank']
  }
}

export async function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requireSubscription?: boolean
    minRank?: Database['public']['Enums']['prophet_rank']
    adminOnly?: boolean
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const supabase = await createServerSupabaseClient()
      
      // Get user from session
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized - Please log in' },
          { status: 401 }
        )
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        )
      }

      // Check subscription requirements
      if (options?.requireSubscription && profile.subscription_status === 'free') {
        return NextResponse.json(
          { error: 'Premium subscription required' },
          { status: 403 }
        )
      }

      // Check rank requirements
      if (options?.minRank) {
        const rankOrder = ['novice', 'apprentice', 'practitioner', 'architect', 'prophet']
        const userRankIndex = rankOrder.indexOf(profile.prophet_rank)
        const minRankIndex = rankOrder.indexOf(options.minRank)
        
        if (userRankIndex < minRankIndex) {
          return NextResponse.json(
            { error: `Minimum rank required: ${options.minRank}` },
            { status: 403 }
          )
        }
      }

      // Check admin requirements (assuming admin role is stored in metadata or a separate table)
      if (options?.adminOnly) {
        // For now, we'll check if the user is a 'prophet' rank as admin
        if (profile.prophet_rank !== 'prophet') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          )
        }
      }

      // Attach user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = {
        id: profile.id,
        email: profile.email,
        subscription_status: profile.subscription_status,
        prophet_rank: profile.prophet_rank
      }

      return await handler(authenticatedRequest)

    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      subscription_status: profile.subscription_status,
      prophet_rank: profile.prophet_rank,
      total_xp: profile.total_xp,
      current_level: profile.current_level
    }
  } catch (error) {
    console.error('Get authenticated user error:', error)
    return null
  }
}

export function createApiResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
) {
  return NextResponse.json(
    { 
      error: message,
      code,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}