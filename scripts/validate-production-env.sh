#!/bin/bash

# Production Environment Validation Script
# Validates all environment variables and configurations before deployment

set -e

echo "🔍 Validating production environment for Vibe Coding Bible..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
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

# Validation counters
PASSED=0
FAILED=0
WARNINGS=0

validate_env_var() {
    local var_name=$1
    local description=$2
    local required=${3:-true}
    
    if vercel env ls production | grep -q "$var_name"; then
        print_success "$description ($var_name)"
        ((PASSED++))
    else
        if [ "$required" = "true" ]; then
            print_error "$description ($var_name) - REQUIRED"
            ((FAILED++))
        else
            print_warning "$description ($var_name) - OPTIONAL"
            ((WARNINGS++))
        fi
    fi
}

validate_url() {
    local url=$1
    local description=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        print_success "$description - URL accessible"
        ((PASSED++))
    else
        print_error "$description - URL not accessible: $url"
        ((FAILED++))
    fi
}

echo "🔐 Validating environment variables..."

# Core site configuration
validate_env_var "NEXT_PUBLIC_SITE_URL" "Site URL"
validate_env_var "NEXT_PUBLIC_SITE_NAME" "Site Name"
validate_env_var "NEXT_PUBLIC_SITE_DESCRIPTION" "Site Description" false

# Supabase configuration
validate_env_var "NEXT_PUBLIC_SUPABASE_URL" "Supabase URL"
validate_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase Anon Key"
validate_env_var "SUPABASE_SERVICE_ROLE_KEY" "Supabase Service Role Key"

# Stripe configuration
validate_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key"
validate_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key"
validate_env_var "STRIPE_WEBHOOK_SECRET" "Stripe Webhook Secret"

# AI Provider Keys
validate_env_var "DEEPSEEK_API_KEY" "DeepSeek API Key" false
validate_env_var "OPENAI_API_KEY" "OpenAI API Key" false
validate_env_var "GOOGLE_AI_API_KEY" "Google AI API Key" false
validate_env_var "ANTHROPIC_API_KEY" "Anthropic API Key" false

# Search Provider Keys
validate_env_var "BRAVE_SEARCH_API_KEY" "Brave Search API Key" false
validate_env_var "SERPER_API_KEY" "Serper API Key" false

# Authentication
validate_env_var "NEXTAUTH_SECRET" "NextAuth Secret"
validate_env_var "NEXTAUTH_URL" "NextAuth URL"

# Email configuration
validate_env_var "SMTP_HOST" "SMTP Host" false
validate_env_var "SMTP_PORT" "SMTP Port" false
validate_env_var "SMTP_USER" "SMTP User" false
validate_env_var "SMTP_PASSWORD" "SMTP Password" false
validate_env_var "SMTP_FROM" "SMTP From Address" false

# Analytics
validate_env_var "NEXT_PUBLIC_GA_ID" "Google Analytics ID" false
validate_env_var "NEXT_PUBLIC_PLAUSIBLE_DOMAIN" "Plausible Domain" false

echo ""
echo "🌐 Validating external services..."

# Validate Supabase connection
if vercel env ls production | grep -q "NEXT_PUBLIC_SUPABASE_URL"; then
    SUPABASE_URL=$(vercel env pull --environment=production --yes .env.production 2>/dev/null && grep "NEXT_PUBLIC_SUPABASE_URL" .env.production | cut -d'=' -f2 | tr -d '"' || echo "")
    if [ ! -z "$SUPABASE_URL" ]; then
        validate_url "$SUPABASE_URL/rest/v1/" "Supabase API"
    fi
fi

# Validate Stripe webhook endpoint
validate_url "https://vibecodingbible.agentland.saarland/api/stripe/webhooks" "Stripe Webhook Endpoint"

echo ""
echo "🔧 Validating project configuration..."

# Check vercel.json
if [ -f "vercel.json" ]; then
    print_success "vercel.json exists"
    ((PASSED++))
    
    # Validate vercel.json syntax
    if jq . vercel.json > /dev/null 2>&1; then
        print_success "vercel.json syntax valid"
        ((PASSED++))
    else
        print_error "vercel.json syntax invalid"
        ((FAILED++))
    fi
else
    print_error "vercel.json missing"
    ((FAILED++))
fi

# Check next.config.js
if [ -f "next.config.js" ]; then
    print_success "next.config.js exists"
    ((PASSED++))
else
    print_error "next.config.js missing"
    ((FAILED++))
fi

# Check package.json
if [ -f "package.json" ]; then
    print_success "package.json exists"
    ((PASSED++))
    
    # Check required scripts
    if jq '.scripts.build' package.json > /dev/null 2>&1; then
        print_success "Build script configured"
        ((PASSED++))
    else
        print_error "Build script missing"
        ((FAILED++))
    fi
    
    if jq '.scripts.start' package.json > /dev/null 2>&1; then
        print_success "Start script configured"
        ((PASSED++))
    else
        print_error "Start script missing"
        ((FAILED++))
    fi
else
    print_error "package.json missing"
    ((FAILED++))
fi

echo ""
echo "🔒 Validating security configuration..."

# Check for sensitive data in code
if grep -r "sk_live_" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" app/ lib/ components/ 2>/dev/null; then
    print_error "Stripe secret key found in code - SECURITY RISK"
    ((FAILED++))
else
    print_success "No hardcoded Stripe secrets found"
    ((PASSED++))
fi

if grep -r "whsec_" --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" app/ lib/ components/ 2>/dev/null; then
    print_error "Webhook secret found in code - SECURITY RISK"
    ((FAILED++))
else
    print_success "No hardcoded webhook secrets found"
    ((PASSED++))
fi

# Check for .env files in git
if git check-ignore .env.local .env.production 2>/dev/null; then
    print_success "Environment files properly ignored by git"
    ((PASSED++))
else
    print_warning "Environment files might not be ignored by git"
    ((WARNINGS++))
fi

echo ""
echo "📊 Validation Summary:"
echo "==============================="
print_success "Passed: $PASSED"
if [ $WARNINGS -gt 0 ]; then
    print_warning "Warnings: $WARNINGS"
fi
if [ $FAILED -gt 0 ]; then
    print_error "Failed: $FAILED"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    print_success "✅ Environment validation PASSED!"
    echo ""
    echo "🚀 Ready for production deployment!"
    echo "   Run: ./scripts/deploy-production.sh"
    exit 0
else
    print_error "❌ Environment validation FAILED!"
    echo ""
    echo "🔧 Please fix the following issues before deployment:"
    echo "1. Add missing required environment variables"
    echo "2. Fix any configuration errors"
    echo "3. Re-run validation: ./scripts/validate-production-env.sh"
    echo ""
    echo "💡 Need help? Check:"
    echo "   - ./scripts/setup-production-env.sh"
    echo "   - ./scripts/setup-stripe-webhooks.sh"
    echo "   - Vercel dashboard: https://vercel.com/dashboard"
    exit 1
fi