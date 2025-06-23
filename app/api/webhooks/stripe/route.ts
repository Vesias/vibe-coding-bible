import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

async function handleStripeWebhook(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('Missing webhook secret')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log(`Received webhook: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const supabase = await createServerSupabaseClient()
    
    if (!session.customer || !session.metadata?.userId) {
      console.error('Missing customer or user ID in checkout session')
      return
    }

    const userId = session.metadata.userId
    const customerId = session.customer as string

    // Determine subscription tier based on the purchased item
    let subscriptionStatus: Database['public']['Enums']['subscription_status'] = 'basic'
    
    // Get line items to determine what was purchased
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    const priceId = lineItems.data[0]?.price?.id

    // Map price IDs to subscription tiers
    const priceTierMap: Record<string, Database['public']['Enums']['subscription_status']> = {
      [process.env.STRIPE_PRICE_ID_BASIC || 'price_basic']: 'basic',
      [process.env.STRIPE_PRICE_ID_PRO || 'price_pro']: 'pro',
      [process.env.STRIPE_PRICE_ID_DIVINE || 'price_divine']: 'divine'
    }

    if (priceId && priceTierMap[priceId]) {
      subscriptionStatus = priceTierMap[priceId]
    }

    // Update user's subscription status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: subscriptionStatus,
        subscription_id: session.subscription as string || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user subscription:', updateError)
      return
    }

    // Award XP for upgrading subscription
    const xpReward = getXPRewardForTier(subscriptionStatus)
    if (xpReward > 0) {
      await awardXP(userId, xpReward, 'subscription_upgrade')
    }

    // Create achievement for subscription upgrade
    await createSubscriptionAchievement(userId, subscriptionStatus)

    console.log(`Successfully upgraded user ${userId} to ${subscriptionStatus}`)

  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const supabase = await createServerSupabaseClient()
    
    if (!subscription.customer) {
      console.error('Missing customer in subscription')
      return
    }

    // Get user by subscription ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('subscription_id', subscription.id)
      .single()

    if (userError || !user) {
      console.error('User not found for subscription:', subscription.id)
      return
    }

    // Determine new subscription status
    let newStatus: Database['public']['Enums']['subscription_status'] = 'free'
    
    if (subscription.status === 'active') {
      const priceId = subscription.items.data[0]?.price.id
      const priceTierMap: Record<string, Database['public']['Enums']['subscription_status']> = {
        [process.env.STRIPE_PRICE_ID_BASIC || 'price_basic']: 'basic',
        [process.env.STRIPE_PRICE_ID_PRO || 'price_pro']: 'pro',
        [process.env.STRIPE_PRICE_ID_DIVINE || 'price_divine']: 'divine'
      }

      if (priceId && priceTierMap[priceId]) {
        newStatus = priceTierMap[priceId]
      }
    }

    // Update user's subscription status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user subscription:', updateError)
      return
    }

    console.log(`Updated user ${user.id} subscription to ${newStatus}`)

  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get user by subscription ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('subscription_id', subscription.id)
      .single()

    if (userError || !user) {
      console.error('User not found for subscription:', subscription.id)
      return
    }

    // Downgrade to free tier
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_status: 'free',
        subscription_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error downgrading user subscription:', updateError)
      return
    }

    console.log(`Downgraded user ${user.id} to free tier`)

  } catch (error) {
    console.error('Error handling subscription deletion:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log(`Payment succeeded for invoice: ${invoice.id}`)
    
    // You can add logic here to:
    // - Send confirmation emails
    // - Update payment history
    // - Award bonus XP for successful payments
    // - Trigger analytics events

  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log(`Payment failed for invoice: ${invoice.id}`)
    
    // You can add logic here to:
    // - Send payment failure notifications
    // - Update subscription status if needed
    // - Implement dunning management
    // - Log for customer support

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    console.log(`New customer created: ${customer.id}`)
    
    // You can add logic here to:
    // - Initialize customer data
    // - Send welcome emails
    // - Set up default preferences

  } catch (error) {
    console.error('Error handling customer created:', error)
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  try {
    console.log(`Customer updated: ${customer.id}`)
    
    // You can add logic here to:
    // - Sync customer data with your database
    // - Update user profiles
    // - Handle email changes

  } catch (error) {
    console.error('Error handling customer updated:', error)
  }
}

// Helper functions
function getXPRewardForTier(tier: Database['public']['Enums']['subscription_status']): number {
  const xpMap = {
    free: 0,
    basic: 100,
    pro: 250,
    divine: 500
  }
  return xpMap[tier] || 0
}

async function awardXP(userId: string, xp: number, reason: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user stats
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      console.error('Error fetching user for XP award:', fetchError)
      return
    }

    const newTotalXP = user.total_xp + xp
    const newLevel = Math.floor(newTotalXP / 1000) + 1 // 1000 XP per level

    // Update user XP and level
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_xp: newTotalXP,
        current_level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user XP:', updateError)
      return
    }

    console.log(`Awarded ${xp} XP to user ${userId} for ${reason}`)

  } catch (error) {
    console.error('Error awarding XP:', error)
  }
}

async function createSubscriptionAchievement(
  userId: string, 
  tier: Database['public']['Enums']['subscription_status']
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const achievementMap = {
      basic: 'subscription_basic',
      pro: 'subscription_pro',
      divine: 'subscription_divine'
    }

    const achievementId = achievementMap[tier as keyof typeof achievementMap]
    if (!achievementId) return

    // Check if achievement already exists
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    if (existing) return // Already has this achievement

    // Create achievement
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        progress: 100,
        earned_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating achievement:', error)
      return
    }

    console.log(`Created ${achievementId} achievement for user ${userId}`)

  } catch (error) {
    console.error('Error creating subscription achievement:', error)
  }
}

// Export the POST handler with rate limiting
export const POST = withRateLimit(handleStripeWebhook, rateLimitConfigs.webhook)