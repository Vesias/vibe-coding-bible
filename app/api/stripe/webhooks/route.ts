import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    const supabase = getSupabaseClient()
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Determine subscription tier based on the price
        let subscriptionStatus = 'basic'
        
        if (session.amount_total) {
          if (session.amount_total >= 19900) {
            subscriptionStatus = 'divine'
          } else if (session.amount_total >= 9900) {
            subscriptionStatus = 'pro'
          } else {
            subscriptionStatus = 'basic'
          }
        }

        // Update user subscription in database
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: subscriptionStatus,
            subscription_id: session.subscription as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user subscription:', error)
        } else {
          console.log(`Updated user ${userId} to ${subscriptionStatus} tier`)
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Handle subscription updates (upgrades, downgrades, etc.)
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: subscription.status === 'active' ? 'pro' : 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Handle subscription cancellation
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'free',
            subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('subscription_id', subscription.id)

        if (error) {
          console.error('Error handling subscription deletion:', error)
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Handle failed payments
        if (invoice.subscription) {
          const { error } = await supabase
            .from('users')
            .update({
              subscription_status: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', invoice.subscription as string)

          if (error) {
            console.error('Error handling payment failure:', error)
          }
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}