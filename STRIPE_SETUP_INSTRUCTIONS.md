# 🚀 Stripe Integration Setup for Vibe Coding Bible

This guide will help you set up the complete Stripe integration with European tax compliance, referral system, and automated payment processing.

## 📋 Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Supabase Project**: Already configured with the database schema
3. **Node.js**: Version 18+ installed
4. **Environment Variables**: Copy `.env.example` to `.env.local`

## 🏗️ Setup Steps

### 1. Configure Stripe Account

#### Enable Required Features:
```bash
# In your Stripe Dashboard:
1. Go to Settings > Business settings
2. Set your business location to Germany/EU
3. Enable automatic tax collection:
   - Settings > Tax settings > Enable automatic tax
4. Configure VAT settings for EU customers
```

#### Set Up Webhooks:
```bash
# In Stripe Dashboard:
1. Go to Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: https://your-domain.com/api/stripe/webhooks
4. Select events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
5. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
```

### 2. Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```bash
# Stripe Keys (from Stripe Dashboard > Developers > API keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Create Stripe Products and Prices

Run the automated setup script:

```bash
# Install dependencies if not already done
npm install

# Run the Stripe setup script
node scripts/setup-stripe-products.js
```

This script will:
- ✅ Create 4 products in Stripe (Starter, Pro, Expert, Lifetime)
- ✅ Create all necessary price objects for monthly/yearly/lifetime billing
- ✅ Output the price IDs to add to your environment variables
- ✅ Configure EUR currency and German tax settings

Copy the generated price IDs to your `.env.local`:
```bash
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_STARTER_YEARLY=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...
STRIPE_PRICE_ID_EXPERT=price_...
STRIPE_PRICE_ID_EXPERT_YEARLY=price_...
STRIPE_PRICE_ID_LIFETIME=price_...
```

### 4. Database Migration

Run the referral system migration:

```bash
# Apply the referral system migration
npx supabase migration up
```

Or manually execute the SQL in `supabase/migrations/005_referral_system.sql`

### 5. Test the Integration

#### Test Stripe Checkout:
1. Start your development server: `npm run dev`
2. Go to `/pricing`
3. Click on any paid plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete the checkout process

#### Test Webhooks:
```bash
# Install Stripe CLI
npm install -g stripe

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Trigger test events
stripe trigger checkout.session.completed
```

### 6. Referral System Testing

#### Test Referral Flow:
1. Create a user account
2. Go to `/referrals` to get your referral code
3. Open an incognito window
4. Visit `/?ref=YOUR_REFERRAL_CODE`
5. Complete a purchase
6. Check referral dashboard for commission tracking

## 💰 Pricing Structure

| Plan | Monthly | Yearly | Features |
|------|---------|--------|----------|
| **Starter** | €19/month | €190/year | 5 Commandments, Basic features |
| **Pro** | €39/month | €390/year | 8 Commandments, Advanced features |
| **Expert** | €69/month | €690/year | All 10 Commandments, VIP features |
| **Lifetime** | - | €497 one-time | Everything forever |

### Referral Commission: **15%** on all sales

## 🔧 Configuration Options

### Tax Compliance (EU/German):
- ✅ Automatic VAT calculation
- ✅ Tax ID collection enabled
- ✅ German locale (can be changed)
- ✅ SEPA Direct Debit support
- ✅ Sofort payments

### Payment Methods:
- ✅ Credit/Debit Cards
- ✅ SEPA Direct Debit
- ✅ Sofort
- ✅ Bancontact (Belgium)
- ✅ iDEAL (Netherlands)

### Referral Features:
- ✅ Unique referral codes per user
- ✅ 15% commission tracking
- ✅ Automated payouts (pending manual approval)
- ✅ Analytics dashboard
- ✅ Conversion tracking

## 🚨 Production Deployment

### Stripe Configuration:
```bash
# Switch to live keys in production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Update webhook endpoint to production URL
# In Stripe Dashboard > Webhooks
Endpoint URL: https://your-domain.com/api/stripe/webhooks
```

### Security Checklist:
- [ ] Enable Stripe webhook signature verification
- [ ] Use HTTPS for all Stripe redirects
- [ ] Set up proper CORS headers
- [ ] Enable database RLS policies
- [ ] Validate user permissions on all API routes
- [ ] Set up monitoring for failed payments

### Monitoring:
```bash
# Monitor key metrics:
1. Payment success/failure rates
2. Referral conversion rates
3. Subscription churn
4. Webhook delivery status
5. Database query performance
```

## 🛟 Troubleshooting

### Common Issues:

#### Webhook Not Receiving Events:
```bash
# Check webhook logs in Stripe Dashboard
# Verify webhook URL is accessible
# Check STRIPE_WEBHOOK_SECRET matches
curl -X POST https://your-domain.com/api/stripe/webhooks
```

#### Price IDs Not Working:
```bash
# Verify price IDs exist in Stripe
stripe prices list --limit 20

# Check environment variables are loaded
console.log(process.env.STRIPE_PRICE_ID_STARTER)
```

#### Referral Not Tracking:
```bash
# Check if referral code exists in database
# Verify user_referrals table has entries
# Check referral_attempts table for click tracking
```

### Support:
- 📧 Email: support@vibecodingbible.agentland.saarland
- 💬 Discord: [Join our community]
- 📚 Documentation: See `/docs` folder

## 🎯 Testing Checklist

Before going live, test:

- [ ] Free plan signup and access
- [ ] Paid plan checkout (all tiers)
- [ ] Monthly vs yearly billing
- [ ] Lifetime purchase
- [ ] Referral link generation
- [ ] Referral commission calculation
- [ ] Webhook event processing
- [ ] Subscription cancellation
- [ ] Failed payment handling
- [ ] Payout request system
- [ ] VAT calculation for EU customers
- [ ] GDPR compliance for data collection

## 📈 Analytics & Metrics

Track these KPIs:
- 📊 Monthly Recurring Revenue (MRR)
- 🔄 Conversion rate by plan
- 👥 Referral program effectiveness
- 💰 Average order value
- 📉 Churn rate
- 🌍 Geographic distribution of customers

---

**Ready to go live? 🚀**

Once everything is tested and configured, update your environment variables to use live Stripe keys and deploy to production!