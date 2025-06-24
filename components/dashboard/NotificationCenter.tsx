'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, 
  X, 
  Check, 
  Star, 
  Users, 
  Award, 
  MessageCircle, 
  Calendar,
  Zap,
  Crown,
  Heart,
  Gift,
  TrendingUp,
  BookOpen,
  Settings,
  Trash2
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Notification {
  id: string
  type: 'achievement' | 'social' | 'workshop' | 'system' | 'collaboration' | 'milestone'
  title: string
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
  avatar?: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (id: string) => void
}

export function NotificationCenter({
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onDeleteNotification = () => {}
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'social'>('all')

  // Mock notifications if none provided
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Neuer Erfolg freigeschaltet!',
      message: 'Du hast "Week Warrior" für deinen 7-Tage-Streak erhalten!',
      timestamp: '2 Minuten',
      read: false,
      priority: 'high',
      action: {
        label: 'Anzeigen',
        href: '/achievements'
      }
    },
    {
      id: '2',
      type: 'social',
      title: 'Sarah Chen hat dein Snippet geliked',
      message: 'Dein "Divine React Hook" Code-Snippet hat 15 neue Likes erhalten',
      timestamp: '1 Stunde',
      read: false,
      priority: 'medium',
      avatar: '/avatars/sarah.jpg',
      action: {
        label: 'Ansehen',
        href: '/community/posts/123'
      }
    },
    {
      id: '3',
      type: 'workshop',
      title: 'Workshop-Erinnerung',
      message: 'Du hast "Die Prompt-Kunst" zu 85% abgeschlossen. Zeit für den letzten Schritt!',
      timestamp: '3 Stunden',
      read: false,
      priority: 'medium',
      action: {
        label: 'Fortfahren',
        href: '/workshops/commandment-iii'
      }
    },
    {
      id: '4',
      type: 'collaboration',
      title: 'Live Session startet bald',
      message: 'Die "Advanced AI Prompting" Session beginnt in 30 Minuten',
      timestamp: '5 Stunden',
      read: true,
      priority: 'high',
      action: {
        label: 'Beitreten',
        href: '/collaboration/session/456'
      }
    },
    {
      id: '5',
      type: 'milestone',
      title: 'Level Up! 🎉',
      message: 'Herzlichen Glückwunsch! Du hast Level 5 erreicht und 2.500 XP gesammelt.',
      timestamp: '1 Tag',
      read: true,
      priority: 'high'
    },
    {
      id: '6',
      type: 'system',
      title: 'Neue Features verfügbar',
      message: 'Der AI Code Review ist jetzt für alle Apostel-Mitglieder verfügbar!',
      timestamp: '2 Tage',
      read: true,
      priority: 'low',
      action: {
        label: 'Ausprobieren',
        href: '/ai-mentor'
      }
    }
  ]

  const allNotifications = notifications.length > 0 ? notifications : mockNotifications
  const unreadCount = allNotifications.filter(n => !n.read).length

  const filteredNotifications = allNotifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read
      case 'achievements':
        return notification.type === 'achievement' || notification.type === 'milestone'
      case 'social':
        return notification.type === 'social' || notification.type === 'collaboration'
      default:
        return true
    }
  })

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />
      case 'social':
        return <Heart className="h-5 w-5 text-pink-500" />
      case 'workshop':
        return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'collaboration':
        return <Users className="h-5 w-5 text-purple-500" />
      case 'milestone':
        return <Crown className="h-5 w-5 text-gold-500" />
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'low':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return `vor ${timestamp}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md h-[600px] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Benachrichtigungen
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Alle gelesen
              </Button>
            )}
          </div>
          
          <DialogDescription>
            Bleibe über deine Fortschritte und Community-Aktivitäten informiert
          </DialogDescription>
        </DialogHeader>

        {/* Filter Tabs */}
        <div className="px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'Alle', count: allNotifications.length },
              { id: 'unread', label: 'Ungelesen', count: unreadCount },
              { id: 'achievements', label: 'Erfolge', count: allNotifications.filter(n => n.type === 'achievement' || n.type === 'milestone').length },
              { id: 'social', label: 'Social', count: allNotifications.filter(n => n.type === 'social' || n.type === 'collaboration').length }
            ].map(filterOption => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.id as any)}
                className="flex-shrink-0 text-xs"
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Keine Benachrichtigungen</p>
                <p className="text-xs">Du bist auf dem neuesten Stand!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    relative p-4 border-l-4 rounded-r-lg transition-all hover:shadow-md cursor-pointer
                    ${getPriorityColor(notification.priority)}
                    ${!notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                  `}
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id)
                    }
                    if (notification.action?.href) {
                      window.location.href = notification.action.href
                    }
                  }}
                >
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteNotification(notification.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>

                  <div className="flex items-start gap-3">
                    {/* Icon or Avatar */}
                    <div className="flex-shrink-0 mt-1">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback className="text-xs">
                            {notification.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="p-1 bg-white rounded-full shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        {notification.action && (
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  {notification.priority === 'high' && (
                    <div className="absolute top-2 left-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filteredNotifications.length} von {allNotifications.length} Benachrichtigungen
            </span>
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Einstellungen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}