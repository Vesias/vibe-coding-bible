-- ===================================
-- 💰 REFERRAL SYSTEM & COMMISSION TRACKING
-- Migration 005: Referral System for 15% Commission
-- ===================================

-- User referral codes and tracking
CREATE TABLE IF NOT EXISTS user_referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Referral Code
    referral_code TEXT UNIQUE NOT NULL,
    
    -- Commission Settings
    commission_rate DECIMAL(5,4) DEFAULT 0.15, -- 15%
    total_earnings DECIMAL(12,2) DEFAULT 0,
    pending_earnings DECIMAL(12,2) DEFAULT 0,
    paid_earnings DECIMAL(12,2) DEFAULT 0,
    
    -- Statistics
    total_referrals INTEGER DEFAULT 0,
    successful_conversions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id)
);

-- Referral clicks/attempts tracking
CREATE TABLE IF NOT EXISTS referral_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Reference Data
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- The person who clicked
    referral_code TEXT NOT NULL,
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- The person who referred
    
    -- Purchase Context
    plan_id TEXT,
    stripe_session_id TEXT,
    amount DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Tracking Data
    ip_address INET,
    user_agent TEXT,
    source_url TEXT,
    landing_page TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'converted', 'expired', 'cancelled'
    
    -- Timestamps
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    converted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Successful referral conversions
CREATE TABLE IF NOT EXISTS referral_conversions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Parties Involved
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Person who made the referral
    referee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- Person who purchased
    referral_code TEXT NOT NULL,
    
    -- Purchase Details
    purchase_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    
    -- Stripe Integration
    stripe_session_id TEXT,
    stripe_subscription_id TEXT,
    stripe_payment_intent_id TEXT,
    
    -- Commission Status
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'paid', 'disputed', 'cancelled'
    commission_paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Commission payouts tracking
CREATE TABLE IF NOT EXISTS referral_payouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Payout Details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    
    -- Payment Method
    payout_method TEXT NOT NULL, -- 'bank_transfer', 'paypal', 'stripe', 'crypto'
    payout_details JSONB, -- Account details, encrypted
    
    -- Included Conversions
    conversion_ids UUID[] NOT NULL,
    conversions_count INTEGER NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
    failure_reason TEXT,
    
    -- External References
    external_payout_id TEXT, -- PayPal, Stripe, etc. transaction ID
    
    -- Timestamps
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral analytics (daily aggregations)
CREATE TABLE IF NOT EXISTS referral_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Time Period
    date DATE NOT NULL,
    
    -- Metrics
    clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Revenue
    total_revenue DECIMAL(12,2) DEFAULT 0,
    commission_earned DECIMAL(12,2) DEFAULT 0,
    
    -- Top Sources
    top_sources JSONB DEFAULT '{}',
    top_pages JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id, date)
);

-- ===================================
-- 🔧 FUNCTIONS & TRIGGERS
-- ===================================

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    username_part TEXT;
    random_part TEXT;
    final_code TEXT;
    code_exists BOOLEAN;
BEGIN
    -- Get username or email prefix
    SELECT COALESCE(username, SPLIT_PART(email, '@', 1)) INTO username_part
    FROM profiles WHERE id = user_uuid;
    
    -- Clean username part (max 6 chars, alphanumeric)
    username_part := UPPER(REGEXP_REPLACE(COALESCE(username_part, 'USER'), '[^A-Za-z0-9]', '', 'g'));
    username_part := LEFT(username_part, 6);
    
    -- Generate unique code
    LOOP
        -- Add random 4-character suffix
        random_part := '';
        FOR i IN 1..4 LOOP
            random_part := random_part || CHR(65 + FLOOR(RANDOM() * 26)); -- A-Z
        END LOOP;
        
        final_code := username_part || random_part;
        
        -- Check if code exists
        SELECT EXISTS(SELECT 1 FROM user_referrals WHERE referral_code = final_code) INTO code_exists;
        
        -- Exit if unique
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Function to create referral code for new users
CREATE OR REPLACE FUNCTION create_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_referrals (user_id, referral_code)
    VALUES (NEW.id, generate_referral_code(NEW.id));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to add referral commission
CREATE OR REPLACE FUNCTION add_referral_commission(user_uuid UUID, commission_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE user_referrals
    SET total_earnings = total_earnings + commission_amount,
        pending_earnings = pending_earnings + commission_amount,
        updated_at = NOW()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to process referral click
CREATE OR REPLACE FUNCTION process_referral_click(
    ref_code TEXT,
    clicked_user_id UUID DEFAULT NULL,
    ip_addr INET DEFAULT NULL,
    user_agent_str TEXT DEFAULT NULL,
    source_url_str TEXT DEFAULT NULL,
    landing_page_str TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    referrer_uuid UUID;
    attempt_id UUID;
BEGIN
    -- Find referrer
    SELECT user_id INTO referrer_uuid
    FROM user_referrals
    WHERE referral_code = ref_code AND is_active = true;
    
    IF referrer_uuid IS NULL THEN
        RAISE EXCEPTION 'Invalid referral code: %', ref_code;
    END IF;
    
    -- Create attempt record
    INSERT INTO referral_attempts (
        user_id,
        referral_code,
        referrer_id,
        ip_address,
        user_agent,
        source_url,
        landing_page
    ) VALUES (
        clicked_user_id,
        ref_code,
        referrer_uuid,
        ip_addr,
        user_agent_str,
        source_url_str,
        landing_page_str
    ) RETURNING id INTO attempt_id;
    
    -- Update click count
    UPDATE user_referrals
    SET total_clicks = total_clicks + 1,
        updated_at = NOW()
    WHERE user_id = referrer_uuid;
    
    RETURN attempt_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate referral statistics
CREATE OR REPLACE FUNCTION update_referral_stats(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE user_referrals
    SET successful_conversions = (
            SELECT COUNT(*)
            FROM referral_conversions
            WHERE referrer_id = user_uuid AND status = 'completed'
        ),
        conversion_rate = CASE
            WHEN total_clicks > 0 THEN
                (SELECT COUNT(*)::DECIMAL FROM referral_conversions WHERE referrer_id = user_uuid AND status = 'completed') / total_clicks * 100
            ELSE 0
        END,
        updated_at = NOW()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 🔐 ROW LEVEL SECURITY
-- ===================================

-- Enable RLS
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own referrals" ON user_referrals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referral attempts" ON referral_attempts FOR SELECT USING (auth.uid() = user_id OR auth.uid() = referrer_id);
CREATE POLICY "Users can view own referral conversions" ON referral_conversions FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "Users can manage own payouts" ON referral_payouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own referral analytics" ON referral_analytics FOR ALL USING (auth.uid() = user_id);

-- Insert policy for referral attempts (needed for tracking clicks from non-authenticated users)
CREATE POLICY "Anyone can insert referral attempts" ON referral_attempts FOR INSERT WITH CHECK (true);

-- ===================================
-- 🎯 TRIGGERS
-- ===================================

-- Create referral code for new users
CREATE TRIGGER create_referral_code_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_user_referral_code();

-- Update timestamps
CREATE TRIGGER update_user_referrals_updated_at BEFORE UPDATE ON user_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_attempts_updated_at BEFORE UPDATE ON referral_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_conversions_updated_at BEFORE UPDATE ON referral_conversions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_payouts_updated_at BEFORE UPDATE ON referral_payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_analytics_updated_at BEFORE UPDATE ON referral_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 📊 INDEXES
-- ===================================

-- Referral system indexes
CREATE INDEX IF NOT EXISTS idx_user_referrals_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_referrals_user ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_active ON user_referrals(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_referral_attempts_code ON referral_attempts(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_attempts_user ON referral_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_attempts_referrer ON referral_attempts(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_attempts_status ON referral_attempts(status);
CREATE INDEX IF NOT EXISTS idx_referral_attempts_clicked_at ON referral_attempts(clicked_at);

CREATE INDEX IF NOT EXISTS idx_referral_conversions_referrer ON referral_conversions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_referee ON referral_conversions(referee_id);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_code ON referral_conversions(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_status ON referral_conversions(status);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_date ON referral_conversions(conversion_date);

CREATE INDEX IF NOT EXISTS idx_referral_payouts_user ON referral_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_status ON referral_payouts(status);
CREATE INDEX IF NOT EXISTS idx_referral_payouts_requested ON referral_payouts(requested_at);

CREATE INDEX IF NOT EXISTS idx_referral_analytics_user_date ON referral_analytics(user_id, date);

-- ===================================
-- 🎁 INITIAL DATA
-- ===================================

-- Create referral codes for existing users
INSERT INTO user_referrals (user_id, referral_code)
SELECT 
    id, 
    generate_referral_code(id)
FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_referrals)
ON CONFLICT (user_id) DO NOTHING;

-- ===================================
-- ✨ COMPLETION MESSAGE
-- ===================================

COMMENT ON SCHEMA public IS 'Referral System with 15% Commission Tracking - Migration 005 Complete';