'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Database } from '@/lib/database.types'
import { getTierInfo, getRankInfo } from '@/lib/auth/roles'
import { 
  Bell, 
  Settings, 
  LogOut, 
  Crown, 
  Zap, 
  Calendar, 
  Target,
  TrendingUp,
  Clock
} from 'lucide-react'

type UserProfile = Database['public']['Tables']['profiles']['Row']

interface DashboardHeaderProps {
  user: UserProfile | null
  tier: string
  tierInfo: any
  rank: string
  rankInfo: any
  nextRank: any
  rankProgress: any
  weeklyProgress: {
    workshopsCompleted: number
    xpEarned: number
    timeSpent: number
    streakDays: number
  }
}

export function DashboardHeader({
  user,
  tier,
  tierInfo,
  rank,
  rankInfo,
  nextRank,
  rankProgress,
  weeklyProgress
}: DashboardHeaderProps) {
  const { signOut } = useAuth()
  const [notificationCount] = useState(3)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* User Info Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/20">
              <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || ''} />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {getGreeting()}, {user?.full_name || 'Divine Coder'}!
                </h1>
                <Badge 
                  variant="secondary" 
                  className="hidden sm:inline-flex"
                  style={{ backgroundColor: tierInfo.color + '20', color: tierInfo.color }}
                >
                  {tierInfo.icon} {tierInfo.name}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  <span>{rankInfo.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>{user?.total_xp?.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Level {user?.current_level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Crown className="mr-2 h-4 w-4" />
                  Subscription
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rank Progress */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-600/10 border-purple-200/50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Rank Progress</span>
                  </div>
                  <Badge variant="outline">
                    {Math.round(rankProgress.progress)}%
                  </Badge>
                </div>
                
                <Progress value={rankProgress.progress} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{rankInfo.name}</span>
                  <span>{nextRank ? nextRank.info.name : 'Max Rank'}</span>
                </div>
                
                {nextRank && (
                  <p className="text-xs text-muted-foreground">
                    {rankProgress.xpNeeded} XP to next rank
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-200/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">This Week</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {weeklyProgress.workshopsCompleted}
                    </div>
                    <div className="text-xs text-muted-foreground">Workshops</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {weeklyProgress.xpEarned}
                    </div>
                    <div className="text-xs text-muted-foreground">XP Earned</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-600/10 border-orange-200/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Learning Streak</span>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {weeklyProgress.streakDays}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {weeklyProgress.streakDays === 1 ? 'day' : 'days'}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < weeklyProgress.streakDays
                          ? 'bg-orange-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Spent */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-200/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Time Invested</span>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(weeklyProgress.timeSpent)}
                  </div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </div>
                
                <div className="text-xs text-center text-muted-foreground">
                  Avg {Math.round(weeklyProgress.timeSpent / 7)}m/day
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}