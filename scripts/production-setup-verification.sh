#!/bin/bash

# Production Setup Verification Script for Vibe Coding Bible
# This script verifies that all required components are properly configured

echo "🚀 Vibe Coding Bible - Production Setup Verification"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall status
OVERALL_STATUS=0

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        OVERALL_STATUS=1
    fi
}

# Function to check warning
check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to show info
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo "📋 Checking Environment Configuration..."

# Check .env.local file
if [ -f ".env.local" ]; then
    check_status 0 "Environment file (.env.local) exists"
    
    # Check required environment variables
    source .env.local 2>/dev/null || true
    
    if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        check_status 0 "NEXT_PUBLIC_SUPABASE_URL is set"
        show_info "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
    else
        check_status 1 "NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    
    if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        check_status 0 "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        check_status 1 "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    fi
    
    if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        check_status 0 "SUPABASE_SERVICE_ROLE_KEY is set"
    else
        check_warning "SUPABASE_SERVICE_ROLE_KEY is missing (needed for admin operations)"
    fi
    
    if [ -n "$NEXT_PUBLIC_SITE_URL" ]; then
        check_status 0 "NEXT_PUBLIC_SITE_URL is set"
        show_info "Site URL: $NEXT_PUBLIC_SITE_URL"
    else
        check_status 1 "NEXT_PUBLIC_SITE_URL is missing"
    fi
    
else
    check_status 1 "Environment file (.env.local) not found"
fi

echo ""
echo "📦 Checking Dependencies..."

# Check if package.json exists
if [ -f "package.json" ]; then
    check_status 0 "package.json exists"
else
    check_status 1 "package.json not found"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_status 0 "Dependencies installed (node_modules exists)"
else
    check_status 1 "Dependencies not installed - run 'pnpm install'"
fi

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    check_status 0 "pnpm is available"
else
    check_warning "pnpm not found - using npm as fallback"
fi

echo ""
echo "🗄️ Checking Database Setup..."

# Check if migration files exist
if [ -d "supabase/migrations" ]; then
    check_status 0 "Migration files directory exists"
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    show_info "Found $MIGRATION_COUNT migration files"
else
    check_status 1 "Migration files directory not found"
fi

# Check if basic schema file exists
if [ -f "scripts/create-basic-schema.sql" ]; then
    check_status 0 "Basic schema file exists"
else
    check_status 1 "Basic schema file not found"
fi

echo ""
echo "🔧 Testing Application..."

# Try to build the application
echo "Building application..."
if command -v pnpm &> /dev/null; then
    BUILD_OUTPUT=$(pnpm run build 2>&1)
else
    BUILD_OUTPUT=$(npm run build 2>&1)
fi

if [ $? -eq 0 ]; then
    check_status 0 "Application builds successfully"
else
    check_status 1 "Application build failed"
    echo "Build output:"
    echo "$BUILD_OUTPUT" | tail -10
fi

echo ""
echo "🌐 Testing Database Connection..."

# Start dev server temporarily for testing
echo "Starting temporary server for testing..."
if command -v pnpm &> /dev/null; then
    timeout 20s pnpm run dev > /tmp/server.log 2>&1 &
else
    timeout 20s npm run dev > /tmp/server.log 2>&1 &
fi

SERVER_PID=$!
sleep 8

# Test database connection
DB_TEST_RESULT=$(curl -s http://localhost:5000/api/test-db 2>/dev/null || echo '{"status":"error","message":"Server not responding"}')
DB_STATUS=$(echo "$DB_TEST_RESULT" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

case "$DB_STATUS" in
    "success")
        check_status 0 "Database connection successful"
        ;;
    "setup_required")
        check_warning "Database tables not found - migration required"
        show_info "Run the database migration in Supabase dashboard"
        ;;
    "error")
        check_status 1 "Database connection failed"
        show_info "Check Supabase configuration and credentials"
        ;;
    *)
        check_status 1 "Unable to test database connection"
        show_info "Server may not be responding on port 5000"
        ;;
esac

# Clean up server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo ""
echo "📋 Summary and Next Steps..."

if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical checks passed!${NC}"
    echo ""
    echo "✅ Your Vibe Coding Bible setup is ready for production!"
    echo ""
    echo "Next steps:"
    echo "1. 🗄️  Run database migration if tables are not set up"
    echo "2. 🚀 Deploy to your hosting platform (Vercel, Netlify, etc.)"
    echo "3. 🔧 Configure production environment variables"
    echo "4. 🧪 Test the live application"
    
else
    echo -e "${RED}❌ Some issues need to be resolved before production deployment.${NC}"
    echo ""
    echo "Required actions:"
    echo "1. 🔧 Fix the failed checks listed above"
    echo "2. 🗄️  Set up the database schema in Supabase"
    echo "3. ⚙️  Configure missing environment variables"
    echo "4. 📦 Install missing dependencies"
fi

echo ""
echo "📚 Documentation:"
echo "- Database Setup: ./DATABASE_SETUP.md"
echo "- Production Guide: ./PRODUCTION_DEPLOYMENT_GUIDE.md"
echo "- Supabase Dashboard: https://supabase.com/dashboard"

echo ""
echo "🆘 Need help? Check the documentation or contact support."

exit $OVERALL_STATUS