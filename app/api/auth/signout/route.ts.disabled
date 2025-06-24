import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Sign out user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Signout error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to end sacred session',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sacred prophet has departed the divine realm. May your journey continue ✨',
      error: null
    }, { status: 200 })

  } catch (error) {
    console.error('Signout API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to end sacred session',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}