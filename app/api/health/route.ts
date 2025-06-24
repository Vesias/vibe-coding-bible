import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const supabase = await createServerSupabaseClient()
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is ok for testing
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Vibe Coding Bible is healthy and sacred! ⚡✨',
      sacred_features: {
        floating_particles: true,
        divine_colors: true,
        mystical_animations: true,
        sacred_typography: true,
        supabase_connected: true
      },
      database: {
        connected: true,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        status: error ? 'no_data' : 'active'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function HEAD(request: NextRequest) {
  return new Response(null, { status: 200 })
}