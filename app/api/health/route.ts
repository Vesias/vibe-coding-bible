import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health check without Supabase connection
    // (Supabase causes SSR issues during build)
    const hasSupabaseConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    return NextResponse.json({
      status: 'success',
      message: 'Vibe Coding Bible is healthy and sacred! ⚡✨',
      sacred_features: {
        floating_particles: true,
        divine_colors: true,
        mystical_animations: true,
        sacred_typography: true,
        supabase_configured: hasSupabaseConfig
      },
      environment: {
        node_env: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        supabase_configured: hasSupabaseConfig
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