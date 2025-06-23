import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createCheckoutSession } from '@/lib/stripe/server'

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, userEmail } = await req.json()

    if (!priceId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // The `set` method was called from a Server Component.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // The `remove` method was called from a Server Component.
            }
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL
    const successUrl = `${origin}/dashboard?success=true`
    const cancelUrl = `${origin}/pricing?canceled=true`

    const { sessionId, url } = await createCheckoutSession({
      priceId,
      userId,
      userEmail,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ sessionId, url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}