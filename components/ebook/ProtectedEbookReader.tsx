'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Lock, Eye, EyeOff, Shield, AlertCircle, BookOpen, Download, Search, Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProtectedEbookReaderProps {
  content: string
  title: string
  chapterId: string
  requiresPremium?: boolean
}

interface ReadingProgress {
  progress_percentage: number
  reading_time_seconds: number
  last_position?: string
  bookmarked: boolean
  notes?: string
}

export const ProtectedEbookReader: React.FC<ProtectedEbookReaderProps> = ({
  content,
  title,
  chapterId,
  requiresPremium = true
}) => {
  const { user, profile } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({
    progress_percentage: 0,
    reading_time_seconds: 0,
    bookmarked: false
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light')
  const [showFeatures, setShowFeatures] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Security event logger
  const logSecurityEvent = useCallback(async (eventType: string, eventData?: any) => {
    if (!user) return
    
    try {
      await supabase.from('ebook_security_events').insert({
        user_id: user.id,
        event_type: eventType,
        chapter_id: chapterId,
        event_data: eventData,
        severity: attempts > 5 ? 'high' : attempts > 2 ? 'medium' : 'low'
      })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }, [user, chapterId, attempts, supabase])

  // Progress tracking
  const updateReadingProgress = useCallback(async (updates: Partial<ReadingProgress>) => {
    if (!user) return
    
    try {
      const updatedProgress = { ...readingProgress, ...updates }
      setReadingProgress(updatedProgress)
      
      await supabase.from('reading_progress')
        .upsert({
          user_id: user.id,
          chapter_id: chapterId,
          ...updatedProgress
        })
    } catch (error) {
      console.error('Failed to update reading progress:', error)
    }
  }, [user, chapterId, readingProgress, supabase])

  // Load reading progress
  useEffect(() => {
    if (user && chapterId) {
      supabase.from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .single()
        .then(({ data }: any) => {
          if (data) {
            setReadingProgress(data)
          }
        })
        .catch(console.error)
    }
  }, [user, chapterId, supabase])

  // Copy Protection - Disable right-click, text selection, and keyboard shortcuts
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault()
      setAttempts(prev => {
        const newAttempts = prev + 1
        logSecurityEvent('right_click_blocked', {
          attempts: newAttempts,
          target: (e.target as Element)?.tagName
        })
        return newAttempts
      })
      return false
    }

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S, Ctrl+P, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && ['a', 'c', 'v', 's', 'p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key === 'u') // View source
      ) {
        e.preventDefault()
        setAttempts(prev => {
          const newAttempts = prev + 1
          logSecurityEvent('keyboard_shortcut_blocked', {
            key: e.key,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            attempts: newAttempts
          })
          return newAttempts
        })
        return false
      }
    }

    const disableSelection = () => {
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges()
      }
    }

    const disableDragAndDrop = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick)
    document.addEventListener('keydown', disableKeyboardShortcuts)
    document.addEventListener('selectstart', disableSelection)
    document.addEventListener('dragstart', disableDragAndDrop)

    // Disable print styles
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .no-print::before { 
          content: "Dieses Dokument ist kopiergeschützt und kann nicht gedruckt werden."; 
          visibility: visible;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: #2563eb;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('contextmenu', disableRightClick)
      document.removeEventListener('keydown', disableKeyboardShortcuts)
      document.removeEventListener('selectstart', disableSelection)
      document.removeEventListener('dragstart', disableDragAndDrop)
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [logSecurityEvent])

  // Premium features
  const exportToPDF = async () => {
    if (!user || !isPremiumUser) return
    
    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapters: [chapterId],
          title: title,
          watermark: {
            email: user.email,
            timestamp: new Date().toISOString()
          }
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vibe-coding-bibel-${chapterId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const toggleBookmark = () => {
    updateReadingProgress({ bookmarked: !readingProgress.bookmarked })
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term && contentRef.current) {
      // Simple search highlighting
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT
      )
      
      let node
      while (node = walker.nextNode()) {
        if (node.textContent?.toLowerCase().includes(term.toLowerCase())) {
          const parent = node.parentElement
          if (parent) {
            parent.scrollIntoView({ behavior: 'smooth', block: 'center' })
            break
          }
        }
      }
    }
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'sepia':
        return 'bg-amber-50 text-amber-900'
      default:
        return 'bg-white text-gray-900'
    }
  }

  // Check user access
  const isPremiumUser = profile?.subscription_status && profile.subscription_status !== 'free'
  const hasAccess = user && (!requiresPremium || isPremiumUser)

  // Content obfuscation for unauthorized users
  const obfuscateContent = (text: string) => {
    return text.replace(/[a-zA-Z]/g, '█').replace(/\d/g, '▓')
  }

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-8 text-center">
          <Lock className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Premium-Zugang erforderlich
          </h2>
          <p className="text-red-600 mb-6">
            Dieses eBook ist nur für Premium-Mitglieder verfügbar. 
            Upgrade jetzt, um Zugang zu allen Inhalten zu erhalten.
          </p>
          <div className="bg-white/50 backdrop-blur p-6 rounded-lg border border-red-200">
            <div className="text-sm text-red-700 mb-4 font-mono">
              {obfuscateContent(content.substring(0, 200))}...
            </div>
            <p className="text-xs text-red-500">
              Vollständiger Inhalt nur mit Premium-Zugang sichtbar
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Security Warning */}
      {attempts > 3 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle size={20} />
            <span className="font-medium">
              Sicherheitshinweis: Mehrere Kopieversuche erkannt. 
              Dieser Inhalt ist urheberrechtlich geschützt.
            </span>
          </div>
        </div>
      )}

      {/* Protected Content Controls */}
      <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800">{title}</h3>
              <p className="text-sm text-blue-600">
                Geschütztes eBook - Nur online lesbar
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              {isVisible ? 'Ausblenden' : 'Anzeigen'}
            </button>
          </div>
        </div>

        {/* Premium Features Panel */}
        {showFeatures && isPremiumUser && (
          <div className="border-t border-blue-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="flex items-center gap-2">
                <Search size={16} className="text-blue-600" />
                <input
                  type="text"
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-2 py-1 border border-blue-200 rounded text-sm"
                />
              </div>

              {/* Bookmark */}
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  readingProgress.bookmarked
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={16} />
                {readingProgress.bookmarked ? 'Gespeichert' : 'Speichern'}
              </button>

              {/* PDF Export */}
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Download size={16} />
                PDF Export
              </button>

              {/* Font Size */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-600">A</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg text-blue-600">A</span>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-blue-600 w-full sm:w-auto">Theme:</span>
              <div className="flex gap-2">
                {(['light', 'dark', 'sepia'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      theme === themeOption
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {themeOption === 'light' ? 'Hell' : themeOption === 'dark' ? 'Dunkel' : 'Sepia'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Progress */}
            <div className="mt-3 text-sm text-blue-600 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span>Lesefortschritt: {readingProgress.progress_percentage}%</span>
              <span className="hidden sm:inline">•</span>
              <span>Lesezeit: {Math.round(readingProgress.reading_time_seconds / 60)} Min</span>
            </div>
          </div>
        )}
      </div>

      {/* Protected Content */}
      {isVisible && (
        <div 
          ref={contentRef}
          className="no-print"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            KhtmlUserSelect: 'none'
          }}
        >
          {/* Watermark overlay */}
          <div 
            className="fixed inset-0 pointer-events-none z-10"
            style={{
              background: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
                  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' 
                        font-family='Arial' font-size='16' fill='rgba(37,99,235,0.1)' 
                        transform='rotate(-45 150 150)'>
                    ${user?.email} • VibeCodingBibel™ • ${new Date().toLocaleDateString('de-DE')}
                  </text>
                </svg>
              `)}")`,
              backgroundRepeat: 'repeat'
            }}
          />
          
          {/* Content with protection layers */}
          <div 
            className={`prose prose-sm sm:prose-lg max-w-none relative z-0 ${getThemeClasses()}`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem sm:2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onCopy={(e) => {
              e.preventDefault()
              setAttempts(prev => {
                const newAttempts = prev + 1
                logSecurityEvent('copy_attempt_blocked', { attempts: newAttempts })
                return newAttempts
              })
            }}
            onDragStart={(e) => e.preventDefault()}
          >
            {/* Invisible overlay to prevent selection */}
            <div 
              className="absolute inset-0 z-20"
              style={{ 
                background: 'transparent',
                cursor: 'default'
              }}
              onMouseDown={(e) => e.preventDefault()}
              {...({ onSelectStart: (e: any) => e.preventDefault() } as any)}
            />
            
            {/* Actual content */}
            <div 
              className="relative z-10"
              dangerouslySetInnerHTML={{ 
                __html: content.replace(/\n/g, '<br>') 
              }}
            />
          </div>
          
          {/* Copyright notice */}
          <div className="mt-6 text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
            <p className="font-medium">
              © 2024 VibeCodingBibel™ - Alle Rechte vorbehalten
            </p>
            <p>
              Dieses Werk ist urheberrechtlich geschützt. Vervielfältigung, Weitergabe oder 
              kommerzielle Nutzung ohne ausdrückliche Genehmigung ist untersagt.
            </p>
            <p className="text-xs mt-2">
              Lizenziert für: {user?.email} • Download-ID: {Date.now().toString(36)}
            </p>
          </div>
        </div>
      )}

      {/* Security Features Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Shield size={16} />
          Kopierschutz-Features
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ Textauswahl deaktiviert</li>
          <li>✓ Rechtsklick-Menü gesperrt</li>
          <li>✓ Tastenkombinationen blockiert (Strg+C, Strg+A, etc.)</li>
          <li>✓ Drucken verhindert</li>
          <li>✓ Browser-Entwicklertools gesperrt</li>
          <li>✓ Wasserzeichen mit Benutzer-ID</li>
          <li>✓ Nur online lesbar - keine Offline-Speicherung</li>
        </ul>
      </div>
    </div>
  )
}

export default ProtectedEbookReader