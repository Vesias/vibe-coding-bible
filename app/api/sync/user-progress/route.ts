import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    // Verify the request is from Agentland
    const authHeader = req.headers.get('authorization')
    const appSource = req.headers.get('x-app-source')
    
    if (!authHeader || appSource !== 'agentland') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { userId, agentlandProfile, timestamp } = await req.json()
    
    const supabase = await createServerSupabaseClient()
    
    // Update user profile with Agentland data
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('agentland_user_id', userId)
      .single()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Calculate prophet rank based on Agentland activity
    let prophetRank = 'seeker'
    if (agentlandProfile.agentsCreated >= 10) {
      prophetRank = 'prophet'
    } else if (agentlandProfile.agentsCreated >= 5) {
      prophetRank = 'apostle'
    } else if (agentlandProfile.agentsCreated >= 1) {
      prophetRank = 'apprentice'
    }
    
    // Update user profile
    await supabase
      .from('users')
      .update({
        prophet_rank: prophetRank,
        metadata: {
          ...user.metadata,
          agentlandProfile,
          lastSync: timestamp
        }
      })
      .eq('id', user.id)
    
    // Update commandment progress based on agent usage
    const commandmentProgress = calculateCommandmentProgress(agentlandProfile)
    
    for (const [commandmentId, progress] of Object.entries(commandmentProgress)) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          commandment_id: commandmentId,
          progress: progress as number,
          completed: (progress as number) >= 100,
          updated_at: new Date().toISOString()
        })
    }
    
    return NextResponse.json({
      success: true,
      prophetRank,
      commandmentProgress
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateCommandmentProgress(profile: any): Record<string, number> {
  const progress: Record<string, number> = {}
  
  // Commandment I - Vision (based on having clear agent purposes)
  progress['1'] = profile.agentsCreated > 0 ? 100 : 0
  
  // Commandment II - Right Stack (using approved tech)
  progress['2'] = profile.tier !== 'free' ? 100 : 50
  
  // Commandment III - Prompt Art (based on agent count)
  progress['3'] = Math.min(profile.agentsCreated * 20, 100)
  
  // Commandment IV - Multi-Context (team features)
  progress['4'] = profile.teamRole ? 75 : 25
  
  // Commandment V - Holy Iteration (ongoing usage)
  progress['5'] = profile.agentsCreated >= 3 ? 50 : 0
  
  return progress
}