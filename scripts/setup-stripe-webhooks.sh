#!/bin/bash

# Stripe Webhook Configuration Script for Production
# Sets up Stripe webhooks for production environment

set -e

echo "🔗 Setting up Stripe webhooks for production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    print_error "Stripe CLI not found. Please install it first:"
    echo "https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if we're logged in to Stripe
if ! stripe config --list &> /dev/null; then
    print_error "Not logged in to Stripe. Please login first:"
    echo "stripe login"
    exit 1
fi

print_status "Stripe CLI found and authenticated"

# Webhook endpoint URL
WEBHOOK_URL="https://vibecodingbible.agentland.saarland/api/stripe/webhooks"

echo ""
echo "🔧 Creating Stripe webhook endpoint..."
echo "   URL: $WEBHOOK_URL"
echo ""

# Events to listen for
EVENTS=(
    "checkout.session.completed"
    "customer.subscription.created"
    "customer.subscription.updated"
    "customer.subscription.deleted"
    "invoice.payment_succeeded"
    "invoice.payment_failed"
    "payment_intent.succeeded"
    "payment_intent.payment_failed"
    "customer.created"
    "customer.updated"
)

# Create webhook endpoint
echo "📡 Creating webhook endpoint..."

# Build events parameter
EVENTS_PARAM=""
for event in "${EVENTS[@]}"; do
    EVENTS_PARAM="$EVENTS_PARAM --event $event"
done

# Create the webhook
WEBHOOK_RESULT=$(stripe listen --forward-to $WEBHOOK_URL --print-secret $EVENTS_PARAM 2>&1 | head -1)

if [[ $WEBHOOK_RESULT == *"whsec_"* ]]; then
    WEBHOOK_SECRET=$(echo $WEBHOOK_RESULT | grep -o 'whsec_[a-zA-Z0-9]*')
    print_status "Webhook endpoint created successfully"
    echo "🔐 Webhook Secret: $WEBHOOK_SECRET"
    
    # Add webhook secret to Vercel environment variables
    echo ""
    echo "🔐 Adding webhook secret to Vercel environment variables..."
    
    if echo "$WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production; then
        print_status "Webhook secret added to Vercel environment variables"
    else
        print_warning "Failed to add webhook secret to Vercel. Please add manually:"
        echo "vercel env add STRIPE_WEBHOOK_SECRET production"
        echo "Value: $WEBHOOK_SECRET"
    fi
    
else
    print_error "Failed to create webhook endpoint"
    echo "Output: $WEBHOOK_RESULT"
    exit 1
fi

# Create webhook endpoint using Stripe API (alternative method)
echo ""
echo "🔧 Alternative: Creating webhook via Stripe API..."

# Create webhook endpoint configuration
cat > /tmp/webhook_config.json << EOF
{
  "url": "$WEBHOOK_URL",
  "enabled_events": [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "customer.created",
    "customer.updated"
  ],
  "description": "Vibe Coding Bible Production Webhook"
}
EOF

# Create webhook using Stripe CLI
if stripe webhooks create --file /tmp/webhook_config.json > /tmp/webhook_response.json 2>&1; then
    WEBHOOK_ID=$(cat /tmp/webhook_response.json | grep -o '"id": *"[^"]*"' | head -1 | cut -d'"' -f4)
    WEBHOOK_SECRET_API=$(cat /tmp/webhook_response.json | grep -o '"secret": *"[^"]*"' | head -1 | cut -d'"' -f4)
    
    print_status "Webhook created via API"
    echo "🆔 Webhook ID: $WEBHOOK_ID"
    echo "🔐 Webhook Secret: $WEBHOOK_SECRET_API"
    
    # Clean up temp files
    rm -f /tmp/webhook_config.json /tmp/webhook_response.json
    
else
    print_warning "Failed to create webhook via API. Manual setup may be required."
    rm -f /tmp/webhook_config.json /tmp/webhook_response.json
fi

echo ""
print_status "Stripe webhook setup completed!"

echo ""
echo "📋 Webhook Configuration Summary:"
echo "   Endpoint URL: $WEBHOOK_URL"
echo "   Events: ${EVENTS[*]}"
echo ""

echo "🔧 Manual verification steps:"
echo "1. Visit: https://dashboard.stripe.com/webhooks"
echo "2. Verify webhook endpoint is listed and enabled"
echo "3. Test webhook by making a test payment"
echo "4. Check Vercel logs: vercel logs"
echo ""

echo "🧪 Testing webhook (optional):"
echo "1. Create a test checkout session"
echo "2. Complete a test payment"
echo "3. Verify webhook events are received"
echo ""

echo "🔐 Security notes:"
echo "- Webhook secret is automatically verified in your API route"
echo "- Only events from Stripe will be processed"
echo "- All webhook data is validated before processing"
echo ""

echo "✅ Stripe webhook setup complete!"