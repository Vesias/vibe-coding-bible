'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  Users, 
  BookOpen, 
  Code, 
  Heart, 
  MessageCircle, 
  Award, 
  Zap,
  Crown,
  TrendingUp,
  Calendar,
  Play,
  Share2,
  Star,
  Gift,
  RefreshCw,
  Filter
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ActivityItem {
  id: string
  type: 'workshop_completed' | 'achievement_earned' | 'content_shared' | 'collaboration_joined' | 'level_up' | 'streak_milestone' | 'comment_added' | 'like_received'
  user: {
    name: string
    avatar: string
    rank: string
    verified: boolean
  }
  action: string
  target?: string
  timestamp: string
  metadata?: {
    xpEarned?: number
    streakDays?: number
    level?: number
    likes?: number
    achievementRarity?: string
  }
}

interface RealTimeActivityFeedProps {
  maxItems?: number
  autoRefresh?: boolean
  showFilters?: boolean
}

export function RealTimeActivityFeed({
  maxItems = 10,
  autoRefresh = true,
  showFilters = true
}: RealTimeActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filter, setFilter] = useState<'all' | 'learning' | 'social' | 'achievements'>('all')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Mock real-time activities
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'workshop_completed',
      user: {
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg',
        rank: 'Architect',
        verified: true
      },
      action: 'hat das Workshop',
      target: '"Die Heilige Vision"',
      timestamp: 'vor 2 Minuten',
      metadata: {
        xpEarned: 250
      }
    },
    {
      id: '2',
      type: 'achievement_earned',
      user: {
        name: 'Maria Rodriguez',
        avatar: '/avatars/maria.jpg',
        rank: 'Practitioner',
        verified: false
      },
      action: 'hat den Erfolg',
      target: '"Code Perfectionist"',
      timestamp: 'vor 5 Minuten',
      metadata: {
        achievementRarity: 'epic'
      }
    },
    {
      id: '3',
      type: 'content_shared',
      user: {
        name: 'David Kim',
        avatar: '/avatars/david.jpg',
        rank: 'Prophet',
        verified: true
      },
      action: 'hat ein Tutorial geteilt:',
      target: '"Advanced React Patterns mit AI"',
      timestamp: 'vor 8 Minuten',
      metadata: {
        likes: 12
      }
    },
    {
      id: '4',
      type: 'collaboration_joined',
      user: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        rank: 'Architect',
        verified: true
      },
      action: 'ist der Live-Session beigetreten:',
      target: '"TypeScript Mastery"',
      timestamp: 'vor 12 Minuten'
    },
    {
      id: '5',
      type: 'level_up',
      user: {
        name: 'Emma Davis',
        avatar: '/avatars/emma.jpg',
        rank: 'Practitioner',
        verified: false
      },
      action: 'hat Level',
      target: '8',
      timestamp: 'vor 15 Minuten',
      metadata: {
        level: 8,
        xpEarned: 500
      }
    },
    {
      id: '6',
      type: 'streak_milestone',
      user: {
        name: 'James Wilson',
        avatar: '/avatars/james.jpg',
        rank: 'Architect',
        verified: true
      },
      action: 'hat einen',
      target: '30-Tage-Streak',
      timestamp: 'vor 18 Minuten',
      metadata: {
        streakDays: 30
      }
    },
    {
      id: '7',
      type: 'comment_added',
      user: {
        name: 'Lisa Zhang',
        avatar: '/avatars/lisa.jpg',
        rank: 'Prophet',
        verified: true
      },
      action: 'hat kommentiert zu',
      target: '"Divine React Hooks Guide"',
      timestamp: 'vor 22 Minuten'
    },
    {
      id: '8',
      type: 'like_received',
      user: {
        name: 'Mike Brown',
        avatar: '/avatars/mike.jpg',
        rank: 'Practitioner',
        verified: false
      },
      action: 'hat 25 Likes für',
      target: '"AI Coding Best Practices"',
      timestamp: 'vor 25 Minuten',
      metadata: {
        likes: 25
      }
    }
  ]

  useEffect(() => {
    setActivities(mockActivities.slice(0, maxItems))
  }, [maxItems])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'workshop_completed',
        user: {
          name: 'Neuer User',
          avatar: '',
          rank: 'Novice',
          verified: false
        },
        action: 'hat ein Workshop abgeschlossen',
        target: '"Multi-Context Programming"',
        timestamp: 'vor wenigen Sekunden',
        metadata: {
          xpEarned: 200
        }
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)])
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, maxItems])

  const filteredActivities = activities.filter(activity => {
    switch (filter) {
      case 'learning':
        return ['workshop_completed', 'level_up', 'streak_milestone'].includes(activity.type)
      case 'social':
        return ['content_shared', 'collaboration_joined', 'comment_added', 'like_received'].includes(activity.type)
      case 'achievements':
        return ['achievement_earned', 'level_up', 'streak_milestone'].includes(activity.type)
      default:
        return true
    }
  })

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'workshop_completed':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'achievement_earned':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'content_shared':
        return <Share2 className="h-4 w-4 text-green-500" />
      case 'collaboration_joined':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'level_up':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case 'streak_milestone':
        return <Zap className="h-4 w-4 text-red-500" />
      case 'comment_added':
        return <MessageCircle className="h-4 w-4 text-indigo-500" />
      case 'like_received':
        return <Heart className="h-4 w-4 text-pink-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Prophet': return <Crown className="h-3 w-3 text-yellow-500" />
      case 'Architect': return <TrendingUp className="h-3 w-3 text-purple-500" />
      case 'Practitioner': return <Zap className="h-3 w-3 text-blue-500" />
      default: return <Users className="h-3 w-3 text-gray-500" />
    }
  }

  const formatAction = (activity: ActivityItem) => {
    let actionText = activity.action
    if (activity.target) {
      actionText += ' ' + activity.target
    }
    
    switch (activity.type) {
      case 'workshop_completed':
        return actionText + ' abgeschlossen'
      case 'achievement_earned':
        return actionText + ' erhalten'
      case 'level_up':
        return actionText + ' erreicht'
      case 'streak_milestone':
        return actionText + ' erreicht'
      default:
        return actionText
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Live Activity Feed</CardTitle>
              <CardDescription>
                Was gerade in der Community passiert
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Aktivitäten</SelectItem>
                <SelectItem value="learning">Lernen</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="achievements">Erfolge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Letzte Aktualisierung: {lastUpdate.toLocaleTimeString('de-DE')}
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Keine Aktivitäten gefunden</p>
                <p className="text-xs">Probiere einen anderen Filter aus</p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all hover:bg-muted/50 ${index === 0 ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800' : ''}`}
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* User Avatar */}
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback className="text-xs">
                      {activity.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      {getRankIcon(activity.user.rank)}
                      <Badge variant="secondary" className="text-xs">
                        {activity.user.rank}
                      </Badge>
                      {activity.user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      {formatAction(activity)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </span>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-2">
                        {activity.metadata?.xpEarned && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            <Zap className="h-3 w-3 mr-1" />
                            +{activity.metadata.xpEarned} XP
                          </Badge>
                        )}
                        {activity.metadata?.likes && (
                          <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700">
                            <Heart className="h-3 w-3 mr-1" />
                            {activity.metadata.likes}
                          </Badge>
                        )}
                        {activity.metadata?.achievementRarity && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              activity.metadata.achievementRarity === 'epic' ? 'bg-purple-50 text-purple-700' :
                              activity.metadata.achievementRarity === 'rare' ? 'bg-blue-50 text-blue-700' :
                              'bg-gray-50 text-gray-700'
                            }`}
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {activity.metadata.achievementRarity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* New Activity Indicator */}
                  {index === 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {/* Load More */}
        {filteredActivities.length >= maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Mehr Aktivitäten laden
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}