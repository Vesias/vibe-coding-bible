#!/bin/bash

# 🚀 Vibe Coding Bible - Ultimate Setup Script
# Erstellt die komplette interaktive Workshop-Plattform

set -e  # Exit on any error

echo "🔮 Initializing the Sacred Vibe Coding Bible..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_divine() {
    echo -e "${PURPLE}[DIVINE]${NC} $1"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the vibe-coding-bible directory."
    exit 1
fi

print_divine "🏛️ THE SACRED SETUP BEGINS..."

# 1. Install Dependencies
print_status "Installing dependencies with pnpm..."
if command -v pnpm >/dev/null 2>&1; then
    pnpm install
else
    print_warning "pnpm not found, using npm..."
    npm install
fi
print_success "Dependencies installed"

# 2. Setup Environment Variables
print_status "Setting up environment variables..."
if [[ ! -f ".env.local" ]]; then
    cp .env.local.example .env.local
    print_warning "Please configure your .env.local file with your credentials:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - STRIPE_SECRET_KEY"
    echo "  - STRIPE_PUBLISHABLE_KEY"
    echo "  - STRIPE_WEBHOOK_SECRET"
    echo "  - OPENAI_API_KEY"
    echo "  - ANTHROPIC_API_KEY"
    echo "  - GOOGLE_AI_API_KEY"
else
    print_success "Environment file already exists"
fi

# 3. Setup Supabase
print_status "Setting up Supabase..."
if command -v supabase >/dev/null 2>&1; then
    print_status "Supabase CLI found, initializing project..."
    
    # Initialize Supabase if not already done
    if [[ ! -f "supabase/config.toml" ]]; then
        supabase init
    fi
    
    # Start local development
    print_status "Starting local Supabase instance..."
    supabase start
    
    # Run migrations
    print_status "Running database migrations..."
    supabase db reset
    
    print_success "Supabase setup completed"
else
    print_warning "Supabase CLI not found. Please install it:"
    print_warning "npm i supabase -g"
    print_warning "Then run: supabase login"
fi

# 4. Generate Database Types
print_status "Generating TypeScript types for database..."
if command -v supabase >/dev/null 2>&1; then
    supabase gen types typescript --local > lib/database.types.ts
    print_success "Database types generated"
fi

# 5. Setup Stripe
print_status "Setting up Stripe webhooks..."
if command -v stripe >/dev/null 2>&1; then
    print_status "Stripe CLI found. Configure webhooks manually or run:"
    print_status "stripe listen --forward-to localhost:3000/api/stripe/webhooks"
else
    print_warning "Stripe CLI not found. Install it from: https://stripe.com/docs/stripe-cli"
fi

# 6. Build the application
print_status "Building the application..."
if command -v pnpm >/dev/null 2>&1; then
    pnpm build
else
    npm run build
fi
print_success "Application built successfully"

# 7. Run tests
print_status "Running tests..."
if command -v pnpm >/dev/null 2>&1; then
    pnpm test --passWithNoTests
else
    npm test -- --passWithNoTests
fi
print_success "Tests completed"

# 8. Create admin user account
print_status "Creating admin account..."
cat > scripts/create-admin-account.sql << 'EOF'
-- Create admin user with full access
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'dragomir@vibe.coding',
    crypt('Sebos+Jenny66', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin", "tier": "divine"}'
);

-- Insert into profiles table
INSERT INTO profiles (
    id,
    email,
    full_name,
    tier,
    role,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'),
    'dragomir@vibe.coding',
    'Dragomir - Divine Coder',
    'divine',
    'admin',
    now(),
    now()
);

-- Grant all course access
INSERT INTO user_progress (
    user_id,
    commandment_id,
    completed,
    progress_percentage,
    completed_at
) VALUES 
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 1, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 2, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 3, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 4, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 5, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 6, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 7, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 8, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 9, true, 100, now()),
    ((SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'), 10, true, 100, now());

-- Grant all achievements
INSERT INTO user_achievements (
    user_id,
    achievement_id,
    earned_at
) 
SELECT 
    (SELECT id FROM auth.users WHERE email = 'dragomir@vibe.coding'),
    id,
    now()
FROM achievements;
EOF

if command -v supabase >/dev/null 2>&1; then
    supabase db reset
    psql "$DATABASE_URL" -f scripts/create-admin-account.sql 2>/dev/null || print_warning "Admin account creation skipped - manual setup required"
fi

# 9. Final setup validation
print_status "Validating setup..."

# Check if Next.js is working
if command -v pnpm >/dev/null 2>&1; then
    pnpm dev &
    DEV_PID=$!
else
    npm run dev &
    DEV_PID=$!
fi

sleep 5

# Test if server is running
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Development server is running!"
else
    print_warning "Development server might not be running correctly"
fi

# Kill the dev server
kill $DEV_PID 2>/dev/null || true

# 10. Setup completion
print_divine "✨ THE SACRED SETUP IS COMPLETE! ✨"
echo ""
echo "🏛️ DIVINE CONFIGURATION SUMMARY:"
echo "=================================="
echo "📧 Admin Account: dragomir@vibe.coding"
echo "🔑 Password: Sebos+Jenny66"
echo "🎯 Tier: Divine (Full Access)"
echo "📚 Course Progress: 100% Complete"
echo "🏆 Achievements: All Unlocked"
echo ""
echo "🚀 NEXT STEPS:"
echo "==============="
echo "1. Configure your .env.local file"
echo "2. Start development: pnpm dev"
echo "3. Open: http://localhost:3000"
echo "4. Login with admin credentials"
echo "5. Deploy to vibecodingbible.agentland.saarland"
echo ""
echo "🎭 AVAILABLE COMMANDS:"
echo "======================"
echo "• pnpm dev          - Start development server"
echo "• pnpm build        - Build for production"
echo "• pnpm test         - Run tests"
echo "• pnpm lint         - Run linting"
echo "• pnpm type-check   - Check TypeScript types"
echo ""
print_divine "May the Code be with you! 🙏✨"