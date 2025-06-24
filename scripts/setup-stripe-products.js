/**
 * Script to create Stripe products and prices for Vibe Coding Bible
 * Run with: node scripts/setup-stripe-products.js
 */

const Stripe = require('stripe')

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const plans = [
  {
    id: 'starter',
    name: 'Vibe Coding Bible - Starter',
    description: 'Perfekt für individuelle Entwickler',
    prices: {
      monthly: { amount: 1900, interval: 'month' }, // €19/month
      yearly: { amount: 19000, interval: 'year' }   // €190/year
    }
  },
  {
    id: 'pro',
    name: 'Vibe Coding Bible - Pro',
    description: 'Für ernsthafte Entwickler und kleine Teams',
    prices: {
      monthly: { amount: 3900, interval: 'month' }, // €39/month
      yearly: { amount: 39000, interval: 'year' }   // €390/year
    }
  },
  {
    id: 'expert',
    name: 'Vibe Coding Bible - Expert',
    description: 'Komplette Meisterschaft für Teams und Unternehmen',
    prices: {
      monthly: { amount: 6900, interval: 'month' }, // €69/month
      yearly: { amount: 69000, interval: 'year' }   // €690/year
    }
  },
  {
    id: 'lifetime',
    name: 'Vibe Coding Bible - Lifetime Access',
    description: 'Lebenslanger Zugang zu allem - beste Investition',
    prices: {
      onetime: { amount: 49700 } // €497 one-time
    }
  }
]

async function createStripeProducts() {
  console.log('🔄 Creating Stripe products and prices...')
  
  const results = {}

  for (const plan of plans) {
    console.log(`\n📦 Creating product: ${plan.name}`)
    
    try {
      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          tier: plan.id,
          planId: plan.id,
        },
      })

      console.log(`✅ Product created: ${product.id}`)
      results[plan.id] = {
        productId: product.id,
        prices: {}
      }

      // Create prices
      for (const [priceType, priceConfig] of Object.entries(plan.prices)) {
        console.log(`💰 Creating price: ${priceType}`)
        
        const priceData = {
          unit_amount: priceConfig.amount,
          currency: 'eur',
          product: product.id,
          metadata: {
            tier: plan.id,
            priceType: priceType
          }
        }

        // Add recurring interval if it's a subscription
        if (priceConfig.interval) {
          priceData.recurring = { interval: priceConfig.interval }
        }

        const price = await stripe.prices.create(priceData)
        
        console.log(`✅ Price created: ${price.id}`)
        results[plan.id].prices[priceType] = price.id
      }

    } catch (error) {
      console.error(`❌ Error creating product ${plan.name}:`, error.message)
    }
  }

  console.log('\n🎉 Setup complete! Here are your price IDs:')
  console.log('\n📋 Add these to your environment variables:')
  console.log('=====================================')
  
  // Generate environment variables
  if (results.starter?.prices.monthly) {
    console.log(`STRIPE_PRICE_ID_STARTER=${results.starter.prices.monthly}`)
  }
  if (results.starter?.prices.yearly) {
    console.log(`STRIPE_PRICE_ID_STARTER_YEARLY=${results.starter.prices.yearly}`)
  }
  if (results.pro?.prices.monthly) {
    console.log(`STRIPE_PRICE_ID_PRO=${results.pro.prices.monthly}`)
  }
  if (results.pro?.prices.yearly) {
    console.log(`STRIPE_PRICE_ID_PRO_YEARLY=${results.pro.prices.yearly}`)
  }
  if (results.expert?.prices.monthly) {
    console.log(`STRIPE_PRICE_ID_EXPERT=${results.expert.prices.monthly}`)
  }
  if (results.expert?.prices.yearly) {
    console.log(`STRIPE_PRICE_ID_EXPERT_YEARLY=${results.expert.prices.yearly}`)
  }
  if (results.lifetime?.prices.onetime) {
    console.log(`STRIPE_PRICE_ID_LIFETIME=${results.lifetime.prices.onetime}`)
  }

  console.log('\n📝 Full results:')
  console.log(JSON.stringify(results, null, 2))
}

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err)
  process.exit(1)
})

// Run the setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required')
  process.exit(1)
}

createStripeProducts()
  .then(() => {
    console.log('\n🚀 Setup completed successfully!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Setup failed:', err)
    process.exit(1)
  })