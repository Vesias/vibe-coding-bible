import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { signUpSchema, type AuthResponse } from '@/lib/validations/auth'
import { z } from 'zod'

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = signUpSchema.parse(body)
    
    const supabase = await createServerSupabaseClient()
    
    // Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName || ''
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json({
        success: false,
        message: error.message,
        user: null,
        error: error.message
      }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create user account',
        user: null,
        error: 'User creation failed'
      }, { status: 400 })
    }

    // Create user profile in database
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: validatedData.fullName || '',
        avatar_url: null,
        subscription_status: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the signup if profile creation fails
    }

    return NextResponse.json({
      success: true,
      message: data.user.email_confirmed_at 
        ? 'Sacred prophet account created successfully! Welcome to the divine journey ⚡'
        : 'Sacred prophet account created! Please check your email to confirm your divine blessing ✨',
      user: {
        id: data.user.id,
        email: data.user.email!,
        fullName: validatedData.fullName || null,
        avatarUrl: null,
        subscriptionStatus: 'free',
        createdAt: data.user.created_at
      },
      error: null
    }, { status: 201 })

  } catch (error) {
    console.error('Signup API error:', error)
    
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
      message: 'Failed to create sacred prophet account',
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}