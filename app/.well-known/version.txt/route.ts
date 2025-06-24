import { NextResponse } from 'next/server'

export async function GET() {
  const version = {
    version: '1.0.0',
    buildTime: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    deployment: process.env.VERCEL_URL || 'localhost',
    nextjs: '15.3.4',
    features: {
      supabase: true,
      auth: true,
      workshops: true,
      sacred_styling: true,
      api_validation: true
    }
  }

  return new NextResponse(
    JSON.stringify(version, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  )
}