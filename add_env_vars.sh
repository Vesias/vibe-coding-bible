#\!/bin/bash

# Add all required environment variables for vibecodingbible.agentland.saarland

echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://hpguscbanxnzufjduiws.supabase.co"  < /dev/null |  vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Adding NEXT_PUBLIC_SITE_URL..."
echo "https://vibecodingbible.agentland.saarland" | vercel env add NEXT_PUBLIC_SITE_URL production

echo "Adding NEXT_PUBLIC_SITE_NAME..."
echo "VibeCoding Bible by Agentland" | vercel env add NEXT_PUBLIC_SITE_NAME production

echo "Environment variables added successfully!"
