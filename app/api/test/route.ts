import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Simple test endpoint working',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({
    status: 'success',
    message: 'POST method working',
    timestamp: new Date().toISOString()
  })
}