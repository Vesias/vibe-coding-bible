/**
 * Comprehensive test suite for Stripe payment integration
 * Tests payment flows, webhooks, and German compliance features
 */

// Jest globals are automatically available, no need to import them
import Stripe from 'stripe'
import { createEnhancedCheckoutSession, createTrialCheckoutSession, validateDiscountCode } from '../lib/stripe/enhanced-checkout'
import { changeSubscriptionPlan, cancelSubscription, pauseSubscription } from '../lib/stripe/server'

// Mock Stripe
jest.mock('stripe')
const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn()
    }
  },
  subscriptions: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn()
  },
  promotionCodes: {
    list: jest.fn()
  },
  coupons: {
    retrieve: jest.fn()
  },
  customers: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn()
  },
  invoices: {
    create: jest.fn(),
    retrieve: jest.fn()
  },
  billingPortal: {
    sessions: {
      create: jest.fn()
    }
  }
} as any

// Mock Supabase
jest.mock('../lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      upsert: jest.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null
      }))
    }
  }))
}))

describe('Stripe Payment Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up default mock returns
    mockStripe.checkout.sessions.create.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
      mode: 'subscription',
      customer_email: 'test@example.com'
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Enhanced Checkout Session', () => {
    it('should create a basic checkout session with German settings', async () => {
      const result = await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: 'payment',
        payment_method_types: ['card', 'sepa_debit', 'sofort', 'giropay', 'bancontact', 'ideal'],
        line_items: [{ price: 'price_test_123', quantity: 1 }],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        customer_email: 'test@example.com',
        metadata: { userId: 'user_123' },
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        tax_id_collection: { enabled: true },
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['DE', 'AT', 'CH', 'FR', 'NL', 'BE', 'LU']
        },
        locale: 'de',
        currency: 'eur',
        consent_collection: {
          terms_of_service: 'required',
          privacy_policy: 'required'
        },
        custom_text: expect.objectContaining({
          terms_of_service_acceptance: expect.any(Object),
          privacy_policy_acceptance: expect.any(Object)
        }),
        invoice_creation: expect.objectContaining({
          enabled: true,
          invoice_data: expect.objectContaining({
            description: 'Vibe Coding Bible Subscription'
          })
        })
      })

      expect(result).toEqual({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/test'
      })
    })

    it('should create subscription checkout with trial period', async () => {
      await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        isSubscription: true,
        trialDays: 14
      })

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'subscription',
          subscription_data: expect.objectContaining({
            trial_period_days: 14,
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'cancel'
              }
            }
          })
        })
      )
    })

    it('should apply valid coupon code', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({
        data: [{
          id: 'promo_123',
          code: 'WELCOME20',
          coupon: 'coupon_123'
        }]
      })

      await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        couponCode: 'welcome20'
      })

      expect(mockStripe.promotionCodes.list).toHaveBeenCalledWith({
        code: 'WELCOME20',
        active: true,
        limit: 1
      })

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          discounts: [{ promotion_code: 'promo_123' }]
        })
      )
    })

    it('should handle invalid coupon code gracefully', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({ data: [] })

      const result = await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        couponCode: 'invalid_code'
      })

      expect(result).toEqual({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/test'
      })

      // Should not include discounts in the session config
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.not.objectContaining({
          discounts: expect.any(Array)
        })
      )
    })
  })

  describe('Trial Checkout Session', () => {
    it('should create trial checkout with payment method required', async () => {
      await createTrialCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        trialDays: 14,
        requirePaymentMethod: true
      })

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        mode: 'subscription',
        payment_method_types: ['card', 'sepa_debit'],
        line_items: [{ price: 'price_test_123', quantity: 1 }],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        customer_email: 'test@example.com',
        metadata: { userId: 'user_123', trial: 'true' },
        subscription_data: {
          trial_period_days: 14,
          metadata: { userId: 'user_123', trial: 'true' },
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel'
            }
          }
        },
        payment_method_collection: 'always',
        locale: 'de',
        currency: 'eur',
        custom_text: {
          submit: {
            message: 'Starten Sie Ihre 14-tägige kostenlose Testphase'
          }
        }
      })
    })

    it('should create trial checkout without payment method requirement', async () => {
      await createTrialCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        requirePaymentMethod: false
      })

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_method_collection: 'if_required',
          subscription_data: expect.objectContaining({
            trial_settings: {
              end_behavior: {
                missing_payment_method: 'pause'
              }
            }
          })
        })
      )
    })
  })

  describe('Discount Code Validation', () => {
    it('should validate a valid discount code', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({
        data: [{
          id: 'promo_123',
          code: 'WELCOME20',
          coupon: 'coupon_123'
        }]
      })

      mockStripe.coupons.retrieve.mockResolvedValue({
        id: 'coupon_123',
        percent_off: 20,
        duration: 'once',
        redeem_by: null,
        max_redemptions: null,
        times_redeemed: 5
      })

      const result = await validateDiscountCode('welcome20')

      expect(result).toEqual({
        valid: true,
        discount: {
          percent_off: 20,
          amount_off: undefined,
          currency: undefined,
          duration: 'once',
          duration_in_months: undefined
        }
      })
    })

    it('should reject expired discount code', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({
        data: [{
          id: 'promo_123',
          code: 'EXPIRED',
          coupon: 'coupon_123'
        }]
      })

      const expiredTimestamp = Math.floor((Date.now() - 86400000) / 1000) // Yesterday
      mockStripe.coupons.retrieve.mockResolvedValue({
        id: 'coupon_123',
        percent_off: 20,
        duration: 'once',
        redeem_by: expiredTimestamp,
        max_redemptions: null,
        times_redeemed: 0
      })

      const result = await validateDiscountCode('expired')

      expect(result).toEqual({
        valid: false,
        error: 'Rabattcode ist abgelaufen'
      })
    })

    it('should reject overused discount code', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({
        data: [{
          id: 'promo_123',
          code: 'MAXED',
          coupon: 'coupon_123'
        }]
      })

      mockStripe.coupons.retrieve.mockResolvedValue({
        id: 'coupon_123',
        percent_off: 20,
        duration: 'once',
        redeem_by: null,
        max_redemptions: 10,
        times_redeemed: 10
      })

      const result = await validateDiscountCode('maxed')

      expect(result).toEqual({
        valid: false,
        error: 'Rabattcode wurde bereits zu oft verwendet'
      })
    })

    it('should reject invalid discount code', async () => {
      mockStripe.promotionCodes.list.mockResolvedValue({ data: [] })

      const result = await validateDiscountCode('invalid')

      expect(result).toEqual({
        valid: false,
        error: 'Ungültiger Rabattcode'
      })
    })
  })

  describe('Subscription Management', () => {
    it('should change subscription plan with proration', async () => {
      const mockSubscription = {
        id: 'sub_123',
        items: {
          data: [{ id: 'si_123' }]
        }
      }

      mockStripe.subscriptions.retrieve.mockResolvedValue(mockSubscription)
      mockStripe.subscriptions.update.mockResolvedValue({
        ...mockSubscription,
        items: {
          data: [{ id: 'si_123', price: { id: 'price_new_123' } }]
        }
      })

      const result = await changeSubscriptionPlan({
        subscriptionId: 'sub_123',
        newPriceId: 'price_new_123'
      })

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        items: [{
          id: 'si_123',
          price: 'price_new_123'
        }],
        proration_behavior: 'create_prorations',
        billing_cycle_anchor: 'unchanged'
      })

      expect(result).toBeDefined()
    })

    it('should cancel subscription at period end', async () => {
      const mockSubscription = {
        id: 'sub_123',
        cancel_at_period_end: true,
        current_period_end: 1234567890
      }

      mockStripe.subscriptions.update.mockResolvedValue(mockSubscription)

      const result = await cancelSubscription({
        subscriptionId: 'sub_123',
        cancelImmediately: false,
        cancellationReason: 'User requested'
      })

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: 'User requested',
          cancelled_at: expect.any(String)
        }
      })

      expect(result.cancel_at_period_end).toBe(true)
    })

    it('should cancel subscription immediately', async () => {
      const mockSubscription = {
        id: 'sub_123',
        status: 'canceled'
      }

      mockStripe.subscriptions.cancel.mockResolvedValue(mockSubscription)

      const result = await cancelSubscription({
        subscriptionId: 'sub_123',
        cancelImmediately: true
      })

      expect(mockStripe.subscriptions.cancel).toHaveBeenCalledWith('sub_123')
      expect(result.status).toBe('canceled')
    })

    it('should pause subscription', async () => {
      const mockSubscription = {
        id: 'sub_123',
        pause_collection: {
          behavior: 'mark_uncollectible'
        }
      }

      mockStripe.subscriptions.update.mockResolvedValue(mockSubscription)

      const result = await pauseSubscription({
        subscriptionId: 'sub_123'
      })

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        pause_collection: {
          behavior: 'mark_uncollectible'
        }
      })

      expect(result).toBeDefined()
    })

    it('should pause subscription until specific date', async () => {
      const pauseUntil = new Date('2024-12-31')
      const mockSubscription = {
        id: 'sub_123',
        pause_collection: {
          behavior: 'void',
          resumes_at: Math.floor(pauseUntil.getTime() / 1000)
        }
      }

      mockStripe.subscriptions.update.mockResolvedValue(mockSubscription)

      const result = await pauseSubscription({
        subscriptionId: 'sub_123',
        pauseUntil
      })

      expect(mockStripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        pause_collection: {
          behavior: 'void',
          resumes_at: Math.floor(pauseUntil.getTime() / 1000)
        }
      })

      expect(result).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle Stripe API errors gracefully', async () => {
      mockStripe.checkout.sessions.create.mockRejectedValue(
        new Error('Your card was declined.')
      )

      await expect(createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })).rejects.toThrow('Failed to create checkout session')
    })

    it('should handle network errors', async () => {
      mockStripe.checkout.sessions.create.mockRejectedValue(
        new Error('Network error')
      )

      await expect(createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })).rejects.toThrow('Failed to create checkout session')
    })
  })

  describe('German Compliance Features', () => {
    it('should include required German legal elements', async () => {
      await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })

      const callArgs = mockStripe.checkout.sessions.create.mock.calls[0][0]

      // Check German locale
      expect(callArgs.locale).toBe('de')
      expect(callArgs.currency).toBe('eur')

      // Check EU payment methods
      expect(callArgs.payment_method_types).toContain('sepa_debit')
      expect(callArgs.payment_method_types).toContain('sofort')
      expect(callArgs.payment_method_types).toContain('giropay')

      // Check legal compliance
      expect(callArgs.consent_collection.terms_of_service).toBe('required')
      expect(callArgs.consent_collection.privacy_policy).toBe('required')

      // Check tax settings
      expect(callArgs.automatic_tax.enabled).toBe(true)
      expect(callArgs.tax_id_collection.enabled).toBe(true)

      // Check address collection
      expect(callArgs.billing_address_collection).toBe('required')
      expect(callArgs.shipping_address_collection.allowed_countries).toContain('DE')

      // Check invoice settings
      expect(callArgs.invoice_creation.enabled).toBe(true)
    })

    it('should support German and EU countries for shipping', async () => {
      await createEnhancedCheckoutSession({
        priceId: 'price_test_123',
        userId: 'user_123',
        userEmail: 'test@example.com',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel'
      })

      const callArgs = mockStripe.checkout.sessions.create.mock.calls[0][0]
      const allowedCountries = callArgs.shipping_address_collection.allowed_countries

      expect(allowedCountries).toContain('DE') // Germany
      expect(allowedCountries).toContain('AT') // Austria
      expect(allowedCountries).toContain('CH') // Switzerland
      expect(allowedCountries).toContain('FR') // France
      expect(allowedCountries).toContain('NL') // Netherlands
      expect(allowedCountries).toContain('BE') // Belgium
      expect(allowedCountries).toContain('LU') // Luxembourg
    })
  })
})

describe('Webhook Event Processing', () => {
  // This would test webhook handlers
  // Implementation depends on the webhook handler structure
  
  it('should process checkout.session.completed event')
  it('should process customer.subscription.created event')
  it('should process customer.subscription.updated event')
  it('should process customer.subscription.deleted event')
  it('should process invoice.payment_succeeded event')
  it('should process invoice.payment_failed event')
  it('should handle referral commission calculation')
  it('should update user subscription status in database')
  it('should send confirmation notifications')
})

describe('Integration Tests', () => {
  // These would be end-to-end tests
  // Require actual Stripe test environment
  
  it('should complete full payment flow for monthly subscription')
  it('should complete full payment flow for yearly subscription')
  it('should complete full payment flow for lifetime purchase')
  it('should handle failed payment scenarios')
  it('should process subscription cancellation flow')
  it('should handle referral tracking throughout payment flow')
})