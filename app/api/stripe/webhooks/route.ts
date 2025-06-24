import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, calculateReferralCommission } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Handle missing webhook secret for build time
if (!webhookSecret && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_WEBHOOK_SECRET is not configured')
}

export async function POST(request: NextRequest) {
  // Handle missing webhook secret gracefully
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    console.error('No stripe signature found')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, supabase)
        break
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription, supabase)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription, supabase)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription, supabase)
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice, supabase)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice, supabase)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  const userId = session.metadata?.userId
  const referralCode = session.metadata?.referralCode

  if (!userId) {
    console.error('No user ID in session metadata')
    return
  }

  // Update user subscription status
  const subscriptionTier = determineTierFromSession(session)
  
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscriptionTier,
      subscription_id: session.subscription || session.id,
      subscription_expires_at: session.subscription ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year for one-time payments
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  // Record payment history
  await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || 'EUR',
      status: 'succeeded',
      payment_date: new Date().toISOString()
    })

  // Handle referral commission if applicable
  if (referralCode && session.amount_total) {
    await processReferralCommission(referralCode, session.amount_total, session.currency || 'eur', userId, supabase)
  }

  // Send confirmation email and create notification
  await createSuccessNotification(userId, subscriptionTier, supabase)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No user ID in subscription metadata')
    return
  }

  const subscriptionTier = determineTierFromSubscription(subscription)

  // Update or create subscription record
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      billing_cycle: subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

  // Update profile
  await supabase
    .from('profiles')
    .update({
      subscription_status: subscriptionTier,
      subscription_id: subscription.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No user ID in subscription metadata')
    return
  }

  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  // Update profile if subscription was canceled
  if (subscription.status === 'canceled') {
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'free',
        subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  // Get user ID and update profile
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (subscriptionData?.user_id) {
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'free',
        subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionData.user_id)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  if (!invoice.subscription) return

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (!subscription?.user_id) return

  // Record payment
  await supabase
    .from('payment_history')
    .insert({
      user_id: subscription.user_id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
      currency: invoice.currency?.toUpperCase() || 'EUR',
      status: 'succeeded',
      payment_date: new Date().toISOString(),
      invoice_url: invoice.hosted_invoice_url
    })
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  if (!invoice.subscription) return

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (!subscription?.user_id) return

  // Record failed payment
  await supabase
    .from('payment_history')
    .insert({
      user_id: subscription.user_id,
      stripe_payment_intent_id: invoice.payment_intent,
      amount: invoice.amount_due ? invoice.amount_due / 100 : 0,
      currency: invoice.currency?.toUpperCase() || 'EUR',
      status: 'failed',
      failure_reason: 'Payment failed',
      payment_date: new Date().toISOString()
    })

  // Create notification for failed payment
  await supabase
    .from('notifications')
    .insert({
      user_id: subscription.user_id,
      type: 'payment_failed',
      title: 'Zahlung fehlgeschlagen',
      message: 'Ihre letzte Zahlung konnte nicht verarbeitet werden. Bitte aktualisieren Sie Ihre Zahlungsmethode.',
      action_text: 'Zahlungsmethode aktualisieren',
      action_url: '/dashboard/billing',
      priority: 'high'
    })
}

async function processReferralCommission(
  referralCode: string,
  amount: number,
  currency: string,
  buyerId: string,
  supabase: any
) {
  // Find the referrer
  const { data: referrer } = await supabase
    .from('user_referrals')
    .select('user_id')
    .eq('referral_code', referralCode)
    .single()

  if (!referrer) {
    console.error(`Referral code ${referralCode} not found`)
    return
  }

  // Calculate commission (15%)
  const commission = await calculateReferralCommission(amount)

  // Record the referral conversion
  await supabase
    .from('referral_conversions')
    .insert({
      referrer_id: referrer.user_id,
      referee_id: buyerId,
      referral_code: referralCode,
      purchase_amount: amount / 100, // Convert from cents
      commission_amount: commission / 100, // Convert from cents
      currency: currency.toUpperCase(),
      status: 'completed',
      conversion_date: new Date().toISOString()
    })

  // Update referral attempt status
  await supabase
    .from('referral_attempts')
    .update({
      status: 'converted',
      amount: amount / 100,
      commission_amount: commission / 100,
      converted_at: new Date().toISOString()
    })
    .eq('referral_code', referralCode)
    .eq('user_id', buyerId)

  // Add commission to referrer's balance
  await supabase.rpc('add_referral_commission', {
    user_uuid: referrer.user_id,
    commission_amount: commission / 100
  })

  // Create notification for referrer
  await supabase
    .from('notifications')
    .insert({
      user_id: referrer.user_id,
      type: 'referral_commission',
      title: 'Provision erhalten!',
      message: `Sie haben €${(commission / 100).toFixed(2)} Provision für einen erfolgreichen Referral erhalten.`,
      action_text: 'Provisionen anzeigen',
      action_url: '/dashboard/referrals',
      priority: 'normal'
    })
}

function determineTierFromSession(session: Stripe.Checkout.Session): string {
  // This would be enhanced to map Stripe price IDs to tiers
  const priceId = session.line_items?.data[0]?.price?.id
  
  if (priceId?.includes('starter')) return 'starter'
  if (priceId?.includes('pro')) return 'pro'
  if (priceId?.includes('expert')) return 'expert'
  if (priceId?.includes('lifetime')) return 'lifetime'
  
  return 'free'
}

function determineTierFromSubscription(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price?.id
  
  if (priceId?.includes('starter')) return 'starter'
  if (priceId?.includes('pro')) return 'pro'
  if (priceId?.includes('expert')) return 'expert'
  
  return 'free'
}

async function createSuccessNotification(userId: string, tier: string, supabase: any) {
  const tierMessages = {
    starter: 'Willkommen im Starter-Tier! Sie haben jetzt Zugang zu 5 Geboten.',
    pro: 'Willkommen im Pro-Tier! Sie haben jetzt Zugang zu 8 Geboten und erweiterten Features.',
    expert: 'Willkommen im Expert-Tier! Sie haben jetzt Zugang zu allen 10 Geboten und VIP-Features.',
    lifetime: 'Willkommen im Lifetime-Tier! Sie haben jetzt lebenslangen Zugang zu allem.'
  }

  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'subscription_success',
      title: 'Willkommen!',
      message: tierMessages[tier as keyof typeof tierMessages] || 'Ihre Subscription wurde erfolgreich aktiviert.',
      action_text: 'Dashboard öffnen',
      action_url: '/dashboard',
      priority: 'normal'
    })
}