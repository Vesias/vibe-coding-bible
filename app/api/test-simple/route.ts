import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Ultra simple test',
    timestamp: new Date().toISOString()
  })
}