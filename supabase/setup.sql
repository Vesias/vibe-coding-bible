-- ✨ Complete Setup Script for Vibe Coding Bible Database
-- Run this file to set up the entire database from scratch
-- Execute in Supabase SQL Editor or via psql

-- This script safely applies all migrations and sets up the database

BEGIN;

-- ===================================
-- 📋 PRE-SETUP CHECKS
-- ===================================

DO $$
BEGIN
    RAISE NOTICE '🚀 Starting Vibe Coding Bible Database Setup...';
    RAISE NOTICE '📅 Timestamp: %', NOW();
    RAISE NOTICE '🏗️  Setting up comprehensive schema for interactive learning platform';
    RAISE NOTICE '';
END $$;

-- Check if we're starting fresh or updating
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'commandments', 'achievements');
    
    IF table_count > 0 THEN
        RAISE NOTICE '⚠️  Existing tables detected. This will update existing schema.';
    ELSE
        RAISE NOTICE '✨ Fresh database detected. Creating complete schema.';
    END IF;
END $$;

-- ===================================
-- 🗃️ APPLY COMPREHENSIVE SCHEMA
-- ===================================

-- The comprehensive schema includes everything needed:
-- - Enhanced user management with XP/levels/streaks
-- - 10 Sacred Commandments with rich content
-- - Interactive challenges and submissions
-- - AI integration with usage tracking
-- - Subscription management with Stripe
-- - Gamification with achievements and leaderboards
-- - Real-time collaboration features
-- - Community and social features
-- - Analytics and progress tracking
-- - Security with RLS policies

\i migrations/002_comprehensive_schema.sql

-- ===================================
-- 🌱 LOAD SEED DATA
-- ===================================

-- Seed data includes:
-- - All 10 commandments with complete content
-- - 4-tier subscription plans (Free to Divine)
-- - 20+ achievement badges
-- - Sample workshop modules and challenges
-- - Platform analytics starter data

\i migrations/003_seed_data.sql

-- ===================================
-- ⚡ ADD UTILITY FUNCTIONS
-- ===================================

-- Utilities include:
-- - Materialized views for performance
-- - Helper functions for business logic
-- - Analytics and engagement scoring
-- - Maintenance functions

\i migrations/004_utility_functions_views.sql

-- ===================================
-- 🔧 POST-SETUP CONFIGURATION
-- ===================================

-- Enable real-time subscriptions for key tables
DO $$
BEGIN
    -- Collaboration features
    PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'collaboration_sessions';
    IF NOT FOUND THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
        RAISE NOTICE '✅ Enabled real-time for collaboration_sessions';
    END IF;
    
    PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'collaboration_participants';
    IF NOT FOUND THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_participants;
        RAISE NOTICE '✅ Enabled real-time for collaboration_participants';
    END IF;
    
    -- Community features
    PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_posts';
    IF NOT FOUND THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
        RAISE NOTICE '✅ Enabled real-time for community_posts';
    END IF;
    
    -- Achievement notifications
    PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_achievements';
    IF NOT FOUND THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_achievements;
        RAISE NOTICE '✅ Enabled real-time for user_achievements';
    END IF;
    
    -- Notifications
    PERFORM 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';
    IF NOT FOUND THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
        RAISE NOTICE '✅ Enabled real-time for notifications';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Could not enable real-time subscriptions (this is OK in local development)';
END $$;

-- Refresh materialized views for immediate use
SELECT refresh_dashboard_views();
RAISE NOTICE '✅ Refreshed materialized views';

-- ===================================
-- 📊 SETUP VERIFICATION
-- ===================================

DO $$
DECLARE
    commandment_count INTEGER;
    achievement_count INTEGER;
    plan_count INTEGER;
    user_count INTEGER;
BEGIN
    -- Verify core data was loaded
    SELECT COUNT(*) INTO commandment_count FROM commandments;
    SELECT COUNT(*) INTO achievement_count FROM achievements;
    SELECT COUNT(*) INTO plan_count FROM subscription_plans;
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    RAISE NOTICE '';
    RAISE NOTICE '🔍 SETUP VERIFICATION:';
    RAISE NOTICE '📚 Commandments loaded: %', commandment_count;
    RAISE NOTICE '🏆 Achievements created: %', achievement_count;
    RAISE NOTICE '💰 Subscription plans: %', plan_count;
    RAISE NOTICE '👤 User profiles: %', user_count;
    
    IF commandment_count = 10 AND achievement_count >= 15 AND plan_count = 4 THEN
        RAISE NOTICE '✅ All core data loaded successfully!';
    ELSE
        RAISE NOTICE '⚠️  Some data may be missing. Check migration logs.';
    END IF;
END $$;

-- ===================================
-- 🛡️ SECURITY VERIFICATION
-- ===================================

DO $$
DECLARE
    rls_enabled_count INTEGER;
    total_user_tables INTEGER;
BEGIN
    -- Check RLS is enabled on user data tables
    SELECT COUNT(*) INTO rls_enabled_count
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
    AND c.relrowsecurity = true
    AND c.relname IN ('profiles', 'user_progress', 'challenge_submissions', 
                      'user_achievements', 'ai_interactions', 'subscriptions');
    
    total_user_tables := 6; -- Expected number of user data tables with RLS
    
    RAISE NOTICE '';
    RAISE NOTICE '🛡️  SECURITY VERIFICATION:';
    RAISE NOTICE '🔐 Tables with RLS enabled: % / %', rls_enabled_count, total_user_tables;
    
    IF rls_enabled_count = total_user_tables THEN
        RAISE NOTICE '✅ Row Level Security properly configured!';
    ELSE
        RAISE NOTICE '⚠️  Some tables may not have RLS enabled. Check security settings.';
    END IF;
END $$;

-- ===================================
-- 📝 NEXT STEPS GUIDANCE
-- ===================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 SETUP COMPLETE! Next steps:';
    RAISE NOTICE '';
    RAISE NOTICE '1. 🔗 FRONTEND INTEGRATION:';
    RAISE NOTICE '   - Update database.types.ts with new schema';
    RAISE NOTICE '   - Test authentication with profiles table';
    RAISE NOTICE '   - Implement subscription tier checking';
    RAISE NOTICE '';
    RAISE NOTICE '2. 💳 STRIPE SETUP:';
    RAISE NOTICE '   - Create products in Stripe Dashboard';
    RAISE NOTICE '   - Update subscription_plans with Stripe price IDs';
    RAISE NOTICE '   - Set up webhook endpoints for subscription events';
    RAISE NOTICE '';
    RAISE NOTICE '3. 🤖 AI INTEGRATION:';
    RAISE NOTICE '   - Configure AI model API keys';
    RAISE NOTICE '   - Test AI usage tracking functions';
    RAISE NOTICE '   - Set up AI personality prompts';
    RAISE NOTICE '';
    RAISE NOTICE '4. 🔄 MAINTENANCE:';
    RAISE NOTICE '   - Set up daily_maintenance() cron job';
    RAISE NOTICE '   - Configure monitoring for materialized views';
    RAISE NOTICE '   - Test backup and restore procedures';
    RAISE NOTICE '';
    RAISE NOTICE '5. 🧪 TESTING:';
    RAISE NOTICE '   - Create test users for each subscription tier';
    RAISE NOTICE '   - Test challenge submission flow';
    RAISE NOTICE '   - Verify achievement awarding system';
    RAISE NOTICE '   - Test collaboration features';
    RAISE NOTICE '';
    RAISE NOTICE '📖 Full documentation: supabase/README.md';
    RAISE NOTICE '';
    RAISE NOTICE 'May your code be bug-free and your users engaged! ✨🙏';
END $$;

COMMIT;

-- ===================================
-- 🔧 OPTIONAL: CREATE SAMPLE TEST USER
-- ===================================

-- Uncomment the following block to create a test user
-- (requires a valid auth.users entry first)

/*
-- Create test user profile (replace with actual auth user ID)
INSERT INTO profiles (
    id, email, full_name, username, subscription_status, prophet_rank,
    total_xp, current_level, github_username, is_public
) VALUES (
    'sample-user-uuid-here', -- Replace with actual auth.users.id
    'test@vibecoding.com',
    'Test Prophet',
    'testprophet',
    'apostle',
    'practitioner', 
    1250,
    5,
    'testprophet',
    true
) ON CONFLICT (id) DO NOTHING;

-- Give test user some progress
INSERT INTO user_progress (
    user_id, commandment_id, status, progress_percentage, xp_earned
) VALUES 
    ('sample-user-uuid-here', 1, 'completed', 100, 200),
    ('sample-user-uuid-here', 2, 'completed', 100, 300),
    ('sample-user-uuid-here', 3, 'in_progress', 60, 150)
ON CONFLICT (user_id, commandment_id) DO NOTHING;

-- Award some achievements
INSERT INTO user_achievements (
    user_id, achievement_id, is_completed, earned_at
)
SELECT 
    'sample-user-uuid-here',
    a.id,
    true,
    NOW() - INTERVAL '1 day'
FROM achievements a 
WHERE a.name IN ('First Steps', 'Vision Seeker', 'Week Warrior')
ON CONFLICT (user_id, achievement_id) DO NOTHING;

RAISE NOTICE '👤 Test user created with sample progress!';
*/