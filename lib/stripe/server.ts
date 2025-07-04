import Stripe from 'stripe'

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    // Return a mock stripe instance for build time
    console.warn('STRIPE_SECRET_KEY is not configured - using mock instance')
    return {
      webhooks: {
        constructEvent: () => ({ type: 'test', data: { object: {} } })
      },
      checkout: {
        sessions: {
          create: () => Promise.resolve({ id: 'mock_session', url: 'mock_url' })
        }
      },
      billingPortal: {
        sessions: {
          create: () => Promise.resolve({ url: 'mock_url' })
        }
      },
      subscriptions: {
        list: () => Promise.resolve({ data: [] })
      },
      products: {
        create: () => Promise.resolve({ id: 'mock_product' })
      },
      prices: {
        create: () => Promise.resolve({ id: 'mock_price' })
      }
    } as any
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  })
}

export const stripe = getStripeInstance()

export interface PricingPlan {
  id: string
  name: string
  price: number
  priceYearly?: number
  priceLifetime?: number
  priceId: string
  priceIdYearly?: string
  priceIdLifetime?: string
  features: string[]
  popular?: boolean
  description: string
  buttonText: string
  maxUsers?: number
  tier: string
  currency: string
  vatIncluded: boolean
  discount?: number
  discountYearly?: number
}

export function getPricingPlans(): PricingPlan[] {
  return [
    {
      id: 'free',
      name: 'Seeker',
      tier: 'free',
      price: 0,
      priceId: '',
      currency: 'EUR',
      vatIncluded: true,
      description: 'Entdecke die Grundlagen des Vibe Coding',
      buttonText: 'Kostenlos starten',
      features: [
        'Zugang zu den ersten 2 Geboten',
        'Grundlegende Coding-Herausforderungen',
        'Community-Forum (nur lesen)',
        'Fortschritts-Tracking',
        'E-Mail-Support'
      ],
    },
    {
      id: 'starter',
      name: 'Starter',
      tier: 'starter',
      price: 1900, // €19 in cents
      priceYearly: 19000, // €190 in cents (10 months)
      priceId: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter_monthly',
      priceIdYearly: process.env.STRIPE_PRICE_ID_STARTER_YEARLY || 'price_starter_yearly',
      currency: 'EUR',
      vatIncluded: true,
      discountYearly: 16, // ~16% discount yearly
      description: 'Perfekt für individuelle Entwickler',
      buttonText: 'Starter werden',
      features: [
        'Zugang zu 5 Geboten',
        'Alle Coding-Herausforderungen',
        'Vollständiger Community-Zugang',
        'Fortschritts-Analytics',
        'E-Mail & Chat-Support',
        'Monaco Editor Playground',
        'Workshop-Materialien zum Download'
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      tier: 'pro',
      price: 3900, // €39 in cents
      priceYearly: 39000, // €390 in cents (10 months)
      priceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro_monthly',
      priceIdYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || 'price_pro_yearly',
      currency: 'EUR',
      vatIncluded: true,
      popular: true,
      discountYearly: 16, // ~16% discount yearly
      description: 'Für ernsthafte Entwickler und kleine Teams',
      buttonText: 'Pro werden',
      features: [
        'Zugang zu 8 Geboten',
        'Erweiterte AI-Herausforderungen',
        'Echtzeit-Kollaborations-Tools',
        'Gruppen-Mentoring-Sessions',
        'Priority Support',
        'Projekt-Reviews',
        'Zertifikat nach Abschluss',
        'Früher Zugang zu neuen Inhalten'
      ],
    },
    {
      id: 'expert',
      name: 'Expert',
      tier: 'expert',
      price: 6900, // €69 in cents
      priceYearly: 69000, // €690 in cents (10 months)
      priceId: process.env.STRIPE_PRICE_ID_EXPERT || 'price_expert_monthly',
      priceIdYearly: process.env.STRIPE_PRICE_ID_EXPERT_YEARLY || 'price_expert_yearly',
      currency: 'EUR',
      vatIncluded: true,
      discountYearly: 16, // ~16% discount yearly
      description: 'Komplette Meisterschaft für Teams und Unternehmen',
      buttonText: 'Expert werden',
      maxUsers: 5,
      features: [
        'Alle 10 heiligen Gebote',
        'Erweiterte AI-powered Herausforderungen',
        'Team-Kollaborations-Tools',
        'Persönliche 1-zu-1 Mentoring-Sessions',
        'VIP Support',
        'Custom Projekt-Reviews',
        'Zertifikat der Vollendung',
        'Revenue-Sharing Möglichkeiten',
        'White-Label-Optionen',
        'API-Zugang für Integrationen'
      ],
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      tier: 'lifetime',
      price: 49700, // €497 one-time
      priceLifetime: 49700,
      priceId: process.env.STRIPE_PRICE_ID_LIFETIME || 'price_lifetime',
      priceIdLifetime: process.env.STRIPE_PRICE_ID_LIFETIME || 'price_lifetime',
      currency: 'EUR',
      vatIncluded: true,
      description: 'Lebenslanger Zugang zu allem - beste Investition',
      buttonText: 'Lifetime kaufen',
      features: [
        'Alle 10 heiligen Gebote - für immer',
        'Lebenslange Updates und neue Inhalte',
        'Alle zukünftigen Features inklusive',
        'VIP Community-Zugang',
        'Persönliche Mentoring-Sessions',
        'Revenue-Sharing Berechtigung',
        'White-Label Lizenzrechte',
        'Prioritäts-Support',
        'Zertifizierung',
        'Keine wiederkehrenden Kosten'
      ],
    }
  ]
}

export const pricingPlans = getPricingPlans()

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  referralCode,
  isSubscription = false,
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  referralCode?: string
  isSubscription?: boolean
}) {
  try {
    const sessionConfig: any = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card', 'sepa_debit', 'sofort'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId,
        ...(referralCode && { referralCode }),
      },
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      billing_address_collection: 'auto',
      // European-specific settings
      locale: 'de',
      currency: 'eur',
    }

    // Add subscription-specific settings
    if (isSubscription) {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          ...(referralCode && { referralCode }),
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
      locale: 'de',
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error('Failed to create portal session')
  }
}

export async function getSubscriptionStatus(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    return subscriptions.data[0] || null
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return null
  }
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price / 100)
}

export function calculateYearlyDiscount(monthlyPrice: number, yearlyPrice: number): number {
  const monthlyCost = monthlyPrice * 12
  const discount = ((monthlyCost - yearlyPrice) / monthlyCost) * 100
  return Math.round(discount)
}

export function generateReferralCode(userId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const prefix = userId.slice(0, 4).toUpperCase()
  let result = prefix
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function calculateReferralCommission(amount: number, currency: string = 'EUR'): Promise<number> {
  const commissionRate = 0.15 // 15%
  return Math.floor(amount * commissionRate) // Always round down for commissions
}

export async function changeSubscriptionPlan({
  subscriptionId,
  newPriceId,
  prorationBehavior = 'create_prorations'
}: {
  subscriptionId: string
  newPriceId: string
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: prorationBehavior,
      billing_cycle_anchor: 'unchanged',
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error changing subscription plan:', error)
    throw new Error('Failed to change subscription plan')
  }
}

export async function cancelSubscription({
  subscriptionId,
  cancelImmediately = false,
  cancellationReason
}: {
  subscriptionId: string
  cancelImmediately?: boolean
  cancellationReason?: string
}) {
  try {
    if (cancelImmediately) {
      const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId)
      return canceledSubscription
    } else {
      // Cancel at period end (German law compliance - 14 days notice)
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: cancellationReason || 'User requested cancellation',
          cancelled_at: new Date().toISOString()
        }
      })
      return updatedSubscription
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}

export async function pauseSubscription({
  subscriptionId,
  pauseUntil
}: {
  subscriptionId: string
  pauseUntil?: Date
}) {
  try {
    const pauseCollection = pauseUntil ? {
      behavior: 'void' as const,
      resumes_at: Math.floor(pauseUntil.getTime() / 1000)
    } : {
      behavior: 'mark_uncollectible' as const
    }
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      pause_collection: pauseCollection
    })

    return updatedSubscription
  } catch (error) {
    console.error('Error pausing subscription:', error)
    throw new Error('Failed to pause subscription')
  }
}

export async function createTrialSubscription({
  customerId,
  priceId,
  trialDays = 14
}: {
  customerId: string
  priceId: string
  trialDays?: number
}) {
  try {
    const trialEndTimestamp = Math.floor((Date.now() + (trialDays * 24 * 60 * 60 * 1000)) / 1000)
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_end: trialEndTimestamp,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
    })

    return subscription
  } catch (error) {
    console.error('Error creating trial subscription:', error)
    throw new Error('Failed to create trial subscription')
  }
}

export async function createDiscountCode({
  name,
  percentOff,
  amountOff,
  currency = 'eur',
  duration = 'once',
  durationInMonths,
  maxRedemptions,
  redeemBy
}: {
  name: string
  percentOff?: number
  amountOff?: number
  currency?: string
  duration?: 'once' | 'repeating' | 'forever'
  durationInMonths?: number
  maxRedemptions?: number
  redeemBy?: Date
}) {
  try {
    // Create coupon first
    const couponData: any = {
      name,
      duration,
    }

    if (percentOff) {
      couponData.percent_off = percentOff
    } else if (amountOff) {
      couponData.amount_off = amountOff
      couponData.currency = currency
    }

    if (duration === 'repeating' && durationInMonths) {
      couponData.duration_in_months = durationInMonths
    }

    if (maxRedemptions) {
      couponData.max_redemptions = maxRedemptions
    }

    if (redeemBy) {
      couponData.redeem_by = Math.floor(redeemBy.getTime() / 1000)
    }

    const coupon = await stripe.coupons.create(couponData)

    // Create promotion code
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: name.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      active: true,
    })

    return { coupon, promotionCode }
  } catch (error) {
    console.error('Error creating discount code:', error)
    throw new Error('Failed to create discount code')
  }
}

export async function createStripeProduct(plan: PricingPlan): Promise<string> {
  try {
    const product = await stripe.products.create({
      name: `Vibe Coding Bible - ${plan.name}`,
      description: plan.description,
      metadata: {
        tier: plan.tier,
        planId: plan.id,
      },
    })
    return product.id
  } catch (error) {
    console.error('Error creating Stripe product:', error)
    throw new Error('Failed to create Stripe product')
  }
}

export async function createStripePrice(productId: string, amount: number, currency: string = 'EUR', interval?: 'month' | 'year'): Promise<string> {
  try {
    const priceData: any = {
      unit_amount: amount,
      currency: currency.toLowerCase(),
      product: productId,
    }

    if (interval) {
      priceData.recurring = { interval }
    }

    const price = await stripe.prices.create(priceData)
    return price.id
  } catch (error) {
    console.error('Error creating Stripe price:', error)
    throw new Error('Failed to create Stripe price')
  }
}