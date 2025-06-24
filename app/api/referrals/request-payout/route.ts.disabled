import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, method } = await request.json()

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: 'Minimum payout amount is €10' },
        { status: 400 }
      )
    }

    if (!method || !['bank_transfer', 'paypal'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payout method' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check user's available balance
    const { data: userReferral, error: referralError } = await supabase
      .from('user_referrals')
      .select('pending_earnings')
      .eq('user_id', user.id)
      .single()

    if (referralError || !userReferral) {
      return NextResponse.json(
        { error: 'Referral data not found' },
        { status: 404 }
      )
    }

    if (amount > userReferral.pending_earnings) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Get completed conversions for this user
    const { data: conversions, error: conversionsError } = await supabase
      .from('referral_conversions')
      .select('id')
      .eq('referrer_id', user.id)
      .eq('status', 'completed')
      .limit(100) // Adjust as needed

    if (conversionsError) {
      return NextResponse.json(
        { error: 'Error fetching conversions' },
        { status: 500 }
      )
    }

    const conversionIds = conversions?.map((c: any) => c.id) || []

    // Create payout request
    const { data: payout, error: payoutError } = await supabase
      .from('referral_payouts')
      .insert({
        user_id: user.id,
        amount,
        currency: 'EUR',
        payout_method: method,
        conversion_ids: conversionIds,
        conversions_count: conversionIds.length,
        status: 'pending'
      })
      .select()
      .single()

    if (payoutError) {
      console.error('Error creating payout request:', payoutError)
      return NextResponse.json(
        { error: 'Failed to create payout request' },
        { status: 500 }
      )
    }

    // Update user's pending earnings
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({
        pending_earnings: userReferral.pending_earnings - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating pending earnings:', updateError)
      // Should probably rollback the payout creation here
    }

    // Create notification for the user
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'payout_requested',
        title: 'Auszahlung beantragt',
        message: `Ihre Auszahlungsanfrage über €${amount.toFixed(2)} wurde eingereicht und wird bearbeitet.`,
        action_text: 'Details anzeigen',
        action_url: '/referrals',
        priority: 'normal'
      })

    // TODO: Send email notification to admin for manual processing
    // In a real implementation, you would integrate with your payment processor
    // or queue this for manual review

    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      message: 'Payout request created successfully'
    })
  } catch (error) {
    console.error('Error processing payout request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}