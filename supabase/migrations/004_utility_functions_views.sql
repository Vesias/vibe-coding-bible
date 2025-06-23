-- ✨ Utility Functions & Views für die Heilige Datenbank
-- Sacred Database Utilities und Performance Views
-- Migration 004: Helper Functions and Materialized Views

-- ===================================
-- 🔍 MATERIALIZED VIEWS FOR PERFORMANCE
-- ===================================

-- User dashboard summary view
CREATE MATERIALIZED VIEW user_dashboard_summary AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.subscription_status,
    p.prophet_rank,
    p.total_xp,
    p.current_level,
    p.streak_days,
    
    -- Progress statistics
    COUNT(DISTINCT up.commandment_id) FILTER (WHERE up.status = 'completed') as commandments_completed,
    COUNT(DISTINCT up.commandment_id) FILTER (WHERE up.status = 'in_progress') as commandments_in_progress,
    COUNT(DISTINCT cs.challenge_id) FILTER (WHERE cs.is_best_attempt = true AND cs.is_correct = true) as challenges_completed,
    
    -- Achievement statistics
    COUNT(DISTINCT ua.achievement_id) FILTER (WHERE ua.is_completed = true) as achievements_earned,
    COUNT(DISTINCT a.id) FILTER (WHERE a.rarity = 'legendary' AND ua.is_completed = true) as legendary_achievements,
    
    -- Recent activity
    MAX(up.last_accessed) as last_learning_activity,
    MAX(cs.submitted_at) as last_challenge_submission,
    MAX(ai.created_at) as last_ai_interaction,
    
    -- Social statistics
    COUNT(DISTINCT m1.id) as mentoring_sessions_as_mentor,
    COUNT(DISTINCT m2.id) as mentoring_sessions_as_mentee,
    COUNT(DISTINCT cp.id) as community_posts_created,
    
    -- Learning velocity (XP per week over last 4 weeks)
    COALESCE(
        (SELECT SUM(ua_recent.xp_earned) 
         FROM user_analytics ua_recent 
         WHERE ua_recent.user_id = p.id 
         AND ua_recent.date >= CURRENT_DATE - INTERVAL '28 days') / 4.0, 
        0
    ) as weekly_xp_velocity

FROM profiles p
LEFT JOIN user_progress up ON p.id = up.user_id
LEFT JOIN challenge_submissions cs ON p.id = cs.user_id
LEFT JOIN user_achievements ua ON p.id = ua.user_id
LEFT JOIN achievements a ON ua.achievement_id = a.id
LEFT JOIN mentorships m1 ON p.id = m1.mentor_id
LEFT JOIN mentorships m2 ON p.id = m2.mentee_id  
LEFT JOIN community_posts cp ON p.id = cp.user_id
GROUP BY p.id, p.full_name, p.username, p.avatar_url, p.subscription_status, 
         p.prophet_rank, p.total_xp, p.current_level, p.streak_days;

-- Create index for performance
CREATE UNIQUE INDEX idx_user_dashboard_summary_user_id ON user_dashboard_summary(user_id);

-- Leaderboard materialized view
CREATE MATERIALIZED VIEW leaderboard_summary AS
WITH user_rankings AS (
    SELECT 
        p.id as user_id,
        p.username,
        p.full_name,
        p.avatar_url,
        p.total_xp,
        p.current_level,
        p.prophet_rank,
        p.subscription_status,
        
        -- Calculate various scores
        p.total_xp as overall_score,
        COUNT(DISTINCT ua.achievement_id) FILTER (WHERE ua.is_completed = true) as achievement_count,
        COUNT(DISTINCT cs.challenge_id) FILTER (WHERE cs.is_best_attempt = true AND cs.is_correct = true) as challenges_completed,
        AVG(cs.score) FILTER (WHERE cs.is_best_attempt = true) as avg_challenge_score,
        
        -- Weekly activity score
        COALESCE(
            (SELECT SUM(ua_week.xp_earned) 
             FROM user_analytics ua_week 
             WHERE ua_week.user_id = p.id 
             AND ua_week.date >= CURRENT_DATE - INTERVAL '7 days'), 
            0
        ) as weekly_xp,
        
        -- Monthly activity score  
        COALESCE(
            (SELECT SUM(ua_month.xp_earned) 
             FROM user_analytics ua_month 
             WHERE ua_month.user_id = p.id 
             AND ua_month.date >= CURRENT_DATE - INTERVAL '30 days'), 
            0
        ) as monthly_xp
        
    FROM profiles p
    LEFT JOIN user_achievements ua ON p.id = ua.user_id
    LEFT JOIN challenge_submissions cs ON p.id = cs.user_id
    GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.total_xp, 
             p.current_level, p.prophet_rank, p.subscription_status
)
SELECT 
    user_id,
    username,
    full_name,
    avatar_url,
    total_xp,
    current_level,
    prophet_rank,
    subscription_status,
    achievement_count,
    challenges_completed,
    ROUND(avg_challenge_score, 2) as avg_challenge_score,
    weekly_xp,
    monthly_xp,
    
    -- Rankings
    RANK() OVER (ORDER BY overall_score DESC) as overall_rank,
    RANK() OVER (ORDER BY weekly_xp DESC) as weekly_rank,
    RANK() OVER (ORDER BY monthly_xp DESC) as monthly_rank,
    RANK() OVER (ORDER BY achievement_count DESC) as achievement_rank,
    RANK() OVER (ORDER BY challenges_completed DESC) as challenge_rank,
    
    -- Percentiles
    ROUND(PERCENT_RANK() OVER (ORDER BY overall_score) * 100, 1) as overall_percentile,
    ROUND(PERCENT_RANK() OVER (ORDER BY weekly_xp) * 100, 1) as weekly_percentile
    
FROM user_rankings
WHERE total_xp > 0;  -- Only include users with some activity

CREATE UNIQUE INDEX idx_leaderboard_summary_user_id ON leaderboard_summary(user_id);
CREATE INDEX idx_leaderboard_summary_overall_rank ON leaderboard_summary(overall_rank);
CREATE INDEX idx_leaderboard_summary_weekly_rank ON leaderboard_summary(weekly_rank);

-- ===================================
-- 🔧 UTILITY FUNCTIONS
-- ===================================

-- Function to get user's current subscription features
CREATE OR REPLACE FUNCTION get_user_subscription_features(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    user_subscription subscription_status;
    plan_features JSONB;
BEGIN
    -- Get user's current subscription status
    SELECT subscription_status INTO user_subscription
    FROM profiles WHERE id = user_uuid;
    
    -- Get plan features
    SELECT features INTO plan_features
    FROM subscription_plans 
    WHERE tier = user_subscription AND is_active = true;
    
    RETURN COALESCE(plan_features, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check AI usage limits
CREATE OR REPLACE FUNCTION check_ai_usage_limit(user_uuid UUID)
RETURNS TABLE(
    within_limit BOOLEAN,
    current_usage INTEGER,
    usage_limit INTEGER,
    reset_date DATE
) AS $$
DECLARE
    user_tier subscription_status;
    monthly_limit INTEGER;
    current_month_usage INTEGER;
BEGIN
    -- Get user subscription tier
    SELECT subscription_status INTO user_tier
    FROM profiles WHERE id = user_uuid;
    
    -- Get usage limit for tier
    SELECT (features->>'ai_interaction_limit')::INTEGER INTO monthly_limit
    FROM subscription_plans 
    WHERE tier = user_tier AND is_active = true;
    
    -- Handle unlimited (-1) case
    IF monthly_limit = -1 THEN
        RETURN QUERY SELECT true, 0, -1, (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE;
        RETURN;
    END IF;
    
    -- Get current month usage
    SELECT COALESCE(total_interactions, 0) INTO current_month_usage
    FROM ai_usage_tracking
    WHERE user_id = user_uuid 
    AND period_type = 'monthly'
    AND period_start = DATE_TRUNC('month', CURRENT_DATE)::DATE;
    
    -- Return results
    RETURN QUERY SELECT 
        (current_month_usage < monthly_limit),
        current_month_usage,
        monthly_limit,
        (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's learning recommendations
CREATE OR REPLACE FUNCTION get_learning_recommendations(user_uuid UUID)
RETURNS TABLE(
    recommendation_type TEXT,
    content_id TEXT,
    content_title TEXT,
    reason TEXT,
    priority INTEGER
) AS $$
DECLARE
    user_level INTEGER;
    user_tier subscription_status;
    completed_commandments INTEGER[];
BEGIN
    -- Get user info
    SELECT current_level, subscription_status INTO user_level, user_tier
    FROM profiles WHERE id = user_uuid;
    
    -- Get completed commandments
    SELECT ARRAY_AGG(commandment_id) INTO completed_commandments
    FROM user_progress 
    WHERE user_id = user_uuid AND status = 'completed';
    
    -- Recommend next commandment
    RETURN QUERY
    SELECT 
        'next_commandment'::TEXT,
        c.id::TEXT,
        c.title,
        'Continue your learning journey with the next commandment'::TEXT,
        1::INTEGER
    FROM commandments c
    WHERE c.is_published = true
    AND c.required_level <= user_level
    AND user_has_content_access(user_uuid, c.required_tier, c.required_level)
    AND (completed_commandments IS NULL OR NOT (c.id = ANY(completed_commandments)))
    ORDER BY c.order_index
    LIMIT 1;
    
    -- Recommend challenges based on weak areas
    RETURN QUERY
    SELECT 
        'challenge_practice'::TEXT,
        ch.id::TEXT,
        ch.title,
        'Practice this challenge to improve your skills'::TEXT,
        2::INTEGER
    FROM challenges ch
    JOIN workshop_modules wm ON ch.workshop_id = wm.id
    JOIN commandments c ON wm.commandment_id = c.id
    LEFT JOIN challenge_submissions cs ON ch.id = cs.challenge_id AND cs.user_id = user_uuid
    WHERE ch.is_published = true
    AND c.is_published = true
    AND user_has_content_access(user_uuid, c.required_tier, c.required_level)
    AND (cs.id IS NULL OR cs.score < 80)  -- Not completed or low score
    ORDER BY ch.difficulty, ch.xp_reward DESC
    LIMIT 3;
    
    -- Recommend achievements within reach
    RETURN QUERY
    SELECT 
        'achievement'::TEXT,
        a.id::TEXT,
        a.name,
        'You''re close to earning this achievement!'::TEXT,
        3::INTEGER
    FROM achievements a
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = user_uuid
    WHERE a.is_active = true
    AND ua.id IS NULL  -- Not yet earned
    AND a.required_level <= user_level
    ORDER BY a.xp_reward DESC
    LIMIT 2;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_score DECIMAL(10,2) := 0;
    max_possible_score DECIMAL(10,2) := 100;
    daily_login_score DECIMAL(5,2);
    challenge_score DECIMAL(5,2);
    ai_interaction_score DECIMAL(5,2);
    community_score DECIMAL(5,2);
    streak_bonus DECIMAL(5,2);
BEGIN
    -- Daily login activity (max 30 points)
    SELECT COUNT(DISTINCT date) * (30.0 / days_back) INTO daily_login_score
    FROM user_analytics
    WHERE user_id = user_uuid 
    AND date >= CURRENT_DATE - INTERVAL '%s days'
    AND login_count > 0;
    
    -- Challenge completion activity (max 25 points)
    SELECT COUNT(*) * 2.5 INTO challenge_score
    FROM challenge_submissions
    WHERE user_id = user_uuid
    AND submitted_at >= CURRENT_DATE - INTERVAL '%s days'
    AND is_correct = true;
    
    -- AI interaction activity (max 20 points)
    SELECT COUNT(*) * 0.2 INTO ai_interaction_score
    FROM ai_interactions
    WHERE user_id = user_uuid
    AND created_at >= CURRENT_DATE - INTERVAL '%s days';
    
    -- Community participation (max 15 points)
    SELECT (COUNT(DISTINCT cp.id) * 3 + COUNT(DISTINCT cr.id) * 1) INTO community_score
    FROM community_posts cp
    FULL OUTER JOIN community_replies cr ON cr.user_id = cp.user_id
    WHERE cp.user_id = user_uuid OR cr.user_id = user_uuid
    AND (cp.created_at >= CURRENT_DATE - INTERVAL '%s days' 
         OR cr.created_at >= CURRENT_DATE - INTERVAL '%s days');
    
    -- Streak bonus (max 10 points)
    SELECT LEAST(streak_days * 0.5, 10) INTO streak_bonus
    FROM profiles WHERE id = user_uuid;
    
    -- Calculate total score
    total_score := COALESCE(daily_login_score, 0) + 
                   COALESCE(challenge_score, 0) + 
                   COALESCE(ai_interaction_score, 0) + 
                   COALESCE(community_score, 0) + 
                   COALESCE(streak_bonus, 0);
    
    -- Cap at maximum possible score
    RETURN LEAST(total_score, max_possible_score);
END;
$$ LANGUAGE plpgsql;

-- Function to update user analytics
CREATE OR REPLACE FUNCTION update_user_daily_analytics(user_uuid UUID, analytics_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
    engagement_score DECIMAL(5,2);
BEGIN
    -- Calculate engagement score
    engagement_score := calculate_engagement_score(user_uuid, 1);
    
    -- Insert or update daily analytics
    INSERT INTO user_analytics (
        user_id, date, 
        coding_time_minutes, workshops_accessed, workshops_completed,
        challenges_attempted, challenges_completed,
        ai_interactions, collaboration_sessions,
        xp_earned, engagement_score
    )
    SELECT 
        user_uuid,
        analytics_date,
        -- Coding time (from challenge submissions and AI interactions)
        COALESCE((
            SELECT SUM(EXTRACT(EPOCH FROM (submitted_at - created_at)) / 60)
            FROM challenge_submissions 
            WHERE user_id = user_uuid AND DATE(submitted_at) = analytics_date
        ), 0),
        -- Workshops accessed
        COUNT(DISTINCT up.commandment_id) FILTER (WHERE DATE(up.last_accessed) = analytics_date),
        -- Workshops completed  
        COUNT(DISTINCT up.commandment_id) FILTER (WHERE DATE(up.completed_at) = analytics_date),
        -- Challenges attempted
        COUNT(DISTINCT cs.challenge_id) FILTER (WHERE DATE(cs.submitted_at) = analytics_date),
        -- Challenges completed (correct submissions)
        COUNT(DISTINCT cs.challenge_id) FILTER (WHERE DATE(cs.submitted_at) = analytics_date AND cs.is_correct = true),
        -- AI interactions
        COUNT(DISTINCT ai.id) FILTER (WHERE DATE(ai.created_at) = analytics_date),
        -- Collaboration sessions
        COUNT(DISTINCT collab.id) FILTER (WHERE DATE(collab.joined_at) = analytics_date),
        -- XP earned (from successful challenge submissions)
        COALESCE(SUM(ch.xp_reward) FILTER (WHERE DATE(cs.submitted_at) = analytics_date AND cs.is_correct = true), 0),
        -- Engagement score
        engagement_score
    FROM profiles p
    LEFT JOIN user_progress up ON p.id = up.user_id
    LEFT JOIN challenge_submissions cs ON p.id = cs.user_id  
    LEFT JOIN challenges ch ON cs.challenge_id = ch.id
    LEFT JOIN ai_interactions ai ON p.id = ai.user_id
    LEFT JOIN collaboration_participants collab ON p.id = collab.user_id
    WHERE p.id = user_uuid
    GROUP BY p.id
    
    ON CONFLICT (user_id, date) 
    DO UPDATE SET
        coding_time_minutes = EXCLUDED.coding_time_minutes,
        workshops_accessed = EXCLUDED.workshops_accessed,
        workshops_completed = EXCLUDED.workshops_completed,
        challenges_attempted = EXCLUDED.challenges_attempted,
        challenges_completed = EXCLUDED.challenges_completed,
        ai_interactions = EXCLUDED.ai_interactions,
        collaboration_sessions = EXCLUDED.collaboration_sessions,
        xp_earned = EXCLUDED.xp_earned,
        engagement_score = EXCLUDED.engagement_score,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_dashboard_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_summary;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 📊 ANALYTICS HELPER VIEWS
-- ===================================

-- Weekly user activity view
CREATE VIEW weekly_user_activity AS
SELECT 
    user_id,
    DATE_TRUNC('week', date) as week_start,
    SUM(coding_time_minutes) as total_coding_time,
    SUM(challenges_completed) as total_challenges_completed,
    SUM(ai_interactions) as total_ai_interactions,
    SUM(xp_earned) as total_xp_earned,
    AVG(engagement_score) as avg_engagement_score,
    COUNT(*) as active_days
FROM user_analytics
GROUP BY user_id, DATE_TRUNC('week', date);

-- Monthly subscription metrics view
CREATE VIEW monthly_subscription_metrics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    subscription_status as tier,
    COUNT(*) as new_subscriptions,
    SUM(CASE WHEN status IN ('active', 'trialing') THEN 1 ELSE 0 END) as active_subscriptions,
    SUM(CASE WHEN canceled_at IS NOT NULL THEN 1 ELSE 0 END) as churned_subscriptions,
    AVG(EXTRACT(DAY FROM COALESCE(canceled_at, CURRENT_DATE) - created_at)) as avg_subscription_days
FROM subscriptions
GROUP BY DATE_TRUNC('month', created_at), subscription_status;

-- Popular content view
CREATE VIEW popular_content AS
SELECT 
    'commandment' as content_type,
    c.id::TEXT as content_id,
    c.title,
    COUNT(DISTINCT up.user_id) as unique_users,
    AVG(up.progress_percentage) as avg_progress,
    COUNT(*) FILTER (WHERE up.status = 'completed') as completions,
    AVG(up.rating) as avg_rating
FROM commandments c
LEFT JOIN user_progress up ON c.id = up.commandment_id
WHERE c.is_published = true
GROUP BY c.id, c.title

UNION ALL

SELECT 
    'challenge' as content_type,
    ch.id::TEXT as content_id,
    ch.title,
    COUNT(DISTINCT cs.user_id) as unique_users,
    AVG(cs.score) as avg_progress,
    COUNT(*) FILTER (WHERE cs.is_correct = true) as completions,
    NULL as avg_rating
FROM challenges ch
LEFT JOIN challenge_submissions cs ON ch.id = cs.challenge_id
WHERE ch.is_published = true
GROUP BY ch.id, ch.title;

-- ===================================
-- ⚡ PERFORMANCE OPTIMIZATIONS
-- ===================================

-- Function to cleanup old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_analytics 
    WHERE date < CURRENT_DATE - INTERVAL '%s days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    DELETE FROM platform_analytics 
    WHERE date < CURRENT_DATE - INTERVAL '%s days';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update AI usage tracking
CREATE OR REPLACE FUNCTION update_ai_usage(
    user_uuid UUID,
    model_used ai_model_type,
    tokens_consumed INTEGER,
    cost_incurred DECIMAL(10,6)
)
RETURNS VOID AS $$
DECLARE
    current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE)::DATE;
    current_month_end DATE := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::DATE;
BEGIN
    -- Update monthly usage tracking
    INSERT INTO ai_usage_tracking (
        user_id, period_type, period_start, period_end,
        total_interactions, total_tokens, total_cost_usd,
        usage_by_model, cost_by_model
    )
    VALUES (
        user_uuid, 'monthly', current_month_start, current_month_end,
        1, tokens_consumed, cost_incurred,
        jsonb_build_object(model_used::TEXT, 1),
        jsonb_build_object(model_used::TEXT, cost_incurred)
    )
    ON CONFLICT (user_id, period_type, period_start)
    DO UPDATE SET
        total_interactions = ai_usage_tracking.total_interactions + 1,
        total_tokens = ai_usage_tracking.total_tokens + tokens_consumed,
        total_cost_usd = ai_usage_tracking.total_cost_usd + cost_incurred,
        usage_by_model = ai_usage_tracking.usage_by_model || 
                        jsonb_build_object(model_used::TEXT, 
                            COALESCE((ai_usage_tracking.usage_by_model->>model_used::TEXT)::INTEGER, 0) + 1),
        cost_by_model = ai_usage_tracking.cost_by_model || 
                       jsonb_build_object(model_used::TEXT, 
                           COALESCE((ai_usage_tracking.cost_by_model->>model_used::TEXT)::DECIMAL, 0) + cost_incurred),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 🔄 SCHEDULED FUNCTIONS (via pg_cron if available)
-- ===================================

-- Function to be called daily for maintenance
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS VOID AS $$
BEGIN
    -- Refresh materialized views
    PERFORM refresh_dashboard_views();
    
    -- Update platform analytics for yesterday
    INSERT INTO platform_analytics (
        date, total_users, active_users, new_registrations,
        total_workshop_completions, total_challenge_submissions,
        total_ai_interactions, total_collaboration_sessions,
        community_posts_created
    )
    SELECT 
        CURRENT_DATE - INTERVAL '1 day',
        COUNT(DISTINCT p.id),
        COUNT(DISTINCT ua.user_id) FILTER (WHERE ua.login_count > 0),
        COUNT(DISTINCT p.id) FILTER (WHERE DATE(p.created_at) = CURRENT_DATE - INTERVAL '1 day'),
        COUNT(DISTINCT up.id) FILTER (WHERE DATE(up.completed_at) = CURRENT_DATE - INTERVAL '1 day'),
        COUNT(DISTINCT cs.id) FILTER (WHERE DATE(cs.submitted_at) = CURRENT_DATE - INTERVAL '1 day'),
        COUNT(DISTINCT ai.id) FILTER (WHERE DATE(ai.created_at) = CURRENT_DATE - INTERVAL '1 day'),
        COUNT(DISTINCT collab.id) FILTER (WHERE DATE(collab.created_at) = CURRENT_DATE - INTERVAL '1 day'),
        COUNT(DISTINCT cp.id) FILTER (WHERE DATE(cp.created_at) = CURRENT_DATE - INTERVAL '1 day')
    FROM profiles p
    LEFT JOIN user_analytics ua ON p.id = ua.user_id AND ua.date = CURRENT_DATE - INTERVAL '1 day'
    LEFT JOIN user_progress up ON p.id = up.user_id
    LEFT JOIN challenge_submissions cs ON p.id = cs.user_id
    LEFT JOIN ai_interactions ai ON p.id = ai.user_id
    LEFT JOIN collaboration_sessions collab ON p.id = collab.host_user_id
    LEFT JOIN community_posts cp ON p.id = cp.user_id
    ON CONFLICT (date) DO NOTHING;
    
    -- Cleanup old data (keep 1 year)
    PERFORM cleanup_old_analytics(365);
    
    RAISE NOTICE 'Daily maintenance completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 🔐 ADDITIONAL RLS POLICIES
-- ===================================

-- Views access policies
CREATE POLICY "Users can view own dashboard summary" ON user_dashboard_summary FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Leaderboard is public" ON leaderboard_summary FOR SELECT 
USING (true);

-- ===================================
-- 📝 COMMENTS AND DOCUMENTATION
-- ===================================

COMMENT ON MATERIALIZED VIEW user_dashboard_summary IS 'Optimized summary view for user dashboard with all key metrics';
COMMENT ON MATERIALIZED VIEW leaderboard_summary IS 'Cached leaderboard rankings updated daily for performance';
COMMENT ON FUNCTION get_user_subscription_features(UUID) IS 'Returns subscription features for a user based on their current tier';
COMMENT ON FUNCTION check_ai_usage_limit(UUID) IS 'Checks if user is within their AI usage limits for current month';
COMMENT ON FUNCTION get_learning_recommendations(UUID) IS 'Provides personalized learning recommendations based on user progress';
COMMENT ON FUNCTION calculate_engagement_score(UUID, INTEGER) IS 'Calculates user engagement score based on various activities';
COMMENT ON FUNCTION daily_maintenance() IS 'Daily maintenance function to refresh views and update analytics';

-- ===================================
-- ✨ COMPLETION MESSAGE
-- ===================================

-- Final setup message
DO $$
BEGIN
    RAISE NOTICE '✨ Sacred Database Setup Complete! ✨';
    RAISE NOTICE '📊 Materialized views created for performance';
    RAISE NOTICE '🔧 Utility functions added for application logic';
    RAISE NOTICE '📈 Analytics views configured';
    RAISE NOTICE '🔐 Security policies implemented';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run daily_maintenance() function daily (set up cron job)';
    RAISE NOTICE '2. Configure Stripe webhook endpoints';
    RAISE NOTICE '3. Set up monitoring for materialized view refresh';
    RAISE NOTICE '';
    RAISE NOTICE 'May your database queries be fast and your users engaged! 🙏';
END $$;