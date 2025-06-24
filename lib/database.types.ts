export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          subscription_status: 'free' | 'basic' | 'pro' | 'divine'
          subscription_id?: string
          created_at: string
          updated_at: string
          last_login?: string
          total_xp: number
          current_level: number
          prophet_rank: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
          github_username?: string
          discord_username?: string
          timezone?: string
          learning_preferences?: Json
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          subscription_status?: 'free' | 'basic' | 'pro' | 'divine'
          subscription_id?: string
          created_at?: string
          updated_at?: string
          last_login?: string
          total_xp?: number
          current_level?: number
          prophet_rank?: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
          github_username?: string
          discord_username?: string
          timezone?: string
          learning_preferences?: Json
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          subscription_status?: 'free' | 'basic' | 'pro' | 'divine'
          subscription_id?: string
          created_at?: string
          updated_at?: string
          last_login?: string
          total_xp?: number
          current_level?: number
          prophet_rank?: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
          github_username?: string
          discord_username?: string
          timezone?: string
          learning_preferences?: Json
        }
      }
      workshops: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          commandment_number: number
          content: Json
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration: number
          xp_reward: number
          prerequisites?: string[]
          learning_objectives: string[]
          tools_required: string[]
          created_at: string
          updated_at: string
          is_published: boolean
          featured_image?: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          commandment_number: number
          content: Json
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration: number
          xp_reward: number
          prerequisites?: string[]
          learning_objectives: string[]
          tools_required: string[]
          created_at?: string
          updated_at?: string
          is_published?: boolean
          featured_image?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          commandment_number?: number
          content?: Json
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration?: number
          xp_reward?: number
          prerequisites?: string[]
          learning_objectives?: string[]
          tools_required?: string[]
          created_at?: string
          updated_at?: string
          is_published?: boolean
          featured_image?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          workshop_id: string
          status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
          progress_percentage: number
          current_challenge_id?: string
          completed_challenges: string[]
          xp_earned: number
          time_spent: number
          started_at?: string
          completed_at?: string
          last_accessed: string
          notes?: string
          rating?: number
          review?: string
        }
        Insert: {
          id?: string
          user_id: string
          workshop_id: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'mastered'
          progress_percentage?: number
          current_challenge_id?: string
          completed_challenges?: string[]
          xp_earned?: number
          time_spent?: number
          started_at?: string
          completed_at?: string
          last_accessed?: string
          notes?: string
          rating?: number
          review?: string
        }
        Update: {
          id?: string
          user_id?: string
          workshop_id?: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'mastered'
          progress_percentage?: number
          current_challenge_id?: string
          completed_challenges?: string[]
          xp_earned?: number
          time_spent?: number
          started_at?: string
          completed_at?: string
          last_accessed?: string
          notes?: string
          rating?: number
          review?: string
        }
      }
      challenges: {
        Row: {
          id: string
          workshop_id: string
          title: string
          description: string
          type: 'coding' | 'quiz' | 'project' | 'essay' | 'peer_review'
          difficulty: 'easy' | 'medium' | 'hard' | 'expert'
          content: Json
          solution?: Json
          xp_reward: number
          time_limit?: number
          max_attempts?: number
          passing_score?: number
          created_at: string
          updated_at: string
          order_index: number
        }
        Insert: {
          id?: string
          workshop_id: string
          title: string
          description: string
          type: 'coding' | 'quiz' | 'project' | 'essay' | 'peer_review'
          difficulty: 'easy' | 'medium' | 'hard' | 'expert'
          content: Json
          solution?: Json
          xp_reward: number
          time_limit?: number
          max_attempts?: number
          passing_score?: number
          created_at?: string
          updated_at?: string
          order_index: number
        }
        Update: {
          id?: string
          workshop_id?: string
          title?: string
          description?: string
          type?: 'coding' | 'quiz' | 'project' | 'essay' | 'peer_review'
          difficulty?: 'easy' | 'medium' | 'hard' | 'expert'
          content?: Json
          solution?: Json
          xp_reward?: number
          time_limit?: number
          max_attempts?: number
          passing_score?: number
          created_at?: string
          updated_at?: string
          order_index?: number
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          progress: number
          metadata?: Json
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
          progress?: number
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          progress?: number
          metadata?: Json
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: 'skill' | 'progress' | 'social' | 'special'
          rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'
          requirements: Json
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          category: 'skill' | 'progress' | 'social' | 'special'
          rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'
          requirements: Json
          xp_reward: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: 'skill' | 'progress' | 'social' | 'special'
          rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'
          requirements?: Json
          xp_reward?: number
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: 'discussion' | 'showcase' | 'help' | 'announcement'
          tags: string[]
          upvotes: number
          downvotes: number
          reply_count: number
          is_featured: boolean
          is_locked: boolean
          created_at: string
          updated_at: string
          workshop_id?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type: 'discussion' | 'showcase' | 'help' | 'announcement'
          tags?: string[]
          upvotes?: number
          downvotes?: number
          reply_count?: number
          is_featured?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
          workshop_id?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          type?: 'discussion' | 'showcase' | 'help' | 'announcement'
          tags?: string[]
          upvotes?: number
          downvotes?: number
          reply_count?: number
          is_featured?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
          workshop_id?: string
        }
      }
      challenge_submissions: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          code?: string
          answer?: Json
          score: number
          is_correct: boolean
          feedback?: string
          execution_time?: number
          submitted_at: string
          reviewed_at?: string
          reviewer_id?: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          code?: string
          answer?: Json
          score: number
          is_correct: boolean
          feedback?: string
          execution_time?: number
          submitted_at?: string
          reviewed_at?: string
          reviewer_id?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          code?: string
          answer?: Json
          score?: number
          is_correct?: boolean
          feedback?: string
          execution_time?: number
          submitted_at?: string
          reviewed_at?: string
          reviewer_id?: string
        }
      }
      leaderboards: {
        Row: {
          id: string
          user_id: string
          category: 'overall' | 'weekly' | 'monthly' | 'workshop_specific'
          rank: number
          score: number
          period_start: string
          period_end: string
          workshop_id?: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: 'overall' | 'weekly' | 'monthly' | 'workshop_specific'
          rank: number
          score: number
          period_start: string
          period_end: string
          workshop_id?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: 'overall' | 'weekly' | 'monthly' | 'workshop_specific'
          rank?: number
          score?: number
          period_start?: string
          period_end?: string
          workshop_id?: string
          updated_at?: string
        }
      }
      // REAL-TIME COLLABORATION SYSTEM
      collaboration_sessions: {
        Row: {
          id: string
          workshop_id: string
          host_user_id: string
          name: string
          description?: string
          status: 'active' | 'paused' | 'ended'
          max_participants: number
          current_participants: number
          code_snapshot: string
          shared_cursor_positions: Json
          voice_chat_enabled: boolean
          screen_sharing_enabled: boolean
          ai_mentor_enabled: boolean
          created_at: string
          updated_at: string
          ended_at?: string
        }
        Insert: {
          id?: string
          workshop_id: string
          host_user_id: string
          name: string
          description?: string
          status?: 'active' | 'paused' | 'ended'
          max_participants?: number
          current_participants?: number
          code_snapshot?: string
          shared_cursor_positions?: Json
          voice_chat_enabled?: boolean
          screen_sharing_enabled?: boolean
          ai_mentor_enabled?: boolean
          created_at?: string
          updated_at?: string
          ended_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          host_user_id?: string
          name?: string
          description?: string
          status?: 'active' | 'paused' | 'ended'
          max_participants?: number
          current_participants?: number
          code_snapshot?: string
          shared_cursor_positions?: Json
          voice_chat_enabled?: boolean
          screen_sharing_enabled?: boolean
          ai_mentor_enabled?: boolean
          created_at?: string
          updated_at?: string
          ended_at?: string
        }
      }
      collaboration_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: 'host' | 'mentor' | 'participant' | 'observer'
          cursor_position: Json
          active_file?: string
          is_typing: boolean
          voice_enabled: boolean
          video_enabled: boolean
          screen_sharing: boolean
          joined_at: string
          last_activity: string
          left_at?: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role?: 'host' | 'mentor' | 'participant' | 'observer'
          cursor_position?: Json
          active_file?: string
          is_typing?: boolean
          voice_enabled?: boolean
          video_enabled?: boolean
          screen_sharing?: boolean
          joined_at?: string
          last_activity?: string
          left_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: 'host' | 'mentor' | 'participant' | 'observer'
          cursor_position?: Json
          active_file?: string
          is_typing?: boolean
          voice_enabled?: boolean
          video_enabled?: boolean
          screen_sharing?: boolean
          joined_at?: string
          last_activity?: string
          left_at?: string
        }
      }
      // AI INTEGRATION SYSTEM
      ai_interactions: {
        Row: {
          id: string
          user_id: string
          session_id?: string
          workshop_id?: string
          challenge_id?: string
          ai_model: 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro' | 'custom'
          interaction_type: 'code_review' | 'mentoring' | 'debugging' | 'explanation' | 'pair_programming'
          prompt: string
          response: string
          code_context?: string
          feedback_rating?: number
          was_helpful: boolean
          processing_time: number
          tokens_used: number
          cost: number
          created_at: string
          metadata?: Json
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string
          workshop_id?: string
          challenge_id?: string
          ai_model: 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro' | 'custom'
          interaction_type: 'code_review' | 'mentoring' | 'debugging' | 'explanation' | 'pair_programming'
          prompt: string
          response: string
          code_context?: string
          feedback_rating?: number
          was_helpful?: boolean
          processing_time?: number
          tokens_used?: number
          cost?: number
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          workshop_id?: string
          challenge_id?: string
          ai_model?: 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro' | 'custom'
          interaction_type?: 'code_review' | 'mentoring' | 'debugging' | 'explanation' | 'pair_programming'
          prompt?: string
          response?: string
          code_context?: string
          feedback_rating?: number
          was_helpful?: boolean
          processing_time?: number
          tokens_used?: number
          cost?: number
          created_at?: string
          metadata?: Json
        }
      }
      ai_mentoring_sessions: {
        Row: {
          id: string
          user_id: string
          workshop_id?: string
          ai_model: string
          session_name: string
          goals: string[]
          conversation_history: Json
          skill_assessment: Json
          personalized_recommendations: Json
          learning_path_adjustments: Json
          session_duration: number
          outcomes_achieved: string[]
          next_session_recommendations: string[]
          created_at: string
          updated_at: string
          completed_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          workshop_id?: string
          ai_model: string
          session_name: string
          goals?: string[]
          conversation_history?: Json
          skill_assessment?: Json
          personalized_recommendations?: Json
          learning_path_adjustments?: Json
          session_duration?: number
          outcomes_achieved?: string[]
          next_session_recommendations?: string[]
          created_at?: string
          updated_at?: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workshop_id?: string
          ai_model?: string
          session_name?: string
          goals?: string[]
          conversation_history?: Json
          skill_assessment?: Json
          personalized_recommendations?: Json
          learning_path_adjustments?: Json
          session_duration?: number
          outcomes_achieved?: string[]
          next_session_recommendations?: string[]
          created_at?: string
          updated_at?: string
          completed_at?: string
        }
      }
      // BLOCKCHAIN CERTIFICATION SYSTEM
      certifications: {
        Row: {
          id: string
          user_id: string
          workshop_id?: string
          skill_category: string
          certification_name: string
          certification_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'divine'
          blockchain_hash: string
          nft_token_id?: string
          nft_contract_address?: string
          verification_url: string
          issued_at: string
          expires_at?: string
          skills_validated: string[]
          performance_metrics: Json
          issuer_signature: string
          is_public: boolean
          linkedin_shared: boolean
          github_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workshop_id?: string
          skill_category: string
          certification_name: string
          certification_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'divine'
          blockchain_hash: string
          nft_token_id?: string
          nft_contract_address?: string
          verification_url: string
          issued_at?: string
          expires_at?: string
          skills_validated: string[]
          performance_metrics: Json
          issuer_signature: string
          is_public?: boolean
          linkedin_shared?: boolean
          github_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workshop_id?: string
          skill_category?: string
          certification_name?: string
          certification_level?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'divine'
          blockchain_hash?: string
          nft_token_id?: string
          nft_contract_address?: string
          verification_url?: string
          issued_at?: string
          expires_at?: string
          skills_validated?: string[]
          performance_metrics?: Json
          issuer_signature?: string
          is_public?: boolean
          linkedin_shared?: boolean
          github_verified?: boolean
          created_at?: string
        }
      }
      // WEBRTC MENTORING SYSTEM
      mentoring_sessions: {
        Row: {
          id: string
          mentor_id: string
          mentee_id: string
          workshop_id?: string
          session_type: 'one_on_one' | 'group' | 'masterclass' | 'code_review'
          status: 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_start: string
          scheduled_end: string
          actual_start?: string
          actual_end?: string
          meeting_url: string
          webrtc_room_id: string
          agenda: string[]
          session_notes?: string
          recording_url?: string
          shared_code_snippets: Json
          mentee_goals: string[]
          outcomes_achieved: string[]
          mentor_rating?: number
          mentee_rating?: number
          follow_up_tasks: string[]
          next_session_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          mentee_id: string
          workshop_id?: string
          session_type: 'one_on_one' | 'group' | 'masterclass' | 'code_review'
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_start: string
          scheduled_end: string
          actual_start?: string
          actual_end?: string
          meeting_url: string
          webrtc_room_id: string
          agenda?: string[]
          session_notes?: string
          recording_url?: string
          shared_code_snippets?: Json
          mentee_goals?: string[]
          outcomes_achieved?: string[]
          mentor_rating?: number
          mentee_rating?: number
          follow_up_tasks?: string[]
          next_session_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string
          mentee_id?: string
          workshop_id?: string
          session_type?: 'one_on_one' | 'group' | 'masterclass' | 'code_review'
          status?: 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_start?: string
          scheduled_end?: string
          actual_start?: string
          actual_end?: string
          meeting_url?: string
          webrtc_room_id?: string
          agenda?: string[]
          session_notes?: string
          recording_url?: string
          shared_code_snippets?: Json
          mentee_goals?: string[]
          outcomes_achieved?: string[]
          mentor_rating?: number
          mentee_rating?: number
          follow_up_tasks?: string[]
          next_session_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      // ENTERPRISE AND TEAM FEATURES
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          owner_id: string
          subscription_type: 'team' | 'enterprise' | 'education'
          max_members: number
          current_members: number
          billing_email: string
          company_name?: string
          industry?: string
          team_settings: Json
          custom_branding: Json
          sso_enabled: boolean
          advanced_analytics: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          owner_id: string
          subscription_type: 'team' | 'enterprise' | 'education'
          max_members: number
          current_members?: number
          billing_email: string
          company_name?: string
          industry?: string
          team_settings?: Json
          custom_branding?: Json
          sso_enabled?: boolean
          advanced_analytics?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          owner_id?: string
          subscription_type?: 'team' | 'enterprise' | 'education'
          max_members?: number
          current_members?: number
          billing_email?: string
          company_name?: string
          industry?: string
          team_settings?: Json
          custom_branding?: Json
          sso_enabled?: boolean
          advanced_analytics?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions: Json
          joined_at: string
          invited_by: string
          last_active: string
          is_active: boolean
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions?: Json
          joined_at?: string
          invited_by: string
          last_active?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions?: Json
          joined_at?: string
          invited_by?: string
          last_active?: string
          is_active?: boolean
        }
      }
      // ADVANCED ANALYTICS
      user_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          coding_time_minutes: number
          workshops_completed: number
          challenges_solved: number
          ai_interactions: number
          collaboration_sessions: number
          xp_earned: number
          skill_improvements: Json
          learning_velocity: number
          engagement_score: number
          retention_risk_score: number
          personalized_insights: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          coding_time_minutes?: number
          workshops_completed?: number
          challenges_solved?: number
          ai_interactions?: number
          collaboration_sessions?: number
          xp_earned?: number
          skill_improvements?: Json
          learning_velocity?: number
          engagement_score?: number
          retention_risk_score?: number
          personalized_insights?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          coding_time_minutes?: number
          workshops_completed?: number
          challenges_solved?: number
          ai_interactions?: number
          collaboration_sessions?: number
          xp_earned?: number
          skill_improvements?: Json
          learning_velocity?: number
          engagement_score?: number
          retention_risk_score?: number
          personalized_insights?: Json
          created_at?: string
        }
      }
      // MARKETPLACE AND MONETIZATION
      marketplace_items: {
        Row: {
          id: string
          seller_id: string
          item_type: 'workshop' | 'certification' | 'template' | 'tool' | 'mentoring'
          title: string
          description: string
          price: number
          currency: 'USD' | 'EUR' | 'GBP'
          commission_rate: number
          total_sales: number
          average_rating: number
          review_count: number
          is_featured: boolean
          is_approved: boolean
          tags: string[]
          preview_content: Json
          full_content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          item_type: 'workshop' | 'certification' | 'template' | 'tool' | 'mentoring'
          title: string
          description: string
          price: number
          currency?: 'USD' | 'EUR' | 'GBP'
          commission_rate?: number
          total_sales?: number
          average_rating?: number
          review_count?: number
          is_featured?: boolean
          is_approved?: boolean
          tags?: string[]
          preview_content: Json
          full_content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          item_type?: 'workshop' | 'certification' | 'template' | 'tool' | 'mentoring'
          title?: string
          description?: string
          price?: number
          currency?: 'USD' | 'EUR' | 'GBP'
          commission_rate?: number
          total_sales?: number
          average_rating?: number
          review_count?: number
          is_featured?: boolean
          is_approved?: boolean
          tags?: string[]
          preview_content?: Json
          full_content?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status: 'free' | 'basic' | 'pro' | 'divine'
      prophet_rank: 'novice' | 'apprentice' | 'practitioner' | 'architect' | 'prophet'
      workshop_difficulty: 'beginner' | 'intermediate' | 'advanced'
      challenge_type: 'coding' | 'quiz' | 'project' | 'essay' | 'peer_review'
      challenge_difficulty: 'easy' | 'medium' | 'hard' | 'expert'
      progress_status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
      achievement_category: 'skill' | 'progress' | 'social' | 'special'
      achievement_rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'divine'
      post_type: 'discussion' | 'showcase' | 'help' | 'announcement'
      leaderboard_category: 'overall' | 'weekly' | 'monthly' | 'workshop_specific'
      // New enums for advanced features
      collaboration_status: 'active' | 'paused' | 'ended'
      participant_role: 'host' | 'mentor' | 'participant' | 'observer'
      ai_model_type: 'gpt-4' | 'claude-3-5-sonnet' | 'gemini-pro' | 'custom'
      ai_interaction_type: 'code_review' | 'mentoring' | 'debugging' | 'explanation' | 'pair_programming'
      certification_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'divine'
      mentoring_session_type: 'one_on_one' | 'group' | 'masterclass' | 'code_review'
      session_status: 'scheduled' | 'active' | 'completed' | 'cancelled'
      team_subscription_type: 'team' | 'enterprise' | 'education'
      team_member_role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
      marketplace_item_type: 'workshop' | 'certification' | 'template' | 'tool' | 'mentoring'
      currency_type: 'USD' | 'EUR' | 'GBP'
    }
  }
}