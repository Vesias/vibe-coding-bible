-- =============================================
-- Analytics and Email System Schema
-- =============================================

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    properties JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Behavior Events Table
CREATE TABLE IF NOT EXISTS user_behavior_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    duration_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Metrics Table
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    dimensions JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    email_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'error', 'bounced', 'delivered', 'opened', 'clicked')),
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_user_behavior_events_user_id ON user_behavior_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_events_action ON user_behavior_events(action);
CREATE INDEX IF NOT EXISTS idx_user_behavior_events_timestamp ON user_behavior_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_behavior_events_resource ON user_behavior_events(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_business_metrics_type ON business_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_business_metrics_timestamp ON business_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- =============================================
-- Analytics Functions
-- =============================================

-- Function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_behavior_events (
        user_id,
        action,
        metadata,
        timestamp
    ) VALUES (
        p_user_id,
        p_activity_type,
        p_details,
        NOW()
    );

    -- Update daily user analytics
    INSERT INTO user_analytics (
        user_id,
        date,
        sessions,
        total_time_minutes,
        pages_visited,
        engagement_score
    ) VALUES (
        p_user_id,
        CURRENT_DATE,
        1,
        0,
        1,
        0.1
    )
    ON CONFLICT (user_id, date)
    DO UPDATE SET
        sessions = user_analytics.sessions + 1,
        pages_visited = user_analytics.pages_visited + 1,
        engagement_score = LEAST(user_analytics.engagement_score + 0.1, 10.0),
        updated_at = NOW();
END;
$$;

-- Function to aggregate user activity
CREATE OR REPLACE FUNCTION aggregate_user_activity(
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Aggregate page views
    INSERT INTO business_metrics (metric_type, value, dimensions, timestamp)
    SELECT 
        'page_views',
        COUNT(*),
        jsonb_build_object('time_window', '1_minute'),
        p_end_time
    FROM analytics_events
    WHERE event_type = 'page_view'
    AND timestamp BETWEEN p_start_time AND p_end_time;

    -- Aggregate unique users
    INSERT INTO business_metrics (metric_type, value, dimensions, timestamp)
    SELECT 
        'active_users',
        COUNT(DISTINCT user_id),
        jsonb_build_object('time_window', '1_minute'),
        p_end_time
    FROM analytics_events
    WHERE timestamp BETWEEN p_start_time AND p_end_time
    AND user_id IS NOT NULL;

    -- Aggregate workshop completions
    INSERT INTO business_metrics (metric_type, value, dimensions, timestamp)
    SELECT 
        'workshop_completions',
        COUNT(*),
        jsonb_build_object('time_window', '1_minute'),
        p_end_time
    FROM user_behavior_events
    WHERE action = 'workshop_completed'
    AND timestamp BETWEEN p_start_time AND p_end_time;
END;
$$;

-- Function to aggregate platform metrics
CREATE OR REPLACE FUNCTION aggregate_platform_metrics(
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update platform analytics
    INSERT INTO platform_analytics (
        date,
        total_users,
        active_users,
        new_registrations,
        total_revenue,
        subscription_conversions
    )
    SELECT 
        DATE(p_end_time),
        (SELECT COUNT(*) FROM profiles),
        COUNT(DISTINCT ae.user_id),
        COUNT(DISTINCT CASE WHEN p.created_at::date = DATE(p_end_time) THEN p.id END),
        COALESCE(revenue_sum.total, 0),
        COUNT(DISTINCT CASE WHEN bm.metric_type = 'subscription_purchased' THEN bm.dimensions->>'user_id' END)
    FROM analytics_events ae
    LEFT JOIN profiles p ON ae.user_id = p.id
    LEFT JOIN (
        SELECT SUM(value) as total
        FROM business_metrics
        WHERE metric_type = 'subscription_purchased'
        AND DATE(timestamp) = DATE(p_end_time)
    ) revenue_sum ON true
    LEFT JOIN business_metrics bm ON bm.timestamp BETWEEN p_start_time AND p_end_time
    WHERE ae.timestamp BETWEEN p_start_time AND p_end_time
    GROUP BY DATE(p_end_time), revenue_sum.total
    ON CONFLICT (date)
    DO UPDATE SET
        total_users = EXCLUDED.total_users,
        active_users = EXCLUDED.active_users,
        new_registrations = EXCLUDED.new_registrations,
        total_revenue = EXCLUDED.total_revenue,
        subscription_conversions = EXCLUDED.subscription_conversions,
        updated_at = NOW();
END;
$$;

-- Function to update user workshop completion
CREATE OR REPLACE FUNCTION update_user_workshop_completion(
    p_user_id UUID,
    p_workshop_id INTEGER,
    p_completion_time_ms INTEGER,
    p_score NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update user progress
    UPDATE user_progress
    SET 
        status = 'completed',
        progress_percentage = 100,
        completion_time_ms = p_completion_time_ms,
        final_score = p_score,
        completed_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id 
    AND commandment_id = p_workshop_id;

    -- Award XP for completion
    PERFORM award_xp(p_user_id, 200, 'Workshop completion');

    -- Update user analytics
    UPDATE user_analytics
    SET 
        workshops_completed = workshops_completed + 1,
        total_score = total_score + p_score,
        engagement_score = LEAST(engagement_score + 1.0, 10.0),
        updated_at = NOW()
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE;
END;
$$;

-- Function to update revenue metrics
CREATE OR REPLACE FUNCTION update_revenue_metrics(
    p_user_id UUID,
    p_amount NUMERIC,
    p_currency TEXT,
    p_subscription_tier TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Record revenue metric
    INSERT INTO business_metrics (
        metric_type,
        value,
        dimensions,
        timestamp
    ) VALUES (
        'revenue',
        p_amount,
        jsonb_build_object(
            'currency', p_currency,
            'subscription_tier', p_subscription_tier,
            'user_id', p_user_id
        ),
        NOW()
    );

    -- Update platform analytics
    UPDATE platform_analytics
    SET 
        total_revenue = total_revenue + p_amount,
        subscription_conversions = subscription_conversions + 1,
        updated_at = NOW()
    WHERE date = CURRENT_DATE;

    -- Insert if not exists
    INSERT INTO platform_analytics (
        date,
        total_users,
        active_users,
        new_registrations,
        total_revenue,
        subscription_conversions
    )
    SELECT 
        CURRENT_DATE,
        (SELECT COUNT(*) FROM profiles),
        1,
        0,
        p_amount,
        1
    WHERE NOT EXISTS (
        SELECT 1 FROM platform_analytics WHERE date = CURRENT_DATE
    );
END;
$$;

-- =============================================
-- Dashboard and Reporting Functions
-- =============================================

-- Function to get analytics dashboard data
CREATE OR REPLACE FUNCTION get_analytics_dashboard(
    p_time_range TEXT DEFAULT '7d',
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start_date TIMESTAMPTZ;
    v_dashboard_data JSONB;
BEGIN
    -- Calculate start date based on time range
    CASE p_time_range
        WHEN '1d' THEN v_start_date := NOW() - INTERVAL '1 day';
        WHEN '7d' THEN v_start_date := NOW() - INTERVAL '7 days';
        WHEN '30d' THEN v_start_date := NOW() - INTERVAL '30 days';
        WHEN '90d' THEN v_start_date := NOW() - INTERVAL '90 days';
        ELSE v_start_date := NOW() - INTERVAL '7 days';
    END CASE;

    -- Build dashboard data
    SELECT jsonb_build_object(
        'overview', jsonb_build_object(
            'total_users', (SELECT COUNT(*) FROM profiles),
            'active_users', (
                SELECT COUNT(DISTINCT user_id) 
                FROM analytics_events 
                WHERE timestamp >= v_start_date
                AND user_id IS NOT NULL
            ),
            'page_views', (
                SELECT COUNT(*) 
                FROM analytics_events 
                WHERE event_type = 'page_view'
                AND timestamp >= v_start_date
            ),
            'workshop_completions', (
                SELECT COUNT(*)
                FROM user_behavior_events
                WHERE action = 'workshop_completed'
                AND timestamp >= v_start_date
            )
        ),
        'revenue', jsonb_build_object(
            'total_revenue', (
                SELECT COALESCE(SUM(value), 0)
                FROM business_metrics
                WHERE metric_type = 'revenue'
                AND timestamp >= v_start_date
            ),
            'subscription_conversions', (
                SELECT COUNT(*)
                FROM business_metrics
                WHERE metric_type = 'subscription_purchased'
                AND timestamp >= v_start_date
            )
        ),
        'user_engagement', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'date', date,
                    'active_users', active_users,
                    'engagement_score', avg_engagement_score
                ) ORDER BY date
            )
            FROM (
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(DISTINCT user_id) as active_users,
                    AVG(CASE WHEN properties->>'engagement_score' IS NOT NULL 
                        THEN (properties->>'engagement_score')::numeric 
                        ELSE 0 END) as avg_engagement_score
                FROM analytics_events
                WHERE timestamp >= v_start_date
                AND user_id IS NOT NULL
                GROUP BY DATE(timestamp)
                ORDER BY date
            ) daily_stats
        )
    ) INTO v_dashboard_data;

    RETURN v_dashboard_data;
END;
$$;

-- Function to get user insights
CREATE OR REPLACE FUNCTION get_user_insights(
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_insights JSONB;
BEGIN
    SELECT jsonb_build_object(
        'profile', (
            SELECT jsonb_build_object(
                'subscription_status', subscription_status,
                'level', level,
                'xp_points', xp_points,
                'learning_streak', learning_streak
            )
            FROM profiles
            WHERE id = p_user_id
        ),
        'activity_summary', jsonb_build_object(
            'total_sessions', (
                SELECT COUNT(DISTINCT session_id)
                FROM analytics_events
                WHERE user_id = p_user_id
                AND session_id IS NOT NULL
            ),
            'total_page_views', (
                SELECT COUNT(*)
                FROM analytics_events
                WHERE user_id = p_user_id
                AND event_type = 'page_view'
            ),
            'workshops_completed', (
                SELECT COUNT(*)
                FROM user_behavior_events
                WHERE user_id = p_user_id
                AND action = 'workshop_completed'
            ),
            'achievements_earned', (
                SELECT COUNT(*)
                FROM user_achievements
                WHERE user_id = p_user_id
                AND is_completed = true
            )
        ),
        'recent_activity', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'action', action,
                    'resource_type', resource_type,
                    'resource_id', resource_id,
                    'timestamp', timestamp
                ) ORDER BY timestamp DESC
            )
            FROM (
                SELECT action, resource_type, resource_id, timestamp
                FROM user_behavior_events
                WHERE user_id = p_user_id
                ORDER BY timestamp DESC
                LIMIT 10
            ) recent
        )
    ) INTO v_insights;

    RETURN v_insights;
END;
$$;

-- Function to get business metrics
CREATE OR REPLACE FUNCTION get_business_metrics(
    p_time_range TEXT DEFAULT '30d',
    p_metric_type TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start_date TIMESTAMPTZ;
    v_metrics JSONB;
BEGIN
    -- Calculate start date
    CASE p_time_range
        WHEN '1d' THEN v_start_date := NOW() - INTERVAL '1 day';
        WHEN '7d' THEN v_start_date := NOW() - INTERVAL '7 days';
        WHEN '30d' THEN v_start_date := NOW() - INTERVAL '30 days';
        WHEN '90d' THEN v_start_date := NOW() - INTERVAL '90 days';
        ELSE v_start_date := NOW() - INTERVAL '30 days';
    END CASE;

    SELECT jsonb_agg(
        jsonb_build_object(
            'metric_type', metric_type,
            'value', value,
            'dimensions', dimensions,
            'timestamp', timestamp
        ) ORDER BY timestamp DESC
    ) INTO v_metrics
    FROM business_metrics
    WHERE timestamp >= v_start_date
    AND (p_metric_type IS NULL OR metric_type = p_metric_type);

    RETURN COALESCE(v_metrics, '[]'::jsonb);
END;
$$;

-- =============================================
-- Email Analytics Functions
-- =============================================

-- Function to get email statistics
CREATE OR REPLACE FUNCTION get_email_statistics(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN jsonb_build_object(
        'total_sent', (
            SELECT COUNT(*)
            FROM email_logs
            WHERE DATE(sent_at) BETWEEN p_start_date AND p_end_date
            AND status = 'sent'
        ),
        'delivery_rate', (
            SELECT ROUND(
                COUNT(*) FILTER (WHERE status IN ('sent', 'delivered', 'opened', 'clicked'))::NUMERIC / 
                NULLIF(COUNT(*), 0) * 100, 2
            )
            FROM email_logs
            WHERE DATE(sent_at) BETWEEN p_start_date AND p_end_date
        ),
        'open_rate', (
            SELECT ROUND(
                COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::NUMERIC / 
                NULLIF(COUNT(*) FILTER (WHERE status = 'sent'), 0) * 100, 2
            )
            FROM email_logs
            WHERE DATE(sent_at) BETWEEN p_start_date AND p_end_date
        ),
        'click_rate', (
            SELECT ROUND(
                COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::NUMERIC / 
                NULLIF(COUNT(*) FILTER (WHERE status = 'sent'), 0) * 100, 2
            )
            FROM email_logs
            WHERE DATE(sent_at) BETWEEN p_start_date AND p_end_date
        ),
        'by_type', (
            SELECT jsonb_object_agg(
                email_type,
                jsonb_build_object(
                    'sent', sent_count,
                    'opened', opened_count,
                    'clicked', clicked_count
                )
            )
            FROM (
                SELECT 
                    email_type,
                    COUNT(*) FILTER (WHERE status = 'sent') as sent_count,
                    COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as opened_count,
                    COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked_count
                FROM email_logs
                WHERE DATE(sent_at) BETWEEN p_start_date AND p_end_date
                GROUP BY email_type
            ) email_stats
        )
    );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Enable RLS on new tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own behavior events" ON user_behavior_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only service role can access business metrics" ON business_metrics
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own email logs" ON email_logs
    FOR SELECT USING (auth.uid() = user_id);