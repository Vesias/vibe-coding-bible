# Vibe Coding Bible - Database Setup Guide

This guide will help you set up the Supabase database for the Vibe Coding Bible platform.

## Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- Access to the Supabase project dashboard
- The database URL and keys configured in your `.env.local` file

## Current Configuration

Your environment is configured with:
- **Supabase URL**: `https://hpguscbanxnzufjduiws.supabase.co`
- **Database**: Shared with Agentland project
- **Environment**: Development/Production ready

## Setup Steps

### 1. Access Supabase Dashboard

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select the project: `hpguscbanxnzufjduiws`

### 2. Run Database Migration

#### Method A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, navigate to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `scripts/create-basic-schema.sql`
4. Click **Run** to execute the migration

#### Method B: Using Migration Files

Run each migration file in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_comprehensive_schema.sql`
3. `supabase/migrations/003_seed_data.sql`
4. `supabase/migrations/004_utility_functions_views.sql`
5. `supabase/migrations/005_referral_system.sql`

### 3. Verify Setup

After running the migration, verify your setup by:

1. **Check Tables**: In Supabase dashboard → Table Editor, you should see:
   - `profiles`
   - `workshops`
   - `user_progress`
   - `sessions`

2. **Test API**: Visit `/api/test-db` in your app to check connectivity

3. **Test Authentication**: Try registering a new user to ensure the auth flow works

## Table Structure Overview

### Core Tables Created

- **profiles**: User profiles (extends auth.users)
- **workshops**: The 10 sacred commandments/workshops
- **user_progress**: User progress through workshops
- **sessions**: Collaboration sessions
- **user_achievements**: Gamification system
- **ai_interactions**: AI mentoring tracking

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Authentication policies** ensuring users can only access their own data
- **Automatic profile creation** when users sign up

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**
   - Solution: Run the database migration as described above

2. **Authentication not working**
   - Check that the `profiles` table exists
   - Verify the trigger for automatic profile creation is set up

3. **Permission denied errors**
   - Ensure RLS policies are correctly configured
   - Check that you're using the correct API keys

### Getting Help

If you encounter issues:

1. Check the browser console for detailed error messages
2. Look at the Supabase dashboard logs
3. Verify your environment variables in `.env.local`

## Database Schema Files

- `scripts/create-basic-schema.sql` - Basic setup for immediate functionality
- `supabase/migrations/002_comprehensive_schema.sql` - Full featured schema
- `scripts/test-supabase-connection.js` - Connection testing utility

## Next Steps

After successful database setup:

1. **Test Authentication**: Try signing up and signing in
2. **Explore Workshops**: Navigate to `/workshops` to see the content
3. **Check Dashboard**: Visit `/dashboard` to see user-specific features
4. **Test API**: Use `/api/test-db` to verify all connections

---

*This database supports the full Vibe Coding Bible experience including user management, workshop progress tracking, AI interactions, and community features.*