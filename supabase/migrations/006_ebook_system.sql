-- Create ebook access logging table
CREATE TABLE IF NOT EXISTS ebook_access_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    chapter_id varchar(100) NOT NULL,
    access_granted boolean DEFAULT false,
    access_reason text,
    accessed_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    session_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    chapter_id varchar(100) NOT NULL,
    progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_seconds integer DEFAULT 0,
    last_position text,
    bookmarked boolean DEFAULT false,
    notes text,
    started_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, chapter_id)
);

-- Create ebook security events table
CREATE TABLE IF NOT EXISTS ebook_security_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    event_type varchar(50) NOT NULL, -- 'copy_attempt', 'right_click', 'dev_tools', 'suspicious_activity'
    chapter_id varchar(100),
    event_data jsonb,
    severity varchar(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create ebook preferences table
CREATE TABLE IF NOT EXISTS ebook_preferences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    font_size integer DEFAULT 16 CHECK (font_size >= 12 AND font_size <= 24),
    theme varchar(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'sepia')),
    reading_speed integer DEFAULT 250, -- words per minute
    auto_bookmark boolean DEFAULT true,
    offline_sync boolean DEFAULT false,
    email_notifications boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create PDF export logs table
CREATE TABLE IF NOT EXISTS pdf_export_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    chapters_exported text[] NOT NULL,
    export_type varchar(50) DEFAULT 'premium', -- 'preview', 'premium', 'full'
    watermark_data jsonb,
    file_size_bytes bigint,
    download_count integer DEFAULT 0,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ebook_access_logs_user_id ON ebook_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ebook_access_logs_chapter_id ON ebook_access_logs(chapter_id);
CREATE INDEX IF NOT EXISTS idx_ebook_access_logs_accessed_at ON ebook_access_logs(accessed_at);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_chapter_id ON reading_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_updated_at ON reading_progress(updated_at);

CREATE INDEX IF NOT EXISTS idx_ebook_security_events_user_id ON ebook_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ebook_security_events_event_type ON ebook_security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_ebook_security_events_severity ON ebook_security_events(severity);
CREATE INDEX IF NOT EXISTS idx_ebook_security_events_created_at ON ebook_security_events(created_at);

CREATE INDEX IF NOT EXISTS idx_pdf_export_logs_user_id ON pdf_export_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_export_logs_created_at ON pdf_export_logs(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE ebook_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebook_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_export_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for ebook_access_logs (admin only)
CREATE POLICY "Admin can view all ebook access logs" ON ebook_access_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.prophet_rank = 'prophet'
        )
    );

-- RLS policies for reading_progress (users can only access their own)
CREATE POLICY "Users can view their own reading progress" ON reading_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reading progress" ON reading_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reading progress" ON reading_progress
    FOR UPDATE USING (user_id = auth.uid());

-- RLS policies for ebook_security_events (admin only)
CREATE POLICY "Admin can view all security events" ON ebook_security_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.prophet_rank = 'prophet'
        )
    );

-- RLS policies for ebook_preferences (users can only access their own)
CREATE POLICY "Users can view their own ebook preferences" ON ebook_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own ebook preferences" ON ebook_preferences
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ebook preferences" ON ebook_preferences
    FOR UPDATE USING (user_id = auth.uid());

-- RLS policies for pdf_export_logs (users can only view their own)
CREATE POLICY "Users can view their own PDF export logs" ON pdf_export_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own PDF export logs" ON pdf_export_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Functions for ebook analytics
CREATE OR REPLACE FUNCTION get_user_reading_stats(user_uuid uuid)
RETURNS TABLE (
    total_chapters_read integer,
    total_reading_time_minutes integer,
    favorite_chapter varchar(100),
    reading_streak_days integer,
    last_read_date timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT chapter_id)::integer as total_chapters_read,
        (SUM(reading_time_seconds) / 60)::integer as total_reading_time_minutes,
        (
            SELECT rp.chapter_id 
            FROM reading_progress rp 
            WHERE rp.user_id = user_uuid 
            ORDER BY rp.reading_time_seconds DESC 
            LIMIT 1
        ) as favorite_chapter,
        0 as reading_streak_days, -- TODO: Implement streak calculation
        MAX(updated_at) as last_read_date
    FROM reading_progress
    WHERE user_id = user_uuid
    AND progress_percentage > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_ebook_security_event(
    p_user_id uuid,
    p_event_type varchar(50),
    p_chapter_id varchar(100) DEFAULT NULL,
    p_event_data jsonb DEFAULT NULL,
    p_severity varchar(20) DEFAULT 'low'
)
RETURNS uuid AS $$
DECLARE
    event_id uuid;
BEGIN
    INSERT INTO ebook_security_events (
        user_id, 
        event_type, 
        chapter_id, 
        event_data, 
        severity
    )
    VALUES (
        p_user_id, 
        p_event_type, 
        p_chapter_id, 
        p_event_data, 
        p_severity
    )
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update reading_progress.updated_at
CREATE OR REPLACE FUNCTION update_reading_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reading_progress_updated_at
    BEFORE UPDATE ON reading_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_reading_progress_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON ebook_access_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON reading_progress TO authenticated;
GRANT SELECT, INSERT ON ebook_security_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ebook_preferences TO authenticated;
GRANT SELECT, INSERT ON pdf_export_logs TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_reading_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION log_ebook_security_event(uuid, varchar, varchar, jsonb, varchar) TO authenticated;