import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const { priceId, planId, isSubscription = false, referralCode } = await request.json()

    if (!priceId || !planId) {
      return NextResponse.json(
        { error: 'Price ID and Plan ID are required' },
        { status: 400 }
      )
    }

    // Get user from session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Create success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/pricing?canceled=true`

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      userId: user.id,
      userEmail: user.email!,
      successUrl,
      cancelUrl,
      referralCode,
      isSubscription,
    })

    // Log the checkout attempt
    if (referralCode) {
      await supabase.from('referral_attempts').insert({
        user_id: user.id,
        referral_code: referralCode,
        plan_id: planId,
        stripe_session_id: session.sessionId,
        amount: 0, // Will be updated by webhook
        status: 'pending'
      })
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}