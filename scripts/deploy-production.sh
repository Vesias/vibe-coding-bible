#!/bin/bash

# Production Deployment Script for Vibe Coding Bible
# Handles pre-deployment checks, build optimization, and deployment automation

set -e

echo "🚀 Starting production deployment for Vibe Coding Bible..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    print_error "Not in project root directory. Please run from project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm not found. Install with: npm i -g pnpm"
    exit 1
fi

print_status "Pre-deployment checks passed"

# Git checks
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them first."
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile
print_status "Dependencies installed"

# Run type checking
echo "🔍 Running type checks..."
if ! pnpm run type-check; then
    print_error "Type checking failed. Please fix type errors before deploying."
    exit 1
fi
print_status "Type checking passed"

# Run linting
echo "🧹 Running linter..."
if ! pnpm run lint; then
    print_error "Linting failed. Please fix linting errors before deploying."
    exit 1
fi
print_status "Linting passed"

# Test build locally
echo "🏗️  Testing local build..."
if ! pnpm run build; then
    print_error "Local build failed. Please fix build errors before deploying."
    exit 1
fi
print_status "Local build successful"

# Clean up build artifacts
echo "🧹 Cleaning up build artifacts..."
rm -rf .next
print_status "Build artifacts cleaned"

# Check environment variables
echo "🔐 Checking environment variables..."
if ! vercel env ls --scope production &> /dev/null; then
    print_error "Failed to access Vercel environment variables. Please login: vercel login"
    exit 1
fi
print_status "Environment variables accessible"

# Deployment confirmation
echo ""
echo "🚀 Ready to deploy to production!"
echo "   Domain: https://vibecodingbible.agentland.saarland"
echo "   Branch: $CURRENT_BRANCH"
echo ""
read -p "Proceed with deployment? (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Deploy to production
echo "🚀 Deploying to production..."
if vercel --prod --yes; then
    print_status "Deployment successful!"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls --scope production | grep "vibecodingbible" | head -1 | awk '{print $2}')
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Production URL: https://vibecodingbible.agentland.saarland"
    echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
    
    # Optional: Run post-deployment checks
    echo "🔍 Running post-deployment checks..."
    
    # Check if site is accessible
    if curl -s -o /dev/null -w "%{http_code}" "https://vibecodingbible.agentland.saarland" | grep -q "200"; then
        print_status "Site is accessible"
    else
        print_warning "Site might not be accessible yet. Please check manually."
    fi
    
    # Check critical API endpoints
    echo "🔍 Testing critical API endpoints..."
    
    # Health check
    if curl -s -o /dev/null -w "%{http_code}" "https://vibecodingbible.agentland.saarland/api/health" | grep -q "200"; then
        print_status "Health endpoint working"
    else
        print_warning "Health endpoint not responding"
    fi
    
    echo ""
    print_status "Post-deployment checks completed"
    
    # Show next steps
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the live site: https://vibecodingbible.agentland.saarland"
    echo "2. Update Stripe webhooks if needed: ./scripts/setup-stripe-webhooks.sh"
    echo "3. Monitor logs: vercel logs"
    echo "4. Check analytics and performance metrics"
    echo ""
    
else
    print_error "Deployment failed!"
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Check Vercel logs: vercel logs"
    echo "2. Verify environment variables: vercel env ls"
    echo "3. Test local build: pnpm run build"
    echo "4. Check Vercel status: https://vercel.com/status"
    exit 1
fi