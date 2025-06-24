'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  FileText, 
  Loader2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Star,
  Clock
} from 'lucide-react'

interface PDFExporterProps {
  workshop: any
  progress?: {
    lessonsCompleted: string[]
    exercisesCompleted: string[]
    totalXPEarned: number
  }
  includeProgress?: boolean
  includeExercises?: boolean
  includeNotes?: boolean
}

const PDFExporter: React.FC<PDFExporterProps> = ({
  workshop,
  progress,
  includeProgress = true,
  includeExercises = true,
  includeNotes = false
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const generatePDFContent = () => {
    const timestamp = new Date().toLocaleDateString('de-DE')
    const progressPercentage = progress ? 
      Math.round(((progress.lessonsCompleted.length + progress.exercisesCompleted.length) / 
                  (workshop.lessons.length + workshop.exercises.length)) * 100) : 0

    let content = `
# VIBE CODING BIBEL™
## ${workshop.title}
### Commandment ${workshop.commandmentNumber}

---

**Workshop Details:**
- Schwierigkeitsgrad: ${workshop.difficulty}
- Geschätzte Zeit: ${workshop.estimatedTime} Minuten
- Gesamt XP: ${workshop.totalXP}
- Exported am: ${timestamp}

**Sacred Wisdom:**
> "${workshop.sacredWisdom}"

---

## Beschreibung
${workshop.description}

## Lernziele
${workshop.learningObjectives.map((obj: string, index: number) => `${index + 1}. ${obj}`).join('\n')}

---

## Lektionen

${workshop.lessons.map((lesson: any, index: number) => `
### Lektion ${index + 1}: ${lesson.title}
**Typ:** ${lesson.type} | **Zeit:** ${lesson.estimatedTime} min | **XP:** ${lesson.xp}
${progress?.lessonsCompleted.includes(lesson.id) ? '✅ **Abgeschlossen**' : '⏳ **Ausstehend**'}

${lesson.content}

---
`).join('\n')}

${includeExercises ? `
## Übungen

${workshop.exercises.map((exercise: any, index: number) => `
### Übung ${index + 1}: ${exercise.title}
**Schwierigkeit:** ${exercise.difficulty} | **XP:** ${exercise.xp}
${progress?.exercisesCompleted.includes(exercise.id) ? '✅ **Abgeschlossen**' : '⏳ **Ausstehend**'}

**Beschreibung:**
${exercise.description}

**Anweisungen:**
${exercise.instructions.map((instruction: string, i: number) => `${i + 1}. ${instruction}`).join('\n')}

**Erwartetes Ergebnis:**
${exercise.expectedOutput}

${exercise.hints.length > 0 ? `**Tipps:**
${exercise.hints.map((hint: string, i: number) => `• ${hint}`).join('\n')}` : ''}

---
`).join('\n')}
` : ''}

${includeProgress && progress ? `
## Dein Fortschritt
- **Lektionen abgeschlossen:** ${progress.lessonsCompleted.length}/${workshop.lessons.length}
- **Übungen abgeschlossen:** ${progress.exercisesCompleted.length}/${workshop.exercises.length}
- **Gesamtfortschritt:** ${progressPercentage}%
- **XP erhalten:** ${progress.totalXPEarned}

### Abgeschlossene Lektionen:
${progress.lessonsCompleted.map(id => {
  const lesson = workshop.lessons.find((l: any) => l.id === id)
  return lesson ? `• ${lesson.title}` : ''
}).filter(Boolean).join('\n')}

### Abgeschlossene Übungen:
${progress.exercisesCompleted.map(id => {
  const exercise = workshop.exercises.find((e: any) => e.id === id)
  return exercise ? `• ${exercise.title}` : ''
}).filter(Boolean).join('\n')}
` : ''}

---

## Abschlusskriterien
${workshop.completionCriteria.map((criteria: string, index: number) => 
  `${index + 1}. ${criteria}`
).join('\n')}

---

*Generiert von der Vibe Coding Bible™*  
*AgentLand Saarland GmbH • Made in Germany 🇩🇪*  
*vibecodingbible.agentland.saarland*
    `.trim()

    return content
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    setExportStatus('idle')

    try {
      // Generate content
      const content = generatePDFContent()
      
      // For now, we'll create a downloadable markdown file
      // In a real implementation, you'd use a library like jsPDF or Puppeteer
      const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `vibe-coding-workshop-${workshop.id}-${workshop.commandmentNumber}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportStatus('success')
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToText = () => {
    const content = generatePDFContent()
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `vibe-coding-workshop-${workshop.id}-${workshop.commandmentNumber}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
          <FileText className="w-5 h-5" />
          Workshop Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workshop Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{workshop.sacredSymbol}</div>
            <div>
              <h3 className="font-semibold" style={{ color: '#FFCE00' }}>
                {workshop.title}
              </h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                <Badge className={`${getDifficultyColor(workshop.difficulty)} text-xs`}>
                  {workshop.difficulty}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {workshop.estimatedTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {workshop.totalXP} XP
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
              <BookOpen className="w-4 h-4" style={{ color: '#009EE0' }} />
              <span>{workshop.lessons.length} Lektionen</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: '#94a3b8' }}>
              <Target className="w-4 h-4" style={{ color: '#8b5cf6' }} />
              <span>{workshop.exercises.length} Übungen</span>
            </div>
          </div>

          {progress && (
            <div className="p-3 rounded-lg border" style={{
              background: 'rgba(15, 23, 42, 0.5)',
              borderColor: 'rgba(255, 206, 0, 0.2)'
            }}>
              <div className="text-sm font-semibold mb-2" style={{ color: '#FFCE00' }}>
                Dein Fortschritt wird eingeschlossen:
              </div>
              <div className="text-xs space-y-1" style={{ color: '#cbd5e1' }}>
                <div>• {progress.lessonsCompleted.length}/{workshop.lessons.length} Lektionen abgeschlossen</div>
                <div>• {progress.exercisesCompleted.length}/{workshop.exercises.length} Übungen abgeschlossen</div>
                <div>• {progress.totalXPEarned} XP erhalten</div>
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <h4 className="font-semibold" style={{ color: '#FFCE00' }}>Export-Optionen:</h4>
          
          <div className="space-y-2">
            <Button
              onClick={exportToPDF}
              disabled={isExporting}
              className="w-full flex items-center gap-2 justify-center"
              style={{
                background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
                color: '#000'
              }}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? 'Exportiere...' : 'Als Markdown exportieren'}
            </Button>

            <Button
              onClick={exportToText}
              variant="outline"
              className="w-full flex items-center gap-2 justify-center"
              style={{
                borderColor: '#475569',
                color: '#94a3b8'
              }}
            >
              <FileText className="w-4 h-4" />
              Als Text exportieren
            </Button>
          </div>
        </div>

        {/* Export Status */}
        {exportStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            border: '1px solid'
          }}>
            <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-sm" style={{ color: '#22c55e' }}>
              Workshop erfolgreich exportiert!
            </span>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            border: '1px solid'
          }}>
            <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
            <span className="text-sm" style={{ color: '#ef4444' }}>
              Export fehlgeschlagen. Bitte versuche es erneut.
            </span>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs space-y-1" style={{ color: '#64748b' }}>
          <p>• Der Export enthält alle Workshop-Inhalte im Markdown-Format</p>
          <p>• Dein aktueller Fortschritt wird automatisch eingeschlossen</p>
          <p>• Die Datei kann offline gelesen oder in andere Apps importiert werden</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default PDFExporter