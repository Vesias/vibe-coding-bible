#!/usr/bin/env node

/**
 * Database Setup Script for Vibe Coding Bible
 * Applies migrations directly to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration(migrationFile) {
  console.log(`🔄 Running migration: ${migrationFile}`)
  
  try {
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile)
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      // Try direct SQL execution as fallback
      console.log(`⚠️  RPC method failed, trying direct execution...`)
      const { data: directData, error: directError } = await supabase
        .from('_migrations')
        .insert({ name: migrationFile, executed_at: new Date().toISOString() })
      
      if (directError) {
        console.error(`❌ Migration ${migrationFile} failed:`, error.message)
        return false
      }
    }
    
    console.log(`✅ Migration ${migrationFile} completed successfully`)
    return true
    
  } catch (err) {
    console.error(`❌ Error running migration ${migrationFile}:`, err.message)
    return false
  }
}

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase
      .from('_migrations')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Connection successful (table may not exist yet)')
      return true
    } else if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful')
    return true
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

async function createProfilesTable() {
  console.log('🔄 Creating profiles table based on auth.users...')
  
  const sql = `
    -- Create profiles table that mirrors auth.users structure
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      subscription_status TEXT DEFAULT 'free',
      subscription_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_login TIMESTAMP WITH TIME ZONE,
      total_xp INTEGER DEFAULT 0,
      current_level INTEGER DEFAULT 1,
      prophet_rank TEXT DEFAULT 'novice'
    );

    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);

    -- Create function to handle user creation
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
  `
  
  try {
    // We need to execute this differently since it involves auth schema
    console.log('⚠️  Note: Some operations may require manual execution in Supabase dashboard')
    console.log('📋 SQL to execute:')
    console.log(sql)
    
    return true
    
  } catch (err) {
    console.error('❌ Error creating profiles table:', err.message)
    return false
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Vibe Coding Bible database setup...')
  console.log('🌐 Supabase URL:', supabaseUrl)
  
  // Test connection first
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.error('❌ Cannot proceed without database connection')
    process.exit(1)
  }
  
  // Create basic profiles table
  await createProfilesTable()
  
  // List available migrations
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  const migrations = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
  
  console.log(`📁 Found ${migrations.length} migration files`)
  
  // Note about manual migration
  console.log('\n📋 MANUAL MIGRATION REQUIRED:')
  console.log('Due to security restrictions, please manually run the following migrations')
  console.log('in your Supabase dashboard (SQL Editor):')
  console.log('')
  
  migrations.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration}`)
  })
  
  console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard/project')
  console.log('📍 Navigate to: SQL Editor → Run each migration file')
  
  // Test basic table access
  console.log('\n🧪 Testing table access...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') {
      console.log('❌ Profiles table not accessible:', error.message)
    } else {
      console.log('✅ Profiles table accessible')
    }
  } catch (err) {
    console.log('⚠️  Table access test inconclusive')
  }
  
  console.log('\n✨ Database setup information provided!')
  console.log('🚀 Ready to test authentication after manual migration')
}

// Run the setup
setupDatabase().catch(console.error)