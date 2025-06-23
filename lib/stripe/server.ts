import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export interface PricingPlan {
  id: string
  name: string
  price: number
  priceId: string
  features: string[]
  popular?: boolean
  description: string
  buttonText: string
  maxUsers?: number
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Seeker',
    price: 0,
    priceId: '',
    description: 'Perfect for getting started with Vibe Coding basics',
    buttonText: 'Start Free',
    features: [
      'Access to first 2 commandments',
      'Basic coding challenges',
      'Community forum access (read-only)',
      'Progress tracking',
      'Email support'
    ],
  },
  {
    id: 'basic',
    name: 'Apprentice',
    price: 4900, // $49 in cents
    priceId: process.env.STRIPE_PRICE_ID_BASIC!,
    description: 'Ideal for individual developers ready to level up',
    buttonText: 'Become an Apprentice',
    features: [
      'Access to first 5 commandments',
      'All coding challenges and quizzes',
      'Full community forum access',
      'Progress tracking & analytics',
      'Email & chat support',
      'Monaco Editor playground',
      'Download workshop materials'
    ],
  },
  {
    id: 'pro',
    name: 'Prophet',
    price: 9900, // $99 in cents
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    description: 'Complete mastery for serious developers and teams',
    buttonText: 'Ascend to Prophet',
    popular: true,
    features: [
      'All 10 sacred commandments',
      'Advanced AI-powered challenges',
      'Real-time collaboration tools',
      'One-on-one mentorship sessions',
      'Priority support',
      'Custom project reviews',
      'Certificate of completion',
      'Revenue sharing opportunities',
      'Early access to new content'
    ],
  },
  {
    id: 'divine',
    name: 'Divine Architect',
    price: 19900, // $199 in cents
    priceId: process.env.STRIPE_PRICE_ID_DIVINE!,
    description: 'Ultimate package for teams and enterprises',
    buttonText: 'Achieve Divinity',
    maxUsers: 10,
    features: [
      'Everything in Prophet tier',
      'Team collaboration tools',
      'White-label licensing rights',
      'Custom workshop creation',
      'Dedicated account manager',
      'On-site training sessions',
      'API access for integrations',
      'Custom branding options',
      'Advanced analytics dashboard',
      'SLA guarantees'
    ],
  },
]

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
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
      },
      allow_promotion_codes: true,
    })

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

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price / 100)
}