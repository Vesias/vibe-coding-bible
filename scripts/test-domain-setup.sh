#!/bin/bash

# Domain Setup Testing Script
# Tests the custom domain configuration for vibecodingbible.agentland.saarland

set -e

echo "🔍 Testing Custom Domain Setup for vibecodingbible.agentland.saarland"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

DOMAIN="vibecodingbible.agentland.saarland"
CURRENT_VERCEL_URL="https://vibe-coding-bibel-mw61gwf0r-bozz-aclearallbgs-projects.vercel.app"

echo ""
echo "🎯 Target Domain: $DOMAIN"
echo "🔗 Current Vercel URL: $CURRENT_VERCEL_URL"
echo ""

# Test 1: DNS Resolution
echo "🔍 Testing DNS Resolution..."
if nslookup $DOMAIN > /dev/null 2>&1; then
    print_status "DNS resolution successful"
    echo "   $(nslookup $DOMAIN | grep -A 2 'Name:' | tail -1)"
else
    print_error "DNS resolution failed"
    echo "   Domain not configured or not propagated yet"
fi

# Test 2: HTTP/HTTPS Connectivity
echo ""
echo "🌐 Testing HTTP/HTTPS Connectivity..."
if curl -Is "https://$DOMAIN" > /dev/null 2>&1; then
    STATUS_CODE=$(curl -Is "https://$DOMAIN" | head -n 1 | cut -d ' ' -f2)
    if [ "$STATUS_CODE" = "200" ]; then
        print_status "HTTPS connection successful (Status: $STATUS_CODE)"
    else
        print_warning "HTTPS connection returned status: $STATUS_CODE"
    fi
else
    print_error "HTTPS connection failed"
    echo "   Testing current Vercel URL instead..."
    if curl -Is "$CURRENT_VERCEL_URL" > /dev/null 2>&1; then
        print_status "Vercel URL is accessible"
    else
        print_error "Vercel URL is not accessible"
    fi
fi

# Test 3: SSL Certificate
echo ""
echo "🔐 Testing SSL Certificate..."
if command -v openssl > /dev/null 2>&1; then
    if echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -subject > /dev/null 2>&1; then
        CERT_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -subject -dates)
        print_status "SSL certificate is valid"
        echo "   $CERT_INFO"
    else
        print_error "SSL certificate validation failed"
    fi
else
    print_warning "OpenSSL not available for certificate testing"
fi

# Test 4: API Endpoints
echo ""
echo "🔌 Testing API Endpoints..."
HEALTH_URL="https://$DOMAIN/api/health"
HEALTH_URL_FALLBACK="$CURRENT_VERCEL_URL/api/health"

if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
    HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" | head -c 100)
    print_status "Health API endpoint accessible"
    echo "   Response: $HEALTH_RESPONSE"
else
    print_error "Health API endpoint not accessible via custom domain"
    echo "   Testing via Vercel URL..."
    if curl -s "$HEALTH_URL_FALLBACK" > /dev/null 2>&1; then
        HEALTH_RESPONSE=$(curl -s "$HEALTH_URL_FALLBACK" | head -c 100)
        print_status "Health API accessible via Vercel URL"
        echo "   Response: $HEALTH_RESPONSE"
    else
        print_error "Health API not accessible via Vercel URL either"
    fi
fi

# Test 5: Stripe Webhook Endpoint
echo ""
echo "💳 Testing Stripe Webhook Endpoint..."
WEBHOOK_URL="https://$DOMAIN/api/stripe/webhooks"
WEBHOOK_URL_FALLBACK="$CURRENT_VERCEL_URL/api/stripe/webhooks"

if curl -s -X POST -H "Content-Type: application/json" "$WEBHOOK_URL" > /dev/null 2>&1; then
    print_status "Stripe webhook endpoint is reachable"
else
    print_error "Stripe webhook endpoint not reachable via custom domain"
    echo "   Testing via Vercel URL..."
    if curl -s -X POST -H "Content-Type: application/json" "$WEBHOOK_URL_FALLBACK" > /dev/null 2>&1; then
        print_status "Stripe webhook endpoint reachable via Vercel URL"
    else
        print_error "Stripe webhook endpoint not reachable"
    fi
fi

# Test 6: Environment Variables
echo ""
echo "⚙️  Testing Environment Variables..."
if vercel env get NEXT_PUBLIC_SITE_URL > /dev/null 2>&1; then
    SITE_URL=$(vercel env get NEXT_PUBLIC_SITE_URL 2>/dev/null)
    if [ "$SITE_URL" = "https://$DOMAIN" ]; then
        print_status "NEXT_PUBLIC_SITE_URL correctly set to custom domain"
    else
        print_warning "NEXT_PUBLIC_SITE_URL is set to: $SITE_URL"
        print_info "Should be: https://$DOMAIN"
    fi
else
    print_error "Cannot retrieve NEXT_PUBLIC_SITE_URL environment variable"
fi

# Test 7: Vercel Domain Configuration
echo ""
echo "🚀 Testing Vercel Domain Configuration..."
if vercel domains ls | grep -q "$DOMAIN"; then
    print_status "Domain is configured in Vercel"
else
    print_error "Domain is not configured in Vercel"
    print_info "Add domain manually via Vercel dashboard"
fi

# Test 8: Page Loading
echo ""
echo "📄 Testing Page Loading..."
PAGES_TO_TEST=(
    "/"
    "/dashboard"
    "/pricing"
    "/workshops"
    "/auth"
    "/api/health"
)

for PAGE in "${PAGES_TO_TEST[@]}"; do
    URL="https://$DOMAIN$PAGE"
    FALLBACK_URL="$CURRENT_VERCEL_URL$PAGE"
    
    if curl -Is "$URL" > /dev/null 2>&1; then
        STATUS=$(curl -Is "$URL" | head -n 1 | cut -d ' ' -f2)
        if [ "$STATUS" = "200" ] || [ "$STATUS" = "302" ] || [ "$STATUS" = "307" ]; then
            print_status "Page $PAGE loads successfully (Status: $STATUS)"
        else
            print_warning "Page $PAGE returned status: $STATUS"
        fi
    else
        print_error "Page $PAGE not accessible via custom domain"
        # Test fallback
        if curl -Is "$FALLBACK_URL" > /dev/null 2>&1; then
            STATUS=$(curl -Is "$FALLBACK_URL" | head -n 1 | cut -d ' ' -f2)
            print_info "Page $PAGE accessible via Vercel URL (Status: $STATUS)"
        fi
    fi
done

# Summary
echo ""
echo "📊 Testing Summary"
echo "=================="
echo ""

if nslookup $DOMAIN > /dev/null 2>&1 && curl -Is "https://$DOMAIN" > /dev/null 2>&1; then
    print_status "Custom domain is fully operational!"
    echo ""
    echo "🎉 Next Steps:"
    echo "   1. Update Stripe webhooks to use custom domain"
    echo "   2. Test payment flows"
    echo "   3. Monitor performance and logs"
    echo ""
else
    print_warning "Custom domain setup is incomplete"
    echo ""
    echo "🔧 Required Actions:"
    echo "   1. Add domain to Vercel project via dashboard"
    echo "   2. Configure DNS records with your provider"
    echo "   3. Wait for DNS propagation (5-10 minutes)"
    echo "   4. Verify SSL certificate provisioning"
    echo ""
    echo "📋 DNS Configuration Required:"
    echo "   Type: CNAME"
    echo "   Name: vibecodingbible"
    echo "   Value: cname.vercel-dns.com"
    echo "   TTL: 300"
    echo ""
fi

echo "🔗 Useful Links:"
echo "   - Vercel Dashboard: https://vercel.com/bozz-aclearallbgs-projects/vibe-coding-bibel"
echo "   - DNS Checker: https://dnschecker.org/"
echo "   - SSL Checker: https://www.ssllabs.com/ssltest/"
echo ""

echo "✅ Domain testing completed!"