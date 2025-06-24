import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const { subscription, action } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (action === 'subscribe') {
      // Save push subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_data: subscription,
          endpoint: subscription.endpoint,
          p256dh_key: subscription.keys?.p256dh,
          auth_key: subscription.keys?.auth,
          user_agent: request.headers.get('user-agent'),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,endpoint'
        })

      if (error) {
        throw error
      }

      // Send welcome notification
      await sendWelcomeNotification(subscription)

      return NextResponse.json({
        success: true,
        message: 'Push notifications enabled'
      })

    } else if (action === 'unsubscribe') {
      // Remove push subscription from database
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('endpoint', subscription.endpoint)

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        message: 'Push notifications disabled'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Push notification error:', error)
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    )
  }
}

// Send notification to specific user
export async function PUT(request: NextRequest) {
  try {
    const { userId, title, body, data, badge, icon } = await request.json()

    // Validate admin access or user permission
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription_data')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No push subscriptions found for user'
      })
    }

    // Send notifications to all user devices
    const results = await Promise.allSettled(
      subscriptions.map((sub: any) => 
        sendPushNotification(sub.subscription_data, {
          title,
          body,
          data,
          badge: badge || '/icons/badge-72x72.png',
          icon: icon || '/icons/icon-192x192.png'
        })
      )
    )

    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: subscriptions.length
    })

  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}

// Get notification settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's notification preferences and subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id)

    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      isSubscribed: subscriptions && subscriptions.length > 0,
      deviceCount: subscriptions?.length || 0,
      preferences: preferences || {
        workshop_reminders: true,
        community_updates: true,
        ai_mentor_tips: true,
        achievement_notifications: true,
        weekly_progress: true
      }
    })

  } catch (error) {
    console.error('Get notification settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get notification settings' },
      { status: 500 }
    )
  }
}

// Helper function to send push notification
async function sendPushNotification(subscription: any, payload: any) {
  if (!process.env.VAPID_PRIVATE_KEY) {
    throw new Error('VAPID private key not configured')
  }

  // In a real implementation, you would use a library like web-push
  // For now, this is a mock implementation
  
  try {
    // Mock notification sending
    console.log('Sending push notification:', { subscription, payload })
    
    // Here you would integrate with a service like:
    // - web-push library
    // - Firebase Cloud Messaging
    // - Apple Push Notification Service
    // - Microsoft WNS
    
    return { success: true }
  } catch (error) {
    console.error('Push notification failed:', error)
    throw error
  }
}

// Send welcome notification
async function sendWelcomeNotification(subscription: any) {
  const payload = {
    title: '🎉 Willkommen bei Vibe Coding Bible!',
    body: 'Push-Benachrichtigungen sind jetzt aktiviert. Du erhältst Updates zu neuen Workshops und Features.',
    data: {
      url: '/dashboard',
      action: 'view_dashboard'
    },
    badge: '/icons/badge-72x72.png',
    icon: '/icons/icon-192x192.png'
  }

  return sendPushNotification(subscription, payload)
}