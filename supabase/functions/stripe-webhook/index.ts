import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@13.11.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface Env {
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

// Connection pool for database connections
class ConnectionPool {
  private static instance: ConnectionPool
  private pools: Map<string, any> = new Map()
  
  static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool()
    }
    return ConnectionPool.instance
  }
  
  getClient(url: string, key: string) {
    const poolKey = `${url}:${key}`
    if (!this.pools.has(poolKey)) {
      this.pools.set(poolKey, createClient(url, key))
    }
    return this.pools.get(poolKey)
  }
}

// Rate limiter using in-memory store (for Edge Runtime)
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests = 1000 // per minute
  private readonly windowMs = 60 * 1000 // 1 minute
  
  isAllowed(ip: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(ip)) {
      this.requests.set(ip, [])
    }
    
    const ipRequests = this.requests.get(ip)!
    
    // Remove old requests outside the window
    const validRequests = ipRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(ip, validRequests)
    
    return true
  }
  
  // Cleanup old entries periodically
  cleanup() {
    const now = Date.now()
    const cutoff = now - this.windowMs
    
    for (const [ip, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > cutoff)
      if (validRequests.length === 0) {
        this.requests.delete(ip)
      } else {
        this.requests.set(ip, validRequests)
      }
    }
  }
}

// Error handler with retry logic
class ErrorHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
    
    throw lastError!
  }
  
  static logError(error: Error, context: any) {
    console.error('Webhook Error:', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }
}

// Analytics tracker
class Analytics {
  static async track(supabase: any, event: string, data: any) {
    try {
      await supabase
        .from('webhook_analytics')
        .insert({
          event_type: event,
          data: data,
          timestamp: new Date().toISOString(),
          success: true
        })
    } catch (error) {
      console.error('Failed to track analytics:', error)
    }
  }
  
  static async trackError(supabase: any, event: string, error: Error, data: any) {
    try {
      await supabase
        .from('webhook_analytics')
        .insert({
          event_type: event,
          data: data,
          error_message: error.message,
          timestamp: new Date().toISOString(),
          success: false
        })
    } catch (err) {
      console.error('Failed to track error analytics:', err)
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const env: Env = {
      STRIPE_SECRET_KEY: Deno.env.get('STRIPE_SECRET_KEY')!,
      STRIPE_WEBHOOK_SECRET: Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      SUPABASE_URL: Deno.env.get('SUPABASE_URL')!,
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    }

    // Validate required environment variables
    const missingEnvVars = Object.entries(env)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key)

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`)
    }

    // Rate limiting
    const rateLimiter = new RateLimiter()
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    if (!rateLimiter.isAllowed(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Get request body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      ErrorHandler.logError(err as Error, { signature, bodyLength: body.length })
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Supabase client from connection pool
    const connectionPool = ConnectionPool.getInstance()
    const supabase = connectionPool.getClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    // Process webhook with retry logic
    const result = await ErrorHandler.withRetry(async () => {
      return await processWebhookEvent(event, supabase, stripe)
    })

    // Track successful webhook processing
    await Analytics.track(supabase, event.type, {
      event_id: event.id,
      livemode: event.livemode,
      created: event.created
    })

    return new Response(
      JSON.stringify({ received: true, processed: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    ErrorHandler.logError(error as Error, { 
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed',
        message: (error as Error).message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function processWebhookEvent(event: Stripe.Event, supabase: any, stripe: Stripe): Promise<any> {
  switch (event.type) {
    case 'checkout.session.completed':
      return await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
    
    case 'customer.subscription.created':
      return await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
    
    case 'customer.subscription.updated':
      return await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
    
    case 'customer.subscription.deleted':
      return await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
    
    case 'invoice.payment_succeeded':
      return await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
    
    case 'invoice.payment_failed':
      return await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
    
    case 'customer.created':
      return await handleCustomerCreated(event.data.object as Stripe.Customer, supabase)
    
    case 'payment_intent.succeeded':
      return await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
    
    case 'charge.dispute.created':
      return await handleChargeDispute(event.data.object as Stripe.Dispute, supabase)
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
      return { handled: false, event_type: event.type }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  const userId = session.metadata?.userId
  const referralCode = session.metadata?.referralCode

  if (!userId) {
    throw new Error('No user ID in session metadata')
  }

  // Begin transaction
  const { data, error } = await supabase.rpc('handle_checkout_completed', {
    p_user_id: userId,
    p_session_id: session.id,
    p_subscription_id: session.subscription,
    p_customer_id: session.customer,
    p_amount_total: session.amount_total,
    p_currency: session.currency,
    p_referral_code: referralCode,
    p_metadata: session.metadata
  })

  if (error) {
    throw new Error(`Database operation failed: ${error.message}`)
  }

  // Send welcome email notification
  await triggerEmailNotification(userId, 'welcome', {
    subscription_tier: data.subscription_tier,
    features_unlocked: data.features_unlocked
  }, supabase)

  return { 
    user_updated: true, 
    payment_recorded: true,
    referral_processed: !!referralCode,
    notification_sent: true
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    throw new Error('No user ID in subscription metadata')
  }

  const { error } = await supabase.rpc('handle_subscription_created', {
    p_user_id: userId,
    p_subscription_id: subscription.id,
    p_customer_id: subscription.customer,
    p_status: subscription.status,
    p_price_id: subscription.items.data[0]?.price?.id,
    p_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    p_metadata: subscription.metadata
  })

  if (error) {
    throw new Error(`Subscription creation failed: ${error.message}`)
  }

  return { subscription_created: true }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const { error } = await supabase.rpc('handle_subscription_updated', {
    p_subscription_id: subscription.id,
    p_status: subscription.status,
    p_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    p_cancel_at_period_end: subscription.cancel_at_period_end,
    p_canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    p_metadata: subscription.metadata
  })

  if (error) {
    throw new Error(`Subscription update failed: ${error.message}`)
  }

  return { subscription_updated: true }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const { error } = await supabase.rpc('handle_subscription_deleted', {
    p_subscription_id: subscription.id,
    p_canceled_at: new Date().toISOString()
  })

  if (error) {
    throw new Error(`Subscription deletion failed: ${error.message}`)
  }

  return { subscription_deleted: true }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  if (!invoice.subscription) {
    return { skipped: true, reason: 'No subscription attached' }
  }

  const { error } = await supabase.rpc('handle_payment_succeeded', {
    p_subscription_id: invoice.subscription,
    p_invoice_id: invoice.id,
    p_payment_intent_id: invoice.payment_intent,
    p_amount_paid: invoice.amount_paid,
    p_currency: invoice.currency,
    p_invoice_url: invoice.hosted_invoice_url
  })

  if (error) {
    throw new Error(`Payment processing failed: ${error.message}`)
  }

  return { payment_recorded: true }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  if (!invoice.subscription) {
    return { skipped: true, reason: 'No subscription attached' }
  }

  const { error } = await supabase.rpc('handle_payment_failed', {
    p_subscription_id: invoice.subscription,
    p_invoice_id: invoice.id,
    p_payment_intent_id: invoice.payment_intent,
    p_amount_due: invoice.amount_due,
    p_currency: invoice.currency,
    p_failure_reason: invoice.last_finalization_error?.message || 'Payment failed'
  })

  if (error) {
    throw new Error(`Failed payment processing failed: ${error.message}`)
  }

  return { failed_payment_recorded: true }
}

async function handleCustomerCreated(customer: Stripe.Customer, supabase: any) {
  const { error } = await supabase.rpc('handle_customer_created', {
    p_customer_id: customer.id,
    p_email: customer.email,
    p_name: customer.name,
    p_metadata: customer.metadata
  })

  if (error) {
    throw new Error(`Customer creation failed: ${error.message}`)
  }

  return { customer_recorded: true }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  const { error } = await supabase.rpc('handle_payment_intent_succeeded', {
    p_payment_intent_id: paymentIntent.id,
    p_amount: paymentIntent.amount,
    p_currency: paymentIntent.currency,
    p_customer_id: paymentIntent.customer,
    p_metadata: paymentIntent.metadata
  })

  if (error) {
    throw new Error(`Payment intent processing failed: ${error.message}`)
  }

  return { payment_intent_recorded: true }
}

async function handleChargeDispute(dispute: Stripe.Dispute, supabase: any) {
  const { error } = await supabase.rpc('handle_charge_dispute', {
    p_dispute_id: dispute.id,
    p_charge_id: dispute.charge,
    p_amount: dispute.amount,
    p_currency: dispute.currency,
    p_reason: dispute.reason,
    p_status: dispute.status
  })

  if (error) {
    throw new Error(`Dispute processing failed: ${error.message}`)
  }

  // Alert admin about dispute
  await triggerEmailNotification('admin', 'dispute_alert', {
    dispute_id: dispute.id,
    amount: dispute.amount,
    currency: dispute.currency,
    reason: dispute.reason
  }, supabase)

  return { dispute_recorded: true, admin_notified: true }
}

async function triggerEmailNotification(userId: string, type: string, data: any, supabase: any) {
  try {
    const { error } = await supabase.functions.invoke('email-notifications', {
      body: {
        user_id: userId,
        type: type,
        data: data
      }
    })

    if (error) {
      console.error('Email notification failed:', error)
    }
  } catch (error) {
    console.error('Failed to trigger email notification:', error)
  }
}

// Periodic cleanup
setInterval(() => {
  const rateLimiter = new RateLimiter()
  rateLimiter.cleanup()
}, 5 * 60 * 1000) // Every 5 minutes