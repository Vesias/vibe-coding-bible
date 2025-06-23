-- ✨ Die Vollständige Heilige Datenbank der Vibe Coding Bible
-- Enhanced Sacred Schema für die komplette interaktive Workshop-Plattform
-- Migration 002: Comprehensive Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ===================================
-- 🔧 ENUMS AND TYPES
-- ===================================

-- Create custom types for better type safety
CREATE TYPE subscription_status AS ENUM ('free', 'seeker', 'apostle', 'prophet', 'divine');
CREATE TYPE prophet_rank AS ENUM ('novice', 'apprentice', 'practitioner', 'architect', 'prophet');
CREATE TYPE workshop_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE challenge_type AS ENUM ('coding', 'quiz', 'project', 'essay', 'peer_review', 'prompt_engineering');
CREATE TYPE challenge_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert', 'divine');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'mastered');
CREATE TYPE achievement_category AS ENUM ('skill', 'progress', 'social', 'special', 'innovation');
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary', 'divine');
CREATE TYPE post_type AS ENUM ('discussion', 'showcase', 'help', 'announcement', 'question');
CREATE TYPE leaderboard_category AS ENUM ('overall', 'weekly', 'monthly', 'workshop_specific', 'skill_specific');
CREATE TYPE collaboration_status AS ENUM ('active', 'paused', 'ended');
CREATE TYPE participant_role AS ENUM ('host', 'mentor', 'participant', 'observer');
CREATE TYPE ai_model_type AS ENUM ('gpt-4', 'claude-3-5-sonnet', 'gemini-pro', 'gpt-4o', 'custom');
CREATE TYPE ai_interaction_type AS ENUM ('code_review', 'mentoring', 'debugging', 'explanation', 'pair_programming', 'prompt_optimization');
CREATE TYPE certification_level AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'divine');
CREATE TYPE mentoring_session_type AS ENUM ('one_on_one', 'group', 'masterclass', 'code_review');
CREATE TYPE session_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE team_subscription_type AS ENUM ('team', 'enterprise', 'education');
CREATE TYPE team_member_role AS ENUM ('owner', 'admin', 'manager', 'member', 'viewer');
CREATE TYPE marketplace_item_type AS ENUM ('workshop', 'certification', 'template', 'tool', 'mentoring');
CREATE TYPE currency_type AS ENUM ('USD', 'EUR', 'GBP');

-- ===================================
-- 👤 ENHANCED USER MANAGEMENT & PROFILES
-- ===================================

-- Enhanced user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    
    -- Subscription and Tier System
    subscription_status subscription_status NOT NULL DEFAULT 'free',
    subscription_id TEXT,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Prophet System
    prophet_rank prophet_rank NOT NULL DEFAULT 'novice',
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    
    -- Social and Profile Info
    github_username TEXT,
    discord_username TEXT,
    linkedin_url TEXT,
    twitter_username TEXT,
    website_url TEXT,
    
    -- Learning Preferences
    timezone TEXT DEFAULT 'UTC',
    preferred_language TEXT DEFAULT 'en',
    learning_preferences JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "discord": false}',
    
    -- Activity Tracking
    last_login TIMESTAMP WITH TIME ZONE,
    streak_days INTEGER DEFAULT 0,
    streak_last_date DATE,
    total_coding_hours INTEGER DEFAULT 0,
    
    -- Profile Settings
    is_public BOOLEAN DEFAULT true,
    is_mentor BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    show_achievements BOOLEAN DEFAULT true,
    show_progress BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_-]{3,30}$')
);

-- ===================================
-- 📚 ENHANCED COURSE CONTENT & STRUCTURE
-- ===================================

-- The 10 Sacred Commandments (Enhanced)
CREATE TABLE IF NOT EXISTS commandments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    content JSONB, -- Rich content with sections, exercises, etc.
    order_index INTEGER NOT NULL UNIQUE,
    
    -- Access Control
    required_tier subscription_status NOT NULL DEFAULT 'free',
    required_level INTEGER DEFAULT 1,
    prerequisites INTEGER[], -- References to other commandment IDs
    
    -- Learning Metadata
    estimated_duration INTEGER, -- in minutes
    difficulty_level workshop_difficulty DEFAULT 'beginner',
    learning_objectives TEXT[],
    skills_taught TEXT[],
    tools_required TEXT[],
    
    -- Divine Tools Association
    primary_ai_tool TEXT, -- Sankt Claude, Cline der Mächtige, etc.
    secondary_tools TEXT[],
    
    -- Content Media
    featured_image_url TEXT,
    video_intro_url TEXT,
    cover_illustration JSONB,
    
    -- Engagement
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop modules within each commandment (Enhanced)
CREATE TABLE IF NOT EXISTS workshop_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    commandment_id INTEGER REFERENCES commandments(id) ON DELETE CASCADE,
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    content JSONB, -- Rich content structure
    module_type TEXT NOT NULL CHECK (module_type IN ('theory', 'exercise', 'challenge', 'project', 'assessment', 'video', 'interactive')),
    
    -- Structure
    order_index INTEGER NOT NULL,
    parent_module_id UUID REFERENCES workshop_modules(id),
    
    -- Access Control
    required_tier subscription_status NOT NULL DEFAULT 'free',
    required_level INTEGER DEFAULT 1,
    unlock_criteria JSONB, -- Conditions to unlock this module
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    badge_reward TEXT,
    
    -- Learning Support
    estimated_duration INTEGER, -- in minutes
    difficulty_level challenge_difficulty DEFAULT 'easy',
    hints JSONB,
    resources JSONB, -- Links, references, etc.
    
    -- Interactive Features
    is_interactive BOOLEAN DEFAULT false,
    interactive_config JSONB, -- Configuration for interactive components
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 🎯 INTERACTIVE EXERCISES & CHALLENGES
-- ===================================

-- Enhanced exercises and challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workshop_id UUID REFERENCES workshop_modules(id) ON DELETE CASCADE,
    
    -- Basic Info
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    
    -- Challenge Configuration
    type challenge_type NOT NULL,
    difficulty challenge_difficulty DEFAULT 'easy',
    order_index INTEGER NOT NULL,
    
    -- Content Structure
    content JSONB NOT NULL, -- Challenge instructions, starter code, etc.
    solution JSONB, -- Hidden solution and explanation
    test_cases JSONB, -- For coding challenges
    validation_criteria JSONB,
    
    -- AI Integration
    ai_prompts JSONB, -- Prompts for AI assistance
    ai_model_suggestions ai_model_type[],
    
    -- Scoring and Rewards
    max_score INTEGER DEFAULT 100,
    xp_reward INTEGER DEFAULT 0,
    time_limit INTEGER, -- in seconds
    max_attempts INTEGER,
    passing_score INTEGER DEFAULT 70,
    
    -- Learning Support
    hints JSONB,
    resources JSONB,
    starter_template JSONB,
    
    -- Analytics
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_time INTEGER, -- in seconds
    total_attempts INTEGER DEFAULT 0,
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 📊 USER PROGRESS & TRACKING
-- ===================================

-- Enhanced user progress through commandments
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    commandment_id INTEGER REFERENCES commandments(id) ON DELETE CASCADE,
    
    -- Progress Status
    status progress_status DEFAULT 'not_started',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    
    -- Current State
    current_module_id UUID REFERENCES workshop_modules(id),
    completed_modules UUID[],
    
    -- Time Tracking
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    
    -- Performance Metrics
    xp_earned INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    completed_challenges INTEGER DEFAULT 0,
    
    -- Learning Data
    notes TEXT,
    bookmarks JSONB, -- User bookmarks within the commandment
    personal_goals TEXT[],
    
    -- Feedback
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    feedback_given_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint
    UNIQUE(user_id, commandment_id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced challenge submissions
CREATE TABLE IF NOT EXISTS challenge_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    
    -- Submission Data
    submission_data JSONB NOT NULL, -- Code, answers, files, etc.
    submission_type TEXT NOT NULL, -- 'code', 'text', 'file', 'multiple_choice'
    
    -- Scoring
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    is_correct BOOLEAN DEFAULT false,
    is_best_attempt BOOLEAN DEFAULT false,
    
    -- AI Assistance Tracking
    ai_interactions_count INTEGER DEFAULT 0,
    ai_help_used BOOLEAN DEFAULT false,
    ai_model_used ai_model_type,
    
    -- Performance Metrics
    execution_time INTEGER, -- Time to complete in seconds
    code_quality_score INTEGER, -- For coding challenges
    creativity_score INTEGER, -- For open-ended challenges
    
    -- Feedback and Review
    automated_feedback TEXT,
    mentor_feedback TEXT,
    peer_review_scores JSONB,
    
    -- Review Status
    needs_review BOOLEAN DEFAULT false,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES profiles(id),
    
    -- Attempt Tracking
    attempt_number INTEGER DEFAULT 1,
    total_attempts INTEGER DEFAULT 1,
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT unique_best_attempt UNIQUE (user_id, challenge_id, is_best_attempt) DEFERRABLE INITIALLY DEFERRED
);

-- ===================================
-- 🏆 ENHANCED GAMIFICATION & ACHIEVEMENTS
-- ===================================

-- Enhanced achievement definitions
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Info
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    
    -- Visual
    icon TEXT,
    badge_url TEXT,
    rarity achievement_rarity NOT NULL DEFAULT 'common',
    category achievement_category NOT NULL,
    
    -- Requirements and Rewards
    requirements JSONB NOT NULL, -- JSON criteria for earning achievement
    xp_reward INTEGER DEFAULT 0,
    special_rewards JSONB, -- Unlocks, titles, etc.
    
    -- Unlock Conditions
    unlock_criteria JSONB, -- When this achievement becomes available
    prerequisite_achievements UUID[], -- Required achievements
    required_level INTEGER DEFAULT 1,
    
    -- Statistics
    earned_count INTEGER DEFAULT 0,
    earned_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false, -- Secret achievements
    is_repeatable BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user earned achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Achievement Data
    progress INTEGER DEFAULT 100, -- Progress towards achievement (0-100)
    current_value INTEGER DEFAULT 0, -- Current value for progressive achievements
    required_value INTEGER, -- Required value to complete
    
    -- Completion
    is_completed BOOLEAN DEFAULT false,
    earned_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    context JSONB, -- Additional context about how it was earned
    related_challenge_id UUID REFERENCES challenges(id),
    related_commandment_id INTEGER REFERENCES commandments(id),
    
    -- Social
    is_showcased BOOLEAN DEFAULT true,
    celebration_shown BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for non-repeatable achievements
    UNIQUE(user_id, achievement_id)
);

-- ===================================
-- 🤖 ENHANCED AI INTEGRATION & INTERACTIONS
-- ===================================

-- Enhanced AI chat interactions and mentoring
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Context
    session_id TEXT,
    workshop_id UUID REFERENCES workshop_modules(id),
    challenge_id UUID REFERENCES challenges(id),
    
    -- AI Configuration
    ai_model ai_model_type NOT NULL,
    ai_personality TEXT, -- Moses, Solomon, David, etc.
    interaction_type ai_interaction_type NOT NULL,
    
    -- Interaction Data
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    conversation_context JSONB, -- Previous messages, current task, etc.
    code_context TEXT, -- Current code being worked on
    
    -- Quality Metrics
    response_quality_score INTEGER, -- 1-10 rating
    was_helpful BOOLEAN,
    user_feedback TEXT,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    
    -- Performance Metrics
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    
    -- Analytics
    led_to_solution BOOLEAN DEFAULT false,
    follow_up_questions INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI mentoring sessions (Enhanced)
CREATE TABLE IF NOT EXISTS ai_mentoring_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Session Context
    workshop_id UUID REFERENCES workshop_modules(id),
    session_name TEXT NOT NULL,
    ai_model ai_model_type NOT NULL,
    ai_personality TEXT,
    
    -- Learning Goals
    stated_goals TEXT[],
    inferred_goals TEXT[],
    session_focus TEXT, -- 'debugging', 'learning_concept', 'project_guidance'
    
    -- Conversation Data
    conversation_history JSONB NOT NULL,
    conversation_summary TEXT,
    key_insights TEXT[],
    
    -- Skill Assessment
    initial_skill_assessment JSONB,
    final_skill_assessment JSONB,
    skill_improvements JSONB,
    areas_for_improvement TEXT[],
    
    -- Recommendations
    personalized_recommendations JSONB,
    suggested_next_steps TEXT[],
    recommended_resources JSONB,
    learning_path_adjustments JSONB,
    
    -- Outcomes
    session_duration INTEGER, -- in seconds
    goals_achieved TEXT[],
    breakthrough_moments TEXT[],
    confusion_points TEXT[],
    
    -- Next Session Planning
    next_session_recommendations TEXT[],
    homework_assignments TEXT[],
    follow_up_reminders JSONB,
    
    -- Quality Metrics
    session_effectiveness_score INTEGER, -- 1-10
    user_satisfaction_score INTEGER, -- 1-10
    mentor_rating INTEGER CHECK (mentor_rating BETWEEN 1 AND 5),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- AI usage tracking for billing/limits
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Time Period
    period_type TEXT NOT NULL, -- 'daily', 'monthly', 'billing_cycle'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Usage Metrics
    total_interactions INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10,2) DEFAULT 0,
    
    -- Breakdown by Model
    usage_by_model JSONB DEFAULT '{}',
    cost_by_model JSONB DEFAULT '{}',
    
    -- Breakdown by Feature
    mentoring_interactions INTEGER DEFAULT 0,
    code_review_interactions INTEGER DEFAULT 0,
    debugging_interactions INTEGER DEFAULT 0,
    pair_programming_interactions INTEGER DEFAULT 0,
    
    -- Limits and Warnings
    usage_limit INTEGER,
    limit_warnings_sent INTEGER DEFAULT 0,
    is_over_limit BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for period tracking
    UNIQUE(user_id, period_type, period_start)
);

-- ===================================
-- 💰 ENHANCED SUBSCRIPTION & BILLING
-- ===================================

-- Enhanced subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Plan Details
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tier subscription_status NOT NULL UNIQUE,
    description TEXT,
    
    -- Pricing
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    price_lifetime DECIMAL(10,2),
    
    -- Features and Limits
    features JSONB NOT NULL,
    ai_interaction_limit INTEGER, -- -1 for unlimited
    workshop_access INTEGER[], -- Commandment IDs accessible
    team_features BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    
    -- Stripe Integration
    stripe_price_id_monthly TEXT,
    stripe_price_id_yearly TEXT,
    stripe_product_id TEXT,
    
    -- Analytics
    active_subscriptions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    
    -- Stripe Integration
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    stripe_payment_method_id TEXT,
    
    -- Subscription Status
    status TEXT NOT NULL, -- active, canceled, past_due, etc.
    billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly, lifetime
    
    -- Billing Periods
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    -- Discount and Coupons
    discount_percent INTEGER,
    coupon_code TEXT,
    
    -- Usage Tracking
    usage_limits JSONB,
    current_usage JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Payment Details
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency currency_type DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL, -- succeeded, failed, pending, etc.
    failure_reason TEXT,
    
    -- Billing
    invoice_url TEXT,
    receipt_url TEXT,
    
    -- Timestamps
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 👥 ENHANCED COLLABORATION & COMMUNITY
-- ===================================

-- Enhanced study groups and teams
CREATE TABLE IF NOT EXISTS study_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Info
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    
    -- Group Settings
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    max_members INTEGER DEFAULT 10,
    current_members INTEGER DEFAULT 1,
    is_public BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Learning Focus
    focus_commandments INTEGER[], -- Which commandments the group focuses on
    skill_level workshop_difficulty,
    learning_goals TEXT[],
    
    -- Activity Settings
    meeting_schedule JSONB, -- When the group meets
    timezone TEXT DEFAULT 'UTC',
    communication_channels JSONB, -- Discord, Slack, etc.
    
    -- Gamification
    group_xp INTEGER DEFAULT 0,
    group_level INTEGER DEFAULT 1,
    group_achievements UUID[],
    
    -- Stats
    total_sessions INTEGER DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced study group memberships
CREATE TABLE IF NOT EXISTS study_group_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Membership
    role team_member_role DEFAULT 'member',
    status TEXT DEFAULT 'active', -- active, inactive, pending, banned
    
    -- Permissions
    permissions JSONB DEFAULT '{}',
    can_invite BOOLEAN DEFAULT false,
    can_moderate BOOLEAN DEFAULT false,
    
    -- Activity
    participation_score INTEGER DEFAULT 0,
    sessions_attended INTEGER DEFAULT 0,
    contributions INTEGER DEFAULT 0,
    
    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique constraint
    UNIQUE(group_id, user_id)
);

-- Enhanced mentorship relationships
CREATE TABLE IF NOT EXISTS mentorships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Relationship Status
    status session_status DEFAULT 'scheduled',
    mentorship_type TEXT DEFAULT 'general', -- 'general', 'project_specific', 'career'
    
    -- Focus Areas
    focus_areas TEXT[], -- Specific skills or topics
    goals TEXT[],
    success_metrics TEXT[],
    
    -- Scheduling
    session_frequency TEXT, -- 'weekly', 'biweekly', 'monthly'
    preferred_times JSONB,
    timezone_mentor TEXT,
    timezone_mentee TEXT,
    
    -- Progress Tracking
    sessions_completed INTEGER DEFAULT 0,
    goals_achieved INTEGER DEFAULT 0,
    mentee_progress_rating INTEGER CHECK (mentee_progress_rating BETWEEN 1 AND 10),
    
    -- Feedback
    mentor_rating INTEGER CHECK (mentor_rating BETWEEN 1 AND 5),
    mentee_rating INTEGER CHECK (mentee_rating BETWEEN 1 AND 5),
    relationship_notes TEXT,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    last_session TIMESTAMP WITH TIME ZONE,
    next_session TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(mentor_id, mentee_id)
);

-- ===================================
-- 🎮 REAL-TIME COLLABORATION SYSTEM
-- ===================================

-- Enhanced collaboration sessions
CREATE TABLE IF NOT EXISTS collaboration_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Session Context
    workshop_id UUID REFERENCES workshop_modules(id),
    challenge_id UUID REFERENCES challenges(id),
    host_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Session Details
    name TEXT NOT NULL,
    description TEXT,
    session_type TEXT DEFAULT 'workshop', -- 'workshop', 'study_group', 'pair_programming', 'code_review'
    
    -- Participant Management
    max_participants INTEGER DEFAULT 5,
    current_participants INTEGER DEFAULT 1,
    invited_users UUID[],
    
    -- Session Status
    status collaboration_status DEFAULT 'active',
    
    -- Real-time Features
    shared_workspace JSONB DEFAULT '{}', -- Shared code, notes, whiteboard
    cursor_positions JSONB DEFAULT '{}',
    active_file TEXT,
    
    -- Communication Features
    voice_chat_enabled BOOLEAN DEFAULT false,
    video_chat_enabled BOOLEAN DEFAULT false,
    screen_sharing_enabled BOOLEAN DEFAULT false,
    chat_history JSONB DEFAULT '[]',
    
    -- AI Features
    ai_mentor_enabled BOOLEAN DEFAULT false,
    ai_model_preference ai_model_type DEFAULT 'claude-3-5-sonnet',
    
    -- Session Recording
    session_recording_url TEXT,
    recording_enabled BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Collaboration participants
CREATE TABLE IF NOT EXISTS collaboration_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Participant Role
    role participant_role DEFAULT 'participant',
    permissions JSONB DEFAULT '{}',
    
    -- Real-time State
    cursor_position JSONB,
    active_file TEXT,
    is_typing BOOLEAN DEFAULT false,
    typing_indicator TEXT,
    
    -- Communication State
    voice_enabled BOOLEAN DEFAULT false,
    video_enabled BOOLEAN DEFAULT false,
    screen_sharing BOOLEAN DEFAULT false,
    is_muted BOOLEAN DEFAULT false,
    
    -- Activity Tracking
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    total_time_active INTEGER DEFAULT 0, -- in seconds
    
    -- Unique constraint
    UNIQUE(session_id, user_id)
);

-- ===================================
-- 📝 ENHANCED CONTENT & DISCUSSIONS
-- ===================================

-- Enhanced discussion forums
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Author and Context
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    commandment_id INTEGER REFERENCES commandments(id),
    workshop_id UUID REFERENCES workshop_modules(id),
    challenge_id UUID REFERENCES challenges(id),
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'markdown', -- 'markdown', 'html', 'plain'
    excerpt TEXT,
    
    -- Post Configuration
    type post_type NOT NULL,
    tags TEXT[],
    
    -- Engagement
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Social Features
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    is_solved BOOLEAN DEFAULT false, -- For help posts
    
    -- Moderation
    is_reported BOOLEAN DEFAULT false,
    report_count INTEGER DEFAULT 0,
    moderator_notes TEXT,
    
    -- SEO
    slug TEXT UNIQUE,
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced discussion replies
CREATE TABLE IF NOT EXISTS community_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES community_replies(id),
    
    -- Content
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'markdown',
    
    -- Engagement
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    -- Special Flags
    is_solution BOOLEAN DEFAULT false, -- Marked as solution by post author
    is_highlighted BOOLEAN DEFAULT false, -- Highlighted by moderators
    
    -- Moderation
    is_reported BOOLEAN DEFAULT false,
    report_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 🏆 ENHANCED LEADERBOARDS
-- ===================================

-- Enhanced leaderboard system
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Leaderboard Configuration
    category leaderboard_category NOT NULL,
    subcategory TEXT, -- e.g., specific skill, workshop, etc.
    name TEXT NOT NULL,
    description TEXT,
    
    -- Time Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Ranking Data
    rankings JSONB NOT NULL, -- Array of user rankings with scores
    total_participants INTEGER DEFAULT 0,
    
    -- Related Entities
    workshop_id UUID REFERENCES workshop_modules(id),
    commandment_id INTEGER REFERENCES commandments(id),
    
    -- Configuration
    scoring_method TEXT DEFAULT 'total_xp', -- 'total_xp', 'completion_time', 'accuracy', etc.
    update_frequency TEXT DEFAULT 'daily', -- 'real_time', 'hourly', 'daily', 'weekly'
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User leaderboard positions (for efficient queries)
CREATE TABLE IF NOT EXISTS user_leaderboard_positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    leaderboard_id UUID REFERENCES leaderboards(id) ON DELETE CASCADE,
    
    -- Position Data
    current_rank INTEGER NOT NULL,
    previous_rank INTEGER,
    rank_change INTEGER DEFAULT 0, -- Positive = moved up, negative = moved down
    score DECIMAL(12,2) NOT NULL,
    
    -- Percentile
    percentile DECIMAL(5,2),
    
    -- Timestamps
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id, leaderboard_id)
);

-- ===================================
-- 📊 ENHANCED ANALYTICS & INSIGHTS
-- ===================================

-- Enhanced learning analytics
CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Time Period
    date DATE NOT NULL,
    week_start DATE,
    month_start DATE,
    
    -- Learning Metrics
    coding_time_minutes INTEGER DEFAULT 0,
    workshops_accessed INTEGER DEFAULT 0,
    workshops_completed INTEGER DEFAULT 0,
    challenges_attempted INTEGER DEFAULT 0,
    challenges_completed INTEGER DEFAULT 0,
    
    -- AI Interaction Metrics
    ai_interactions INTEGER DEFAULT 0,
    ai_tokens_used INTEGER DEFAULT 0,
    ai_cost_usd DECIMAL(8,4) DEFAULT 0,
    
    -- Social Metrics
    collaboration_sessions INTEGER DEFAULT 0,
    mentoring_sessions INTEGER DEFAULT 0,
    community_posts INTEGER DEFAULT 0,
    community_replies INTEGER DEFAULT 0,
    
    -- Performance Metrics
    xp_earned INTEGER DEFAULT 0,
    achievements_earned INTEGER DEFAULT 0,
    avg_challenge_score DECIMAL(5,2),
    avg_completion_time INTEGER, -- in seconds
    
    -- Engagement Metrics
    login_count INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0, -- in minutes
    pages_visited INTEGER DEFAULT 0,
    features_used TEXT[],
    
    -- Learning Insights
    skill_improvements JSONB DEFAULT '{}',
    learning_velocity DECIMAL(8,4) DEFAULT 0, -- XP per hour
    focus_areas TEXT[],
    
    -- Predictive Metrics
    engagement_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    retention_risk_score DECIMAL(5,2) DEFAULT 0, -- 0-100
    
    -- Personalized Insights
    strengths TEXT[],
    areas_for_improvement TEXT[],
    recommended_actions TEXT[],
    personalized_insights JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id, date)
);

-- Platform-wide analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Time Period
    date DATE NOT NULL UNIQUE,
    
    -- User Metrics
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_registrations INTEGER DEFAULT 0,
    user_retention_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Learning Metrics
    total_workshop_completions INTEGER DEFAULT 0,
    total_challenge_submissions INTEGER DEFAULT 0,
    avg_completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- AI Usage Metrics
    total_ai_interactions INTEGER DEFAULT 0,
    total_tokens_used BIGINT DEFAULT 0,
    total_ai_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Revenue Metrics
    total_revenue DECIMAL(12,2) DEFAULT 0,
    new_subscriptions INTEGER DEFAULT 0,
    churned_subscriptions INTEGER DEFAULT 0,
    mrr DECIMAL(12,2) DEFAULT 0, -- Monthly Recurring Revenue
    
    -- Engagement Metrics
    avg_session_duration INTEGER DEFAULT 0, -- in minutes
    total_collaboration_sessions INTEGER DEFAULT 0,
    community_posts_created INTEGER DEFAULT 0,
    
    -- Quality Metrics
    user_satisfaction_score DECIMAL(3,2) DEFAULT 0,
    support_ticket_count INTEGER DEFAULT 0,
    bug_reports INTEGER DEFAULT 0,
    
    -- Additional Insights
    top_performing_workshops INTEGER[],
    most_challenging_exercises UUID[],
    trending_topics TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- 🎯 SPECIALIZED FEATURES
-- ===================================

-- Skill assessments and certifications
CREATE TABLE IF NOT EXISTS skill_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Assessment Details
    assessment_type TEXT NOT NULL, -- 'initial', 'milestone', 'final', 'custom'
    skill_category TEXT NOT NULL,
    assessment_name TEXT NOT NULL,
    
    -- Scoring
    total_score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    percentage_score DECIMAL(5,2) DEFAULT 0,
    grade TEXT, -- 'A', 'B', 'C', 'D', 'F' or custom grading
    
    -- Detailed Results
    skill_breakdown JSONB, -- Scores in different skill areas
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations TEXT[],
    
    -- Assessment Data
    questions_answered INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Certification
    certification_earned BOOLEAN DEFAULT false,
    certification_level certification_level,
    certificate_url TEXT,
    
    -- Validity
    expires_at TIMESTAMP WITH TIME ZONE,
    is_valid BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notifications system
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Notification Content
    type TEXT NOT NULL, -- 'achievement', 'mentorship', 'collaboration', 'system', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_text TEXT,
    action_url TEXT,
    
    -- Rich Content
    icon TEXT,
    image_url TEXT,
    data JSONB, -- Additional structured data
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    
    -- Delivery
    delivery_method TEXT[], -- 'in_app', 'email', 'push', 'discord'
    sent_via TEXT[], -- Which methods were actually used
    email_sent_at TIMESTAMP WITH TIME ZONE,
    push_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Priority
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- User bookmarks and favorites
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Bookmarked Content
    content_type TEXT NOT NULL, -- 'commandment', 'workshop', 'challenge', 'post', 'reply'
    content_id TEXT NOT NULL,
    
    -- Organization
    folder TEXT DEFAULT 'default',
    tags TEXT[],
    notes TEXT,
    
    -- Status
    is_favorite BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(user_id, content_type, content_id)
);

-- ===================================
-- 🔐 ENHANCED SECURITY & RLS
-- ===================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_leaderboard_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Users can manage their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Content visibility policies
CREATE POLICY "Published commandments are visible to all" ON commandments FOR SELECT USING (is_published = true);
CREATE POLICY "Published workshops are visible to all" ON workshop_modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM commandments WHERE id = commandment_id AND is_published = true)
);
CREATE POLICY "Published challenges are visible to all" ON challenges FOR SELECT USING (is_published = true);

-- User progress policies
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own submissions" ON challenge_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- AI interaction policies
CREATE POLICY "Users can manage own AI interactions" ON ai_interactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mentoring sessions" ON ai_mentoring_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own AI usage" ON ai_usage_tracking FOR SELECT USING (auth.uid() = user_id);

-- Subscription policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payment history" ON payment_history FOR SELECT USING (auth.uid() = user_id);

-- Community policies
CREATE POLICY "Public posts are visible to all" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON user_bookmarks FOR ALL USING (auth.uid() = user_id);

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
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenge_submissions_updated_at BEFORE UPDATE ON challenge_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level = sqrt(XP / 100) + 1, capped at reasonable maximum
    RETURN LEAST(FLOOR(SQRT(xp_points / 100.0)) + 1, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION award_xp(user_uuid UUID, xp_amount INTEGER, source_description TEXT DEFAULT '')
RETURNS TABLE(new_total_xp INTEGER, new_level INTEGER, level_up BOOLEAN) AS $$
DECLARE
    old_level INTEGER;
    calculated_new_level INTEGER;
    old_xp INTEGER;
    calculated_new_xp INTEGER;
BEGIN
    -- Get current XP and level
    SELECT total_xp, current_level INTO old_xp, old_level
    FROM profiles WHERE id = user_uuid;
    
    -- Calculate new values
    calculated_new_xp := old_xp + xp_amount;
    calculated_new_level := calculate_user_level(calculated_new_xp);
    
    -- Update user profile
    UPDATE profiles 
    SET total_xp = calculated_new_xp,
        current_level = calculated_new_level,
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Return results
    new_total_xp := calculated_new_xp;
    new_level := calculated_new_level;
    level_up := calculated_new_level > old_level;
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER;
    last_date DATE;
    today DATE := CURRENT_DATE;
BEGIN
    -- Get current streak data
    SELECT streak_days, streak_last_date INTO current_streak, last_date
    FROM profiles WHERE id = user_uuid;
    
    -- Initialize if null
    current_streak := COALESCE(current_streak, 0);
    
    -- Check streak logic
    IF last_date IS NULL OR last_date < today - INTERVAL '1 day' THEN
        -- Reset streak if more than 1 day gap
        IF last_date = today - INTERVAL '1 day' THEN
            -- Consecutive day - increment streak
            current_streak := current_streak + 1;
        ELSE
            -- Gap in days - reset streak
            current_streak := 1;
        END IF;
        
        -- Update profile
        UPDATE profiles 
        SET streak_days = current_streak,
            streak_last_date = today,
            updated_at = NOW()
        WHERE id = user_uuid;
    END IF;
    
    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(user_uuid UUID)
RETURNS subscription_status AS $$
DECLARE
    user_tier subscription_status;
BEGIN
    SELECT subscription_status INTO user_tier
    FROM profiles WHERE id = user_uuid;
    
    RETURN COALESCE(user_tier, 'free');
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has access to content
CREATE OR REPLACE FUNCTION user_has_content_access(user_uuid UUID, required_tier subscription_status, content_level INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier subscription_status;
    user_level INTEGER;
    tier_hierarchy INTEGER[];
BEGIN
    -- Get user's current tier and level
    SELECT subscription_status, current_level INTO user_tier, user_level
    FROM profiles WHERE id = user_uuid;
    
    -- Define tier hierarchy (higher index = higher tier)
    tier_hierarchy := ARRAY['free', 'seeker', 'apostle', 'prophet', 'divine'];
    
    -- Check tier access
    IF array_position(tier_hierarchy, user_tier) >= array_position(tier_hierarchy, required_tier) THEN
        -- Check level requirement
        IF user_level >= content_level THEN
            RETURN true;
        END IF;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- 🔍 PERFORMANCE INDEXES
-- ===================================

-- User and profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_prophet_rank ON profiles(prophet_rank);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_commandments_order ON commandments(order_index);
CREATE INDEX IF NOT EXISTS idx_commandments_published ON commandments(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_commandments_tier ON commandments(required_tier);
CREATE INDEX IF NOT EXISTS idx_commandments_slug ON commandments(slug);

CREATE INDEX IF NOT EXISTS idx_workshop_modules_commandment ON workshop_modules(commandment_id);
CREATE INDEX IF NOT EXISTS idx_workshop_modules_order ON workshop_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_workshop_modules_type ON workshop_modules(module_type);

CREATE INDEX IF NOT EXISTS idx_challenges_workshop ON challenges(workshop_id);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_challenges_published ON challenges(is_published) WHERE is_published = true;

-- Progress and submissions indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_commandment ON user_progress(commandment_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed_at) WHERE completed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user ON challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge ON challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_score ON challenge_submissions(score DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_best ON challenge_submissions(user_id, challenge_id, is_best_attempt) WHERE is_best_attempt = true;

-- Achievement indexes
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(is_completed, earned_at) WHERE is_completed = true;

-- AI interaction indexes
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session ON ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created ON ai_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_mentoring_sessions_user ON ai_mentoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_mentoring_sessions_workshop ON ai_mentoring_sessions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_ai_mentoring_sessions_completed ON ai_mentoring_sessions(completed_at) WHERE completed_at IS NOT NULL;

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON subscriptions(current_period_start, current_period_end);

-- Community indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(type);
CREATE INDEX IF NOT EXISTS idx_community_posts_commandment ON community_posts(commandment_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_featured ON community_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_community_replies_post ON community_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_user ON community_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_created ON community_replies(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON user_analytics(date);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date);

-- Collaboration indexes
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_host ON collaboration_sessions(host_user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_workshop ON collaboration_sessions(workshop_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_status ON collaboration_sessions(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_created ON collaboration_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_collaboration_participants_session ON collaboration_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_participants_user ON collaboration_participants(user_id);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboards_category ON leaderboards(category);
CREATE INDEX IF NOT EXISTS idx_leaderboards_period ON leaderboards(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_leaderboards_active ON leaderboards(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_leaderboard_positions_user ON user_leaderboard_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_leaderboard_positions_leaderboard ON user_leaderboard_positions(leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_user_leaderboard_positions_rank ON user_leaderboard_positions(current_rank);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_commandments_search ON commandments USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_community_posts_search ON community_posts USING GIN(to_tsvector('english', title || ' ' || content));

-- ===================================
-- ✨ COMPLETION MESSAGE
-- ===================================

-- This completes the comprehensive sacred database schema
-- May your queries be fast, your data be consistent, and your users be engaged! 🙏
COMMENT ON SCHEMA public IS 'Die Vollständige Heilige Datenbank der Vibe Coding Bible - Comprehensive Schema v2.0';