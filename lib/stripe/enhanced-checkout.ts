import { stripe } from './server'

export async function createEnhancedCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  referralCode,
  isSubscription = false,
  trialDays,
  couponCode,
  customerName
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  referralCode?: string
  isSubscription?: boolean
  trialDays?: number
  couponCode?: string
  customerName?: string
}) {
  try {
    const sessionConfig: any = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: [
        'card',
        'sepa_debit',
        'sofort',
        'giropay',
        'bancontact',
        'ideal'
      ],
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
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH', 'FR', 'NL', 'BE', 'LU'],
      },
      // European-specific settings
      locale: 'de',
      currency: 'eur',
      // German legal compliance
      consent_collection: {
        terms_of_service: 'required',
        privacy_policy: 'required'
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: 'Ich akzeptiere die [Allgemeinen Geschäftsbedingungen](https://vibecodingbible.agentland.saarland/terms).'
        },
        privacy_policy_acceptance: {
          message: 'Ich akzeptiere die [Datenschutzerklärung](https://vibecodingbible.agentland.saarland/privacy).'
        }
      },
      // Enhanced invoice settings for German compliance
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: 'Vibe Coding Bible Subscription',
          metadata: {
            userId,
            ...(referralCode && { referralCode })
          },
          footer: 'Vielen Dank für Ihr Vertrauen in die Vibe Coding Bible!'
        }
      }
    }

    // Add customer name if provided
    if (customerName) {
      sessionConfig.customer_creation = 'always'
      sessionConfig.customer_update = {
        name: 'always',
        address: 'always'
      }
    }

    // Add coupon if provided
    if (couponCode) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: couponCode.toUpperCase(),
          active: true,
          limit: 1
        })
        
        if (promotionCodes.data.length > 0) {
          sessionConfig.discounts = [{
            promotion_code: promotionCodes.data[0].id
          }]
        }
      } catch (couponError) {
        console.warn('Invalid coupon code:', couponCode)
        // Continue without coupon rather than failing
      }
    }

    // Add subscription-specific settings
    if (isSubscription) {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          ...(referralCode && { referralCode }),
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel'
          }
        }
      }
      
      // Add trial period if specified
      if (trialDays && trialDays > 0) {
        sessionConfig.subscription_data.trial_period_days = trialDays
      }

      // German-specific subscription settings
      sessionConfig.payment_method_collection = 'if_required'
      sessionConfig.payment_method_options = {
        sepa_debit: {
          setup_future_usage: 'off_session'
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating enhanced checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function createTrialCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  trialDays = 14,
  requirePaymentMethod = true
}: {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  trialDays?: number
  requirePaymentMethod?: boolean
}) {
  try {
    const sessionConfig: any = {
      mode: 'subscription',
      payment_method_types: ['card', 'sepa_debit'],
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
        trial: 'true'
      },
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          userId,
          trial: 'true'
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: requirePaymentMethod ? 'cancel' : 'pause'
          }
        }
      },
      payment_method_collection: requirePaymentMethod ? 'always' : 'if_required',
      locale: 'de',
      currency: 'eur',
      custom_text: {
        submit: {
          message: `Starten Sie Ihre ${trialDays}-tägige kostenlose Testphase`
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating trial checkout session:', error)
    throw new Error('Failed to create trial checkout session')
  }
}

export async function validateDiscountCode(code: string): Promise<{
  valid: boolean
  discount?: {
    percent_off?: number
    amount_off?: number
    currency?: string
    duration: string
    duration_in_months?: number
  }
  error?: string
}> {
  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1
    })

    if (promotionCodes.data.length === 0) {
      return { valid: false, error: 'Ungültiger Rabattcode' }
    }

    const promotionCode = promotionCodes.data[0]
    const coupon = await stripe.coupons.retrieve(promotionCode.coupon as string)

    // Check if coupon is still valid
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Rabattcode ist abgelaufen' }
    }

    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return { valid: false, error: 'Rabattcode wurde bereits zu oft verwendet' }
    }

    return {
      valid: true,
      discount: {
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months
      }
    }
  } catch (error) {
    console.error('Error validating discount code:', error)
    return { valid: false, error: 'Fehler beim Validieren des Rabattcodes' }
  }
}