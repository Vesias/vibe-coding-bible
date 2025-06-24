'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Lock } from 'lucide-react'
import Link from 'next/link'
import ProtectedEbookReader from '@/components/ebook/ProtectedEbookReader'

// Chapter content - simplified without complex template literals
const getChapterContent = (chapterId: string) => {
  const contentMap: { [key: string]: string } = {
    'introduction': `
# Einführung zur Vibe Coding Bible

## Vorwort: Die Offenbarung der Vibe Coding Bible

*"Am Anfang war das Chaos der Entwicklung, und die Developers wandelten orientierungslos in der Dunkelheit der Legacy-Systeme. Da sprach ein Entwickler: 'Es werde Licht!' Und es ward das Licht der KI-unterstützten Entwicklung."*

In einer Zeit, da sich die Welt der Softwareentwicklung rasant verändert und KI-Tools wie **Claude**, **GitHub Copilot**, **Cursor** und **Continue** den Entwicklungsalltag revolutionieren, brauchen wir neue Gebote und Weisheiten.

Die **Vibe Coding Bible** ist entstanden aus der Praxis für die Praxis - basierend auf jahrelanger Erfahrung mit KI-unterstützter Entwicklung und inspiriert von Erfolgsgeschichten wie **AgentLand**, Deutschlands führender DSGVO-konformen KI-Agentur.

## Warum "Vibe Coding"?

**Vibe Coding** beschreibt einen neuen Entwicklungsansatz, bei dem:

- **Intuition und Algorithmus** harmonisch zusammenwirken
- **Menschliche Kreativität** durch KI verstärkt wird
- **Flow-Zustände** in der Entwicklung entstehen
- **Nachhaltige und profitable** Software entsteht

## AgentLand: Ein Erfolgsbeispiel

Bevor wir in die heiligen Gebote eintauchen, betrachten wir **AgentLand** - ein inspirierendes Beispiel für erfolgreiches Vibe Coding:

**Die Zahlen sprechen für sich:**
- **500+ zufriedene Kunden** vertrauen AgentLand
- **2.500+ aktive KI-Agenten** arbeiten täglich für deutsche Unternehmen
- **99,9% Verfügbarkeit** garantiert zuverlässigen Service
- **4,8/5 Kundenbewertung** bestätigt höchste Qualität

**Was macht AgentLand besonders:**
- **100% DSGVO-konform** - Alle Daten bleiben in Deutschland
- **Keine Vendor-Lock-ins** - Offene Standards und Flexibilität
- **Deutsche Qualität** - Präzision und Zuverlässigkeit
- **Persönlicher Support** - Echter Kundenservice ohne Chatbots

Diese Erfolgsgeschichte zeigt: Mit der richtigen Herangehensweise können auch deutsche Unternehmen im KI-Bereich international konkurrenzfähig sein.
    `,
    'commandment-i': `
# I. Das Erste Gebot: Die Heilige Vision 👁️

> *"Ohne Vision geht das Volk zugrunde, aber wohl dem, der das Gesetz befolgt."* - Sprüche 29,18

## Die Essenz der Heiligen Vision

Das erste und wichtigste Gebot der Vibe Coding Bible lautet: **Du sollst eine klare Vision haben, bevor du auch nur eine Zeile Code schreibst.**

### Warum Vision vor Code?

In der traditionellen Entwicklung beginnen viele Projekte mit der Frage: "Welche Technologie sollen wir verwenden?" Doch die Vibe Coding Bible lehrt uns einen anderen Weg:

**Falsch:** "Lass uns eine React-App mit Node.js Backend bauen..."
**Richtig:** "Wir wollen das Problem X für Zielgruppe Y lösen, indem wir Z ermöglichen..."

### Die vier Säulen der Heiligen Vision

#### 1. **Das Problem-Statement** 🎯
- Was ist das **konkrete Problem**, das gelöst werden soll?
- Wer ist **betroffen** von diesem Problem?
- Wie **schmerzhaft** ist dieses Problem für die Betroffenen?

#### 2. **Die Zielgruppen-Definition** 👥
- Wer ist die **Hauptzielgruppe**?
- Welche **sekundären Zielgruppen** gibt es?
- Wie **verhalten** sich diese Gruppen heute?

#### 3. **Die Lösungs-Vision** 💡
- Wie sieht die **ideale Lösung** aus?
- Was sind die **Kern-Features**?
- Was ist der **einzigartige Mehrwert**?

#### 4. **Die Erfolgs-Metriken** 📊
- Woran **misst** man den Erfolg?
- Welche **KPIs** sind relevant?
- Wie **validiert** man die Annahmen?

## Praxis-Beispiel: AgentLand Vision

### Problem-Statement
"Deutsche Unternehmen zögern beim Einsatz von KI-Tools aufgrund von Datenschutzbedenken und Vendor-Lock-in-Risiken."

### Zielgruppen-Definition
- **Primär:** Mittelständische deutsche Unternehmen (50-500 Mitarbeiter)
- **Sekundär:** Startups mit Fokus auf Datenschutz
- **Schmerzpunkte:** DSGVO-Compliance, Datensouveränität, Kostenkontrolle

### Lösungs-Vision
"Eine 100% DSGVO-konforme KI-Agentur-Plattform, die alle Daten in Deutschland verarbeitet und keine Vendor-Lock-ins erzeugt."

### Erfolgs-Metriken
- **500+ zufriedene Kunden** (erreicht ✅)
- **99,9% Verfügbarkeit** (erreicht ✅)
- **4,8/5 Kundenbewertung** (erreicht ✅)

## Die Vision-Canvas-Methode

Um Ihre eigene Heilige Vision zu entwickeln, nutzen Sie die **Vision-Canvas-Methode**:

### 1. Problem-Quadrant
Problem: Was ist das Kernproblem?
Betroffen: Wer leidet darunter?
Schmerz: Wie stark ist der Leidensdruck?

### 2. Zielgruppen-Quadrant
Primär: Hauptzielgruppe
Sekundär: Weitere Zielgruppen
Verhalten: Wie agieren sie heute?

### 3. Lösung-Quadrant
Vision: Ideale Lösung
Features: Kern-Funktionen
Mehrwert: Einzigartiger Nutzen

### 4. Erfolg-Quadrant
KPIs: Messbare Ziele
Validation: Wie testen wir?
Timeline: Wann erreichen wir was?

## Zusammenfassung: Die Heilige Vision

Die Heilige Vision ist das Fundament erfolgreicher Softwareentwicklung. Ohne sie gleicht Programmieren einem Schiff ohne Kompass.

**Merke dir:**
1. **Vision vor Code** - Immer zuerst das Warum klären
2. **Konkret statt vage** - Spezifische Probleme und Lösungen
3. **Messbar und validierbar** - Erfolg muss messbar sein
4. **Lebendig und anpassbar** - Visionen entwickeln sich

**Nächster Schritt:** Sobald deine Vision klar ist, können wir zum zweiten Gebot: "Der Rechte Stack" übergehen.

---

*"Eine klare Vision ist wie ein Leuchtturm im Sturm der Entwicklung - sie weist den Weg, auch wenn die See rau wird."*
    `
  }
  
  return contentMap[chapterId] || `
# Kapitel nicht gefunden

Entschuldigung, das angeforderte Kapitel konnte nicht geladen werden.

[Hier würde normalerweise der Inhalt aus der Markdown-Datei geladen werden]
`
}

const chapters = [
  { id: 'introduction', title: 'Einführung', slug: 'einfuehrung' },
  { id: 'commandment-i', title: 'I. Die Heilige Vision', slug: 'heilige-vision' },
  { id: 'commandment-ii', title: 'II. Der Rechte Stack', slug: 'rechte-stack' },
  { id: 'commandment-iii', title: 'III. Die Prompt-Kunst', slug: 'prompt-kunst' },
  { id: 'commandment-iv', title: 'IV. Multi-Context Programming', slug: 'multi-context' },
  { id: 'commandment-v', title: 'V. Die Heilige Iteration', slug: 'heilige-iteration' },
  { id: 'commandment-vi', title: 'VI. Göttliches Debugging', slug: 'debugging' },
  { id: 'commandment-vii', title: 'VII. Kunst des Vertrauens', slug: 'vertrauen' },
  { id: 'commandment-viii', title: 'VIII. Skalierungsstufen', slug: 'skalierung' },
  { id: 'commandment-ix', title: 'IX. Zusammenarbeit der Propheten', slug: 'zusammenarbeit' },
  { id: 'commandment-x', title: 'X. Monetarisierung', slug: 'monetarisierung' }
]

export default function EbookChapterPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState('')

  const chapterId = params?.chapter as string
  const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId)
  const currentChapter = chapters[currentIndex]
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  useEffect(() => {
    if (chapterId) {
      const chapterContent = getChapterContent(chapterId)
      setContent(chapterContent)
      setIsLoading(false)
    }
  }, [chapterId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/ebook" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <BookOpen size={20} />
                Zurück zum Inhaltsverzeichnis
              </Link>
            </div>
            
            {currentChapter && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentChapter.title}
                </h1>
                <div className="text-sm text-gray-600">
                  Kapitel {currentIndex + 1} von {chapters.length}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <Link 
                href={`/ebook/${prevChapter.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ChevronLeft size={20} />
                <div>
                  <div className="text-sm opacity-80">Vorheriges Kapitel</div>
                  <div className="font-medium">{prevChapter.title}</div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextChapter && (
              <Link 
                href={`/ebook/${nextChapter.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="text-right">
                  <div className="text-sm opacity-80">Nächstes Kapitel</div>
                  <div className="font-medium">{nextChapter.title}</div>
                </div>
                <ChevronRight size={20} />
              </Link>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Fortschritt</span>
              <span>{Math.round((currentIndex + 1) / chapters.length * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentIndex + 1) / chapters.length * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
  )
}