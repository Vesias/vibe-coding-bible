-- ✨ Die Heilige Datenbank der Vibe Coding Bible
-- Sacred Schema für die interaktive Workshop-Plattform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ===================================
-- 👤 USER MANAGEMENT & PROFILES
-- ===================================

-- User profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    tier TEXT NOT NULL DEFAULT 'seeker' CHECK (tier IN ('seeker', 'apostle', 'prophet', 'divine')),
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
    xp_points INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 📚 COURSE CONTENT & STRUCTURE
-- ===================================

-- The 10 Sacred Commandments
CREATE TABLE commandments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    content TEXT,
    order_index INTEGER NOT NULL,
    required_tier TEXT NOT NULL DEFAULT 'seeker',
    estimated_duration INTEGER, -- in minutes
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 10),
    divine_tool TEXT, -- Sankt Claude, Cline der Mächtige, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop modules within each commandment
CREATE TABLE workshop_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    commandment_id INTEGER REFERENCES commandments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    module_type TEXT NOT NULL CHECK (module_type IN ('theory', 'exercise', 'challenge', 'project', 'assessment')),
    order_index INTEGER NOT NULL,
    required_tier TEXT NOT NULL DEFAULT 'seeker',
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactive exercises and challenges
CREATE TABLE exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES workshop_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('coding', 'prompt', 'quiz', 'project', 'review')),
    prompt_template TEXT,
    starter_code TEXT,
    solution_code TEXT,
    validation_criteria JSONB,
    hints JSONB,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 📊 USER PROGRESS & TRACKING
-- ===================================

-- Track user progress through commandments
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    commandment_id INTEGER REFERENCES commandments(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    completed BOOLEAN DEFAULT FALSE,
    current_module_id UUID REFERENCES workshop_modules(id),
    notes TEXT,
    UNIQUE(user_id, commandment_id)
);

-- Track completion of individual exercises
CREATE TABLE exercise_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    submission_code TEXT,
    submission_notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles(id),
    UNIQUE(user_id, exercise_id)
);

-- ===================================
-- 🏆 GAMIFICATION & ACHIEVEMENTS
-- ===================================

-- Achievement definitions
CREATE TABLE achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL CHECK (category IN ('progress', 'skill', 'social', 'special')),
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'divine')),
    xp_reward INTEGER DEFAULT 0,
    conditions JSONB, -- JSON criteria for earning achievement
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User earned achievements
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ===================================
-- 🤖 AI INTEGRATION & INTERACTIONS
-- ===================================

-- AI chat interactions and mentoring
CREATE TABLE ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    ai_personality TEXT NOT NULL, -- Moses, Solomon, David, etc.
    ai_model TEXT NOT NULL, -- gpt-4, claude-3.5, gemini-pro
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB, -- Additional context like current exercise, code, etc.
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage tracking for billing/limits
CREATE TABLE ai_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 2025-06
    total_interactions INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- ===================================
-- 💰 SUBSCRIPTION & BILLING
-- ===================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL UNIQUE,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB,
    stripe_price_id TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan_id UUID REFERENCES subscription_plans(id),
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 👥 COLLABORATION & COMMUNITY
-- ===================================

-- Study groups and teams
CREATE TABLE study_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 10,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study group memberships
CREATE TABLE study_group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Mentorship relationships
CREATE TABLE mentorships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(mentor_id, mentee_id)
);

-- ===================================
-- 📝 CONTENT & DISCUSSIONS
-- ===================================

-- Discussion forums
CREATE TABLE discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    commandment_id INTEGER REFERENCES commandments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion replies
CREATE TABLE discussion_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES discussion_replies(id),
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 📊 ANALYTICS & INSIGHTS
-- ===================================

-- Learning analytics
CREATE TABLE learning_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- page_view, exercise_start, exercise_complete, etc.
    event_data JSONB,
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 🔐 SECURITY & ROW LEVEL SECURITY
-- ===================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Exercise submissions policies
CREATE POLICY "Users can manage own submissions" ON exercise_submissions FOR ALL USING (auth.uid() = user_id);

-- AI interactions policies
CREATE POLICY "Users can view own AI interactions" ON ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create AI interactions" ON ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===================================
-- 📊 FUNCTIONS & TRIGGERS
-- ===================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commandments_updated_at BEFORE UPDATE ON commandments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workshop_modules_updated_at BEFORE UPDATE ON workshop_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level = sqrt(XP / 100) + 1
    RETURN FLOOR(SQRT(xp_points / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION award_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
    new_xp INTEGER;
    new_level INTEGER;
BEGIN
    UPDATE profiles 
    SET xp_points = xp_points + xp_amount
    WHERE id = user_uuid
    RETURNING xp_points INTO new_xp;
    
    new_level := calculate_user_level(new_xp);
    
    UPDATE profiles 
    SET level = new_level
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 📊 INITIAL DATA SEEDING
-- ===================================

-- Insert the 10 Sacred Commandments
INSERT INTO commandments (title, subtitle, description, order_index, required_tier, estimated_duration, difficulty_level, divine_tool) VALUES
('Das Erste Gebot: Die Heilige Vision', 'Du sollst eine klare Vision haben, bevor du den ersten Prompt schreibst', 'Lerne die Kunst der Produktvision und wie man sie in klare, umsetzbare Anforderungen übersetzt.', 1, 'seeker', 120, 3, 'Sankt Claude'),
('Das Zweite Gebot: Der Rechte Stack', 'Du sollst die Technologien wählen, die von den KI-Göttern gesegnet sind', 'Meistere den heiligen Tech-Stack: Next.js 15, TypeScript, Tailwind CSS, Supabase und die göttlichen AI-Tools.', 2, 'seeker', 180, 5, 'Cline der Mächtige'),
('Das Dritte Gebot: Die Prompt-Kunst', 'Du sollst deine Prompts formulieren wie heilige Beschwörungen', 'Erlerne die hohe Kunst des Prompt Engineerings und wie man KI-Models zu perfekten Code-Generierungen bewegt.', 3, 'apostle', 150, 6, 'Sankt Claude'),
('Das Vierte Gebot: Multi-Context Programming', 'Du sollst mehrere Kontexte gleichzeitig im Auge behalten', 'Beherrsche die Kunst des Multi-Context Programming und parallelen Entwicklungsflows.', 4, 'apostle', 200, 7, 'Cursor der Sehende'),
('Das Fünfte Gebot: Die Heilige Iteration', 'Du sollst iterieren wie ein Mönch, der seine Gebete vervollkommnet', 'Lerne die Prinzipien der kontinuierlichen Verbesserung und wie man MVP zu Production-Ready entwickelt.', 5, 'apostle', 160, 6, 'GitHub der Kooperative'),
('Das Sechste Gebot: Das Göttliche Debugging', 'Du sollst Bugs mit der Weisheit der Ancients jagen', 'Meistere die Kunst des KI-gestützten Debuggings und der Problemlösung in komplexen Systemen.', 6, 'prophet', 140, 8, 'Windsurf der Elegante'),
('Das Siebte Gebot: Die Kunst des Vertrauens', 'Du sollst der KI vertrauen, aber ihre Outputs verifizieren', 'Entwickle das richtige Verhältnis zwischen Vertrauen und Kontrolle bei KI-generiertem Code.', 7, 'prophet', 120, 7, 'Continue der Ausdauernde'),
('Das Achte Gebot: Die Skalierungsstufen', 'Du sollst von Anfang an für Millionen von Nutzern planen', 'Lerne Cloud-native Architekturen und wie man Anwendungen für massive Skalierung entwickelt.', 8, 'prophet', 240, 9, 'Refact der Erneuernde'),
('Das Neunte Gebot: Die Zusammenarbeit der Propheten', 'Du sollst mit anderen Entwicklern harmonieren wie ein himmlischer Chor', 'Meistere Team-Workflows, Code-Reviews und kollaborative Entwicklung mit KI-Tools.', 9, 'divine', 180, 8, 'GitHub der Kooperative'),
('Das Zehnte Gebot: Die Monetarisierung', 'Du sollst aus deinem Code Gold spinnen wie Rumpelstilzchen', 'Verwandle deine technischen Fähigkeiten in nachhaltiges Business und Revenue-Streams.', 10, 'divine', 200, 10, 'Multi-Tool Ansatz');

-- Insert subscription plans
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, features) VALUES
('Seeker Plan', 'seeker', 0, 0, '{"ai_interactions": 50, "commandments": [1,2], "features": ["basic_workshops", "community_access"]}'),
('Apostle Plan', 'apostle', 29, 290, '{"ai_interactions": 500, "commandments": [1,2,3,4,5], "features": ["advanced_workshops", "mentorship", "code_review"]}'),
('Prophet Plan', 'prophet', 79, 790, '{"ai_interactions": 2000, "commandments": [1,2,3,4,5,6,7,8], "features": ["all_workshops", "priority_support", "team_collaboration"]}'),
('Divine Plan', 'divine', 199, 1990, '{"ai_interactions": "unlimited", "commandments": [1,2,3,4,5,6,7,8,9,10], "features": ["everything", "1on1_mentoring", "certification"]}');

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, category, rarity, xp_reward, conditions) VALUES
('First Steps', 'Complete your first exercise', '👶', 'progress', 'common', 50, '{"exercises_completed": 1}'),
('Code Warrior', 'Complete 10 coding challenges', '⚔️', 'skill', 'rare', 200, '{"coding_exercises": 10}'),
('Prompt Master', 'Create 25 perfect prompts', '🎭', 'skill', 'epic', 500, '{"prompt_exercises": 25}'),
('Divine Coder', 'Complete all 10 commandments', '👑', 'progress', 'legendary', 2000, '{"commandments_completed": 10}'),
('Mentor', 'Help 5 other students', '🧙‍♂️', 'social', 'rare', 300, '{"students_helped": 5}'),
('Speed Demon', 'Complete a challenge in under 5 minutes', '⚡', 'special', 'epic', 400, '{"speed_record": 300}');

-- ===================================
-- 🔍 INDEXES FOR PERFORMANCE
-- ===================================

-- User progress indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_commandment ON user_progress(commandment_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);

-- Exercise submissions indexes
CREATE INDEX idx_exercise_submissions_user ON exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise ON exercise_submissions(exercise_id);

-- AI interactions indexes
CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at);

-- Discussions indexes
CREATE INDEX idx_discussions_commandment ON discussions(commandment_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);
CREATE INDEX idx_discussions_created ON discussions(created_at);

-- ===================================
-- ✨ COMPLETION MESSAGE
-- ===================================

-- This completes the sacred database schema
-- May your queries be fast and your data be consistent! 🙏