import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { referralCode, userId, metadata } = await request.json()

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    // Process the referral click
    const { data, error } = await supabase.rpc('process_referral_click', {
      ref_code: referralCode,
      clicked_user_id: userId || null,
      ip_addr: ip,
      user_agent_str: userAgent,
      source_url_str: referer,
      landing_page_str: metadata?.landingPage || '/'
    })

    if (error) {
      console.error('Error processing referral click:', error)
      return NextResponse.json(
        { error: 'Failed to process referral' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      attemptId: data
    })
  } catch (error) {
    console.error('Error in referral tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Validate referral code
    const { data: referral, error } = await supabase
      .from('user_referrals')
      .select(`
        referral_code,
        user_id,
        profiles (
          username,
          full_name
        )
      `)
      .eq('referral_code', code)
      .eq('is_active', true)
      .single()

    if (error || !referral) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      referralCode: referral.referral_code,
      referrerName: referral.profiles?.full_name || referral.profiles?.username
    })
  } catch (error) {
    console.error('Error validating referral code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}