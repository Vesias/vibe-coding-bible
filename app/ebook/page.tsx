'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, Lock, Shield, Crown, Star } from 'lucide-react'
import Link from 'next/link'

const chapters = [
  {
    id: 'introduction',
    title: 'Einführung',
    description: 'Vorwort und Grundlagen der Vibe Coding Bible',
    icon: BookOpen,
    isPremium: false
  },
  {
    id: 'commandment-i',
    title: 'I. Die Heilige Vision',
    description: 'Das Erste Gebot: Die Heilige Vision',
    icon: Star,
    isPremium: true
  },
  {
    id: 'commandment-ii',
    title: 'II. Der Rechte Stack',
    description: 'Das Zweite Gebot: Der Rechte Stack',
    icon: Shield,
    isPremium: true
  },
  {
    id: 'commandment-iii',
    title: 'III. Die Prompt-Kunst',
    description: 'Das Dritte Gebot: Die Prompt-Kunst',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-iv',
    title: 'IV. Multi-Context Programming',
    description: 'Das Vierte Gebot: Multi-Context Programming',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-v',
    title: 'V. Die Heilige Iteration',
    description: 'Das Fünfte Gebot: Die Heilige Iteration',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-vi',
    title: 'VI. Das Göttliche Debugging',
    description: 'Das Sechste Gebot: Das Göttliche Debugging',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-vii',
    title: 'VII. Die Kunst des Vertrauens',
    description: 'Das Siebte Gebot: Die Kunst des Vertrauens',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-viii',
    title: 'VIII. Die Skalierungsstufen',
    description: 'Das Achte Gebot: Die Skalierungsstufen',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-ix',
    title: 'IX. Die Zusammenarbeit der Propheten',
    description: 'Das Neunte Gebot: Die Zusammenarbeit der Propheten',
    icon: Crown,
    isPremium: true
  },
  {
    id: 'commandment-x',
    title: 'X. Die Monetarisierung',
    description: 'Das Zehnte Gebot: Die Monetarisierung',
    icon: Crown,
    isPremium: true
  }
]

export default function EbookPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  const isPremiumUser = profile?.subscription_status && profile.subscription_status !== 'free'

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Lock className="mx-auto mb-4 text-blue-600" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Anmeldung erforderlich
          </h2>
          <p className="text-gray-600 mb-6">
            Bitte melden Sie sich an, um auf die Vibe Coding Bible zuzugreifen.
          </p>
          <Link 
            href="/auth/signin?redirectTo=/ebook"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Jetzt anmelden
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📖 Vibe Coding Bible
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Das vollständige Kompendium der AI-unterstützten Entwicklung
          </p>
          
          {/* User Status */}
          <div className="inline-flex items-center gap-3 bg-white rounded-lg px-6 py-3 shadow-md">
            <div className="flex items-center gap-2">
              {isPremiumUser ? (
                <Crown className="text-yellow-500" size={20} />
              ) : (
                <Lock className="text-gray-400" size={20} />
              )}
              <span className="font-medium">
                {isPremiumUser ? 'Premium-Zugang' : 'Kostenlos'}
              </span>
            </div>
            {!isPremiumUser && (
              <Link 
                href="/pricing"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => {
            const IconComponent = chapter.icon
            const hasAccess = !chapter.isPremium || isPremiumUser
            
            return (
              <div
                key={chapter.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  hasAccess 
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                    : 'opacity-60'
                }`}
              >
                {hasAccess ? (
                  <Link href={`/ebook/${chapter.id}`} className="block">
                    <ChapterCard chapter={chapter} hasAccess={hasAccess || false} IconComponent={IconComponent} />
                  </Link>
                ) : (
                  <ChapterCard chapter={chapter} hasAccess={hasAccess || false} IconComponent={IconComponent} />
                )}
              </div>
            )
          })}
        </div>

        {/* Premium Benefits */}
        {!isPremiumUser && (
          <div className="mt-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white text-center">
            <Crown className="mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-bold mb-4">
              Premium-Features freischalten
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span>Alle 10 Gebote freischalten</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Offline-Lesemodus</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>PDF-Export mit Wasserzeichen</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown size={16} />
                <span>Erweiterte Suchfunktion</span>
              </div>
            </div>
            <Link 
              href="/pricing"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Jetzt Premium werden
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ChapterCard({ 
  chapter, 
  hasAccess, 
  IconComponent 
}: { 
  chapter: typeof chapters[0]
  hasAccess: boolean
  IconComponent: any
}) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <IconComponent 
          className={hasAccess ? 'text-blue-600' : 'text-gray-400'} 
          size={32} 
        />
        {chapter.isPremium && !hasAccess && (
          <Lock className="text-gray-400" size={20} />
        )}
      </div>
      
      <h3 className={`text-lg font-bold mb-2 ${
        hasAccess ? 'text-gray-800' : 'text-gray-500'
      }`}>
        {chapter.title}
      </h3>
      
      <p className={`text-sm ${
        hasAccess ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {chapter.description}
      </p>
      
      {chapter.isPremium && !hasAccess && (
        <div className="mt-4 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
          Premium-Zugang erforderlich
        </div>
      )}
    </div>
  )
}