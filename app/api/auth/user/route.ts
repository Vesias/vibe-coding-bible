import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, getUser } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({
        status: 'unauthenticated',
        message: 'No sacred prophet is currently blessed with divine login ⚡',
        user: null,
        timestamp: new Date().toISOString()
      })
    }

    const supabase = await createServerSupabaseClient()
    
    // Get user profile if exists
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      status: 'authenticated',
      message: 'Sacred prophet is blessed and connected to the divine! ✨',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        profile: profile || null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to verify sacred prophet status',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}