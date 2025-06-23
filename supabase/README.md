# 🛠️ Supabase Database Schema - Vibe Coding Bible

Die vollständige Datenbank-Implementierung für die interaktive Vibe Coding Bible Plattform.

## 📁 Migration Files Overview

### `001_initial_schema.sql` (Existing)
- Basis-Schema mit grundlegenden Tabellen
- Ursprüngliche Implementation

### `002_comprehensive_schema.sql` ⭐ **MAIN SCHEMA**
- **Vollständige Datenbank-Architektur** für alle Features
- Enhanced User Management & Profiles
- 10 Sacred Commandments with rich content structure
- Interactive Exercises & Challenges System
- AI Integration & Mentoring
- Subscription & Billing (Stripe Integration)
- Gamification & Achievements
- Real-time Collaboration Features
- Community & Social Features
- Analytics & Progress Tracking
- Security with Row Level Security (RLS)

### `003_seed_data.sql` 🌱 **SEED DATA**
- **Alle 10 Gebote** mit vollständigem Content
- 4-Tier Subscription Plans (Free, Apostle, Prophet, Divine)
- 20+ Achievement Badges
- Sample Workshop Modules & Challenges
- Platform Analytics Starter Data

### `004_utility_functions_views.sql` ⚡ **UTILITIES**
- Materialized Views für Performance
- Helper Functions für Business Logic
- Analytics Views
- Maintenance Functions
- Engagement Score Calculation

## 🗂️ Database Architecture

### 🏗️ Core Tables Structure

```
📊 USER MANAGEMENT
├── profiles                    # Enhanced user profiles with XP, levels, streaks
├── subscriptions              # Stripe subscription management
├── subscription_plans         # 4-tier pricing plans
└── payment_history           # Payment tracking

📚 CONTENT STRUCTURE  
├── commandments              # 10 Sacred Commandments
├── workshop_modules          # Modules within each commandment
├── challenges               # Interactive exercises
└── challenge_submissions    # User solutions & scores

🏆 GAMIFICATION
├── achievements             # Badge definitions
├── user_achievements       # Earned badges
├── leaderboards           # Ranking system
└── user_leaderboard_positions

🤖 AI INTEGRATION
├── ai_interactions         # Chat history with AI mentors
├── ai_mentoring_sessions  # Structured mentoring sessions
└── ai_usage_tracking      # Usage limits & billing

👥 COLLABORATION
├── study_groups           # Learning communities
├── study_group_members    # Membership management
├── mentorships           # Human mentor relationships
├── collaboration_sessions # Real-time coding sessions
└── collaboration_participants

💬 COMMUNITY
├── community_posts        # Discussion forum
├── community_replies     # Thread responses
├── notifications        # User notifications
└── user_bookmarks      # Saved content

📊 ANALYTICS
├── user_analytics        # Daily user activity metrics
├── platform_analytics   # Platform-wide statistics
├── skill_assessments    # Certification tracking
└── user_dashboard_summary # Materialized view for dashboards
```

## 🚀 Installation & Setup

### 1. Initial Setup
```bash
# Navigate to your Supabase project
cd your-project/supabase

# Run migrations in order
supabase db reset  # If starting fresh
# OR apply migrations:
supabase migration up
```

### 2. Apply Migrations
```sql
-- Run in Supabase SQL Editor or via CLI:

-- 1. Core Schema (REQUIRED)
\i migrations/002_comprehensive_schema.sql

-- 2. Seed Data (RECOMMENDED) 
\i migrations/003_seed_data.sql

-- 3. Utilities (OPTIONAL but recommended)
\i migrations/004_utility_functions_views.sql
```

### 3. Post-Setup Configuration

```sql
-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE user_achievements;

-- Set up daily maintenance (if pg_cron is available)
SELECT cron.schedule('daily-maintenance', '0 2 * * *', 'SELECT daily_maintenance();');
```

## 🔑 Key Features Implemented

### ✅ User Management
- **4-Tier Subscription System**: Free (Seeker) → Apostle → Prophet → Divine
- **XP & Level System**: Gamified progression with automatic level calculation
- **Streak Tracking**: Daily learning streaks with bonuses
- **Prophet Ranks**: Novice → Apprentice → Practitioner → Architect → Prophet

### ✅ Content Management
- **10 Sacred Commandments**: Complete with rich JSONB content structure
- **Workshop Modules**: Hierarchical learning modules
- **Interactive Challenges**: Multiple types (coding, quiz, project, essay)
- **Progressive Unlocking**: Content unlocks based on level and subscription

### ✅ AI Integration
- **Multi-Model Support**: GPT-4, Claude-3.5-Sonnet, Gemini Pro
- **Usage Tracking**: Monthly limits based on subscription tier
- **Mentoring Sessions**: Structured AI coaching with outcomes tracking
- **Context Management**: Conversation history and code context

### ✅ Gamification
- **Achievement System**: 20+ badges across categories (skill, progress, social, special)
- **Leaderboards**: Multiple ranking categories with real-time updates
- **XP Rewards**: Detailed reward system with multipliers
- **Social Recognition**: Community achievements and showcasing

### ✅ Collaboration
- **Real-time Sessions**: Multi-user coding environments
- **Study Groups**: Community learning pods
- **Mentorship**: Human mentor matching and session management
- **Screen Sharing**: WebRTC-enabled collaboration tools

### ✅ Analytics & Insights
- **User Analytics**: Daily activity tracking and engagement scoring
- **Platform Metrics**: Business intelligence and growth tracking
- **Learning Recommendations**: AI-powered personalized suggestions
- **Progress Visualization**: Comprehensive dashboard metrics

## 📊 Subscription Tiers

| Feature | Free (Seeker) | Apostle ($29) | Prophet ($79) | Divine ($199) |
|---------|---------------|---------------|---------------|---------------|
| **Commandments** | 1-2 | 1-5 | 1-8 | 1-10 (All) |
| **AI Interactions/month** | 50 | 500 | 2,000 | Unlimited |
| **Mentoring** | ❌ | Peer | 2h/month | 8h/month |
| **Team Features** | ❌ | ❌ | ✅ | ✅ |
| **Certifications** | Basic | Advanced | Professional | Custom |
| **Support** | Community | Email | Priority | VIP (<4h) |

## 🎯 Usage Examples

### User Registration & Profile Setup
```typescript
// Create user profile after auth
const { data: profile } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    email: user.email,
    full_name: 'John Doe',
    subscription_status: 'free',
    prophet_rank: 'novice'
  });
```

### Award XP and Check Level Up
```sql
-- Award XP for completing a challenge
SELECT * FROM award_xp('user-uuid', 150, 'Challenge completed: Vision Canvas');

-- Check if user leveled up
SELECT 
  new_total_xp,
  new_level,
  level_up
FROM award_xp('user-uuid', 150);
```

### Check AI Usage Limits
```sql
-- Verify user can make AI request
SELECT * FROM check_ai_usage_limit('user-uuid');
-- Returns: within_limit, current_usage, usage_limit, reset_date
```

### Get Learning Recommendations
```sql
-- Get personalized recommendations
SELECT * FROM get_learning_recommendations('user-uuid');
-- Returns: next commandments, challenges, achievements
```

### Track User Progress
```typescript
// Update user progress through commandment
await supabase
  .from('user_progress')
  .upsert({
    user_id: userId,
    commandment_id: 1,
    status: 'in_progress',
    progress_percentage: 45,
    current_module_id: moduleId
  });
```

### Award Achievement
```typescript
// Check and award achievement
const { data: eligibleAchievements } = await supabase
  .rpc('check_achievement_eligibility', { user_uuid: userId });

// Award achievement
await supabase
  .from('user_achievements')
  .insert({
    user_id: userId,
    achievement_id: achievementId,
    is_completed: true,
    earned_at: new Date().toISOString()
  });
```

## 🔐 Security & RLS Policies

### Row Level Security (RLS) is enabled on all user data tables:

- **Profiles**: Users can only view/edit their own profile
- **Progress**: Users can only access their own learning progress
- **Submissions**: Users can only see their own challenge submissions
- **AI Interactions**: Private to each user
- **Subscriptions**: Users can only view their own billing data
- **Community Posts**: Public read, authenticated write
- **Analytics**: Users can only view their own analytics

### Content Security:
- **Commandments**: Public read access for published content
- **Challenges**: Access based on subscription tier and level
- **Achievements**: Public definitions, private user achievements

## 📈 Performance Optimizations

### Materialized Views
- `user_dashboard_summary`: Pre-calculated dashboard metrics
- `leaderboard_summary`: Cached leaderboard rankings

### Indexes
- **User lookups**: email, username, subscription_status
- **Content access**: commandment order, published status, difficulty
- **Progress tracking**: user+commandment, completion status
- **AI interactions**: user+session, timestamp
- **Community**: post type, creation date, tags (GIN index)
- **Full-text search**: commandments and posts content

### Maintenance Functions
```sql
-- Daily maintenance (run via cron)
SELECT daily_maintenance();

-- Manual view refresh
SELECT refresh_dashboard_views();

-- Cleanup old analytics data (keep 1 year)
SELECT cleanup_old_analytics(365);
```

## 🛠️ Development Workflow

### 1. Local Development
```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase migration up

# Reset and reseed for testing
supabase db reset
```

### 2. Schema Changes
```bash
# Create new migration
supabase migration new your_feature_name

# Apply changes
supabase migration up
```

### 3. Production Deployment
```bash
# Deploy to production
supabase db push
```

## 🧪 Testing Data

The seed data includes:
- **Test Users**: Various subscription tiers
- **Complete Content**: All 10 commandments with sample modules
- **Sample Progress**: Users at different learning stages
- **Achievements**: Various earned badges
- **Analytics**: Historical activity data

## 🔄 Maintenance Tasks

### Daily (Automated)
- Refresh materialized views
- Update platform analytics
- Cleanup old session data

### Weekly (Manual/Automated)
- Update leaderboard rankings
- Send engagement reports
- Process subscription renewals

### Monthly (Manual)
- Analyze user retention
- Review AI usage costs
- Update content recommendations

## 🚨 Troubleshooting

### Common Issues

1. **Migration Errors**
   ```bash
   # Check migration status
   supabase migration list
   
   # Repair if needed
   supabase migration repair
   ```

2. **RLS Policy Issues**
   ```sql
   -- Check if user can access data
   SELECT auth.uid(); -- Should return user ID
   
   -- Test policy
   SELECT * FROM profiles WHERE id = auth.uid();
   ```

3. **Performance Issues**
   ```sql
   -- Refresh materialized views
   REFRESH MATERIALIZED VIEW CONCURRENTLY user_dashboard_summary;
   
   -- Check index usage
   EXPLAIN ANALYZE SELECT * FROM your_slow_query;
   ```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Stripe Integration Guide](https://stripe.com/docs/billing/subscriptions)

## 🤝 Contributing

When modifying the schema:

1. **Always create new migrations** - never edit existing ones
2. **Test with sample data** - ensure RLS policies work correctly
3. **Update this README** - document new features and usage
4. **Consider performance** - add appropriate indexes
5. **Maintain backwards compatibility** - use additive changes when possible

---

## ✨ Sacred Database is Complete!

Diese Datenbank-Implementierung unterstützt alle Features der Vibe Coding Bible:

- 🎓 **Interaktive Workshops** mit den 10 heiligen Geboten
- 🤖 **AI-gestütztes Mentoring** mit mehreren KI-Modellen  
- 🏆 **Gamification System** mit XP, Levels und Achievements
- 👥 **Kollaborations-Features** für Teams und Communities
- 💰 **Vollständiges Subscription System** mit Stripe Integration
- 📊 **Analytics & Insights** für Lernfortschritt und Engagement
- 🔐 **Enterprise-ready Security** mit RLS und Audit Trails

May your queries be fast and your users be engaged! 🙏✨