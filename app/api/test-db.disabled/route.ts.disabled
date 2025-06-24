import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      if (connectionError.code === 'PGRST116') {
        return NextResponse.json({
          status: 'setup_required',
          message: 'Database tables not found - migration required',
          error: connectionError.message,
          setup_instructions: {
            message: 'Please run the database migration to set up required tables',
            migration_file: 'scripts/create-basic-schema.sql',
            supabase_dashboard: 'https://supabase.com/dashboard',
            documentation: '/DATABASE_SETUP.md'
          },
          timestamp: new Date().toISOString()
        }, { status: 503 })
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to connect to database',
          error: connectionError.message,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    }

    // Test multiple table schemas
    const schemaTests = []
    
    // Test profiles table schema
    const { data: profilesSchema, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0)
    
    schemaTests.push({
      table: 'profiles',
      accessible: !profilesError,
      error: profilesError?.message || null
    })

    // Test workshops table schema
    const { data: workshopsSchema, error: workshopsError } = await supabase
      .from('workshops')
      .select('*')
      .limit(0)
    
    schemaTests.push({
      table: 'workshops',
      accessible: !workshopsError,
      error: workshopsError?.message || null
    })

    // Test sessions table schema
    const { data: sessionsSchema, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(0)
    
    schemaTests.push({
      table: 'sessions',
      accessible: !sessionsError,
      error: sessionsError?.message || null
    })

    return NextResponse.json({
      status: 'success',
      message: 'Database schema validation complete',
      connection: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connected: true,
        timestamp: new Date().toISOString()
      },
      schema_validation: schemaTests,
      summary: {
        total_tables_tested: schemaTests.length,
        accessible_tables: schemaTests.filter(t => t.accessible).length,
        failed_tables: schemaTests.filter(t => !t.accessible).length
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}