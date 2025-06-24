#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Has Anon Key:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test basic connection
    console.log('\n🧪 Testing basic connectivity...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('⚠️  Query error (expected for new DB):', error.message)
      console.log('Error code:', error.code)
      
      if (error.code === 'PGRST116') {
        console.log('✅ Connection successful! Table does not exist yet (normal for new setup)')
      } else {
        console.log('❌ Connection issue:', error.message)
      }
    } else {
      console.log('✅ Connection successful! Found data:', data)
    }
    
    // Test auth functionality
    console.log('\n🔐 Testing auth functionality...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Auth error:', authError.message)
    } else {
      console.log('✅ Auth module accessible')
      console.log('Current session:', authData.session ? 'Logged in' : 'Not logged in')
    }
    
    // Test creating a user (will likely fail but shows auth is working)
    console.log('\n👤 Testing auth signup capability...')
    const testEmail = 'test-' + Date.now() + '@example.com'
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!'
    })
    
    if (signupError) {
      console.log('⚠️  Signup test error (may be expected):', signupError.message)
      if (signupError.message.includes('Unable to validate email address')) {
        console.log('✅ Auth system is working (email validation required)')
      }
    } else {
      console.log('✅ Signup successful:', signupData.user?.email)
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err.message)
  }
}

testConnection()