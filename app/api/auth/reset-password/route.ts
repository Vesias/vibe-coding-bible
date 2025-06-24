import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = resetPasswordSchema.parse(body)
    
    const supabase = await createServerSupabaseClient()
    
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
    })

    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to send password reset email',
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sacred password reset instructions have been sent to your divine email ⚡',
      error: null
    }, { status: 200 })

  } catch (error) {
    console.error('Password reset API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        error: error.errors.map(e => e.message).join(', ')
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send password reset email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}