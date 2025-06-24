-- Basic Schema Setup for Vibe Coding Bible
-- This creates the minimal required tables for the app to function

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'pro', 'divine')),
    subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    prophet_rank TEXT DEFAULT 'novice' CHECK (prophet_rank IN ('novice', 'apprentice', 'practitioner', 'architect', 'prophet'))
);

-- Create workshops table
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    commandment_number INTEGER NOT NULL UNIQUE CHECK (commandment_number BETWEEN 1 AND 10),
    content JSONB,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration INTEGER, -- in minutes
    xp_reward INTEGER DEFAULT 0,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    tools_required TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false,
    featured_image TEXT
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    current_challenge_id TEXT,
    completed_challenges TEXT[],
    xp_earned INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, workshop_id)
);

-- Create sessions table for collaboration
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    session_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Workshops policies (public read, admin write)
CREATE POLICY "Anyone can view published workshops" ON public.workshops
    FOR SELECT USING (is_published = true);

-- User progress policies
CREATE POLICY "Users can manage own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY "Users can manage own sessions" ON public.sessions
    FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at 
    BEFORE UPDATE ON public.workshops 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON public.user_progress 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON public.sessions 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample workshop data
INSERT INTO public.workshops (title, slug, description, commandment_number, difficulty_level, estimated_duration, xp_reward, learning_objectives, tools_required, is_published)
VALUES 
    (
        'Die Heilige Vision - Commandment I',
        'commandment-i-die-heilige-vision',
        'Lerne die Grundlagen der KI-unterstützten Entwicklung und erkenne deine göttliche Vision.',
        1,
        'beginner',
        60,
        100,
        ARRAY['Verstehe KI-Grundlagen', 'Entwickle eine Vision', 'Setze Ziele'],
        ARRAY['Claude', 'VS Code', 'Git'],
        true
    ),
    (
        'Der Rechte Stack - Commandment II',
        'commandment-ii-der-rechte-stack',
        'Wähle die richtigen Technologien für dein Projekt aus.',
        2,
        'beginner',
        90,
        150,
        ARRAY['Stack-Selection', 'Tool-Integration', 'Setup-Automation'],
        ARRAY['Next.js', 'TypeScript', 'Supabase'],
        true
    ),
    (
        'Die Prompt-Kunst - Commandment III',
        'commandment-iii-die-prompt-kunst',
        'Meistere die Kunst des Prompt Engineering für maximale KI-Effizienz.',
        3,
        'intermediate',
        120,
        200,
        ARRAY['Prompt-Design', 'Context-Management', 'Output-Optimization'],
        ARRAY['GPT-4', 'Claude', 'Cursor'],
        true
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_workshops_commandment_number ON public.workshops(commandment_number);
CREATE INDEX IF NOT EXISTS idx_workshops_published ON public.workshops(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_workshop_id ON public.user_progress(workshop_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- Success message
SELECT 'Vibe Coding Bible basic schema created successfully! 🚀' as status;