import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signInSchema, type AuthResponse } from '@/lib/validations/auth'
import { z } from 'zod'

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = signInSchema.parse(body)
    
    const supabase = await createServerSupabaseClient()
    
    // Sign in user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password
    })

    if (error) {
      console.error('Signin error:', error)
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password. The sacred gates remain closed.',
        user: null,
        error: error.message
      }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({
        success: false,
        message: 'Authentication failed',
        user: null,
        error: 'No user data returned'
      }, { status: 401 })
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      // Continue without profile data
    }

    return NextResponse.json({
      success: true,
      message: 'Sacred prophet successfully blessed with divine access! Welcome back ⚡',
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: profile?.full_name || null,
        avatarUrl: profile?.avatar_url || null,
        subscriptionStatus: profile?.subscription_status || 'free',
        createdAt: data.user.created_at
      },
      error: null
    }, { status: 200 })

  } catch (error) {
    console.error('Signin API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        user: null,
        error: error.errors.map(e => e.message).join(', ')
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to authenticate sacred prophet',
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}